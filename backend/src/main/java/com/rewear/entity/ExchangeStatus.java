package com.rewear.entity;

import jakarta.persistence.AttributeConverter;

/** Exchange.status in store.ts. */
public enum ExchangeStatus {
    PENDING("pending"),
    ACCEPTED("accepted"),
    DECLINED("declined");

    private final String value;

    ExchangeStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static ExchangeStatus fromValue(String value) {
        for (ExchangeStatus s : values()) {
            if (s.value.equals(value)) {
                return s;
            }
        }
        throw new IllegalArgumentException("Unknown exchange status: " + value);
    }

    public static class Converter implements AttributeConverter<ExchangeStatus, String> {
        @Override
        public String convertToDatabaseColumn(ExchangeStatus attribute) {
            return attribute == null ? null : attribute.getValue();
        }

        @Override
        public ExchangeStatus convertToEntityAttribute(String dbData) {
            return dbData == null ? null : fromValue(dbData);
        }
    }
}
