package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import java.io.Serializable;

@Embeddable
@Data
public class ActivityPostId implements Serializable {
    @Column(name = "activity_id")
    private String activityId;

    @Column(name = "post_id")
    private String postId;
}