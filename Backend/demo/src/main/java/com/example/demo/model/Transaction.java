package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
public class Transaction {
    @Id
    private String transactionId;

    @ManyToOne
    @JoinColumn(name = "post_id") // Ánh xạ tới post_id trong bảng Transactions
    private SellExchangePost post;

    @ManyToOne
    @JoinColumn(name = "activity_id") // Ánh xạ tới activity_id trong bảng Transactions
    private Activity activity;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;

    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private UserAccount user;

    private String type;
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

}
