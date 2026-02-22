package com.SignupForm.entity;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class CarbonData {
    private String method;
    private Double totalCO2ePerKg;
    private String material;

    @Embedded
    private CarbonBreakdown breakdown;
}