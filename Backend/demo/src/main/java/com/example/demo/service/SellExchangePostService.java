package com.example.demo.service;

import com.example.demo.dto.PostDTO;
import com.example.demo.enumpack.PostStateType;
import com.example.demo.enumpack.PostStatusType;
import com.example.demo.enumpack.PostType;
import com.example.demo.model.Item;
import com.example.demo.model.SellExchangePost;
import com.example.demo.model.UserAccount;
import com.example.demo.repository.ItemRepository;
import com.example.demo.repository.SellExchangePostRepository;
import com.example.demo.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SellExchangePostService {

    @Autowired
    private SellExchangePostRepository postRepository;

    @Autowired
    private UserRepository userAccountRepository;

    @Autowired
    private ItemService itemService;

    @Transactional
    public SellExchangePost createPost(PostDTO postDTO) {
        // Fetch related entities
        String postId = UUID.randomUUID().toString();

        Item item = itemService.createItem(postDTO);

        // Map DTO to Entity
        SellExchangePost post = new SellExchangePost();
        post.setPostId(postId);
        post.setPrice(postDTO.getPrice());
        post.setType(postDTO.getType().equals("Liquidation") ? PostType.Liquidation : PostType.Exchange);
        post.setProductType(item.getCategory().getName());
        post.setStatus(PostStatusType.Pending);
        post.setState(PostStateType.Pending);
        post.setItem(item);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());

        // Save the post
        return postRepository.save(post);
    }

    public Optional<SellExchangePost> getPostById(String postId) {
        return postRepository.findById(postId);
    }

    public List<SellExchangePost> getAllPosts() {
         return postRepository.findAll();
    }

    public List<SellExchangePost> getPostsBySellerId(String sellerId) {
        return null;//postRepository.findBySellerUserId(sellerId);
    }

    public List<SellExchangePost> getPostsByType(PostType type) {
        return postRepository.findByType(type);
    }

    public List<SellExchangePost> getPostsByStatus(PostStatusType status) {
        return postRepository.findByStatus(status);
    }

    public List<SellExchangePost> getPostsByState(PostStateType state) {
        return postRepository.findByState(state);
    }

    public List<SellExchangePost> getPostsByCategoryId(String categoryId) {
        return postRepository.findByItem_Category_CategoryId(categoryId);
    }

    public Optional<SellExchangePost> updatePost(String postId, PostDTO updatedPost) {
        Optional<SellExchangePost> existingPostOpt = postRepository.findById(postId);
        if (existingPostOpt.isEmpty()) return Optional.empty();

        SellExchangePost existingPost = existingPostOpt.get();

        existingPost.setPrice(updatedPost.getPrice());
        existingPost.setStatus(PostStatusType.fromString(updatedPost.getStatus()));
        existingPost.setState(PostStateType.fromString(updatedPost.getState()));
        existingPost.setType(PostType.fromString(updatedPost.getType()));
        existingPost.setUpdatedAt(LocalDateTime.now());

        postRepository.save(existingPost);
        return Optional.of(existingPost);
    }

    public boolean deletePost(String postId) {
        Optional<SellExchangePost> existingPost = postRepository.findById(postId);
        if (existingPost.isPresent()) {
            postRepository.deleteById(postId);
            return true;
        }
        return false;
    }
}