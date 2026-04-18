package com.weather.apigateway.service;

import com.weather.apigateway.dto.WeatherDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.time.Duration;
import java.util.List;
import reactor.core.publisher.Mono;
import java.util.Arrays;

@Service
@RequiredArgsConstructor
@Slf4j
public class WeatherService {

    private final WebClient webClient;
    private final RedisTemplate<String, Object> redisTemplate;
    
    private static final long CACHE_TTL_MINUTES = 30;

    public WeatherDto getCurrentWeather(String city) {
        String cacheKey = "weather:current:" + city.toLowerCase();
        
        // 1. Check Redis Cache
        WeatherDto cached = (WeatherDto) redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            log.info("Cache hit for city: {}", city);
            return cached;
        }

        log.info("Cache miss for city: {}. Fetching from Python service...", city);
        // 2. Fetch from Python Service
        WeatherDto response = webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/weather/latest").queryParam("city", city).build())
                .retrieve()
                .bodyToMono(WeatherDto.class)
                .onErrorResume(e -> {
                    log.error("Error fetching from Python service: {}", e.getMessage());
                    return Mono.empty();
                })
                .block();

        // 3. Store in Redis
        if (response != null) {
            redisTemplate.opsForValue().set(cacheKey, response, Duration.ofMinutes(CACHE_TTL_MINUTES));
        }

        return response;
    }

    public List<WeatherDto> getWeatherHistory(String city) {
        String cacheKey = "weather:history:" + city.toLowerCase();
        
        Object cachedObj = redisTemplate.opsForValue().get(cacheKey);
        if (cachedObj instanceof WeatherDto[]) {
            WeatherDto[] cached = (WeatherDto[]) cachedObj;
            log.info("History cache hit for city: {}", city);
            return Arrays.asList(cached);
        }

        log.info("History cache miss. Fetching from Python service for city: {}", city);
        WeatherDto[] response = webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/weather/history").queryParam("city", city).build())
                .retrieve()
                .bodyToMono(WeatherDto[].class)
                .onErrorResume(e -> {
                    log.error("Error fetching history from Python service: {}", e.getMessage());
                    return Mono.empty();
                })
                .block();

        if (response != null && response.length > 0) {
            redisTemplate.opsForValue().set(cacheKey, response, Duration.ofMinutes(5));
            return Arrays.asList(response);
        }
        
        return List.of();
    }
}
