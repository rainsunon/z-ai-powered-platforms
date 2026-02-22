package com.xrs.aimlservice.model;

import java.util.Map;

public class AsyncTask {

    private final String taskId;
    private final String userId;
    private final String taskType;
    private final Map<String, Object> payload;
    private volatile String status;
    private volatile Map<String, Object> output;

    public AsyncTask(String taskId, String userId, String taskType, Map<String, Object> payload) {
        this.taskId = taskId;
        this.userId = userId;
        this.taskType = taskType;
        this.payload = payload;
        this.status = "QUEUED";
        this.output = Map.of();
    }

    public String getTaskId() {
        return taskId;
    }

    public String getUserId() {
        return userId;
    }

    public String getTaskType() {
        return taskType;
    }

    public Map<String, Object> getPayload() {
        return payload;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Map<String, Object> getOutput() {
        return output;
    }

    public void setOutput(Map<String, Object> output) {
        this.output = output;
    }
}