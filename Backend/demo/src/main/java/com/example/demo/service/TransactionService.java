package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private SellExchangePostRepository postRepository;
    @Autowired
    private ItemRepository itemRepository;
    @Autowired
    private ActivityRepository activityRepository;
    @Autowired
    private UserRepository userRepository;

    public List<Transaction> getAll() {
        return transactionRepository.findAll();
    }

    @Transactional
    public Transaction createTransaction(String postId, String userId, String type) {
        // Fetch related entities
        SellExchangePost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        Item item = itemRepository.findById(post.getItem().getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));
        UserAccount user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create new transaction
        Transaction transaction = new Transaction();
        transaction.setTransactionId(UUID.randomUUID().toString());
        transaction.setPost(post);
        transaction.setItem(item);
        transaction.setUser(user);
        transaction.setType(type); // "Liquidation" or "Exchange"
        transaction.setStatus("Pending"); // Initial status
        transaction.setCreatedAt(LocalDateTime.now());

        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction createActivityTransaction(String activityId, String userId, String type) {
        // Fetch related entities
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        Item item = null;
        UserAccount user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create new transaction
        Transaction transaction = new Transaction();
        transaction.setTransactionId(UUID.randomUUID().toString());
        transaction.setActivity(activity);
        transaction.setUser(user);
        transaction.setType(type); // "Liquidation" or "Exchange"
        transaction.setStatus("PENDING"); // Initial status
        transaction.setCreatedAt(LocalDateTime.now());

        return transactionRepository.save(transaction);
    }

    public Optional<Transaction> getById(String id) {
        return transactionRepository.findById(id);
    }

    public List<Transaction> getByUserId(String userId) {
        return transactionRepository.findByUserUserId(userId);
    }
}
