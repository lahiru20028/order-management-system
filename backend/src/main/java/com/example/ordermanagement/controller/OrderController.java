package com.example.ordermanagement.controller;

import com.example.ordermanagement.entity.Order;
import com.example.ordermanagement.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173") // Default Vite port
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderRepository.save(order);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> request) {
        return orderRepository.findById(id)
                .map(order -> {
                    String status = request.get("status");
                    if (status != null && !status.isEmpty()) {
                        order.setStatus(status);
                    }
                    return ResponseEntity.ok(orderRepository.save(order));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
