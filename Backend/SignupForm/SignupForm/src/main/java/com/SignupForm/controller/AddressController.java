package com.SignupForm.controller;

import com.SignupForm.dto.address.AddressRequest;
import com.SignupForm.dto.address.AddressResponse;
import com.SignupForm.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public ResponseEntity<List<AddressResponse>> getUserAddresses(Authentication authentication) {
        return ResponseEntity.ok(addressService.getAddressesByEmail(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<AddressResponse> addAddress(@RequestBody AddressRequest request, Authentication auth) {
        return ResponseEntity.ok(addressService.saveAddress(request, auth.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable Long id,
            @RequestBody AddressRequest request,
            Authentication auth) {
        return ResponseEntity.ok(addressService.updateAddress(id, request, auth.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id, Authentication auth) {
        addressService.deleteAddress(id, auth.getName());
        return ResponseEntity.noContent().build();
    }
}