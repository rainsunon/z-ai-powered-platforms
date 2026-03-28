package com.xrs.asset.mapper;

import com.xrs.asset.dto.ListAssetDTO;
import com.xrs.asset.entity.Asset;
import com.xrs.asset.entity.AssetAssignment;
import com.xrs.asset.enums.AssignmentStatus;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class ListAssetDTOMapper {
    public ListAssetDTO toDto(Asset asset) {
        if (asset == null) {
            return null;
        }
        ListAssetDTO listAssetDTO = new ListAssetDTO();
        listAssetDTO.setId(asset.getId());
        listAssetDTO.setSerialNumber(asset.getSerialNumber());
        listAssetDTO.setName(asset.getName());
        listAssetDTO.setType(asset.getType().getName());
        listAssetDTO.setTypeName(asset.getType().getName());  // Match frontend field name
        listAssetDTO.setCategory(asset.getCategory());
        listAssetDTO.setCategoryName(asset.getCategory().getName());  // Match frontend field name
        listAssetDTO.setBrand(asset.getBrand());
        listAssetDTO.setStatus(asset.getStatus().name());
        listAssetDTO.setLocation(asset.getLocation());  // Match frontend field

        if (asset.getAssignments() != null && !asset.getAssignments().isEmpty()) {
            // Find the active assignment first, if none found, use the most recent one
            Optional<AssetAssignment> activeAssignment = asset.getAssignments().stream()
                    .filter(a -> a.getStatus() == AssignmentStatus.ACTIVE)
                    .findFirst();
            
            Optional<AssetAssignment> assignmentToUse = activeAssignment.isPresent() 
                ? activeAssignment 
                : asset.getAssignments().stream()
                    .max(Comparator.comparing(AssetAssignment::getAssignmentDate));

            assignmentToUse.ifPresent(assignment -> {
                if (assignment.getAssignedTo() != null) {
                    listAssetDTO.setAssignedTo(assignment.getAssignedTo().getUsername());
                    if (assignment.getAssignedTo().getDepartment() != null) {
                        listAssetDTO.setDepartment(assignment.getAssignedTo().getDepartment().getName());
                    }
                }
            });
        }

        return listAssetDTO;
    }

    public List<ListAssetDTO> toDtoList(List<Asset> assets) {
        if (assets == null) {
            return List.of();
        }
        return assets.stream().map(this::toDto).collect(Collectors.toList());
    }
}