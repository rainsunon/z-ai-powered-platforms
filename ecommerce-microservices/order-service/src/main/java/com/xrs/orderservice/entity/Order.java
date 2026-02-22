package com.xrs.orderservice.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonFormat.Shape;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.xrs.orderservice.constrant.AppConstant;
import com.xrs.orderservice.domain.OrderStatus;
import com.xrs.orderservice.domain.valueobject.Address;
import com.xrs.orderservice.domain.valueobject.Money;
import com.xrs.orderservice.domain.valueobject.ProductReference;
import com.xrs.orderservice.domain.valueobject.Quantity;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.*;
import java.io.Serial;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Order aggregate root in DDD
 * Manages order lifecycle, state transitions, and business rules
 * Publishes domain events through outbox pattern
 */
@Entity
@Table(name = "orders")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true, exclude = {"items", "cart"})
@Data
@Builder
public class Order extends AbstractMappedEntity {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id", unique = true, nullable = false, updatable = false)
    private Integer orderId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private OrderStatus status;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "shipping_address", nullable = false, length = 500)
    private String shippingAddress;

    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonFormat(pattern = AppConstant.LOCAL_DATE_TIME_FORMAT, shape = Shape.STRING)
    @DateTimeFormat(pattern = AppConstant.LOCAL_DATE_TIME_FORMAT)
    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Column(name = "order_desc")
    private String orderDesc;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    // Keeping backward compatibility with cart reference (optional)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    @ToString.Exclude
    private Cart cart;

    // Domain events to be published (transient, not persisted)
    @Transient
    @Builder.Default
    private final List<Object> domainEvents = new ArrayList<>();

    /**
     * Factory method to create a new order (aggregate root)
     */
    public static Order createOrder(Long userId, List<OrderItem> items, Address address) {
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("Order must have at least one item");
        }

        Order order = Order.builder()
                .userId(userId)
                .status(OrderStatus.PENDING)
                .shippingAddress(address.toFullAddressString())
                .orderDate(LocalDateTime.now())
                .items(new ArrayList<>())
                .totalAmount(BigDecimal.ZERO)
                .build();

        // Add items and set bidirectional relationship
        items.forEach(order::addItem);

        return order;
    }

    /**
     * Add item to order and maintain bidirectional relationship
     */
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
        recalculateTotalAmount();
    }

    /**
     * Remove item from order
     */
    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
        recalculateTotalAmount();
    }

    /**
     * Business logic: Recalculate total amount from all items
     */
    public void recalculateTotalAmount() {
        Money total = items.stream()
                .map(OrderItem::getLineTotalMoney)
                .reduce(Money.zero(), Money::add);
        this.totalAmount = total.amount();
    }

    /**
     * Confirm order (after inventory reservation)
     */
    public void confirm() {
        validateStatusTransition(OrderStatus.CONFIRMED);
        this.status = OrderStatus.CONFIRMED;
    }

    /**
     * Mark order as paid (after payment completion)
     */
    public void markAsPaid() {
        validateStatusTransition(OrderStatus.PAID);
        this.status = OrderStatus.PAID;
    }

    /**
     * Mark order as shipped
     */
    public void markAsShipped() {
        validateStatusTransition(OrderStatus.SHIPPED);
        this.status = OrderStatus.SHIPPED;
    }

    /**
     * Mark order as delivered (terminal state)
     */
    public void markAsDelivered() {
        validateStatusTransition(OrderStatus.DELIVERED);
        this.status = OrderStatus.DELIVERED;
    }

    /**
     * Cancel order (compensation in saga)
     */
    public void cancel(String reason) {
        if (!status.isCancellable()) {
            throw new IllegalStateException("Cannot cancel order in status: " + status);
        }
        this.status = OrderStatus.CANCELLED;
        this.orderDesc = "Cancelled: " + reason;
    }

    /**
     * Mark order as failed
     */
    public void markAsFailed(String reason) {
        validateStatusTransition(OrderStatus.FAILED);
        this.status = OrderStatus.FAILED;
        this.orderDesc = "Failed: " + reason;
    }

    /**
     * Validate state transition
     */
    private void validateStatusTransition(OrderStatus targetStatus) {
        if (!status.canTransitionTo(targetStatus)) {
            throw new IllegalStateException(
                    String.format("Cannot transition from %s to %s", status, targetStatus)
            );
        }
    }

    /**
     * Add domain event to be published via outbox
     */
    public void addDomainEvent(Object event) {
        domainEvents.add(event);
    }

    /**
     * Clear domain events after publishing
     */
    public void clearDomainEvents() {
        domainEvents.clear();
    }

    /**
     * Get domain events for outbox publishing
     */
    public List<Object> getDomainEvents() {
        return new ArrayList<>(domainEvents);
    }

    /**
     * Get total amount as Money value object
     */
    public Money getTotalAmountMoney() {
        return new Money(totalAmount);
    }

    /**
     * Get shipping address as Address value object
     */
    public Address getShippingAddressVO() {
        return Address.fromString(shippingAddress);
    }

    /**
     * Get all product references from items
     */
    public List<ProductReference> getProductReferences() {
        return items.stream()
                .map(OrderItem::getProductReference)
                .toList();
    }

    /**
     * Check if order is in terminal state
     */
    public boolean isTerminal() {
        return status.isTerminal();
    }

    /**
     * Check if order can be cancelled
     */
    public boolean isCancellable() {
        return status.isCancellable();
    }
}

