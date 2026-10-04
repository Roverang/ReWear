package com.rewear.exception;

/** Mapped to 401. Same message for unknown email and wrong password. */
public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException() {
        super("Invalid email or password");
    }
}
