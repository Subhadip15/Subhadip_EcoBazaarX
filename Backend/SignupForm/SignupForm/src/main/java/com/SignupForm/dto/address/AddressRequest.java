package com.SignupForm.dto.address;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressRequest {
    private String fullName;
    private String street;
    private String city;
    private String state;
    private String zipCode;
}