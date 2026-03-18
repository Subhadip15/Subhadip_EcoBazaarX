package com.SignupForm.service;

import com.SignupForm.dto.address.AddressRequest;
import com.SignupForm.dto.address.AddressResponse;
import com.SignupForm.entity.Address;
import com.SignupForm.entity.Users;
import com.SignupForm.repository.AddressRepository;
import com.SignupForm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    // ================= FETCH ONLY ACTIVE ADDRESSES =================
    @Transactional(readOnly = true)
    public List<AddressResponse> getAddressesByEmail(String email) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ FIXED: Changed from findByUser() to findByUserAndDeletedFalse()
        // This ensures the frontend doesn't see "deleted" addresses.
        return addressRepository.findByUserAndDeletedFalse(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressResponse saveAddress(AddressRequest request, String email) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = Address.builder()
                .fullName(request.getFullName())
                .street(request.getStreet())
                .city(request.getCity())
                .state(request.getState())
                .zipCode(request.getZipCode())
                .user(user)
                .deleted(false) // Explicitly set to false for safety
                .build();

        return mapToResponse(addressRepository.save(address));
    }

    @Transactional
    public AddressResponse updateAddress(Long id, AddressRequest request, String email) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized to update this address");
        }

        // If a user tries to update a soft-deleted address, we should technically stop them
        if (address.isDeleted()) {
            throw new RuntimeException("Cannot update a deleted address");
        }

        address.setFullName(request.getFullName());
        address.setStreet(request.getStreet());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setZipCode(request.getZipCode());

        return mapToResponse(addressRepository.save(address));
    }

    // ================= SOFT DELETE LOGIC =================
    @Transactional
    public void deleteAddress(Long id, String email) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized to delete this address");
        }

        // Flip the bit instead of removing the row
        address.setDeleted(true);
        addressRepository.save(address);
    }

    private AddressResponse mapToResponse(Address addr) {
        return AddressResponse.builder()
                .id(addr.getId())
                .fullName(addr.getFullName())
                .street(addr.getStreet())
                .city(addr.getCity())
                .state(addr.getState())
                .zipCode(addr.getZipCode())
                .build();
    }
}