import com.distributedtransactions.common.dto.OrderCommand;
import com.distributedtransactions.common.dto.OrderEvent;
import com.distributedtransactionsorderservice.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderCommandListener {

    private final OrderService orderService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @KafkaListener(topics = "order-commands", groupId = "order-service-group")
    public void listenOrderCommands(OrderCommand command) {
        log.info("[OrderService] Received command: {}", command);

        switch (command.getType()) {
            case "CREATE_ORDER" -> {
                try {
                    orderService.createOrder(command.getOrderId(), command.getCustomerId(), command.getAmount());
                    // Publish Order Created Event
                    OrderEvent event = new OrderEvent(command.getOrderId(), "ORDER_CREATED", null);
                    kafkaTemplate.send("order-events", event);
                    log.info("[OrderService] Published ORDER_CREATED event for Order ID: {}", command.getOrderId());
                } catch (Exception e) {
                    log.error("[OrderService] Failed to create order: {}", e.getMessage());
                    // Publish Order Failed Event
                    OrderEvent event = new OrderEvent(command.getOrderId(), "ORDER_FAILED", e.getMessage());
                    kafkaTemplate.send("order-events", event);
                }
            }
            case "CANCEL_ORDER" -> {
                orderService.cancelOrder(command.getOrderId());
                // Publish Order Canceled Event
                OrderEvent event = new OrderEvent(command.getOrderId(), "ORDER_CANCELED", null);
                kafkaTemplate.send("order-events", event);
                log.info("[OrderService] Published ORDER_CANCELED event for Order ID: {}", command.getOrderId());
            }
            default -> log.warn("[OrderService] Unknown command type: {}", command.getType());
        }
    }
}
