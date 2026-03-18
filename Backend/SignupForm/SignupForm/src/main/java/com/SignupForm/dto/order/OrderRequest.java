package com.SignupForm.dto.order;

import com.SignupForm.dto.address.AddressRequest;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequest {

    private String fullName;
    private String email;
    private String paymentMethod;
    private AddressRequest newAddress;
    private AddressRequest address;   // 🔥 instead of String address

    private List<OrderItemRequest> items;

    private Double subtotal;
    private Double shipping;
    private Double total;
    private Double totalEmission;
}