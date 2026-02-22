package com.xrs.orderservice.service.impl;

import com.xrs.commonlib.cqrs.CommandBus;
import com.xrs.commonlib.cqrs.QueryBus;
import com.xrs.commonlib.idempotence.Idempotent;
import com.xrs.orderservice.command.CreateOrderCommand;
import com.xrs.orderservice.command.UpdateOrderCommand;
import com.xrs.orderservice.command.DeleteOrderCommand;
import com.xrs.orderservice.dto.order.OrderDto;
import com.xrs.orderservice.exception.wrapper.CartNotFoundException;
import com.xrs.orderservice.exception.wrapper.OrderNotFoundException;
import com.xrs.orderservice.helper.OrderMappingHelper;
import com.xrs.orderservice.query.GetOrderQuery;
import com.xrs.orderservice.query.ListOrdersQuery;
import com.xrs.orderservice.repository.OrderRepository;
import com.xrs.orderservice.service.CallAPI;
import com.xrs.orderservice.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private final OrderRepository orderRepository;

    @Autowired
    private final ModelMapper modelMapper;

    @Autowired
    private final CallAPI callAPI;
    
    @Autowired
    private final CommandBus commandBus;
    
    @Autowired
    private final QueryBus queryBus;

    @Override
    public Mono<List<OrderDto>> findAll() {
        log.info("OrderDto List, service; fetch all orders");
        
        ListOrdersQuery query = new ListOrdersQuery(
            java.util.UUID.randomUUID().toString(),
            0,
            10,
            null,
            null,
            "orderDate",
            "desc"
        );
        
        return queryBus.dispatch(query);
    }

    @Override
    public Mono<Page<OrderDto>> findAll(int page, int size, String sortBy, String sortOrder) {
        log.info("OrderDto List, service; fetch all carts with paging and sorting");
        
        ListOrdersQuery query = new ListOrdersQuery(
            java.util.UUID.randomUUID().toString(),
            page,
            size,
            null,
            null,
            sortBy,
            sortOrder
        );
        
        return queryBus.dispatch(query)
                .map(orderDtos -> new PageImpl<>(orderDtos, PageRequest.of(page, size), orderDtos.size()));
    }

    @Override
    public Mono<OrderDto> findById(Integer orderId) {
        log.info("OrderDto, service; fetch order by id");
        
        GetOrderQuery query = new GetOrderQuery(
            java.util.UUID.randomUUID().toString(),
            orderId
        );
        
        return queryBus.dispatch(query);
    }

    // check orderId in exist in database.
    @Override
    public Boolean existsByOrderId(Integer orderId) {
         return orderRepository.findById(orderId).isPresent();
    }

    /**
     * Create a new order using CQRS pattern.
     * Starts the saga orchestration for order fulfillment.
     */
    @Override
    @Idempotent(ttl = 3600)  // 1 hour TTL
    @Transactional
    public Mono<OrderDto> save(final OrderDto orderDto) {
        log.info("OrderDto, service; save order");
        
        // Create command from DTO
        CreateOrderCommand command = new CreateOrderCommand(
            java.util.UUID.randomUUID().toString(),
            orderDto.userId(),
            orderDto.cartDto() != null ? orderDto.cartDto().items().stream()
                    .map(item -> new CreateOrderCommand.OrderItemData(
                            item.productId(),
                            item.productName(),
                            item.quantity(),
                            item.unitPrice(),
                            item.lineTotal()
                    ))
                    .toList() : List.of(),
            orderDto.shippingAddress() != null ? orderDto.shippingAddress() : "",
            orderDto.orderDesc(),
            orderDto.orderFee()
        );
        
        return commandBus.dispatch(command);
    }

    /**
     * Update an existing order using CQRS pattern.
     */
    @Override
    @Idempotent(ttl = 3600)  // 1 hour TTL
    @Transactional
    public Mono<OrderDto> update(final OrderDto orderDto) {
        log.info("OrderDto, service; update order");
        
        UpdateOrderCommand command = new UpdateOrderCommand(
            java.util.UUID.randomUUID().toString(),
            orderDto.orderId(),
            orderDto.orderDesc(),
            orderDto.shippingAddress()
        );
        
        return commandBus.dispatch(command);
    }

    /**
     * Update an existing order using CQRS pattern (by orderId).
     */
    @Override
    @Idempotent(ttl = 3600)  // 1 hour TTL
    @Transactional
    public Mono<OrderDto> update(final Integer orderId, final OrderDto orderDto) {
        log.info("OrderDto, service; update order with orderId");
        
        UpdateOrderCommand command = new UpdateOrderCommand(
            java.util.UUID.randomUUID().toString(),
            orderId,
            orderDto.orderDesc(),
            orderDto.shippingAddress()
        );
        
        return commandBus.dispatch(command);
    }

    /**
     * Delete an order using CQRS pattern.
     */
    @Override
    @Idempotent(ttl = 3600)  // 1 hour TTL
    @Transactional
    public Mono<Void> deleteById(final Integer orderId) {
        log.info("Void, service; delete order by id");
        
        DeleteOrderCommand command = new DeleteOrderCommand(
            java.util.UUID.randomUUID().toString(),
            orderId
        );
        
        return commandBus.dispatch(command);
    }
    
    /**
     * Inner class for OrderMappingHelper to maintain backward compatibility.
     */
    public static class OrderMappingHelper {
        public static OrderDto map(Order order) {
            return com.xrs.orderservice.helper.OrderMappingHelper.map(order);
        }
    }
}
