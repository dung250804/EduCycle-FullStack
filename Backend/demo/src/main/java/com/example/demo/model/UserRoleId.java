package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import java.io.Serializable;

@Embeddable
@Data
public class UserRoleId implements Serializable {
    @Column(name = "user_id")
    private String userId;

    @Column(name = "role_id")
    private Integer roleId;
}