package com.deliverymanagement.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    private String itemName;
    private String address;
    private String status;

    @DBRef
    private User customer;

    @DBRef
    private DeliveryAgent deliveryAgent;

    public Order() {}

    public String getId() {
        return id;
    }

    public String getItemName() {
        return itemName;
    }

    public String getAddress() {
        return address;
    }

    public String getStatus() {
        return status;
    }

    public User getCustomer() {
        return customer;
    }

    public DeliveryAgent getDeliveryAgent() {
        return deliveryAgent;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public void setDeliveryAgent(DeliveryAgent deliveryAgent) {
        this.deliveryAgent = deliveryAgent;
    }
}