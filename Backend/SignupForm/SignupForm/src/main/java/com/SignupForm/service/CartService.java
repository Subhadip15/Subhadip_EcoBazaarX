package com.SignupForm.service;

import com.SignupForm.dto.cart.CartResponse;
import com.SignupForm.entity.Cart;
import com.SignupForm.entity.CartItem;
import com.SignupForm.entity.Product;
import com.SignupForm.entity.Users;
import com.SignupForm.repository.CartItemRepository;
import com.SignupForm.repository.CartRepository;
import com.SignupForm.repository.ProductRepository;
import com.SignupForm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartRepository cartRepo;
    private final CartItemRepository cartItemRepo;
    private final ProductRepository productRepo;
    private final UserRepository usersRepo;

    // ================= GET OR CREATE CART =================
    private Cart getOrCreateCart(String email) {
        Users user = usersRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartRepo.findByUser(user)
                .orElseGet(() -> cartRepo.save(
                        Cart.builder()
                                .user(user)
                                .cartItems(new ArrayList<>())
                                .build()
                ));
    }

    // ================= GET CART =================
    public CartResponse getCart(String email) {
        Cart cart = getOrCreateCart(email);
        return mapToCartResponse(cart);
    }

    // ================= ADD TO CART =================
    public CartResponse addToCart(String email, Long productId, Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        Cart cart = getOrCreateCart(email);

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem existingItem = null;
        for (CartItem i : cart.getCartItems()) {
            if (i.getProduct().getId().equals(productId)) {
                existingItem = i;
                break;
            }
        }

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(quantity)
                    .build();
            cart.getCartItems().add(newItem);
        }

        cartRepo.save(cart);
        return mapToCartResponse(cart);
    }

    // ================= REMOVE ITEM =================
    public CartResponse removeItem(String email, Long itemId) {
        Cart cart = getOrCreateCart(email);

        CartItem item = cartItemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Item does not belong to this user");
        }

        cart.getCartItems().remove(item);
        cartItemRepo.delete(item);

        return mapToCartResponse(cart);
    }

    // ================= UPDATE QUANTITY =================
    public CartResponse updateQuantity(String email, Long productId, int quantityChange) {
        if (quantityChange == 0) {
            throw new RuntimeException("Quantity change cannot be 0");
        }

        Cart cart = getOrCreateCart(email);

        CartItem item = null;
        for (CartItem ci : cart.getCartItems()) {
            if (ci.getProduct().getId().equals(productId)) {
                item = ci;
                break;
            }
        }

        if (item == null) {
            throw new RuntimeException("Cart item not found");
        }

        int newQuantity = item.getQuantity() + quantityChange;

        if (newQuantity <= 0) {
            // Snapshot items before deletion
            List<CartItem> itemsBeforeRemoval = new ArrayList<>(cart.getCartItems());

            // Remove the item safely
            cart.getCartItems().remove(item);
            cartItemRepo.delete(item);

            // Map response from snapshot excluding deleted item
            return mapToCartResponseFromItems(cart, itemsBeforeRemoval);
        } else {
            item.setQuantity(newQuantity);
            cartRepo.save(cart);
            return mapToCartResponse(cart);
        }
    }

    // ================= CLEAR CART =================
    public CartResponse clearCart(String email) {
        Cart cart = getOrCreateCart(email);
        cartItemRepo.deleteAll(cart.getCartItems());
        cart.getCartItems().clear();
        return mapToCartResponse(cart);
    }

    // ================= MAPPER =================
    private CartResponse mapToCartResponse(Cart cart) {
        List<CartResponse.CartItemResponse> itemResponses = new ArrayList<>();
        double total = 0.0;
        double totalEmission = 0.0;

        for (CartItem item : cart.getCartItems()) {
            double subtotal = item.getProduct().getPrice() * item.getQuantity();
            double emission = item.getQuantity() *
                    (item.getProduct().getEmission() != null ? item.getProduct().getEmission() : 0.5);

            total += subtotal;
            totalEmission += emission;

            itemResponses.add(CartResponse.CartItemResponse.builder()
                    .itemId(item.getId())
                    .productId(item.getProduct().getId())
                    .productName(item.getProduct().getName())
                    .image(item.getProduct().getImage())
                    .price(item.getProduct().getPrice())
                    .quantity(item.getQuantity())
                    .subtotal(subtotal)
                    .emission(emission)
                    .build());
        }

        return CartResponse.builder()
                .cartId(cart.getId())
                .userEmail(cart.getUser().getEmail())
                .items(itemResponses)
                .totalAmount(total)
                .totalEmission(totalEmission)
                .build();
    }

    // ================= MAPPER FOR REMOVED ITEM =================
    private CartResponse mapToCartResponseFromItems(Cart cart, List<CartItem> items) {
        List<CartResponse.CartItemResponse> itemResponses = new ArrayList<>();
        double total = 0.0;
        double totalEmission = 0.0;

        for (CartItem item : items) {
            if (item.getQuantity() <= 0) continue;

            double subtotal = item.getProduct().getPrice() * item.getQuantity();
            double emission = item.getQuantity() *
                    (item.getProduct().getEmission() != null ? item.getProduct().getEmission() : 0.5);

            total += subtotal;
            totalEmission += emission;

            itemResponses.add(CartResponse.CartItemResponse.builder()
                    .itemId(item.getId())
                    .productId(item.getProduct().getId())
                    .productName(item.getProduct().getName())
                    .image(item.getProduct().getImage())
                    .price(item.getProduct().getPrice())
                    .quantity(item.getQuantity())
                    .subtotal(subtotal)
                    .emission(emission)
                    .build());
        }

        return CartResponse.builder()
                .cartId(cart.getId())
                .userEmail(cart.getUser().getEmail())
                .items(itemResponses)
                .totalAmount(total)
                .totalEmission(totalEmission)
                .build();
    }
}