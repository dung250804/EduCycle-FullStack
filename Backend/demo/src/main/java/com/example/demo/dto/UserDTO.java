package com.example.demo.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class UserDTO {
    private String id;
    private String name;
    private String email;
    private String password;
    private Integer reputationScore;
    private Integer violationCount;
    private BigDecimal walletBalance;
    private BigDecimal rating;
    private String status;
    private String avatar;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<String> roles;
}