package com.deliverymanagement.repository;

import com.deliverymanagement.model.Order;
import com.deliverymanagement.model.DeliveryAgent;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findByDeliveryAgent(DeliveryAgent deliveryAgent);
}