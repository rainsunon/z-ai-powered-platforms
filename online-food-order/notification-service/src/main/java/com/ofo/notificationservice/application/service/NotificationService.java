package com.ofo.notificationservice.application.service;

import com.ofo.notificationservice.domain.event.InvoiceGeneratedEvent;
import com.ofo.notificationservice.domain.event.OrderCreatedEvent;
import com.ofo.notificationservice.domain.event.OrderPaidEvent;
import com.ofo.notificationservice.domain.model.IdempotencyKey;
import com.ofo.notificationservice.domain.model.Notification;
import com.ofo.notificationservice.domain.model.NotificationTemplate;
import com.ofo.notificationservice.domain.repository.IdempotencyKeyRepository;
import com.ofo.notificationservice.domain.repository.NotificationRepository;
import com.ofo.notificationservice.domain.repository.NotificationTemplateRepository;
import com.ofo.notificationservice.infrastructure.sender.NotificationSender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationTemplateRepository templateRepository;
    private final IdempotencyKeyRepository idempotencyKeyRepository;
    private final NotificationSender notificationSender;
    private final NotificationContentBuilder contentBuilder = new NotificationContentBuilder();

    @Value("${notification.default.recipient:}")
    private String defaultRecipientEmail;

    @Transactional
    public void handleOrderCreated(OrderCreatedEvent event) {
        processEvent(event.getRequestId(), event.getUserId(),
                Notification.NotificationType.ORDER_CONFIRMATION,
                "order-created",
                Map.of("orderId", event.getOrderId()));
    }

    @Transactional
    public void handleOrderPaid(OrderPaidEvent event) {
        Map<String, Object> vars = new HashMap<>();
        vars.put("orderId", event.getOrderId());
        vars.put("amount", event.getAmount());
        vars.put("currency", event.getCurrency());
        processEvent(event.getRequestId(), event.getUserId(),
                Notification.NotificationType.PAYMENT_RECEIVED,
                "order-paid",
                vars);
    }

    @Transactional
    public void handleInvoiceGenerated(InvoiceGeneratedEvent event) {
        processEvent(event.getRequestId(), event.getUserId(),
                Notification.NotificationType.INVOICE_GENERATED,
                "invoice-generated",
                Map.of("invoiceId", event.getInvoiceId(), "orderId", event.getOrderId()));
    }

    public java.util.List<Notification> getNotificationsByUser(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Notification getNotificationById(java.util.UUID id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
    }

    public java.util.List<Notification> getNotificationsByFilter(
            String userId,
            Notification.NotificationStatus status,
            Notification.NotificationType type) {
        if (userId != null && status != null && type != null) {
            return notificationRepository.findByUserIdAndStatusAndTypeOrderByCreatedAtDesc(userId, status, type);
        }
        if (userId != null && status != null) {
            return notificationRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, status);
        }
        if (userId != null && type != null) {
            return notificationRepository.findByUserIdAndTypeOrderByCreatedAtDesc(userId, type);
        }
        if (userId != null) {
            return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        }
        if (status != null) {
            return notificationRepository.findByStatusOrderByCreatedAtDesc(status);
        }
        if (type != null) {
            return notificationRepository.findByTypeOrderByCreatedAtDesc(type);
        }
        return java.util.List.of();
    }

    private void processEvent(String requestId,
                              String userId,
                              Notification.NotificationType type,
                              String templateName,
                              Map<String, Object> variables) {

        Optional<IdempotencyKey> existing = idempotencyKeyRepository.findByRequestId(requestId);
        if (existing.isPresent() && "COMPLETED".equals(existing.get().getStatus())) {
            log.info("Duplicate event ignored: requestId={}", requestId);
            return;
        }

        IdempotencyKey idempotencyKey = existing.orElseGet(() -> idempotencyKeyRepository.save(
                IdempotencyKey.builder()
                        .requestId(requestId)
                        .status("PROCESSING")
                        .build()
        ));

        NotificationTemplate template = templateRepository.findByTemplateName(templateName)
                .orElseThrow(() -> new IllegalStateException("Template not found: " + templateName));

        String subject = contentBuilder.buildSubject(template, variables);
        String body = contentBuilder.buildBody(template, variables);
        String recipientEmail = resolveRecipientEmail(variables);

        Notification notification = Notification.builder()
                .userId(userId)
                .recipientEmail(recipientEmail)
                .type(type)
                .channel(Notification.NotificationChannel.EMAIL)
                .templateName(templateName)
                .templateData(variables)
                .subject(subject)
                .status(Notification.NotificationStatus.PENDING)
                .build();

        notification = notificationRepository.save(notification);

        try {
            notificationSender.send(notification, body);
            notification.setStatus(Notification.NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
            notificationRepository.save(notification);
            idempotencyKey.setStatus("COMPLETED");
            idempotencyKeyRepository.save(idempotencyKey);
        } catch (Exception ex) {
            log.error("Failed to send notification: requestId={}, error={}", requestId, ex.getMessage(), ex);
            notification.setStatus(Notification.NotificationStatus.FAILED);
            notification.setFailedReason(ex.getMessage());
            notificationRepository.save(notification);
            idempotencyKey.setStatus("FAILED");
            idempotencyKeyRepository.save(idempotencyKey);
            throw ex;
        }
    }

    private String resolveRecipientEmail(Map<String, Object> variables) {
        Object email = variables.get("email");
        if (email instanceof String && !((String) email).isBlank()) {
            return (String) email;
        }
        if (defaultRecipientEmail != null && !defaultRecipientEmail.isBlank()) {
            return defaultRecipientEmail;
        }
        throw new IllegalStateException("Recipient email is required to send notifications");
    }
}
