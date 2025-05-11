package com.example.demo.dto;

import lombok.Data;

@Data
public class ItemDTO {
    private String itemName;
    private String description;
    private String imageUrl;
    private String owner_id;
    private String category_id;
}
