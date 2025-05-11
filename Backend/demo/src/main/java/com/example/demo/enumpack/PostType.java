package com.example.demo.enumpack;

public enum PostType {
    Liquidation, Exchange, Fundraiser;
    public static PostType fromString(String state) {
        try {
            return PostType.valueOf(state);
        } catch (IllegalArgumentException | NullPointerException e) {
            return null; // Hoặc: throw new IllegalArgumentException("Invalid state: " + state);
        }
    }
}
