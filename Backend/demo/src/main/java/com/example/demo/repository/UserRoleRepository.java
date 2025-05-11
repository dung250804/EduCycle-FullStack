package com.example.demo.repository;

import com.example.demo.model.UserRole;
import com.example.demo.model.UserRoleId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, UserRoleId> {}
