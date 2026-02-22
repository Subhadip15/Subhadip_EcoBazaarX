package com.SignupForm.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String category;

    private String seller;

    @Column(nullable = false)
    private Double price;

    // Stores Cloudinary URL
    @Column(length = 2000)
    private String image;

    // Use columnDefinition = "TEXT" for long product descriptions
    @Column(columnDefinition = "TEXT")
    private String description;

    // Matches 'isEcoFriendly' in React payload
    @Column(name = "is_eco_friendly")
    private Boolean isEcoFriendly;

    // Flattens carbonData fields into the 'products' table
    @Embedded
    private CarbonData carbonData;

    // --- Database Image Storage (Optional fallback for Cloudinary) ---
    private String imageName;
    private String imageType;

    @Lob
    @Column(name = "image_data", columnDefinition = "LONGBLOB")
    private byte[] imageData;
}