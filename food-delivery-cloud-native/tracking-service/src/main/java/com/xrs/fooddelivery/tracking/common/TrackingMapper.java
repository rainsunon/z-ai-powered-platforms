package com.xrs.fooddelivery.tracking.common;

import com.xrs.fooddelivery.tracking.dto.TrackingInfoDTO;
import com.xrs.fooddelivery.tracking.entity.TrackingInfo;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TrackingMapper {
    TrackingInfoDTO toDTO(TrackingInfo entity);
    TrackingInfo toEntity(TrackingInfoDTO dto);
}
