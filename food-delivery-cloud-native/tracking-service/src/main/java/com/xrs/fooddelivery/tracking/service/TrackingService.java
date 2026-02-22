package com.xrs.fooddelivery.tracking.service;

import com.xrs.fooddelivery.tracking.dto.TrackingInfoDTO;

public interface TrackingService {
    TrackingInfoDTO getTrackingByOrderId(Long orderId);
    void updateTracking(TrackingInfoDTO dto);
}
