package com.example.demo.controller;

import com.example.demo.model.Category;
import com.example.demo.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<Category> getCategoryById(@PathVariable String categoryId) {
        Optional<Category> category = categoryService.getCategoryById(categoryId);
        return category.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        try {
            Category createdCategory = categoryService.createCategory(category);
            return ResponseEntity.ok(createdCategory);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{categoryId}")
    public ResponseEntity<Category> updateCategory(@PathVariable String categoryId, @RequestBody Category category) {
        try {
            Category updatedCategory = categoryService.updateCategory(categoryId, category);
            return ResponseEntity.ok(updatedCategory);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable String categoryId) {
        try {
            categoryService.deleteCategory(categoryId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}