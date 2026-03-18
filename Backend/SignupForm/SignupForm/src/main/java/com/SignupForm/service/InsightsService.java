package com.SignupForm.service;

import com.SignupForm.dto.insights.CarbonInsightsResponse;
import com.SignupForm.entity.Order;
import com.SignupForm.entity.OrderItem;
import com.SignupForm.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InsightsService {

    private final OrderRepository orderRepository;

    public CarbonInsightsResponse getInsightsData(String email) {
        // 1. Fetch orders sorted by date for the trend line
        List<Order> orders = orderRepository.findByEmailOrderByOrderDateAsc(email);

        // 2. Group by Month for the Trend Chart
        Map<String, Double> trendMap = orders.stream()
                .collect(Collectors.groupingBy(
                        o -> o.getOrderDate().getMonth().name().substring(0, 3),
                        LinkedHashMap::new,
                        Collectors.summingDouble(Order::getTotalEmission)
                ));

        List<CarbonInsightsResponse.MonthlyTrendDTO> trends = trendMap.entrySet().stream()
                .map(e -> new CarbonInsightsResponse.MonthlyTrendDTO(e.getKey(), e.getValue()))
                .collect(Collectors.toList());

        // 3. Summarize Totals
        Double total = orders.stream().mapToDouble(Order::getTotalEmission).sum();

        // Find Best Month (lowest footprint)
        String bestMonth = trendMap.entrySet().stream()
                .min(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey).orElse("N/A");

        // 4. Calculate Top Products based on line-item emissions
        List<CarbonInsightsResponse.TopProductDTO> topProducts = orders.stream()
                .flatMap(o -> o.getOrderItems().stream())
                .collect(Collectors.groupingBy(
                        OrderItem::getProductName,
                        Collectors.summingDouble(OrderItem::getEmission)
                ))
                .entrySet().stream()
                .map(e -> new CarbonInsightsResponse.TopProductDTO(null, e.getKey(), e.getValue()))
                .sorted(Comparator.comparing(CarbonInsightsResponse.TopProductDTO::getEmission).reversed())
                .limit(4)
                .collect(Collectors.toList());

        return CarbonInsightsResponse.builder()
                .totalFootprint(total)
                .averageMonthly(orders.isEmpty() ? 0.0 : total / orders.size())
                .bestMonth(bestMonth)
                .monthlyTrends(trends)
                .topProducts(topProducts)
                .build();
    }

    // Module 5: Admin Logic
    public Map<String, Object> getAdminGlobalReport() {
        Double systemTotal = orderRepository.getSystemWideTotalEmission();

        Map<String, Object> report = new HashMap<>();
        report.put("globalCarbonSaved", systemTotal != null ? systemTotal : 0.0);
        return report;
    }
}