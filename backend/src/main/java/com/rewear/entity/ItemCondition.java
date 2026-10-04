package com.rewear.entity;

import jakarta.persistence.AttributeConverter;

/** StoredItem.condition in store.ts. Stored in the DB with the exact frontend label. */
public enum ItemCondition {
    LIKE_NEW("Like New"),
    EXCELLENT("Excellent"),
    GOOD("Good"),
    FAIR("Fair");

    private final String value;

    ItemCondition(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static ItemCondition fromValue(String value) {
        for (ItemCondition c : values()) {
            if (c.value.equals(value)) {
                return c;
            }
        }
        throw new IllegalArgumentException("Unknown item condition: " + value);
    }

    public static class Converter implements AttributeConverter<ItemCondition, String> {
        @Override
        public String convertToDatabaseColumn(ItemCondition attribute) {
            return attribute == null ? null : attribute.getValue();
        }

        @Override
        public ItemCondition convertToEntityAttribute(String dbData) {
            return dbData == null ? null : fromValue(dbData);
        }
    }
}
