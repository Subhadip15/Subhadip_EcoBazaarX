package com.SignupForm.dto.cart;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemResponse {

    private Long productId;
    private String productName;
    private int quantity;
    private double price;
    private double subtotal;
    private double emission; // estimated CO2 per item
    private String image;
}