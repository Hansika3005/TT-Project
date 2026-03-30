package com.deliverymanagement.service;

import com.deliverymanagement.dto.OrderRequest;
import com.deliverymanagement.model.DeliveryAgent;
import com.deliverymanagement.model.Order;
import com.deliverymanagement.model.User;
import com.deliverymanagement.repository.DeliveryAgentRepository;
import com.deliverymanagement.repository.OrderRepository;
import com.deliverymanagement.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepo;
    private final UserRepository userRepo;
    private final DeliveryAgentRepository agentRepo;

    public OrderService(OrderRepository orderRepo,
                        UserRepository userRepo,
                        DeliveryAgentRepository agentRepo) {
        this.orderRepo = orderRepo;
        this.userRepo = userRepo;
        this.agentRepo = agentRepo;
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

        return orderRepo.save(o);
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
}