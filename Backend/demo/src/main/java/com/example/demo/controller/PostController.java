package com.example.demo.controller;
import com.example.demo.dto.ItemDTO;
import com.example.demo.dto.PostDTO;
import com.example.demo.enumpack.PostStatus;
import com.example.demo.enumpack.PostType;
import com.example.demo.model.Item;
import com.example.demo.model.SellExchangePost;
import com.example.demo.service.SellExchangePostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    @Autowired
    private SellExchangePostService postService;

    @GetMapping
    public List<SellExchangePost> getAllPosts() {
        return postService.getAllPosts();
    }

    @PostMapping
    public ResponseEntity<SellExchangePost> createPost(@RequestBody PostDTO post) {
        return ResponseEntity.ok(postService.createPost(post));
    }

    @GetMapping("/{postId}")
    public ResponseEntity<SellExchangePost> getPostById(@PathVariable String postId) {
        Optional<SellExchangePost> SellExchangePost = postService.getPostById(postId);
        return SellExchangePost.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/seller/{sellerId}")
    public List<SellExchangePost> getPostsBySellerId(@PathVariable String sellerId) {
        return postService.getPostsBySellerId(sellerId);
    }

    @GetMapping("/type/{type}")
    public List<SellExchangePost> getPostsByType(@PathVariable PostType type) {
        return postService.getPostsByType(type);
    }

    @GetMapping("/status/{status}")
    public List<SellExchangePost> getPostsByStatus(@PathVariable PostStatus status) {
        return postService.getPostsByStatus(status);
    }

    @GetMapping("/category/{categoryId}")
    public List<SellExchangePost> getPostsByCategoryId(@PathVariable String categoryId) {
        return postService.getPostsByCategoryId(categoryId);
    }

}