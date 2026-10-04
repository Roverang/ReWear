package com.rewear.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/** User in store.ts (memberSince is derived from createdAt). */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 255, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 100)
    private String passwordHash;

    @Column(nullable = false, length = 4)
    private String initials;

    @Column(name = "avatar_color", nullable = false, length = 7)
    private String avatarColor;

    @Column(nullable = false, length = 100)
    private String location = "";

    @Column(nullable = false, length = 500)
    private String bio = "";

    @Column(name = "eco_points", nullable = false)
    private int ecoPoints;

    @Column(name = "co2_saved", nullable = false)
    private double co2Saved;

    @Column(name = "textile_saved", nullable = false)
    private double textileSaved;

    @Column(name = "exchange_count", nullable = false)
    private int exchangeCount;

    @Column(name = "donation_count", nullable = false)
    private int donationCount;

    @ElementCollection
    @CollectionTable(name = "user_badges", joinColumns = @JoinColumn(name = "user_id"))
    @OrderColumn(name = "sort_order")
    @Column(name = "badge", nullable = false, length = 50)
    private List<String> badges = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "user_style_preferences", joinColumns = @JoinColumn(name = "user_id"))
    @OrderColumn(name = "sort_order")
    @Column(name = "preference", nullable = false, length = 50)
    private List<String> stylePreferences = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected User() {
        // for JPA
    }

    public User(String name, String email, String passwordHash, String initials, String avatarColor) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.initials = initials;
        this.avatarColor = avatarColor;
    }

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getInitials() {
        return initials;
    }

    public void setInitials(String initials) {
        this.initials = initials;
    }

    public String getAvatarColor() {
        return avatarColor;
    }

    public void setAvatarColor(String avatarColor) {
        this.avatarColor = avatarColor;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public int getEcoPoints() {
        return ecoPoints;
    }

    public void setEcoPoints(int ecoPoints) {
        this.ecoPoints = ecoPoints;
    }

    public double getCo2Saved() {
        return co2Saved;
    }

    public void setCo2Saved(double co2Saved) {
        this.co2Saved = co2Saved;
    }

    public double getTextileSaved() {
        return textileSaved;
    }

    public void setTextileSaved(double textileSaved) {
        this.textileSaved = textileSaved;
    }

    public int getExchangeCount() {
        return exchangeCount;
    }

    public void setExchangeCount(int exchangeCount) {
        this.exchangeCount = exchangeCount;
    }

    public int getDonationCount() {
        return donationCount;
    }

    public void setDonationCount(int donationCount) {
        this.donationCount = donationCount;
    }

    public List<String> getBadges() {
        return badges;
    }

    public void setBadges(List<String> badges) {
        this.badges = badges;
    }

    public List<String> getStylePreferences() {
        return stylePreferences;
    }

    public void setStylePreferences(List<String> stylePreferences) {
        this.stylePreferences = stylePreferences;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
