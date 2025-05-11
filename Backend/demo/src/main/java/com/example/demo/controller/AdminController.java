package com.example.demo.controller;

import com.example.demo.model.Transaction;
import com.example.demo.model.UserAccount;
import com.example.demo.service.TransactionService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private UserService userService;

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/users")
    public List<UserAccount> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/transactions")
    public List<Transaction> getTransactionsByUserId() {
        return transactionService.getAll();
    }

}
