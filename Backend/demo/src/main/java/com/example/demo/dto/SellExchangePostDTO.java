package com.example.demo.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class SellExchangePostDTO {
    private String postId;
    private String sellerId;
    private String itemId;
    private String title;
    private String description;
    private BigDecimal price;
    private String type;
    private String productType;
    private String categoryId;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}