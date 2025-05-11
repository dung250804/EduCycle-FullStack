package com.example.demo.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ActivityDTO {
    private String activityId;
    private String organizerId;
    private String title;
    private String description;
    private BigDecimal goalAmount;
    private BigDecimal amountRaised;
    private String image;
    private String activityType; // "Donation" or "Fundraiser"
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ActivityPostDTO> items; // For related items
}