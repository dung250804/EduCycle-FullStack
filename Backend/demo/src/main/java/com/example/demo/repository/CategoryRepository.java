package com.example.demo.repository;
import com.example.demo.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, String> {
    Optional<Category> findByName(String name);
    Optional<Category> findByCategoryId(String categoryId);
    boolean existsByName(String name);
}