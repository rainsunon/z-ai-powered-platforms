package com.ofo.notificationservice.domain.repository;

import com.ofo.notificationservice.domain.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);

    List<Notification> findByStatusOrderByCreatedAtDesc(Notification.NotificationStatus status);

    List<Notification> findByTypeOrderByCreatedAtDesc(Notification.NotificationType type);

    List<Notification> findByUserIdAndStatusOrderByCreatedAtDesc(String userId, Notification.NotificationStatus status);

    List<Notification> findByUserIdAndTypeOrderByCreatedAtDesc(String userId, Notification.NotificationType type);

    List<Notification> findByUserIdAndStatusAndTypeOrderByCreatedAtDesc(
            String userId,
            Notification.NotificationStatus status,
            Notification.NotificationType type);
}
