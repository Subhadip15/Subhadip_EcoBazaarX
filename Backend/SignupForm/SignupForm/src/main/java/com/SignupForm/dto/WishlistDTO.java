package com.SignupForm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WishlistDTO {
    private Long id;
    private Long productId;
    private String name;
    private String image;
    private String category;
    private BigDecimal price;
}
