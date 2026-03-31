package com.deliverymanagement.service;

import com.deliverymanagement.dto.LoginRequest;
import com.deliverymanagement.dto.RegisterRequest;
import com.deliverymanagement.dto.AuthResponse;
import com.deliverymanagement.model.User;
import com.deliverymanagement.repository.UserRepository;
import com.deliverymanagement.util.JwtUtil;

import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepo, JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.jwtUtil = jwtUtil;
    }

    // ✅ REGISTER
    public String register(RegisterRequest request) {

        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // (plain for now)
        user.setRole(request.getRole());

        userRepo.save(user);

        return "REGISTERED";
    }

    // ✅ LOGIN (EMAIL BASED)
    public AuthResponse login(LoginRequest request) {

        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getUsername());
        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                user.getUsername(),
                user.getEmail(),
                user.getRole() != null ? user.getRole().toString() : null
        );
        return new AuthResponse(token, userInfo);
    }
}