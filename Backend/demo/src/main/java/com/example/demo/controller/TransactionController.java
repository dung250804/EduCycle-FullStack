package com.example.demo.controller;

import com.example.demo.model.Transaction;
import com.example.demo.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/create")
    public ResponseEntity<Transaction> createTransaction(
            @RequestParam String postId,
            @RequestParam String userId,
            @RequestParam String type) {
        Transaction transaction = transactionService.createTransaction(postId, userId, type);
        return ResponseEntity.ok(transaction);
    }


}