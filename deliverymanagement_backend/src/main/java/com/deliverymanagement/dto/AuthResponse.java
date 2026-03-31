package com.deliverymanagement.dto;

public class AuthResponse {

    private String token;
    private String role;
    private UserInfo user;

    public AuthResponse() {}

    public AuthResponse(String token) {
        this.token = token;
    }

    public AuthResponse(String token, UserInfo user) {
        this.token = token;
        this.role = user != null ? user.getRole() : null;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserInfo getUser() {
        return user;
    }

    public void setUser(UserInfo user) {
        this.user = user;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public static class UserInfo {
        private String name;
        private String email;
        private String role;

        public UserInfo() {}

        public UserInfo(String name, String email, String role) {
            this.name = name;
            this.email = email;
            this.role = role;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }
}