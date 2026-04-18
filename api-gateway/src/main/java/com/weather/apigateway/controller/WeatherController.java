package com.weather.apigateway.controller;

import com.weather.apigateway.dto.WeatherDto;
import com.weather.apigateway.service.WeatherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // For React frontend
public class WeatherController {

    private final WeatherService weatherService;

    @GetMapping("/current")
    public ResponseEntity<WeatherDto> getCurrentWeather(@RequestParam String city) {
        WeatherDto weather = weatherService.getCurrentWeather(city);
        if (weather != null) {
            return ResponseEntity.ok(weather);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/history")
    public ResponseEntity<List<WeatherDto>> getWeatherHistory(@RequestParam String city) {
        List<WeatherDto> history = weatherService.getWeatherHistory(city);
        if (history != null && !history.isEmpty()) {
            return ResponseEntity.ok(history);
        }
        return ResponseEntity.notFound().build();
    }
}
