package com.example.demo.service;

import com.example.demo.dto.PostDTO;
import com.example.demo.enumpack.PostStatus;
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
        UserAccount seller = userAccountRepository.findById(postDTO.getSellerId())
                .orElseThrow(() -> new EntityNotFoundException("Seller not found with ID: " + postDTO.getSellerId()));
        String postId = UUID.randomUUID().toString();

        Item item = itemService.createItem(postDTO);

        // Map DTO to Entity
        SellExchangePost post = new SellExchangePost();
        post.setPostId(postId);
        post.setTitle(postDTO.getItemName());
        post.setDescription(postDTO.getDescription());
        post.setPrice(postDTO.getPrice());
        post.setType(postDTO.getType().equals("Liquidation") ? PostType.Liquidation : PostType.Exchange);
        post.setProductType(item.getCategory().getName());
        post.setStatus(PostStatus.Pending);
        post.setSeller(seller);
        post.setItem(item);

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
        return postRepository.findBySellerUserId(sellerId);
    }

    public List<SellExchangePost> getPostsByType(PostType type) {
        return postRepository.findByType(type);
    }

    public List<SellExchangePost> getPostsByStatus(PostStatus status) {
        return postRepository.findByStatus(status);
    }

    public List<SellExchangePost> getPostsByCategoryId(String categoryId) {
        return postRepository.findByItem_Category_CategoryId(categoryId);
    }

    public SellExchangePost updatePost(SellExchangePost SellExchangePost) {
        return postRepository.save(SellExchangePost);
    }

    public void deletePost(String postId) {
        postRepository.deleteById(postId);
    }
    
}