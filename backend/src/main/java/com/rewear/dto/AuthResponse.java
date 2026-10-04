package com.rewear.dto;

/** Returned by register and login. expiresIn is in seconds. */
public record AuthResponse(
        String token,
        String tokenType,
        long expiresIn,
        UserResponse user
) {
}
