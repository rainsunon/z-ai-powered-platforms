package com.xrs.fooddelivery.payment.sharding;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.concurrent.ConcurrentSkipListMap;

@Service
public class ShardingService {
    private final SortedMap<Integer, String> ring = new ConcurrentSkipListMap<>();
    private final int virtualNodes = 150;

    public ShardingService() {
        // Initialize with default shards
        addShard("shard-0");
        addShard("shard-1");
        addShard("shard-2");
    }

    public void addShard(String shardName) {
        for (int i = 0; i < virtualNodes; i++) {
            int hash = hash(shardName + ":" + i);
            ring.put(hash, shardName);
        }
    }

    public void removeShard(String shardName) {
        for (int i = 0; i < virtualNodes; i++) {
            int hash = hash(shardName + ":" + i);
            ring.remove(hash);
        }
    }

    public String getShard(String key) {
        if (ring.isEmpty()) {
            throw new IllegalStateException("No shards available");
        }

        int hash = hash(key);
        SortedMap<Integer, String> tailMap = ring.tailMap(hash);

        if (tailMap.isEmpty()) {
            return ring.get(ring.firstKey());
        }

        return tailMap.get(tailMap.firstKey());
    }

    private int hash(String key) {
        // Simple hash function - in production, use a better one like MurmurHash
        int hash = 0;
        for (char c : key.toCharArray()) {
            hash = 31 * hash + c;
        }
        return Math.abs(hash);
    }

    public List<String> getAllShards() {
        return List.copyOf(ring.values().stream().distinct().toList());
    }
}
