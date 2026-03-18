package com.SignupForm.repository;

import com.SignupForm.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByUserId(Long userId);
    void deleteByUserIdAndProductId(Long userId, Long productId);
}