package com.rewear.repository;

import com.rewear.entity.Exchange;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ExchangeRepository extends JpaRepository<Exchange, UUID> {
}
