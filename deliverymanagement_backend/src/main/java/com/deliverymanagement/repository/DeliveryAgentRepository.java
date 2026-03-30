package com.deliverymanagement.repository;

import com.deliverymanagement.model.DeliveryAgent;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DeliveryAgentRepository extends MongoRepository<DeliveryAgent, String> {
}