package com.rewear.dto;

import jakarta.validation.constraints.NotBlank;

/** Body of POST /api/auth/login. */
public record LoginRequest(
        @NotBlank String email,
        @NotBlank String password
) {

    public LoginRequest {
        email = email == null ? null : email.trim();
    }
}
