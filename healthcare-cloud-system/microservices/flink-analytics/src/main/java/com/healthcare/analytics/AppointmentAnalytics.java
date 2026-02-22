package com.healthcare.analytics;

import org.apache.flink.api.common.eventtime.WatermarkStrategy;
import org.apache.flink.api.common.functions.AggregateFunction;
import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.connector.kafka.source.KafkaSource;
import org.apache.flink.connector.kafka.source.enumerator.initializer.OffsetsInitializer;
import org.apache.flink.connector.kafka.sink.KafkaRecordSerializationSchema;
import org.apache.flink.connector.kafka.sink.KafkaSink;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.windowing.assigners.TumblingProcessingTimeWindows;
import org.apache.flink.streaming.api.windowing.time.Time;
import com.google.gson.Gson;
import java.util.Properties;
import java.util.HashSet;
import java.util.Set;

public class AppointmentAnalytics {
    
    public static void main(String[] args) throws Exception {
        // Set up the execution environment
        final StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
        
        // Kafka configuration
        String kafkaBootstrapServers = System.getenv().getOrDefault("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092");
        String inputTopic = "appointment-events";
        String outputTopic = "analytics-results";
        
        System.out.println("Starting Flink Analytics Job");
        System.out.println("Kafka brokers: " + kafkaBootstrapServers);
        System.out.println("Input topic: " + inputTopic);
        System.out.println("Output topic: " + outputTopic);
        
        // Kafka Source
        KafkaSource<String> source = KafkaSource.<String>builder()
            .setBootstrapServers(kafkaBootstrapServers)
            .setTopics(inputTopic)
            .setGroupId("flink-analytics-group")
            .setStartingOffsets(OffsetsInitializer.latest())
            .setValueOnlyDeserializer(new SimpleStringSchema())
            .build();
        
        // Read from Kafka
        DataStream<String> kafkaStream = env.fromSource(
            source,
            WatermarkStrategy.noWatermarks(),
            "Kafka Source"
        );
        
        // Parse JSON and filter appointment_created events
        DataStream<AppointmentEvent> events = kafkaStream
            .map(AppointmentEvent::fromJson)
            .filter(event -> "appointment_created".equals(event.getEventType()));
        
        // Perform windowed aggregation (1-minute tumbling window)
        DataStream<String> aggregated = events
            .keyBy(event -> "all") // Group all events together
            .window(TumblingProcessingTimeWindows.of(Time.minutes(1)))
            .aggregate(new AppointmentAggregator())
            .map(result -> new Gson().toJson(result));
        
        // Kafka Sink
        KafkaSink<String> sink = KafkaSink.<String>builder()
            .setBootstrapServers(kafkaBootstrapServers)
            .setRecordSerializer(KafkaRecordSerializationSchema.builder()
                .setTopic(outputTopic)
                .setValueSerializationSchema(new SimpleStringSchema())
                .build()
            )
            .build();
        
        // Write results to Kafka
        aggregated.sinkTo(sink);
        
        // Print to console for debugging
        aggregated.print();
        
        // Execute
        env.execute("Healthcare Appointment Analytics");
    }
    
    // Aggregator for counting unique patients and appointments per window
    public static class AppointmentAggregator implements AggregateFunction<AppointmentEvent, AggregateAccumulator, AggregateResult> {
        
        @Override
        public AggregateAccumulator createAccumulator() {
            return new AggregateAccumulator();
        }
        
        @Override
        public AggregateAccumulator add(AppointmentEvent event, AggregateAccumulator accumulator) {
            if (event.getPatientId() != null) {
                accumulator.uniquePatients.add(event.getPatientId());
            }
            if (event.getDoctorId() != null) {
                accumulator.appointmentsByDoctor.merge(event.getDoctorId(), 1, Integer::sum);
            }
            accumulator.totalAppointments++;
            return accumulator;
        }
        
        @Override
        public AggregateResult getResult(AggregateAccumulator accumulator) {
            return new AggregateResult(
                accumulator.totalAppointments,
                accumulator.uniquePatients.size(),
                accumulator.appointmentsByDoctor.size(),
                System.currentTimeMillis()
            );
        }
        
        @Override
        public AggregateAccumulator merge(AggregateAccumulator a, AggregateAccumulator b) {
            a.totalAppointments += b.totalAppointments;
            a.uniquePatients.addAll(b.uniquePatients);
            b.appointmentsByDoctor.forEach((doctor, count) -> 
                a.appointmentsByDoctor.merge(doctor, count, Integer::sum)
            );
            return a;
        }
    }
    
    // Accumulator class
    public static class AggregateAccumulator {
        public int totalAppointments = 0;
        public Set<Long> uniquePatients = new HashSet<>();
        public java.util.Map<Long, Integer> appointmentsByDoctor = new java.util.HashMap<>();
    }
    
    // Result class
    public static class AggregateResult {
        public int totalAppointments;
        public int uniquePatients;
        public int activeDoctors;
        public long windowEndTime;
        
        public AggregateResult(int totalAppointments, int uniquePatients, int activeDoctors, long windowEndTime) {
            this.totalAppointments = totalAppointments;
            this.uniquePatients = uniquePatients;
            this.activeDoctors = activeDoctors;
            this.windowEndTime = windowEndTime;
        }
    }
}