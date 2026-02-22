package com.xrs.commonlib.saga;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory implementation of SagaStateRepository.
 * Suitable for development and testing. For production, consider using a database.
 * 
 * @param <C> the context type
 */
@Component
@Slf4j
public class InMemorySagaStateRepository<C> implements SagaStateRepository<C> {
    
    private final Map<String, SagaState<C>> store = new ConcurrentHashMap<>();
    
    @Override
    public Mono<Void> saveState(SagaState<C> state) {
        return Mono.fromRunnable(() -> {
            store.put(state.getSagaId(), state);
            log.debug("Saved saga state for saga: {}", state.getSagaId());
        });
    }
    
    @Override
    public Mono<SagaState<C>> getState(String sagaId) {
        return Mono.justOrEmpty(store.get(sagaId));
    }
    
    @Override
    public Mono<Void> updateState(SagaState<C> state) {
        return Mono.fromRunnable(() -> {
            store.put(state.getSagaId(), state);
            log.debug("Updated saga state for saga: {}", state.getSagaId());
        });
    }
    
    @Override
    public Mono<Void> deleteState(String sagaId) {
        return Mono.fromRunnable(() -> {
            store.remove(sagaId);
            log.debug("Deleted saga state for saga: {}", sagaId);
        });
    }
}
