package com.xrs.asset.mapper;
import com.xrs.asset.dto.AssetAssignmentRequest;
import com.xrs.asset.entity.Asset;
import com.xrs.asset.entity.AssetAssignment;
import com.xrs.asset.entity.AssetHistory;
import com.xrs.asset.entity.User;
import com.xrs.asset.entity.AssetStatus;
import com.xrs.asset.enums.AssignmentStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class AssignmentMapper {


    public AssetAssignment toAssignAsset(AssetAssignmentRequest request, Asset asset, User user)
    {
        if (request == null) {
            return null;
        }

        AssetAssignment assignment = new AssetAssignment();
        assignment.setAsset(asset);
        assignment.setAssignedTo(user);
        assignment.setStatus(AssignmentStatus.ACTIVE);
        assignment.setAssignmentDate(
                LocalDate.now()        );
        assignment.setNote(request.getNote());

        return assignment;
    }
    public AssetHistory toCreateAssetHistory(Asset asset, User user, AssetStatus status, String note) {
        AssetHistory history = new AssetHistory();
        history.setAsset(asset);
        history.setUser(user);
        history.setStatus(status);
        history.setNote(note);
        history.setTimestamp(LocalDateTime.now());
        return  history;
    }

}