package com.xrs.gateway.botdefense.net;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.ArrayList;
import java.util.List;

/**
 * Configuration for proxy-aware IP resolution.
 */
@ConfigurationProperties(prefix = "botdefense.ip")
public class IpResolverProperties {

    /**
     * CIDR blocks that are considered trusted proxies (e.g. LB/Ingress).
     * <p>
     * When the immediate peer (remoteAddress) matches one of these blocks,
     * the resolver will look at forwarding headers.
     */
    private List<String> trustedProxyCidrs = new ArrayList<>();

    public List<String> getTrustedProxyCidrs() {
        return trustedProxyCidrs;
    }

    public void setTrustedProxyCidrs(List<String> trustedProxyCidrs) {
        this.trustedProxyCidrs = trustedProxyCidrs;
    }
}
