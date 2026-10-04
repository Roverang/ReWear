package com.rewear.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

/** app.jwt.* — secret is base64 and comes from the JWT_SECRET environment variable. */
@ConfigurationProperties(prefix = "app.jwt")
public record JwtProperties(String secret, Duration expiration) {
}
