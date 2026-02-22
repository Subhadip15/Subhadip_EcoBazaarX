package com.SignupForm.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class CarbonBreakdown {
    private Double manufacturing;
    private Double packaging;
    private Double transport;
    private Double handling;
}