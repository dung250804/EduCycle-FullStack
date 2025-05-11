package com.example.demo.model;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDateTime;

@Entity
@Table(name = "categories")
@Data
@Access(AccessType.FIELD) // Enforce field-based access to avoid getter/setter inference
public class Category {

    @Id
    @Column(name = "category_id", length = 36)
    private String categoryId;


    @Column(name = "name", nullable = false, unique = true)
    private String name;


    @Column(name = "description")
    private String description;


    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Getters and setters


    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}