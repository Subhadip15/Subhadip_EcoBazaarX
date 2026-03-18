package com.SignupForm.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ ADD THIS: Required for the "Deliver to: Name" part of the UI
    private String fullName;

    private String street;
    private String city;
    private String state;
    private String zipCode;
    @Builder.Default
    private boolean deleted = false;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Users user;

    @OneToMany(mappedBy = "address")
    private List<Order> orders;

    public String getFullAddress() {
        return street + ", " + city + ", " + state + " - " + zipCode;
    }
}