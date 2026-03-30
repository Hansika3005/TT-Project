package com.deliverymanagement.dto;

public class OrderRequest {

    private String itemName;
    private String address;

    public OrderRequest() {}

    public OrderRequest(String itemName, String address) {
        this.itemName = itemName;
        this.address = address;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}