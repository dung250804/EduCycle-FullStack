package com.example.demo.model;

import jakarta.persistence.*;
@Entity
@Table(name = "Activity_Post")
@IdClass(ActivityPostId.class)
public class ActivityPost {

    @Id
    @Column(name = "activity_id")
    private String activityId;

    @Id
    @Column(name = "post_id")
    private String postId;

    @Column(name = "quantity")
    private Integer quantity;
}
