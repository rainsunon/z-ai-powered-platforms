package com.xrs.paymentservice.service.impl;

import com.google.gson.Gson;
import com.xrs.paymentservice.constant.KafkaConstant;
import com.xrs.paymentservice.dto.KafkaPaymentDto;
import com.xrs.paymentservice.dto.OrderDto;
import com.xrs.paymentservice.dto.PaymentDto;
import com.xrs.paymentservice.dto.UserDto;
import com.xrs.paymentservice.event.EventProducer;
import com.xrs.paymentservice.exception.wrapper.PaymentNotFoundException;
import com.xrs.paymentservice.helper.PaymentMappingHelper;
import com.xrs.paymentservice.repository.PaymentRepository;
// import com.xrs.paymentservice.security.JwtTokenFilter; // TODO: JwtTokenFilter class doesn't exist
import com.xrs.paymentservice.service.CallAPI;
import com.xrs.paymentservice.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Scheduler;
import reactor.core.scheduler.Schedulers;

import jakarta.transaction.Transactional;
import java.util.List;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private final PaymentRepository paymentRepository;

    @Autowired
    private final ModelMapper modelMapper;

    @Autowired
    private final CallAPI callAPI;

    Gson gson = new Gson(); // google.code.gson
    @Autowired
    private EventProducer eventProducer;

    @Override
    public Mono<List<PaymentDto>> findAll() {
        log.info("*** PaymentDto List, service; fetch all payments *");
        return Mono.fromSupplier(() -> paymentRepository.findAll()
                        .stream()
                        .map(PaymentMappingHelper::map)
                        .toList())
                .flatMap(listPaymentDtos -> Flux.fromIterable(listPaymentDtos)
                        .flatMap(paymentDto ->
                                // TODO: JwtTokenFilter class doesn't exist, need to implement JWT token extraction
                                // callAPI.receiverPaymentDto(paymentDto.orderId(), JwtTokenFilter.getTokenFromRequest())
                                callAPI.receiverPaymentDto(paymentDto.orderId(), null)
                                        .map(orderDto -> new PaymentDto(
                                                paymentDto.paymentId(),
                                                paymentDto.isPayed(),
                                                paymentDto.paymentStatus(),
                                                paymentDto.orderId(),
                                                paymentDto.userId(),
                                                modelMapper.map(orderDto, OrderDto.class),
                                                paymentDto.userDto()
                                        ))
                                        .onErrorResume(throwable -> {
                                            log.error("Error fetching order info: {}", throwable.getMessage());
                                            return Mono.just(paymentDto);
                                        })
                        ).collectList()
                );
    }

    @Override
    public Mono<Page<PaymentDto>> findAll(int page, int size, String sortBy, String sortOrder) {
        log.info("PaymentDto List, service; fetch all carts with paging and sorting");
        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        return Mono.fromSupplier(() -> paymentRepository.findAll(pageable)
                        .map(PaymentMappingHelper::map)
                )
                .flatMap(paymentDtos -> Flux.fromIterable(paymentDtos)
                        .flatMap(paymentDto ->
                                // TODO: JwtTokenFilter class doesn't exist, need to implement JWT token extraction
                                // callAPI.receiverPaymentDto(paymentDto.orderId(), JwtTokenFilter.getTokenFromRequest())
                                callAPI.receiverPaymentDto(paymentDto.orderId(), null)
                                        .map(orderDto -> new PaymentDto(
                                                paymentDto.paymentId(),
                                                paymentDto.isPayed(),
                                                paymentDto.paymentStatus(),
                                                paymentDto.orderId(),
                                                paymentDto.userId(),
                                                modelMapper.map(orderDto, OrderDto.class),
                                                paymentDto.userDto()
                                        ))
                                        .onErrorResume(throwable -> {
                                            log.error("Error fetching order info: {}", throwable.getMessage());
                                            return Mono.just(paymentDto);
                                        })
                        )
                        .collectList()
                        .map(resultList -> new PageImpl<>(resultList, pageable, resultList.size()))
                );
    }

    @Override
    public Mono<PaymentDto> findById(Integer paymentId) {
        log.info("*** PaymentDto, service; fetch payment by id *");
        return Mono.fromSupplier(() -> paymentRepository.findById(paymentId)
                        .map(PaymentMappingHelper::map)
                        .orElseThrow(() -> new PaymentNotFoundException(String.format("Order with id: %d not found", paymentId)))
                )
                .flatMap(paymentDto ->
                        // TODO: JwtTokenFilter class doesn't exist, need to implement JWT token extraction
                        // callAPI.receiverPaymentDto(paymentDto.orderDto().orderId(), JwtTokenFilter.getTokenFromRequest())
                        callAPI.receiverPaymentDto(paymentDto.orderDto().orderId(), null)
                        .flatMap(orderDto -> {
                                    OrderDto mappedOrderDto = modelMapper.map(orderDto, OrderDto.class);

                                    // TODO: JwtTokenFilter class doesn't exist, need to implement JWT token extraction
                                    // return callAPI.receiverUserDto(paymentDto.userId(), JwtTokenFilter.getTokenFromRequest())
                                    return callAPI.receiverUserDto(paymentDto.userId(), null)
                                            .map(userDto -> new PaymentDto(
                                                    paymentDto.paymentId(),
                                                    paymentDto.isPayed(),
                                                    paymentDto.paymentStatus(),
                                                    paymentDto.orderId(),
                                                    paymentDto.userId(),
                                                    mappedOrderDto,
                                                    modelMapper.map(userDto, UserDto.class)
                                            )).publishOn(Schedulers.boundedElastic())
                                            .switchIfEmpty(Mono.just(new PaymentDto(
                                                    paymentDto.paymentId(),
                                                    paymentDto.isPayed(),
                                                    paymentDto.paymentStatus(),
                                                    paymentDto.orderId(),
                                                    paymentDto.userId(),
                                                    mappedOrderDto,
                                                    paymentDto.userDto()
                                            )));

                                })
                                .onErrorResume(throwable -> {
                                    log.error("Error fetching order or user info: {}", throwable.getMessage());
                                    return Mono.just(paymentDto);
                                })
                );
    }

    public Mono<OrderDto> getOrderDto(Integer orderId) {
        // TODO: JwtTokenFilter class doesn't exist, need to implement JWT token extraction
        // return callAPI.receiverPaymentDto(orderId, JwtTokenFilter.getTokenFromRequest())
        return callAPI.receiverPaymentDto(orderId, null)
                .map(orderDto -> modelMapper.map(orderDto, OrderDto.class));
    }

    @Override
    public Mono<PaymentDto> save(PaymentDto paymentDto) {
        log.info("PaymentDto, service; save order");

        return Mono.just(paymentDto)
                .filter(dto -> !paymentRepository.existsByOrderIdAndIsPayed(dto.orderId()))
                .switchIfEmpty(Mono.error(new PaymentNotFoundException("Order has already been paid.")))
                .flatMap(dto -> Mono.fromCallable(() -> PaymentMappingHelper.map(paymentRepository.save(PaymentMappingHelper.map(dto)))))
                .flatMap(savedPaymentDto -> {
                    KafkaPaymentDto newPaymentDto = KafkaPaymentDto.builder()
                            .paymentId(savedPaymentDto.paymentId())
                            .isPayed(savedPaymentDto.isPayed())
                            .paymentStatus(savedPaymentDto.paymentStatus())
                            .orderId(savedPaymentDto.orderId())
                            .userId(savedPaymentDto.userId())
                            .build();

                    // Send Kafka notifications without waiting
                    return eventProducer.send(KafkaConstant.STATUS_PAYMENT_SUCCESSFUL, gson.toJson(newPaymentDto))
                            .thenReturn(savedPaymentDto);
                })
                .onErrorResume(throwable -> {
                    log.error("Error saving payment or sending Kafka message: {}", throwable.getMessage());
                    return Mono.error(throwable);
                })
                .subscribeOn(Schedulers.boundedElastic()); // run on another thread
    }


    @Override
    public Mono<PaymentDto> update(PaymentDto paymentDto) {
        log.info("PaymentDto, service; update order");
        return Mono.fromSupplier(() -> paymentRepository.save(PaymentMappingHelper.map(paymentDto)))
                .map(PaymentMappingHelper::map);
    }

    @Override
    public Mono<PaymentDto> update(Integer paymentId, PaymentDto paymentDto) {
        log.info("OrderDto, service; update order with orderId");
        return findById(paymentId).flatMap(existingPaymentDto -> {
                    modelMapper.map(paymentDto, existingPaymentDto);
                    return Mono.fromSupplier(() -> paymentRepository.save(PaymentMappingHelper.map(existingPaymentDto)))
                            .map(PaymentMappingHelper::map);
                })
                .switchIfEmpty(Mono.error(new PaymentNotFoundException("Payment with id " + paymentId + " not found")));
    }

    @Override
    public Mono<Void> deleteById(Integer paymentId) {
        log.info("Void, service; delete payment by id");
        return Mono.fromRunnable(() -> paymentRepository.deleteById(paymentId));
    }

}