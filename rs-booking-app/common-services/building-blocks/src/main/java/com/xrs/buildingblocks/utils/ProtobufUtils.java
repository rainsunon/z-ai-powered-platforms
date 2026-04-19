package com.xrs.buildingblocks.utils;


import com.google.protobuf.util.Timestamps;
import com.google.protobuf.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

/**
 * @author Rui S.
 * @date 2026-01-30
 * @apiNote
 */
public class ProtobufUtils {
    public static Timestamp toProtobufTimestamp(LocalDateTime localDateTime) {
        return Timestamps.fromMillis(localDateTime.toInstant(ZoneOffset.UTC).toEpochMilli());
    }

    public static LocalDateTime toLocalDateTime(Timestamp timestamp) {
        Instant instant = Instant.ofEpochSecond(timestamp.getSeconds(), timestamp.getNanos());
        return LocalDateTime.ofInstant(instant, ZoneOffset.UTC);
    }
}
