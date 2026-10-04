package com.rewear.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/** StoredItem in store.ts (the owner summary is built from the owner User). */
@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(nullable = false, length = 80)
    private String brand;

    @Column(nullable = false, length = 50)
    private String category;

    @Convert(converter = ItemCondition.Converter.class)
    @Column(name = "item_condition", nullable = false, length = 20)
    private ItemCondition condition;

    @Column(nullable = false, length = 20)
    private String size;

    @Convert(converter = Gender.Converter.class)
    @Column(nullable = false, length = 10)
    private Gender gender;

    @Column(nullable = false, length = 100)
    private String location;

    @Column(name = "sustainability_score", nullable = false)
    private int sustainabilityScore;

    /** Main image (StoredItem.image). */
    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @ElementCollection
    @CollectionTable(name = "item_images", joinColumns = @JoinColumn(name = "item_id"))
    @OrderColumn(name = "sort_order")
    @Column(name = "image_url", nullable = false, length = 500)
    private List<String> images = new ArrayList<>();

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(name = "point_value", nullable = false)
    private int pointValue;

    @Column(name = "listed_at", nullable = false)
    private Instant listedAt;

    @Column(name = "exchange_count", nullable = false)
    private int exchangeCount;

    @Column(name = "is_available", nullable = false)
    private boolean available = true;

    protected Item() {
        // for JPA
    }

    public Item(User owner, String title, String brand, String category, ItemCondition condition,
                String size, Gender gender, String location, int sustainabilityScore,
                String imageUrl, String description, int pointValue) {
        this.owner = owner;
        this.title = title;
        this.brand = brand;
        this.category = category;
        this.condition = condition;
        this.size = size;
        this.gender = gender;
        this.location = location;
        this.sustainabilityScore = sustainabilityScore;
        this.imageUrl = imageUrl;
        this.description = description;
        this.pointValue = pointValue;
    }

    @PrePersist
    void onCreate() {
        if (listedAt == null) {
            listedAt = Instant.now();
        }
    }

    public UUID getId() {
        return id;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public ItemCondition getCondition() {
        return condition;
    }

    public void setCondition(ItemCondition condition) {
        this.condition = condition;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getSustainabilityScore() {
        return sustainabilityScore;
    }

    public void setSustainabilityScore(int sustainabilityScore) {
        this.sustainabilityScore = sustainabilityScore;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getPointValue() {
        return pointValue;
    }

    public void setPointValue(int pointValue) {
        this.pointValue = pointValue;
    }

    public Instant getListedAt() {
        return listedAt;
    }

    public void setListedAt(Instant listedAt) {
        this.listedAt = listedAt;
    }

    public int getExchangeCount() {
        return exchangeCount;
    }

    public void setExchangeCount(int exchangeCount) {
        this.exchangeCount = exchangeCount;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }
}
