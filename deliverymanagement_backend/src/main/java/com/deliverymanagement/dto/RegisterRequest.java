package com.deliverymanagement.dto;

import com.deliverymanagement.model.Role;
import com.fasterxml.jackson.annotation.JsonAlias;

public class RegisterRequest {

    // Frontend may send `name`; backend DTO uses `username`.
    // JsonAlias lets Spring/Jackson accept both keys.
    @JsonAlias("name")
    private String username;
    private String email;
    private String password;
    private Role role;

    public RegisterRequest() {}

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}