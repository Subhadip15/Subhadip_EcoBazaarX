package com.SignupForm.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "wishlist_items")
@Data
public class WishlistItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // For multi-user support
    private Long productId;
    private String name;
    private String image;
    private String category;
    private BigDecimal price;
}