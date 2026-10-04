package com.rewear.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** app.demo.* — demo account created by DemoDataSeeder in the dev profile. */
@ConfigurationProperties(prefix = "app.demo")
public record DemoProperties(String email, String password) {
}
