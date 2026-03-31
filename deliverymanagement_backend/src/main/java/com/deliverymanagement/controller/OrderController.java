package com.deliverymanagement.controller;

import com.deliverymanagement.dto.OrderRequest;
import com.deliverymanagement.model.Order;
import com.deliverymanagement.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @PostMapping
    public Order create(@RequestBody OrderRequest req, Authentication authentication) {
        return service.createOrder(req, authentication.getName());
    }

    @GetMapping
    public List<Order> getAll(Authentication authentication) {
        List<String> roles = authentication.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .collect(Collectors.toList());
        return service.getOrdersForUser(authentication.getName(), roles);
    }

    @PutMapping("/{orderId}/assign/{agentId}")
    public Order assignAgent(@PathVariable String orderId,
                             @PathVariable String agentId) {
        return service.assignAgent(orderId, agentId);
    }
}