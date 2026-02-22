package com.xrs.aimlservice.service;

import com.xrs.aimlservice.dto.AiMlDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PredictiveAnalyticsService {

    public AiMlDto.ForecastResponse forecast(AiMlDto.ForecastRequest request) {
        List<Double> history = request.history();
        if (history == null || history.isEmpty()) {
            return new AiMlDto.ForecastResponse(request.seriesName(), List.of());
        }

        int horizon = request.horizon() == null ? 3 : Math.max(1, request.horizon());
        double slope = calculateSlope(history);
        double lastValue = history.get(history.size() - 1);

        List<Double> prediction = new ArrayList<>();
        for (int step = 1; step <= horizon; step++) {
            prediction.add(round(lastValue + slope * step));
        }
        return new AiMlDto.ForecastResponse(request.seriesName(), prediction);
    }

    private double calculateSlope(List<Double> history) {
        if (history.size() < 2) {
            return 0.0;
        }
        int n = history.size();
        double sumX = 0.0;
        double sumY = 0.0;
        double sumXY = 0.0;
        double sumXX = 0.0;

        for (int index = 0; index < n; index++) {
            double x = index + 1;
            double y = history.get(index);
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumXX += x * x;
        }

        double denominator = n * sumXX - sumX * sumX;
        if (denominator == 0.0) {
            return 0.0;
        }
        return (n * sumXY - sumX * sumY) / denominator;
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}