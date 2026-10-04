package com.rewear.service;

import com.rewear.dto.AuthResponse;
import com.rewear.dto.LoginRequest;
import com.rewear.dto.RegisterRequest;
import com.rewear.dto.UserResponse;
import com.rewear.entity.Notification;
import com.rewear.entity.NotificationType;
import com.rewear.entity.User;
import com.rewear.exception.ConflictException;
import com.rewear.exception.InvalidCredentialsException;
import com.rewear.exception.NotFoundException;
import com.rewear.repository.NotificationRepository;
import com.rewear.repository.UserRepository;
import com.rewear.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
public class AuthService {

    /** Same palette as AVATAR_COLORS in store.ts. */
    private static final List<String> AVATAR_COLORS = List.of(
            "#7FA35B", "#3F6B37", "#C2A878", "#5AA469", "#A8B89C", "#6B8F71", "#8AAE6B", "#4A7C59");

    /** Starting values for a new account, matching register() in AppContext.tsx. */
    private static final int STARTING_ECO_POINTS = 10;
    private static final String STARTER_BADGE = "Eco Starter";
    private static final String WELCOME_MESSAGE = "Welcome to ReWear! 🌿 You've earned the Eco Starter badge.";

    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    /** Compared against when the email is unknown, so both login failures take similar time. */
    private final String dummyPasswordHash;

    public AuthService(UserRepository userRepository,
                       NotificationRepository notificationRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.dummyPasswordHash = passwordEncoder.encode(UUID.randomUUID().toString());
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("An account with this email already exists");
        }

        String name = request.name().trim();
        User user = new User(name, email, passwordEncoder.encode(request.password()),
                initialsOf(name), randomAvatarColor());
        user.setEcoPoints(STARTING_ECO_POINTS);
        user.setBadges(new ArrayList<>(List.of(STARTER_BADGE)));
        if (request.stylePreferences() != null) {
            user.setStylePreferences(new ArrayList<>(request.stylePreferences()));
        }
        // saveAndFlush so a duplicate email that slips past the check above fails here (-> 409)
        user = userRepository.saveAndFlush(user);

        notificationRepository.save(new Notification(user, WELCOME_MESSAGE, null, NotificationType.BADGE));

        return toAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(normalizeEmail(request.email())).orElse(null);
        if (user == null) {
            passwordEncoder.matches(request.password(), dummyPasswordHash);
            throw new InvalidCredentialsException();
        }
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }
        return toAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(UUID userId) {
        return userRepository.findById(userId)
                .map(UserResponse::from)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    private AuthResponse toAuthResponse(User user) {
        String token = jwtService.generateToken(user.getId());
        return new AuthResponse(token, "Bearer", jwtService.getExpirationSeconds(), UserResponse.from(user));
    }

    static String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    /** Same rule as getInitials() in store.ts: first letter of each word, max 2. */
    static String initialsOf(String name) {
        String initials = Arrays.stream(name.trim().split("\\s+"))
                .filter(part -> !part.isEmpty())
                .map(part -> part.substring(0, 1))
                .collect(Collectors.joining())
                .toUpperCase(Locale.ROOT);
        return initials.length() > 2 ? initials.substring(0, 2) : initials;
    }

    private static String randomAvatarColor() {
        return AVATAR_COLORS.get(ThreadLocalRandom.current().nextInt(AVATAR_COLORS.size()));
    }
}
