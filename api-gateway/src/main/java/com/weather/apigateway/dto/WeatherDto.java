package com.weather.apigateway.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeatherDto {
    private Integer id;
    private String city;
    private Double temperature;
    private Double humidity;
    private LocalDateTime timestamp;
}
