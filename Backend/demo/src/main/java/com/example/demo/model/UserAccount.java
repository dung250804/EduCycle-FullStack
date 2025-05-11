package com.example.demo.model;

import com.example.demo.enumpack.UserStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

    @Entity
    @Table(name = "Users")
    @Data
    public class UserAccount implements UserDetails, Serializable {
        @Id
        @Column(name = "user_id") // Explicitly map to user_id column
        private String userId;

        @Column(nullable = false)
        private String name;

        @Column(nullable = false, unique = true)
        private String email;

        @Column(name = "password_hash", nullable = false)
        private String passwordHash;

        @Column(name = "reputation_score", nullable = false)
        private int reputationScore = 100;

        @Column(name = "violation_count", nullable = false)
        private int violationCount = 0;

        @Column(name = "wallet_balance", nullable = false)
        private BigDecimal walletBalance = BigDecimal.ZERO;

        @Column(nullable = false)
        private BigDecimal rating = BigDecimal.ZERO;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private UserStatus status = UserStatus.Active;

        private String className;
        private String thClass;
        private String avatar;

        private LocalDateTime createdAt;

        private LocalDateTime updatedAt;

        @ManyToMany(fetch = FetchType.EAGER)
        @JoinTable(
                name = "User_Role",
                joinColumns = @JoinColumn(name = "user_id"),
                inverseJoinColumns = @JoinColumn(name = "role_id")
        )
        private Set<Role> roles;

        // Existing methods (getters, setters, UserDetails methods, etc.)
        public Set<Role> getRoles() {
            return roles;
        }

        public Set<String> getRolesName() {
            return roles.stream()
                    .map(Role::getRoleName)
                    .collect(Collectors.toSet());
        }

        public void setRoles(Set<Role> roles) {
            this.roles = roles;
        }

        public String getPrimaryRole() {
            if (roles == null || roles.isEmpty()) {
                return "user";
            }

            List<String> priorityOrder = List.of(
                    "Admin",
                    "Warehouse Manager",
                    "Approval Manager",
                    "Representative",
                    "Member"
            );

            for (String priorityRole : priorityOrder) {
                for (Role role : roles) {
                    if (priorityRole.equals(role.getRoleName())) {
                        return priorityRole;
                    }
                }
            }

            return "Member";
        }

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return roles.stream()
                    .map(role -> (GrantedAuthority) () -> "ROLE_" + role.getRoleName())
                    .toList();
        }

        @Override
        public String getPassword() {
            return this.passwordHash;
        }

        @Override
        public String getUsername() {
            return this.email;
        }

        // Other getters and setters handled by @Data
    }