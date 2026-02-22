package com.xrs.gateway.botdefense.consumer;

import com.xrs.gateway.botdefense.kafka.BotDefenseEvent;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.listener.ContainerProperties;
import org.springframework.kafka.support.serializer.ErrorHandlingDeserializer;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;

/**
 * Kafka listener configuration.
 */
@Configuration
public class KafkaConsumerConfig {

    /**
     * Expose properties bean for SpEL in {@link org.springframework.kafka.annotation.KafkaListener}.
     */
    @Bean
    public ConsumerProperties consumerProperties(ConsumerProperties props) {
        return props;
    }

    /**
     * Container factory with manual ack and JSON deserialization.
     */
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, BotDefenseEvent> botDefenseKafkaListenerContainerFactory(
            org.springframework.boot.autoconfigure.kafka.KafkaProperties kafkaProperties) {

        Map<String, Object> props = new HashMap<>(kafkaProperties.buildConsumerProperties(null));
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, ErrorHandlingDeserializer.class);
        props.put(ErrorHandlingDeserializer.VALUE_DESERIALIZER_CLASS, JsonDeserializer.class);
        props.put(JsonDeserializer.TRUSTED_PACKAGES, "com.xrs.gateway.botdefense");
        props.put(JsonDeserializer.VALUE_DEFAULT_TYPE, BotDefenseEvent.class.getName());
        props.put(JsonDeserializer.USE_TYPE_INFO_HEADERS, false);

        ConsumerFactory<String, BotDefenseEvent> cf = new DefaultKafkaConsumerFactory<>(props);
        ConcurrentKafkaListenerContainerFactory<String, BotDefenseEvent> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(cf);
        factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.MANUAL);
        return factory;
    }
}
