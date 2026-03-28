package com.ofo.notificationservice.infrastructure.sender;

import com.ofo.notificationservice.domain.model.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Component;

@Component
@Profile("!dev")
@RequiredArgsConstructor
public class EmailNotificationSender implements NotificationSender {

    private final JavaMailSender mailSender;

    @Override
    @Retryable(
            retryFor = Exception.class,
            maxAttemptsExpression = "${notification.retry.max-attempts:3}",
            backoff = @Backoff(
                    delayExpression = "${notification.retry.backoff-ms:500}",
                    multiplierExpression = "${notification.retry.multiplier:2.0}",
                    maxDelayExpression = "${notification.retry.max-delay-ms:5000}"
            )
    )
    public void send(Notification notification, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(notification.getRecipientEmail());
        message.setSubject(notification.getSubject());
        message.setText(body);
        mailSender.send(message);
    }
}
