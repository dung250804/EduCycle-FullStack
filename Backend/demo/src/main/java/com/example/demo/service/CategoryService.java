package com.example.demo.service;

import com.example.demo.model.Category;
import com.example.demo.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public Category createCategory(Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            throw new IllegalArgumentException("Category with name " + category.getName() + " already exists");
        }
        category.setCategoryId(UUID.randomUUID().toString());
        return categoryRepository.save(category);
    }

    public Optional<Category> getCategoryById(String categoryId) {
        return categoryRepository.findById(categoryId);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category updateCategory(String categoryId, Category updatedCategory) {
        Optional<Category> existingCategory = categoryRepository.findById(categoryId);
        if (existingCategory.isEmpty()) {
            throw new IllegalArgumentException("Category with ID " + categoryId + " not found");
        }
        if (!existingCategory.get().getName().equals(updatedCategory.getName()) &&
                categoryRepository.existsByName(updatedCategory.getName())) {
            throw new IllegalArgumentException("Category with name " + updatedCategory.getName() + " already exists");
        }
        updatedCategory.setCategoryId(categoryId);
        return categoryRepository.save(updatedCategory);
    }

    public void deleteCategory(String categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new IllegalArgumentException("Category with ID " + categoryId + " not found");
        }
        categoryRepository.deleteById(categoryId);
    }
}