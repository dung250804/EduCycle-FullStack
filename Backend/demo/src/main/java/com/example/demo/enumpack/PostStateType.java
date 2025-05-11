package com.example.demo.enumpack;

public enum PostStateType {
    Pending, SellerSent, BuyerSent, BothSent, SellerReceived, BuyerReceived, BothReceived;

    public static PostStateType fromString(String state) {
        try {
            return PostStateType.valueOf(state);
        } catch (IllegalArgumentException | NullPointerException e) {
            return null; // Hoặc: throw new IllegalArgumentException("Invalid state: " + state);
        }
    }
}
