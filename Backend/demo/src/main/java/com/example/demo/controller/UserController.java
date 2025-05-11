package com.example.demo.controller;

import com.example.demo.dto.UserDTO;
import com.example.demo.enumpack.UserStatus;
import com.example.demo.model.Role;
import com.example.demo.model.SellExchangePost;
import com.example.demo.model.Transaction;
import com.example.demo.model.UserAccount;
import com.example.demo.repository.RoleRepository;
import com.example.demo.service.TransactionService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // Cấu hình CORS cho frontend
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private TransactionService transactionService;

    // Lấy danh sách tất cả users
    @GetMapping
    public List<UserAccount> getAllUsers() {
        return userService.getAllUsers();
    }

    // Lấy user theo ID
    @GetMapping("/{id}")
    public ResponseEntity<UserAccount> getPostById(@PathVariable String id) {
        Optional<UserAccount> userAccount = userService.getUserById(id);
        return userAccount.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Lấy transactions của user
    @GetMapping("/{id}/transactions")
    public ResponseEntity<List<Transaction>> getTransactionsByUserId(@PathVariable String id) {
        List<Transaction> transactions = transactionService.getByUserId(id);
        return ResponseEntity.ok(transactions);
    }

    // Tạo user mới
    @PostMapping
    public ResponseEntity<UserAccount> createUser(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.createUser(userDTO));
    }

    // Cập nhật user
    @PutMapping("/{id}")
    public ResponseEntity<UserAccount> updateUser(@PathVariable String id, @RequestBody UserAccount userAccount) {
        Optional<UserAccount> updated = userService.updateUser(id, userAccount);
        return updated.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Xóa user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        try {
            boolean deleted = userService.deleteUser(id);
            if (deleted) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
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

    // DTO cho permissions
    public static class PermissionsDTO {
        private List<String> permissions;

        public List<String> getPermissions() {
            return permissions;
        }

        public void setPermissions(List<String> permissions) {
            this.permissions = permissions;
        }
    }
}