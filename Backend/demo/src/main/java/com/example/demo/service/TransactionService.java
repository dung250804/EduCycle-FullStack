package com.example.demo.service;

import com.example.demo.model.Transaction;
import com.example.demo.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository repository;

    public List<Transaction> getAll() {
        return repository.findAll();
    }

    public Transaction create(Transaction transaction) {
        return repository.save(transaction);
    }

    public Optional<Transaction> getById(String id) {
        return repository.findById(id);
    }

    public List<Transaction> getByUserId(String userId) {
        return repository.findByUserUserId(userId);
    }
}
