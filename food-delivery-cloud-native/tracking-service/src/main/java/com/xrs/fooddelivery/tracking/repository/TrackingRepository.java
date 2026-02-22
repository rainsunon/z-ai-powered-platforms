package com.xrs.fooddelivery.tracking.repository;

import com.xrs.fooddelivery.tracking.entity.TrackingInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TrackingRepository extends JpaRepository<TrackingInfo, Long> {
    Optional<TrackingInfo> findTopByOrderIdOrderByUpdatedAtDesc(Long orderId);
}
