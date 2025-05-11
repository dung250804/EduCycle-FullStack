package com.example.demo.enumpack;

public enum PostStatusType {
    Pending, Approved, Rejected, Completed;

    public static PostStatusType fromString(String state) {
        try {
            return PostStatusType.valueOf(state);
        } catch (IllegalArgumentException | NullPointerException e) {
            return null; // Hoặc: throw new IllegalArgumentException("Invalid state: " + state);
        }
    }
}