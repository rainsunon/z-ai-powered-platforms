package  com.distributedtransactions.paymentservice.listener;
import com.distributedtransactions.common.dto.OrderCommand;
import com.distributedtransactions.common.dto.OrderEvent;
import com.distributedtransactions.paymentservice.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentCommandListener {

    private final PaymentService paymentService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @KafkaListener(topics = "payment-commands", groupId = "payment-service-group")
    public void listenPaymentCommands(OrderCommand command) {
        log.info("[PaymentService] Received command: {}", command);

        switch (command.getType()) {
            case "PROCESS_PAYMENT" -> {
                boolean success = paymentService.processPayment(command.getOrderId(), command.getAmount());
                if (success) {
                    // Publish Payment Success Event
                    OrderEvent event = new OrderEvent(command.getOrderId(), "PAYMENT_SUCCESS", null);
                    kafkaTemplate.send("payment-events", event);
                    log.info("[PaymentService] Published PAYMENT_SUCCESS event for Order ID: {}", command.getOrderId());
                } else {
                    // Publish Payment Failed Event
                    OrderEvent event = new OrderEvent(command.getOrderId(), "PAYMENT_FAILED", "Insufficient funds");
                    kafkaTemplate.send("payment-events", event);
                    log.info("[PaymentService] Published PAYMENT_FAILED event for Order ID: {}", command.getOrderId());
                }
            }
            case "ROLLBACK_PAYMENT" -> {
                paymentService.rollbackPayment(command.getOrderId());
                // Optionally, publish Payment Rolled Back Event
                OrderEvent event = new OrderEvent(command.getOrderId(), "PAYMENT_ROLLED_BACK", null);
                kafkaTemplate.send("payment-events", event);
                log.info("[PaymentService] Published PAYMENT_ROLLED_BACK event for Order ID: {}", command.getOrderId());
            }
            default -> log.warn("[PaymentService] Unknown command type: {}", command.getType());
        }
    }
}
