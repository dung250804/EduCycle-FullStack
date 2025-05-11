package com.example.demo.controller;

import com.example.demo.model.Transaction;
import com.example.demo.model.UserAccount;
import com.example.demo.service.TransactionService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/{id}")
    public ResponseEntity<UserAccount> getUserById(@PathVariable String id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/transactions")
    public List<Transaction> getTransactionsByUserId(@PathVariable String id) {
        return transactionService.getByUserId(id);
    }

    @PostMapping
    public ResponseEntity<UserAccount> createUser(@RequestBody UserAccount user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserAccount> updateUser(@PathVariable String id, @RequestBody UserAccount user) {
        return userService.updateUser(id, user)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


}


