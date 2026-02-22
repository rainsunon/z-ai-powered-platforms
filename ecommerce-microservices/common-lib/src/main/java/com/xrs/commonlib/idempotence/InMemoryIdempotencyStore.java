package com.xrs.commonlib.idempotence;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory implementation of IdempotencyStore.
 * Suitable for development and testing. For production, consider using Redis or a database.
 */
@Component
@Slf4j
public class InMemoryIdempotencyStore implements IdempotencyStore {
    
    private final Map<String, IdempotencyRecord> store = new ConcurrentHashMap<>();
    
    @Override
    public boolean isProcessed(String key) {
        IdempotencyRecord record = store.get(key);
        if (record == null) {
            return false;
        }
        
        // Check if the record has expired
        if (record.expiryTime.isBefore(LocalDateTime.now())) {
            store.remove(key);
            return false;
        }
        
        return true;
    }
    
    @Override
    public Optional<Object> getResult(String key) {
        IdempotencyRecord record = store.get(key);
        if (record == null) {
            return Optional.empty();
        }
        
        // Check if the record has expired
        if (record.expiryTime.isBefore(LocalDateTime.now())) {
            store.remove(key);
            return Optional.empty();
        }
        
        return Optional.ofNullable(record.result);
    }
    
    @Override
    public void store(String key, Object result, long ttl) {
        LocalDateTime expiryTime = LocalDateTime.now().plusSeconds(ttl);
        IdempotencyRecord record = new IdempotencyRecord(result, expiryTime);
        store.put(key, record);
        log.debug("Stored idempotency record for key: {}", key);
    }
    
    @Override
    public void markProcessed(String key, long ttl) {
        LocalDateTime expiryTime = LocalDateTime.now().plusSeconds(ttl);
        IdempotencyRecord record = new IdempotencyRecord(null, expiryTime);
        store.put(key, record);
        log.debug("Marked key as processed: {}", key);
    }
    
    @Override
    public void remove(String key) {
        store.remove(key);
        log.debug("Removed idempotency record for key: {}", key);
    }
    
    @Override
    public void cleanup() {
        LocalDateTime now = LocalDateTime.now();
        int removed = 0;
        
        for (Map.Entry<String, IdempotencyRecord> entry : store.entrySet()) {
            if (entry.getValue().expiryTime.isBefore(now)) {
                store.remove(entry.getKey());
                removed++;
            }
        }
        
        if (removed > 0) {
            log.info("Cleaned up {} expired idempotency records", removed);
        }
    }
    
    /**
     * Scheduled cleanup of expired records.
     * Runs every hour.
     */
    @Scheduled(cron = "0 0 * * * ?")
    public void scheduledCleanup() {
        cleanup();
    }
    
    /**
     * Internal record class to store idempotency data.
     */
    private record IdempotencyRecord(Object result, LocalDateTime expiryTime) {}
}
