package com.xrs.gateway.botdefense.net;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Arrays;

/**
 * Immutable CIDR block for IPv4/IPv6.
 * <p>
 * Supports inputs like {@code 10.0.0.0/8}, {@code 192.168.1.10/32},
 * {@code 2001:db8::/32}, {@code ::1/128}.
 */
public final class CidrBlock {

    private final byte[] network;
    private final int prefix;

    private CidrBlock(byte[] network, int prefix) {
        this.network = network;
        this.prefix = prefix;
    }

    /**
     * Parse a CIDR string.
     *
     * @param cidr CIDR string
     * @return parsed block
     */
    public static CidrBlock parse(String cidr) {
        if (cidr == null || cidr.isBlank()) {
            throw new IllegalArgumentException("CIDR is blank");
        }
        String[] parts = cidr.trim().split("/");
        if (parts.length != 2) {
            throw new IllegalArgumentException("Invalid CIDR: " + cidr);
        }
        InetAddress addr = inet(parts[0]);
        int max = addr.getAddress().length * 8;
        int p;
        try {
            p = Integer.parseInt(parts[1]);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid prefix: " + cidr, e);
        }
        if (p < 0 || p > max) {
            throw new IllegalArgumentException("Prefix out of range: " + cidr);
        }

        byte[] normalized = mask(addr.getAddress(), p);
        return new CidrBlock(normalized, p);
    }

    /**
     * Check whether the given string IP is in this CIDR.
     */
    public boolean contains(String ip) {
        if (ip == null || ip.isBlank()) {
            return false;
        }
        InetAddress addr;
        try {
            addr = InetAddress.getByName(stripBrackets(ip.trim()));
        } catch (Exception e) {
            return false;
        }
        return contains(addr);
    }

    /**
     * Check whether the given address is in this CIDR.
     */
    public boolean contains(InetAddress addr) {
        if (addr == null) {
            return false;
        }
        byte[] a = addr.getAddress();
        if (a.length != network.length) {
            return false;
        }
        return Arrays.equals(mask(a, prefix), network);
    }

    public int prefix() {
        return prefix;
    }

    public byte[] network() {
        return network.clone();
    }

    private static InetAddress inet(String raw) {
        try {
            return InetAddress.getByName(stripBrackets(raw.trim()));
        } catch (UnknownHostException e) {
            throw new IllegalArgumentException("Invalid IP: " + raw, e);
        }
    }

    private static String stripBrackets(String s) {
        if (s.startsWith("[") && s.endsWith("]")) {
            return s.substring(1, s.length() - 1);
        }
        return s;
    }

    private static byte[] mask(byte[] input, int prefix) {
        byte[] out = input.clone();
        int fullBytes = prefix / 8;
        int remBits = prefix % 8;

        // Zero all bytes after the prefix.
        for (int i = fullBytes + (remBits == 0 ? 0 : 1); i < out.length; i++) {
            out[i] = 0;
        }
        if (remBits != 0 && fullBytes < out.length) {
            int mask = 0xFF << (8 - remBits);
            out[fullBytes] = (byte) (out[fullBytes] & mask);
        }
        return out;
    }
}
