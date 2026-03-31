package com.deliverymanagement.service;

import com.deliverymanagement.dto.OrderRequest;
import com.deliverymanagement.model.Customer;
import com.deliverymanagement.model.DeliveryAgent;
import com.deliverymanagement.model.Order;
import com.deliverymanagement.model.User;
import com.deliverymanagement.repository.CustomerRepository;
import com.deliverymanagement.repository.DeliveryAgentRepository;
import com.deliverymanagement.repository.OrderRepository;
import com.deliverymanagement.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepo;
    private final UserRepository userRepo;
    private final DeliveryAgentRepository agentRepo;
    private final CustomerRepository customerRepo;

    public OrderService(OrderRepository orderRepo,
                        UserRepository userRepo,
                        DeliveryAgentRepository agentRepo,
                        CustomerRepository customerRepo) {
        this.orderRepo = orderRepo;
        this.userRepo = userRepo;
        this.agentRepo = agentRepo;
        this.customerRepo = customerRepo;
    }

    public Order createOrder(OrderRequest req, String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order o = new Order();
        o.setCustomer(user);
        o.setCustomerName(req.getCustomerName() != null ? req.getCustomerName() : user.getUsername());
        o.setCustomerEmail(user.getEmail());

        // Frontend fields
        o.setAmount(req.getAmount());
        o.setDate(req.getDate() != null ? req.getDate() : Instant.now().toString());
        o.setStatus(req.getStatus() != null ? req.getStatus() : "PENDING");

        // Backward compatibility
        o.setItemName(req.getItemName());
        o.setAddress(req.getAddress());

        if (req.getAgentId() != null && !req.getAgentId().isBlank()) {
            DeliveryAgent agent = agentRepo.findById(req.getAgentId())
                    .orElseThrow(() -> new RuntimeException("Agent not found"));
            o.setDeliveryAgent(agent);
            o.setAgentId(agent.getId());
            o.setAgentName(agent.getName());
        }

        Order saved = orderRepo.save(o);
        syncCustomerStats(user);
        return saved;
    }

    public List<Order> getOrdersForUser(String username, List<String> roles) {
        List<Order> all = orderRepo.findAll();
        if (roles.contains("ROLE_ADMIN")) return all;

        if (roles.contains("ROLE_DELIVERY_AGENT")) {
            return all.stream()
                    .filter(o -> o.getAgentName() != null && o.getAgentName().equalsIgnoreCase(username))
                    .collect(Collectors.toList());
        }

        // CUSTOMER
        return all.stream()
                .filter(o -> {
                    if (o.getCustomer() != null && o.getCustomer().getUsername() != null) {
                        return o.getCustomer().getUsername().equalsIgnoreCase(username);
                    }
                    return o.getCustomerName() != null && o.getCustomerName().equalsIgnoreCase(username);
                })
                .collect(Collectors.toList());
    }

    public Order assignAgent(String orderId, String agentId) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        DeliveryAgent agent = agentRepo.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        order.setDeliveryAgent(agent);
        order.setAgentId(agent.getId());
        order.setAgentName(agent.getName());

        return orderRepo.save(order);
    }

    private void syncCustomerStats(User user) {
        if (user == null || user.getEmail() == null || user.getEmail().isBlank()) {
            return;
        }

        String normalizedEmail = user.getEmail().trim().toLowerCase();
        Customer customer = customerRepo.findByEmailIgnoreCase(normalizedEmail)
                .orElseGet(Customer::new);

        customer.setEmail(normalizedEmail);
        customer.setName(
                (user.getUsername() != null && !user.getUsername().isBlank())
                        ? user.getUsername()
                        : "Customer"
        );
        customer.setTotalOrders(Math.max(customer.getTotalOrders(), 0) + 1);
        customer.setLastOrderDate(Instant.now().toString());

        customerRepo.save(customer);
        log.info("Customer stats synced email={} totalOrders={}", customer.getEmail(), customer.getTotalOrders());
    }
}