package com.ofo.notificationservice.application.service;

import com.ofo.notificationservice.domain.model.NotificationTemplate;

import java.util.Map;

/**
 * Builds notification content from templates and variables.
 */
public class NotificationContentBuilder {

    public String buildSubject(NotificationTemplate template, Map<String, Object> variables) {
        return interpolate(template.getSubject(), variables);
    }

    public String buildBody(NotificationTemplate template, Map<String, Object> variables) {
        return interpolate(template.getBody(), variables);
    }

    private String interpolate(String template, Map<String, Object> variables) {
        String result = template;
        for (Map.Entry<String, Object> entry : variables.entrySet()) {
            result = result.replace("{{" + entry.getKey() + "}}", String.valueOf(entry.getValue()));
        }
        return result;
    }
}

