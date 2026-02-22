package com.xrs.gateway.botdefense.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

/**
 * Persisted decision for forensic analysis.
 *
 * <p>Write volume is intentionally small (denials only) to avoid impacting normal traffic.
 */
@Entity
@Table(name = "rate_limit_decisions")
public class RateLimitDecisionEntity {

    @Id
    private UUID id;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "tenant_id")
    private String tenantId;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "ip", nullable = false)
    private String ip;

    @Column(name = "route_group", nullable = false)
    private String routeGroup;

    @Column(name = "method", nullable = false)
    private String method;

    @Column(name = "path", nullable = false)
    private String path;

    @Column(name = "risk_score", nullable = false)
    private int riskScore;

    @Column(name = "risk_tier", nullable = false)
    private String riskTier;

    @Column(name = "allowed", nullable = false)
    private boolean allowed;

    @Column(name = "remaining_tokens")
    private Integer remainingTokens;

    @Column(name = "retry_after_millis")
    private Long retryAfterMillis;

    @Column(name = "step_up_required", nullable = false)
    private boolean stepUpRequired;

    @Column(name = "step_up_action")
    private String stepUpAction;

    @Column(name = "reason")
    private String reason;

    @Column(name = "correlation_id")
    private String correlationId;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getRouteGroup() {
        return routeGroup;
    }

    public void setRouteGroup(String routeGroup) {
        this.routeGroup = routeGroup;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public int getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(int riskScore) {
        this.riskScore = riskScore;
    }

    public String getRiskTier() {
        return riskTier;
    }

    public void setRiskTier(String riskTier) {
        this.riskTier = riskTier;
    }

    public boolean isAllowed() {
        return allowed;
    }

    public void setAllowed(boolean allowed) {
        this.allowed = allowed;
    }

    public Integer getRemainingTokens() {
        return remainingTokens;
    }

    public void setRemainingTokens(Integer remainingTokens) {
        this.remainingTokens = remainingTokens;
    }

    public Long getRetryAfterMillis() {
        return retryAfterMillis;
    }

    public void setRetryAfterMillis(Long retryAfterMillis) {
        this.retryAfterMillis = retryAfterMillis;
    }

    public boolean isStepUpRequired() {
        return stepUpRequired;
    }

    public void setStepUpRequired(boolean stepUpRequired) {
        this.stepUpRequired = stepUpRequired;
    }

    public String getStepUpAction() {
        return stepUpAction;
    }

    public void setStepUpAction(String stepUpAction) {
        this.stepUpAction = stepUpAction;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getCorrelationId() {
        return correlationId;
    }

    public void setCorrelationId(String correlationId) {
        this.correlationId = correlationId;
    }
}
