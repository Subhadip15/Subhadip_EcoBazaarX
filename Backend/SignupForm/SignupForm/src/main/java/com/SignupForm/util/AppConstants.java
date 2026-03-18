package com.SignupForm.util;

public final class AppConstants {

    private AppConstants() {}

    // ORDER STATUS
    public static final String ORDER_PENDING = "PENDING";
    public static final String ORDER_PROCESSING = "ORDERED";
    public static final String ORDER_PLACED = "PLACED";
    public static final String ORDER_CONFIRMED = "CONFIRMED";
    public static final String ORDER_SHIPPED = "SHIPPED";
    public static final String ORDER_DELIVERED = "DELIVERED";
    public static final String ORDER_CANCELLED = "CANCELLED";

    // USER ROLES
    public static final String ROLE_USER = "USER";
    public static final String ROLE_ADMIN = "ADMIN";

    // CART
    public static final Integer MAX_CART_ITEMS = 50;

    // RECOMMENDATION
    public static final double GREEN_SCORE_WEIGHT = 0.7;
    public static final double PRICE_SCORE_WEIGHT = 0.3;

    // ORDER PREFIX
    public static final String ORDER_PREFIX = "ECO-";
}