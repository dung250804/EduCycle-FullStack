package com.example.demo.model;

import com.example.demo.enumpack.PostStateType;
import com.example.demo.enumpack.PostStatusType;
import com.example.demo.enumpack.PostType;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Sell_Exchange_Posts")
@Data
public class SellExchangePost {
    @Id
    private String postId;

    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Column(precision = 10, scale = 2, nullable = true)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostType type;

    @Column(name = "product_type", nullable = false)
    private String productType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostStatusType status = PostStatusType.Pending;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostStateType state = PostStateType.Pending;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

