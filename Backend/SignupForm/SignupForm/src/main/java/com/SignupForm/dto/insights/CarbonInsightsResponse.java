package com.SignupForm.dto.insights;

import lombok.*;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CarbonInsightsResponse {
    private Double totalFootprint;
    private Double averageMonthly;
    private String bestMonth;
    private List<MonthlyTrendDTO> monthlyTrends;
    private List<TopProductDTO> topProducts;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MonthlyTrendDTO {
        private String label; // e.g., "Jan"
        private Double value; // total emission
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TopProductDTO {
        private Long id;
        private String name;
        private Double emission;
    }
}