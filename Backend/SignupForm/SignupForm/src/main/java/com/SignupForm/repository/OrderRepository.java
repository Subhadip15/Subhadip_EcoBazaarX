package com.SignupForm.repository;

import com.SignupForm.entity.Order;
import com.SignupForm.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // For User Dashboard: Fetch orders by email sorted by date for the trend chart
    List<Order> findByEmailOrderByOrderDateAsc(String email);

    // For User Dashboard: Fetch orders by User object
    List<Order> findByUser(Users user);

    // For Module 4: Get total carbon saved by a specific user (for Badges)
    @Query("SELECT SUM(o.totalEmission) FROM Order o WHERE o.email = :email")
    Double getTotalEmissionByEmail(@Param("email") String email);

    // For Module 5: Admin Dashboard - System-wide carbon reduction trend
    @Query("SELECT SUM(o.totalEmission) FROM Order o")
    Double getSystemWideTotalEmission();

    // For Module 5: Merchant Analytics - Top eco-performing months
    @Query(value = "SELECT MONTHNAME(order_date) as month, SUM(total_emission) as total " +
            "FROM orders GROUP BY MONTH(order_date) ORDER BY MONTH(order_date)",
            nativeQuery = true)
    List<Object[]> getMonthlyEmissionStats();
}