package com.xrs.gateway.botdefense.net;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * Resolve the real client IP in a proxy-aware way.
 * <p>
 * ...
 */
@Component
public class ProxyAwareIpResolver {

    private final List<CidrBlock> trustedProxies;

    public ProxyAwareIpResolver(IpResolverProperties props) {
        List<CidrBlock> blocks = new ArrayList<>();
        for (String cidr : props.getTrustedProxyCidrs()) {
            try {
                blocks.add(CidrBlock.parse(cidr));
            } catch (Exception ignored) {
                // Ignore invalid CIDRs.
            }
        }
        this.trustedProxies = List.copyOf(blocks);
    }

    /**
     * Resolve best-effort client IP.
     */
    public String resolve(HttpServletRequest request) {
        String remote = safeIp(request.getRemoteAddr());
        if (remote == null) {
            return "unknown";
        }

        // If peer is not a trusted proxy, ignore forwarding headers.
        if (!isTrusted(remote)) {
            return remote;
        }

        // 1) RFC 7239 Forwarded header
        String forwarded = request.getHeader("Forwarded");
        String fromForwarded = parseForwardedFor(forwarded);
        if (fromForwarded != null) {
            return fromForwarded;
        }

        // 2) X-Forwarded-For chain (peel trusted proxies from the right)
        String xff = request.getHeader("X-Forwarded-For");
        String fromXff = parseXffChain(xff, remote);
        if (fromXff != null) {
            return fromXff;
        }

        // 3) X-Real-IP
        String xReal = safeIp(request.getHeader("X-Real-IP"));
        if (xReal != null) {
            return xReal;
        }

        return remote;
    }

    private boolean isTrusted(String ip) {
        for (CidrBlock b : trustedProxies) {
            if (b.contains(ip)) {
                return true;
            }
        }
        return false;
    }

    private String parseForwardedFor(String forwarded) {
        if (forwarded == null || forwarded.isBlank()) {
            return null;
        }
        // Example: Forwarded: for=192.0.2.60;proto=http;by=203.0.113.43
        // Example: Forwarded: for="[2001:db8:cafe::17]:4711"
        String[] entries = forwarded.split(",");
        for (String e : entries) {
            String[] parts = e.split(";");
            for (String p : parts) {
                String[] kv = p.trim().split("=", 2);
                if (kv.length == 2 && "for".equalsIgnoreCase(kv[0].trim())) {
                    String raw = kv[1].trim();
                    raw = trimQuotes(raw);
                    raw = stripPort(raw);
                    raw = stripBrackets(raw);
                    raw = safeIp(raw);
                    if (raw != null) {
                        return raw;
                    }
                }
            }
        }
        return null;
    }

    private String parseXffChain(String xff, String remote) {
        if (xff == null || xff.isBlank()) {
            return null;
        }
        String[] parts = xff.split(",");
        List<String> chain = new ArrayList<>();
        for (String p : parts) {
            String ip = safeIp(stripBrackets(stripPort(p.trim())));
            if (ip != null) {
                chain.add(ip);
            }
        }
        // Append the immediate peer as the last hop.
        chain.add(remote);

        // Peel trusted proxies from the right.
        int i = chain.size() - 1;
        while (i >= 0 && isTrusted(chain.get(i))) {
            i--;
        }
        if (i >= 0) {
            return chain.get(i);
        }
        return null;
    }

    private static String safeIp(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        String s = raw.trim();
        if ("unknown".equalsIgnoreCase(s)) {
            return null;
        }
        // Very lightweight sanitation – avoid spaces and commas.
        s = s.replace(" ", "").replace(",", "");
        return s.isBlank() ? null : s;
    }

    private static String stripPort(String v) {
        if (v == null) {
            return null;
        }
        String s = v.trim();
        // IPv6 with port uses brackets, handled elsewhere.
        int idx = s.lastIndexOf(':');
        if (idx > 0 && s.indexOf(':') == idx) {
            // likely IPv4:port
            String maybePort = s.substring(idx + 1);
            if (maybePort.chars().allMatch(Character::isDigit)) {
                return s.substring(0, idx);
            }
        }
        return s;
    }

    private static String stripBrackets(String v) {
        if (v == null) {
            return null;
        }
        String s = v.trim();
        if (s.startsWith("[") && s.contains("]")) {
            return s.substring(1, s.indexOf(']'));
        }
        return s;
    }

    private static String trimQuotes(String v) {
        String s = v;
        if (s.startsWith("\"") && s.endsWith("\"") && s.length() >= 2) {
            s = s.substring(1, s.length() - 1);
        }
        return s;
    }
}
