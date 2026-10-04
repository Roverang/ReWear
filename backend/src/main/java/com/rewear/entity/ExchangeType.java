package com.rewear.entity;

import jakarta.persistence.AttributeConverter;

/** Exchange.type in store.ts. */
public enum ExchangeType {
    EXCHANGE("exchange"),
    DONATE("donate");

    private final String value;

    ExchangeType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static ExchangeType fromValue(String value) {
        for (ExchangeType t : values()) {
            if (t.value.equals(value)) {
                return t;
            }
        }
        throw new IllegalArgumentException("Unknown exchange type: " + value);
    }

    public static class Converter implements AttributeConverter<ExchangeType, String> {
        @Override
        public String convertToDatabaseColumn(ExchangeType attribute) {
            return attribute == null ? null : attribute.getValue();
        }

        @Override
        public ExchangeType convertToEntityAttribute(String dbData) {
            return dbData == null ? null : fromValue(dbData);
        }
    }
}
