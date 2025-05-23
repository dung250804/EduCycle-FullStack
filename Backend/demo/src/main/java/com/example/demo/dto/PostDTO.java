package com.example.demo.dto;

import com.example.demo.enumpack.PostType;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PostDTO {
    private String title;
    private String description;
    private String imageUrl;
    private String sellerId;
    private String categoryId;
    private BigDecimal price;
    private String type;
    private String status;
    private String state;
}
