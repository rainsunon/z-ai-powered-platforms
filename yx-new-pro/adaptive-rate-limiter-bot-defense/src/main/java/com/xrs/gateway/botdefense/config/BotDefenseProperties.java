package com.xrs.gateway.botdefense.config;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.util.ArrayList;
import java.util.List;

/**
 * Configuration for the bot-defense system.
 */
@Validated
@ConfigurationProperties(prefix = "botdefense")
public class BotDefenseProperties {

    @Valid
    @NotNull
    private Allowlist allowlist = new Allowlist();

    @Valid
    @NotEmpty
    private List<RouteGroup> routeGroups = new ArrayList<>();

    @Valid
    @NotNull
    private Limits limits = new Limits();

    @Valid
    @NotNull
    private Risk risk = new Risk();

    @Valid
    @NotNull
    private Signals signals = new Signals();

    public Allowlist getAllowlist() {
        return allowlist;
    }

    public void setAllowlist(Allowlist allowlist) {
        this.allowlist = allowlist;
    }

    public List<RouteGroup> getRouteGroups() {
        return routeGroups;
    }

    public void setRouteGroups(List<RouteGroup> routeGroups) {
        this.routeGroups = routeGroups;
    }

    public Limits getLimits() {
        return limits;
    }

    public void setLimits(Limits limits) {
        this.limits = limits;
    }

    public Risk getRisk() {
        return risk;
    }

    public void setRisk(Risk risk) {
        this.risk = risk;
    }

    public Signals getSignals() {
        return signals;
    }

    public void setSignals(Signals signals) {
        this.signals = signals;
    }

    /**
     * IP allow-list configuration.
     */
    public static class Allowlist {
        /**
         * List of CIDR strings that are exempt from enforcement.
         */
        private List<String> ipCidrs = new ArrayList<>();

        public List<String> getIpCidrs() {
            return ipCidrs;
        }

        public void setIpCidrs(List<String> ipCidrs) {
            this.ipCidrs = ipCidrs;
        }
    }

    /**
     * Path grouping used for routing to different limit profiles.
     */
    public static class RouteGroup {
        @NotNull
        private String name;

        @NotEmpty
        private List<String> paths = new ArrayList<>();

        @NotEmpty
        private List<String> methods = new ArrayList<>();

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public List<String> getPaths() {
            return paths;
        }

        public void setPaths(List<String> paths) {
            this.paths = paths;
        }

        public List<String> getMethods() {
            return methods;
        }

        public void setMethods(List<String> methods) {
            this.methods = methods;
        }
    }

    /**
     * Base limits.
     */
    public static class Limits {
        @Valid
        @NotNull
        private Bucket ip = new Bucket();

        @Valid
        @NotNull
        private Bucket user = new Bucket();

        @Valid
        @NotNull
        private Bucket tenant = new Bucket();

        public Bucket getIp() {
            return ip;
        }

        public void setIp(Bucket ip) {
            this.ip = ip;
        }

        public Bucket getUser() {
            return user;
        }

        public void setUser(Bucket user) {
            this.user = user;
        }

        public Bucket getTenant() {
            return tenant;
        }

        public void setTenant(Bucket tenant) {
            this.tenant = tenant;
        }
    }

    /**
     * Token-bucket parameters.
     */
    public static class Bucket {
        /**
         * Maximum burst.
         */
        private int capacity = 60;

        /**
         * Refill rate in tokens per second.
         */
        private double refillPerSecond = 1.0;

        public int getCapacity() {
            return capacity;
        }

        public void setCapacity(int capacity) {
            this.capacity = capacity;
        }

        public double getRefillPerSecond() {
            return refillPerSecond;
        }

        public void setRefillPerSecond(double refillPerSecond) {
            this.refillPerSecond = refillPerSecond;
        }
    }

    /**
     * Risk configuration.
     */
    public static class Risk {
        private int tightenMediumAt = 30;
        private int tightenHighAt = 60;
        private int stepUpAt = 80;

        @Valid
        @NotNull
        private Factors factors = new Factors();

        public int getTightenMediumAt() {
            return tightenMediumAt;
        }

        public void setTightenMediumAt(int tightenMediumAt) {
            this.tightenMediumAt = tightenMediumAt;
        }

        public int getTightenHighAt() {
            return tightenHighAt;
        }

        public void setTightenHighAt(int tightenHighAt) {
            this.tightenHighAt = tightenHighAt;
        }

        public int getStepUpAt() {
            return stepUpAt;
        }

        public void setStepUpAt(int stepUpAt) {
            this.stepUpAt = stepUpAt;
        }

        public Factors getFactors() {
            return factors;
        }

        public void setFactors(Factors factors) {
            this.factors = factors;
        }

        /**
         * Multipliers applied to base limits depending on risk.
         */
        public static class Factors {
            private double medium = 0.5;
            private double high = 0.2;

            public double getMedium() {
                return medium;
            }

            public void setMedium(double medium) {
                this.medium = medium;
            }

            public double getHigh() {
                return high;
            }

            public void setHigh(double high) {
                this.high = high;
            }
        }
    }

    /**
     * Parameters controlling signal windows and aggregation.
     */
    public static class Signals {
        private int loginFailureWindowSeconds = 600;
        private int requestRateWindowSeconds = 60;

        public int getLoginFailureWindowSeconds() {
            return loginFailureWindowSeconds;
        }

        public void setLoginFailureWindowSeconds(int loginFailureWindowSeconds) {
            this.loginFailureWindowSeconds = loginFailureWindowSeconds;
        }

        public int getRequestRateWindowSeconds() {
            return requestRateWindowSeconds;
        }

        public void setRequestRateWindowSeconds(int requestRateWindowSeconds) {
            this.requestRateWindowSeconds = requestRateWindowSeconds;
        }
    }
}
