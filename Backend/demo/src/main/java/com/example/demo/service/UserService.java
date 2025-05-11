package com.example.demo.service;

import com.example.demo.dto.UserDTO;
import com.example.demo.enumpack.UserStatus;
import com.example.demo.model.Role;
import com.example.demo.model.SellExchangePost;
import com.example.demo.model.UserAccount;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private RoleRepository roleRepository;

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

    public UserAccount createUser(UserDTO userDTO) {
        UserAccount user = toEntity(userDTO);
        user.setPasswordHash(passwordEncoder.encode(userDTO.getPassword())); // encode here
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

    public boolean deleteUser(String postId) {
        Optional<UserAccount> existingPost = userRepository.findById(postId);
        if (existingPost.isPresent()) {
            userRepository.deleteById(postId);
            return true;
        }
        return false;
    }

    private UserDTO toDTO(UserAccount user) {
        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRoles(convertSetRoleToListString(user.getRoles()));
        dto.setClassName(user.getClassName());
        dto.setThClass(user.getThClass());
        dto.setReputationScore(user.getReputationScore());
        dto.setViolationCount(user.getViolationCount());
        dto.setWalletBalance(user.getWalletBalance());
        dto.setRating(user.getRating());
        dto.setStatus(user.getStatus().toString());
        dto.setAvatar(user.getAvatar());
        return dto;
    }

    private UserAccount toEntity(UserDTO dto) {
        UserAccount user = new UserAccount();
        user.setUserId(dto.getUserId() != null ? dto.getUserId() : UUID.randomUUID().toString());
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setRoles(convertListStringToSetRole(dto.getRoles()));
        user.setClassName(dto.getClassName());
        user.setThClass(dto.getThClass());
        user.setReputationScore(dto.getReputationScore());
        user.setViolationCount(dto.getViolationCount());
        user.setWalletBalance(dto.getWalletBalance());
        user.setRating(dto.getRating());
        user.setStatus(UserStatus.fromString(dto.getStatus())); // Giả định status là enum
        user.setAvatar(dto.getAvatar());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return user;
    }

    // Chuyển đổi roles từ List<String> sang Set<Role>
    public Set<Role> convertListStringToSetRole(List<String> roleNames) {
        return roleNames.stream()
                .map(roleName -> roleRepository.findByRoleName(roleName)
                        .orElseThrow(() -> new RuntimeException("Role not found: " + roleName)))
                .collect(Collectors.toSet());
    }

    // Chuyển đổi roles từ Set<Role> sang List<String>
    public List<String> convertSetRoleToListString(Set<Role> roles) {
        return roles.stream()
                .map(Role::getRoleName)
                .collect(Collectors.toList());
    }
}