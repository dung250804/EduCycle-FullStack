package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String userId;
    private Set<String> userRole;
    private String userName;
    private String userAvatar;
}