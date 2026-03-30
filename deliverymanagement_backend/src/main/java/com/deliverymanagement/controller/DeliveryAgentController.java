package com.deliverymanagement.controller;

import com.deliverymanagement.model.DeliveryAgent;
import com.deliverymanagement.service.DeliveryAgentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agent")
public class DeliveryAgentController {

    private final DeliveryAgentService service;

    public DeliveryAgentController(DeliveryAgentService service) {
        this.service = service;
    }

    @PostMapping
    public DeliveryAgent create(@RequestBody DeliveryAgent agent) {
        return service.save(agent);
    }

    @GetMapping
    public List<DeliveryAgent> getAll() {
        return service.getAll();
    }
}