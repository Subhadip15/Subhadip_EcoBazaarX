package com.SignupForm.service;

import com.SignupForm.dto.WishlistDTO;
import com.SignupForm.entity.WishlistItem;
import com.SignupForm.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    public List<WishlistDTO> getWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public WishlistDTO addToWishlist(Long userId, WishlistItem item) {
        item.setUserId(userId);
        WishlistItem saved = wishlistRepository.save(item);
        return convertToDTO(saved);
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }

    private WishlistDTO convertToDTO(WishlistItem item) {
        return new WishlistDTO(
                item.getId(),
                item.getProductId(),
                item.getName(),
                item.getImage(),
                item.getCategory(),
                item.getPrice()
        );
    }
}