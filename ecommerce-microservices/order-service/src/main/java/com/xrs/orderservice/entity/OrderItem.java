package com.xrs.orderservice.entity;

import com.xrs.orderservice.domain.valueobject.Money;
import com.xrs.orderservice.domain.valueobject.ProductReference;
import com.xrs.orderservice.domain.valueobject.Quantity;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;

/**
 * OrderItem entity representing individual line items in an order
 * Part of Order aggregate, encapsulates business logic for line total calculation
 */
@Entity
@Table(name = "order_items")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class OrderItem implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_id", unique = true, nullable = false, updatable = false)
    private Long orderItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Order order;

    @Column(name = "product_id", nullable = false)
    private Integer productId;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "line_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal lineTotal;

    /**
     * Factory method to create OrderItem from domain value objects
     */
    public static OrderItem create(ProductReference product, Quantity quantity, Money unitPrice) {
        Money calculatedLineTotal = unitPrice.multiply(quantity.value());
        
        return OrderItem.builder()
                .productId(product.productId())
                .productName(product.productName())
                .quantity(quantity.value())
                .unitPrice(unitPrice.amount())
                .lineTotal(calculatedLineTotal.amount())
                .build();
    }

    /**
     * Business logic: Calculate line total
     */
    public Money calculateLineTotal() {
        Money price = new Money(unitPrice);
        return price.multiply(quantity);
    }

    /**
     * Recalculate line total when quantity or price changes
     */
    public void recalculateLineTotal() {
        this.lineTotal = calculateLineTotal().amount();
    }

    /**
     * Set the order (bidirectional relationship management)
     */
    public void setOrder(Order order) {
        this.order = order;
    }

    /**
     * Update quantity and recalculate line total
     */
    public void updateQuantity(int newQuantity) {
        if (newQuantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }
        this.quantity = newQuantity;
        recalculateLineTotal();
    }

    /**
     * Get product reference as value object
     */
    public ProductReference getProductReference() {
        return ProductReference.of(productId, productName);
    }

    /**
     * Get quantity as value object
     */
    public Quantity getQuantityVO() {
        return Quantity.of(quantity);
    }

    /**
     * Get unit price as value object
     */
    public Money getUnitPriceMoney() {
        return new Money(unitPrice);
    }

    /**
     * Get line total as value object
     */
    public Money getLineTotalMoney() {
        return new Money(lineTotal);
    }
}
