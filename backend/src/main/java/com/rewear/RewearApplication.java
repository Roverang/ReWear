package com.rewear;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

import java.util.TimeZone;

// UserDetailsServiceAutoConfiguration is excluded because authentication is done
// with our own JWT filter; otherwise Boot would create an in-memory user with a logged password.
@SpringBootApplication(exclude = UserDetailsServiceAutoConfiguration.class)
@ConfigurationPropertiesScan
public class RewearApplication {

    public static void main(String[] args) {
        // Run in UTC: the PostgreSQL driver sends the JVM time zone on connect, and some
        // OS defaults (e.g. the legacy alias "Asia/Calcutta") are rejected by the server.
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        SpringApplication.run(RewearApplication.class, args);
    }
}
