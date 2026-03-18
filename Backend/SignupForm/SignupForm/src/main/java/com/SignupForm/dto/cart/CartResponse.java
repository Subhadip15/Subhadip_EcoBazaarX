package com.SignupForm.dto.cart;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponse {

    private Long cartId;

    private String userEmail;

    private List<CartItemResponse> items;

    private Double totalAmount;

    private Double totalEmission; // NEW: Total CO2 for the cart

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CartItemResponse {
        private Long itemId;
        private Long productId;
        private String productName;
        private String image;
        private Double price;
        private Integer quantity;
        private Double subtotal;
        private Double emission; // NEW: CO2 emission per item
    }
}