package com.example.ordermanagement.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String itemName;
    private Integer quantity;
    private Double price;

    private String address;
    private String paymentType;
    private String status;

    @Transient
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    public Double getTotal() {
        return (price != null && quantity != null) ? price * quantity : 0.0;
    }
}
