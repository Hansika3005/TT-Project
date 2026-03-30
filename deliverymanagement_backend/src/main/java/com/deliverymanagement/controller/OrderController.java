package com.deliverymanagement.controller;

import com.deliverymanagement.dto.OrderRequest;
import com.deliverymanagement.model.Order;
import com.deliverymanagement.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @PostMapping
    public Order create(@RequestBody OrderRequest req) {
        return service.createOrder(req);
    }

    @GetMapping
    public List<Order> getAll() {
        return service.getAllOrders();
    }

    @PutMapping("/{orderId}/assign/{agentId}")
    public Order assignAgent(@PathVariable String orderId,
                             @PathVariable String agentId) {
        return service.assignAgent(orderId, agentId);
    }
}