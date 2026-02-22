package com.xrs.aimlservice.service;

import com.xrs.aimlservice.dto.AiMlDto;
import com.xrs.aimlservice.model.AsyncTask;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.LinkedBlockingQueue;

@Service
public class AsyncProcessingService {

    private final Map<String, AsyncTask> tasks = new ConcurrentHashMap<>();
    private final BlockingQueue<String> queue = new LinkedBlockingQueue<>();
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final long processingDelayMs;

    public AsyncProcessingService(ObjectProvider<KafkaTemplate<String, String>> kafkaTemplateProvider,
                                  @Value("${ai.async.processing-delay-ms:800}") long processingDelayMs) {
        this.kafkaTemplate = kafkaTemplateProvider.getIfAvailable();
        this.processingDelayMs = processingDelayMs;
    }

    public AiMlDto.AsyncTaskResponse submit(AiMlDto.AsyncTaskRequest request) {
        String taskId = "task-" + UUID.randomUUID();
        Map<String, Object> payload = request.payload() == null ? Map.of() : request.payload();

        AsyncTask task = new AsyncTask(taskId, request.userId(), request.taskType(), payload);
        tasks.put(taskId, task);
        queue.offer(taskId);

        if (kafkaTemplate != null) {
            kafkaTemplate.send("ai-async-tasks", taskId, request.taskType());
        }

        return new AiMlDto.AsyncTaskResponse(taskId, task.getStatus());
    }

    public AiMlDto.AsyncTaskStatusResponse status(String taskId) {
        AsyncTask task = tasks.get(taskId);
        if (task == null) {
            throw new IllegalArgumentException("Task not found: " + taskId);
        }
        return new AiMlDto.AsyncTaskStatusResponse(task.getTaskId(), task.getStatus(), task.getOutput());
    }

    @Scheduled(fixedDelay = 250)
    void processQueue() {
        String taskId = queue.poll();
        if (taskId == null) {
            return;
        }

        AsyncTask task = tasks.get(taskId);
        if (task == null) {
            return;
        }

        task.setStatus("PROCESSING");

        try {
            Thread.sleep(processingDelayMs);
            Map<String, Object> output = new HashMap<>();
            output.put("message", "Task completed successfully");
            output.put("taskType", task.getTaskType());
            output.put("payloadSize", task.getPayload().size());
            task.setOutput(output);
            task.setStatus("COMPLETED");
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            task.setStatus("FAILED");
            task.setOutput(Map.of("error", "Task interrupted"));
        }
    }
}