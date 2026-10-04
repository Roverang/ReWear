package com.rewear.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * Body of POST /api/auth/register.
 * Password max is 72 because BCrypt only uses the first 72 bytes.
 */
public record RegisterRequest(
        @NotBlank @Size(max = 100) String name,
        @NotBlank @Email @Size(max = 255) String email,
        @NotBlank @Size(min = 8, max = 72) String password,
        @Size(max = 20) List<@NotBlank @Size(max = 50) String> stylePreferences
) {

    /** Trim before validation so " a@b.com " is accepted as a valid email. */
    public RegisterRequest {
        name = name == null ? null : name.trim();
        email = email == null ? null : email.trim();
    }
}
