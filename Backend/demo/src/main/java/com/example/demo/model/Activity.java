package com.example.demo.model;

import com.example.demo.enumpack.ActivityType;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Activities")
@Data
public class Activity {
    @Id
    private String activityId;

    @ManyToOne
    @JoinColumn(name = "organizer_id", nullable = false)
    private UserAccount organizer;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "goal_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal goalAmount;

    @Column(name = "amount_raised", precision = 10, scale = 2, nullable = false)
    private BigDecimal amountRaised = BigDecimal.ZERO;

    @Column(nullable = false)
    private String image;

    @Enumerated(EnumType.STRING)
    @Column(name = "activity_type", nullable = false)
    private ActivityType activityType;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

