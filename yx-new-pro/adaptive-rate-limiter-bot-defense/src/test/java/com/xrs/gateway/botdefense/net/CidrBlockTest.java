package com.xrs.gateway.botdefense.net;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CidrBlockTest {

    @Test
    void ipv4ContainsWorks() {
        CidrBlock c = CidrBlock.parse("10.0.0.0/8");
        assertTrue(c.contains("10.1.2.3"));
        assertFalse(c.contains("11.1.2.3"));
    }

    @Test
    void ipv6ContainsWorks() {
        CidrBlock c = CidrBlock.parse("2001:db8::/32");
        assertTrue(c.contains("2001:db8:abcd::1"));
        assertFalse(c.contains("2001:db9::1"));
    }
}
