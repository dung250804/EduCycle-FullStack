package com.example.demo.enumpack;

public enum ActivityType {
    Donation, Fundraiser;
    public static ActivityType fromString(String state) {
        try {
            return ActivityType.valueOf(state);
        } catch (IllegalArgumentException | NullPointerException e) {
            return null; // Hoặc: throw new IllegalArgumentException("Invalid state: " + state);
        }
    }

    @Override
    public String toString() {
        // Viết hoa chữ cái đầu, các chữ còn lại viết thường (Active, Banned)
        return name().charAt(0) + name().substring(1).toLowerCase();
    }
}