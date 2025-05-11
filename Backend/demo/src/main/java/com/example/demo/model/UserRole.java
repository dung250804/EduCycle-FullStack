package com.example.demo.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.security.Timestamp;

@Entity
@Table(name = "User_Role")
@IdClass(UserRoleId.class)
public class UserRole {
    @Id
    private String userId;

    @Id
    private Integer roleId;

    @CreationTimestamp
    private Timestamp assignedAt;

    // Foreign key relations can be added if needed

}
