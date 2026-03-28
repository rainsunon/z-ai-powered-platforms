package com.xrs.asset.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Simple utility to generate BCrypt password hashes.
 * Run this main method to generate a hash for a password.
 */
public class GeneratePasswordHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = args.length > 0 ? args[0] : "password123";
        String hash = encoder.encode(password);
        System.out.println("Password: " + password);
        System.out.println("BCrypt Hash: " + hash);
        System.out.println("\nUse this hash in SQL INSERT statement.");
    }
}

