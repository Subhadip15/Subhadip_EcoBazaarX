package com.SignupForm.dto.address;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressResponse {
    private Long id;
    private String fullName;
    private String street;
    private String city;
    private String state;
    private String zipCode;
}