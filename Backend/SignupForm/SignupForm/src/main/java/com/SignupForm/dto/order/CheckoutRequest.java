package com.SignupForm.dto.order;

import com.SignupForm.dto.address.AddressRequest;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckoutRequest {

    private Long addressId;         // Sent when selecting an existing address radio button

    private AddressRequest newAddress; // Sent when "Add/Edit" form is used in React

    private String paymentMethod;   // "cod", "card", or "upi"

    private String fullName;        // The "Deliver to" name from the UI

    private String email;           // Optional: for guest checkout or confirmation
}