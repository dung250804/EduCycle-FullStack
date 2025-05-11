package com.example.demo.service;

import com.example.demo.model.UserAccount;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<UserAccount> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<UserAccount> getUserById(String id) {
        return userRepository.findById(id);
    }

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserAccount createUser(UserAccount user) {
        user.setUserId(UUID.randomUUID().toString());
        user.setPasswordHash(passwordEncoder.encode(user.getPassword())); // encode here
        return userRepository.save(user);
    }

    public Optional<UserAccount> updateUser(String id, UserAccount updatedUser) {
        return userRepository.findById(id).map(existingUser -> {
            existingUser.setName(updatedUser.getName());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setPasswordHash(updatedUser.getPassword());
            // update other fields as needed
            return userRepository.save(existingUser);
        });
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}