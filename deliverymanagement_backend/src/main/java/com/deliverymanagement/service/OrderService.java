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

    public Order createOrder(OrderRequest req) {

        // Get the first user from the database as default customer
        List<User> users = userRepo.findAll();
        User user;
        if (!users.isEmpty()) {
            user = users.get(0);
        } else {
            throw new RuntimeException("No users found. Please register first.");
        }

        Order o = new Order();
        o.setCustomer(user);
        o.setItemName(req.getItemName());
        o.setAddress(req.getAddress());
        o.setStatus("PENDING");

        Order saved = orderRepo.save(o);
        syncCustomerStats(user);
        return saved;
    }

    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }

    public Order assignAgent(String orderId, String agentId) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        DeliveryAgent agent = agentRepo.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        order.setDeliveryAgent(agent);

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