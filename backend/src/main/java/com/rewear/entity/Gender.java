package com.rewear.entity;

import jakarta.persistence.AttributeConverter;

/** StoredItem.gender in store.ts. */
public enum Gender {
    WOMEN("Women"),
    MEN("Men"),
    UNISEX("Unisex");

    private final String value;

    Gender(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static Gender fromValue(String value) {
        for (Gender g : values()) {
            if (g.value.equals(value)) {
                return g;
            }
        }
        throw new IllegalArgumentException("Unknown gender: " + value);
    }

    public static class Converter implements AttributeConverter<Gender, String> {
        @Override
        public String convertToDatabaseColumn(Gender attribute) {
            return attribute == null ? null : attribute.getValue();
        }

        @Override
        public Gender convertToEntityAttribute(String dbData) {
            return dbData == null ? null : fromValue(dbData);
        }
    }
}
