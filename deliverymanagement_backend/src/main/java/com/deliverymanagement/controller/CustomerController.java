package com.deliverymanagement.controller;

import com.deliverymanagement.model.Customer;
import com.deliverymanagement.service.CustomerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin("*")
public class CustomerController {

    private final CustomerService service;

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    @GetMapping
    public List<Customer> getAll() {
        return service.getAll();
    }

    @GetMapping("/by-email/{email}")
    public Customer getByEmail(@PathVariable String email) {
        return service.getByEmail(email);
    }

    @PostMapping
    public Customer create(@RequestBody Customer customer) {
        return service.create(customer);
    }

    @PutMapping("/by-email/{email}")
    public Customer upsertByEmail(@PathVariable String email, @RequestBody Customer customer) {
        return service.upsertByEmail(email, customer);
    }
}

