package com.weather.apigateway.service;

import com.github.tomakehurst.wiremock.client.WireMock;
import com.weather.apigateway.dto.WeatherDto;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class WeatherServiceTest {

    @Autowired
    private WeatherService weatherService;
    
    private static WireMockServer wireMockServer;

    @BeforeEach
    public void setup() {
        if (wireMockServer == null) {
            wireMockServer = new WireMockServer(WireMockConfiguration.wireMockConfig().dynamicPort());
            wireMockServer.start();
            System.setProperty("app.python-service.url", "http://localhost:" + wireMockServer.port());
            WireMock.configureFor("localhost", wireMockServer.port());
        }
        wireMockServer.resetAll();
    }
    
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        if (wireMockServer == null) {
            wireMockServer = new WireMockServer(WireMockConfiguration.wireMockConfig().dynamicPort());
            wireMockServer.start();
        }
        registry.add("app.python-service.url", () -> "http://localhost:" + wireMockServer.port());
    }

    @Test
    public void testGetCurrentWeather_Success() {
        stubFor(get(urlPathEqualTo("/weather/latest"))
                .withQueryParam("city", equalTo("London"))
                .willReturn(aResponse()
                        .withHeader("Content-Type", "application/json")
                        .withBody("{\"id\":1,\"city\":\"London\",\"temperature\":20.5,\"humidity\":60.0,\"timestamp\":\"2024-05-18T10:00:00\"}")
                ));

        WeatherDto result = weatherService.getCurrentWeather("London");

        assertNotNull(result);
        assertEquals("London", result.getCity());
        assertEquals(20.5, result.getTemperature());
    }
}
