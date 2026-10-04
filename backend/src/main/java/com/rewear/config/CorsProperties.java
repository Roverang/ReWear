package com.rewear.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** app.cors.* — the frontend origin allowed to call the API. */
@ConfigurationProperties(prefix = "app.cors")
public record CorsProperties(String allowedOrigin) {
}
