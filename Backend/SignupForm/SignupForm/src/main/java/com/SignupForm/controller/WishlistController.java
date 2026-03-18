package com.SignupForm.controller;

import com.SignupForm.dto.WishlistDTO;
import com.SignupForm.entity.WishlistItem;
import com.SignupForm.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import com.SignupForm.repository.UserRepository;
import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "http://localhost:3000")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private UserRepository userRepository; // To find the ID by email

    @GetMapping
    public ResponseEntity<List<WishlistDTO>> getWishlist(Authentication authentication) {
        // authentication.getName() returns the email you set in the JwtFilter
        Long userId = getUserIdFromEmail(authentication.getName());
        return ResponseEntity.ok(wishlistService.getWishlist(userId));
    }

    @PostMapping("/add")
    public ResponseEntity<WishlistDTO> addItem(@RequestBody WishlistItem item, Authentication authentication) {
        Long userId = getUserIdFromEmail(authentication.getName());
        return ResponseEntity.ok(wishlistService.addToWishlist(userId, item));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Void> removeItem(@PathVariable Long productId, Authentication authentication) {
        Long userId = getUserIdFromEmail(authentication.getName());
        wishlistService.removeFromWishlist(userId, productId);
        return ResponseEntity.noContent().build();
    }

    private Long getUserIdFromEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}