package com.xrs.gateway.botdefense.net;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;

import static org.junit.jupiter.api.Assertions.*;

class ProxyAwareIpResolverTest {

    @Test
    void whenPeerNotTrusted_ignoresXff() {
        IpResolverProperties props = new IpResolverProperties();
        ProxyAwareIpResolver r = new ProxyAwareIpResolver(props);

        MockHttpServletRequest req = new MockHttpServletRequest();
        req.setRemoteAddr("203.0.113.10");
        req.addHeader("X-Forwarded-For", "1.1.1.1");

        assertEquals("203.0.113.10", r.resolve(req));
    }

    @Test
    void peelsTrustedProxyFromXffChain() {
        IpResolverProperties props = new IpResolverProperties();
        props.getTrustedProxyCidrs().add("203.0.113.0/24");
        ProxyAwareIpResolver r = new ProxyAwareIpResolver(props);

        MockHttpServletRequest req = new MockHttpServletRequest();
        req.setRemoteAddr("203.0.113.10");
        req.addHeader("X-Forwarded-For", "198.51.100.1, 203.0.113.10");

        assertEquals("198.51.100.1", r.resolve(req));
    }

    @Test
    void parsesForwardedHeaderWithIpv6() {
        IpResolverProperties props = new IpResolverProperties();
        props.getTrustedProxyCidrs().add("::1/128");
        ProxyAwareIpResolver r = new ProxyAwareIpResolver(props);

        MockHttpServletRequest req = new MockHttpServletRequest();
        req.setRemoteAddr("::1");
        req.addHeader("Forwarded", "for=\"[2001:db8:cafe::17]:4711\";proto=https");

        assertEquals("2001:db8:cafe::17", r.resolve(req));
    }
}
