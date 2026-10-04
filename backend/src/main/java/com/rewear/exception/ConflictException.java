package com.rewear.exception;

/** Mapped to 409 by GlobalExceptionHandler. */
public class ConflictException extends RuntimeException {

    public ConflictException(String message) {
        super(message);
    }
}
