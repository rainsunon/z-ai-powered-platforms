package com.ofo.notificationservice.api;

import com.ofo.notificationservice.application.service.NotificationService;
import com.ofo.notificationservice.domain.model.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getByUser(@PathVariable String userId) {
        return ResponseEntity.ok(notificationService.getNotificationsByUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Notification> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(notificationService.getNotificationById(id));
    }

    @GetMapping
    public ResponseEntity<List<Notification>> search(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type) {
        Notification.NotificationStatus statusEnum = parseStatus(status);
        Notification.NotificationType typeEnum = parseType(type);
        return ResponseEntity.ok(notificationService.getNotificationsByFilter(userId, statusEnum, typeEnum));
    }

    private Notification.NotificationStatus parseStatus(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }
        return Notification.NotificationStatus.valueOf(status.trim().toUpperCase());
    }

    private Notification.NotificationType parseType(String type) {
        if (type == null || type.isBlank()) {
            return null;
        }
        return Notification.NotificationType.valueOf(type.trim().toUpperCase());
    }
}
