package com.deliverymanagement.controller;

import com.deliverymanagement.model.DeliveryAgent;
import com.deliverymanagement.model.Order;
import com.deliverymanagement.service.DeliveryAgentService;
import com.deliverymanagement.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminController {

    private final OrderService orderService;
    private final DeliveryAgentService agentService;

    public AdminController(OrderService orderService,
                           DeliveryAgentService agentService) {
        this.orderService = orderService;
        this.agentService = agentService;
    }

    // ✅ GET ALL ORDERS
    @GetMapping("/orders")
    public List<Order> orders() {
        return orderService.getAllOrders();
    }

    // ✅ GET ALL AGENTS
    @GetMapping("/agents")
    public List<DeliveryAgent> agents() {
        return agentService.getAll();
    }

    // ✅ CREATE AGENT (THIS FIXES YOUR ERROR)
    @PostMapping("/agents")
    public DeliveryAgent createAgent(@RequestBody DeliveryAgent agent) {
        return agentService.save(agent);
    }
}