package com.rewear.entity;

import jakarta.persistence.AttributeConverter;

/** AppNotification.type in store.ts. */
public enum NotificationType {
    EXCHANGE("exchange"),
    BADGE("badge"),
    WISHLIST("wishlist"),
    SYSTEM("system"),
    DONATE("donate");

    private final String value;

    NotificationType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static NotificationType fromValue(String value) {
        for (NotificationType t : values()) {
            if (t.value.equals(value)) {
                return t;
            }
        }
        throw new IllegalArgumentException("Unknown notification type: " + value);
    }

    public static class Converter implements AttributeConverter<NotificationType, String> {
        @Override
        public String convertToDatabaseColumn(NotificationType attribute) {
            return attribute == null ? null : attribute.getValue();
        }

        @Override
        public NotificationType convertToEntityAttribute(String dbData) {
            return dbData == null ? null : fromValue(dbData);
        }
    }
}
