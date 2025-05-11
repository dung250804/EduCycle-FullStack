package com.example.demo.repository;

import com.example.demo.enumpack.PostStatus;
import com.example.demo.enumpack.PostType;
import com.example.demo.model.SellExchangePost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SellExchangePostRepository extends JpaRepository<SellExchangePost, String> {
    List<SellExchangePost> findBySellerUserId(String sellerId);
    List<SellExchangePost> findByType(PostType type);
    List<SellExchangePost> findByStatus(PostStatus status);
    List<SellExchangePost> findByItem_Category_CategoryId(String categoryId);
}