package com.example.demo.dto;

import com.example.demo.enumpack.PostStatus;
import com.example.demo.enumpack.PostType;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PostDTO {
    private String itemName;
    private String description;
    private String imageUrl;
    private String sellerId;
    private String categoryId;
    private BigDecimal price;
    private String type;
}
