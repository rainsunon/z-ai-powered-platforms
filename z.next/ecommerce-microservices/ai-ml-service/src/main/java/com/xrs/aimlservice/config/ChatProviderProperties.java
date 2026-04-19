package com.xrs.aimlservice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "ai.chat")
public class ChatProviderProperties {

    private String defaultProvider = "heuristic";
    private Gemini gemini = new Gemini();
    private Mcp mcp = new Mcp();

    public String getDefaultProvider() {
        return defaultProvider;
    }

    public void setDefaultProvider(String defaultProvider) {
        this.defaultProvider = defaultProvider;
    }

    public Gemini getGemini() {
        return gemini;
    }

    public void setGemini(Gemini gemini) {
        this.gemini = gemini;
    }

    public Mcp getMcp() {
        return mcp;
    }

    public void setMcp(Mcp mcp) {
        this.mcp = mcp;
    }

    public static class Gemini {
        private boolean enabled = true;
        private String apiKey;
        private String model = "gemini-1.5-flash";
        private String endpointTemplate = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent";

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        public String getApiKey() {
            return apiKey;
        }

        public void setApiKey(String apiKey) {
            this.apiKey = apiKey;
        }

        public String getModel() {
            return model;
        }

        public void setModel(String model) {
            this.model = model;
        }

        public String getEndpointTemplate() {
            return endpointTemplate;
        }

        public void setEndpointTemplate(String endpointTemplate) {
            this.endpointTemplate = endpointTemplate;
        }
    }

    public static class Mcp {
        private boolean enabled = true;
        private String endpoint;
        private String authToken;
        private String apiKey;
        private String apiKeyHeader = "X-API-Key";

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        public String getEndpoint() {
            return endpoint;
        }

        public void setEndpoint(String endpoint) {
            this.endpoint = endpoint;
        }

        public String getAuthToken() {
            return authToken;
        }

        public void setAuthToken(String authToken) {
            this.authToken = authToken;
        }

        public String getApiKey() {
            return apiKey;
        }

        public void setApiKey(String apiKey) {
            this.apiKey = apiKey;
        }

        public String getApiKeyHeader() {
            return apiKeyHeader;
        }

        public void setApiKeyHeader(String apiKeyHeader) {
            this.apiKeyHeader = apiKeyHeader;
        }
    }
}