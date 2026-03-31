package com.deliverymanagement.service;

import com.deliverymanagement.model.Customer;
import com.deliverymanagement.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository repository;

    public CustomerService(CustomerRepository repository) {
        this.repository = repository;
    }

    public List<Customer> getAll() {
        return repository.findAll();
    }

    public Customer getByEmail(String email) {
        return repository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public Customer create(Customer customer) {
        if (customer.getTotalOrders() == 0) {
            customer.setTotalOrders(0);
        }
        if (customer.getLastOrderDate() == null) {
            customer.setLastOrderDate(Instant.now().toString());
        }
        return repository.save(customer);
    }

    public Customer upsertByEmail(String email, Customer incoming) {
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase();
        if (normalizedEmail.isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        Customer customer = repository.findByEmailIgnoreCase(normalizedEmail)
                .orElseGet(Customer::new);

        customer.setEmail(normalizedEmail);
        if (incoming.getName() != null && !incoming.getName().trim().isEmpty()) {
            customer.setName(incoming.getName().trim());
        } else if (customer.getName() == null || customer.getName().isEmpty()) {
            customer.setName("Customer");
        }

        if (incoming.getTotalOrders() > 0) {
            customer.setTotalOrders(incoming.getTotalOrders());
        } else if (customer.getTotalOrders() < 0) {
            customer.setTotalOrders(0);
        }

        if (incoming.getLastOrderDate() != null && !incoming.getLastOrderDate().isBlank()) {
            customer.setLastOrderDate(incoming.getLastOrderDate());
        } else if (customer.getLastOrderDate() == null) {
            customer.setLastOrderDate(Instant.now().toString());
        }

        return repository.save(customer);
    }
}

