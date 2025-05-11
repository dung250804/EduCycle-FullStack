package com.example.demo.repository;

import com.example.demo.model.Role;
import com.example.demo.model.UserAccount;
import com.example.demo.model.UserRole;
import com.example.demo.model.UserRoleId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserAccount, String> {
    Optional<UserAccount> findByEmail(String email);
}



