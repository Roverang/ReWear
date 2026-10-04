package com.rewear.dto;

import com.rewear.entity.User;

import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

/** Public view of a user, same shape as User in store.ts minus the password. */
public record UserResponse(
        UUID id,
        String name,
        String email,
        String initials,
        String avatarColor,
        String location,
        String bio,
        String memberSince,
        int ecoPoints,
        double co2Saved,
        double textileSaved,
        int exchangeCount,
        int donationCount,
        List<String> badges,
        List<String> stylePreferences
) {

    private static final DateTimeFormatter MEMBER_SINCE = DateTimeFormatter.ofPattern("yyyy-MM").withZone(ZoneOffset.UTC);

    /** Must be called inside a transaction (badges and stylePreferences are lazy). */
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getInitials(),
                user.getAvatarColor(),
                user.getLocation(),
                user.getBio(),
                MEMBER_SINCE.format(user.getCreatedAt()),
                user.getEcoPoints(),
                user.getCo2Saved(),
                user.getTextileSaved(),
                user.getExchangeCount(),
                user.getDonationCount(),
                List.copyOf(user.getBadges()),
                List.copyOf(user.getStylePreferences())
        );
    }
}
