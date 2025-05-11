package com.example.demo.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Data
public class UserDTO {
    private String userId;

    private String name;

    private String email;

    private List<String> roles = new ArrayList<>();

    private String className;

    private String thClass;

    private int reputationScore;

    private int violationCount;

    private BigDecimal walletBalance;

    private BigDecimal rating;

    private String status;

    private String avatar;

    private String password;
}