package com.xrs.gateway.botdefense.web;

import com.xrs.gateway.botdefense.config.BotDefenseProperties;
import com.xrs.gateway.botdefense.net.CidrBlock;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Allowlist of CIDR blocks exempt from rate limiting.
 * <p>
 * Supports IPv4 and IPv6 CIDRs.
 */
@Component
public class IpAllowlist {

    private final List<CidrBlock> cidrs;

    /**
     * Create from configuration.
     */
    public IpAllowlist(BotDefenseProperties props) {
        List<CidrBlock> parsed = new ArrayList<>();
        for (String c : props.getAllowlist().getIpCidrs()) {
            try {
                parsed.add(CidrBlock.parse(c));
            } catch (IllegalArgumentException ignored) {
                // Ignore invalid values to avoid startup failures.
            }
        }
        this.cidrs = List.copyOf(parsed);
    }

    /**
     * Returns true if the IP is exempt.
     */
    public boolean isAllowed(String ip) {
        for (CidrBlock c : cidrs) {
            if (c.contains(ip)) {
                return true;
            }
        }
        return false;
    }
}
