package com.rewear.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

/** Exchange in store.ts (itemTitle / requesterName come from the related item and requester). */
@Entity
@Table(name = "exchanges")
public class Exchange {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proposed_item_id")
    private Item proposedItem;

    @Column(nullable = false, length = 1000)
    private String message;

    @Convert(converter = ExchangeStatus.Converter.class)
    @Column(nullable = false, length = 10)
    private ExchangeStatus status = ExchangeStatus.PENDING;

    @Convert(converter = ExchangeType.Converter.class)
    @Column(name = "exchange_type", nullable = false, length = 10)
    private ExchangeType type;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected Exchange() {
        // for JPA
    }

    public Exchange(Item item, User requester, User owner, Item proposedItem, String message, ExchangeType type) {
        this.item = item;
        this.requester = requester;
        this.owner = owner;
        this.proposedItem = proposedItem;
        this.message = message;
        this.type = type;
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

    public Item getItem() {
        return item;
    }

    public User getRequester() {
        return requester;
    }

    public User getOwner() {
        return owner;
    }

    public Item getProposedItem() {
        return proposedItem;
    }

    public String getMessage() {
        return message;
    }

    public ExchangeStatus getStatus() {
        return status;
    }

    public void setStatus(ExchangeStatus status) {
        this.status = status;
    }

    public ExchangeType getType() {
        return type;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
