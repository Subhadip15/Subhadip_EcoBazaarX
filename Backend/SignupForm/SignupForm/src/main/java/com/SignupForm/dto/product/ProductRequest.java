package com.SignupForm.dto.product;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    private Long id;
    private String name;
    private String category;
    private String seller;
    private Double price;
    private String image;
    private String description;
    private Boolean isEcoFriendly;

    // Flattened fields for easier React handling
    private Double manufacturing;
    private Double packaging;
    private Double transport;
    private Double handling;
    private Double totalCO2e;
}