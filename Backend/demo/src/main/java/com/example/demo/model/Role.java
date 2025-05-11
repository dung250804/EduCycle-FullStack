package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Roles")
@Data
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer roleId;

    @Column(name = "role_name", unique = true, nullable = false)
    private String roleName;

    // Getters & setters

}