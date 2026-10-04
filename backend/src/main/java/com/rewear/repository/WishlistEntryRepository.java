package com.rewear.repository;

import com.rewear.entity.WishlistEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface WishlistEntryRepository extends JpaRepository<WishlistEntry, UUID> {
}
