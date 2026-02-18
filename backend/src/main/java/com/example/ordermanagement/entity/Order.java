package com.example.ordermanagement.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String address;
    private String paymentType;
    private String deliveryType;
    private String status;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<OrderItem> items = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPaymentType() {
        return paymentType;
    }

    public void setPaymentType(String paymentType) {
        this.paymentType = paymentType;
    }

    public String getDeliveryType() {
        return deliveryType;
    }

    public void setDeliveryType(String deliveryType) {
        this.deliveryType = deliveryType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    @Transient
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    public Double getDeliveryCost() {
        if ("Speed Post".equals(deliveryType))
            return 350.0;
        if ("Courier Service".equals(deliveryType))
            return 550.0;
        return 0.0;
    }

    @Transient
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    public Double getTotal() {
        double itemsTotal = 0.0;
        if (items != null && !items.isEmpty()) {
            itemsTotal = items.stream()
                    .mapToDouble(item -> (item.getPrice() != null && item.getQuantity() != null)
                            ? item.getPrice() * item.getQuantity()
                            : 0.0)
                    .sum();
        }
        return itemsTotal + getDeliveryCost();
    }
}
