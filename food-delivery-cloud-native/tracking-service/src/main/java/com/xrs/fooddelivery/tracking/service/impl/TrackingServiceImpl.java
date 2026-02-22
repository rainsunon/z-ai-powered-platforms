package com.xrs.fooddelivery.tracking.service.impl;

import com.xrs.fooddelivery.tracking.common.TrackingMapper;
import com.xrs.fooddelivery.tracking.dto.TrackingInfoDTO;
import com.xrs.fooddelivery.tracking.repository.TrackingRepository;
import com.xrs.fooddelivery.tracking.service.TrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TrackingServiceImpl implements TrackingService {

    private final TrackingRepository repository;

    private final TrackingMapper mapper;

    @Override
    public TrackingInfoDTO getTrackingByOrderId(Long orderId) {
        return repository.findTopByOrderIdOrderByUpdatedAtDesc(orderId)
                .map(mapper::toDTO)
                .orElse(null);
    }

    @Override
    public void updateTracking(TrackingInfoDTO dto) {
        repository.save(mapper.toEntity(dto));
    }
}
