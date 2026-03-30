package com.deliverymanagement.service;

import com.deliverymanagement.model.DeliveryAgent;
import com.deliverymanagement.repository.DeliveryAgentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeliveryAgentService {

    private final DeliveryAgentRepository repo;

    public DeliveryAgentService(DeliveryAgentRepository repo) {
        this.repo = repo;
    }

    public DeliveryAgent save(DeliveryAgent agent) {
        return repo.save(agent);
    }

    public List<DeliveryAgent> getAll() {
        return repo.findAll();
    }

    public DeliveryAgent getById(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Agent not found"));
    }
}