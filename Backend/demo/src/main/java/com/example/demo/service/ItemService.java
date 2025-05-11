package com.example.demo.service;

import com.example.demo.dto.ItemDTO;
import com.example.demo.dto.PostDTO;
import com.example.demo.model.Category;
import com.example.demo.model.Item;
import com.example.demo.model.UserAccount;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ItemRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ItemService {

    private final ItemRepository itemRepository;

    @Autowired
    private UserRepository userAccountRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Optional<Item> getItemById(String itemId) {
        return itemRepository.findById(itemId);
    }

    public Item createItem(ItemDTO itemDTO) {
        // Generate random itemId
        String itemId = UUID.randomUUID().toString();

        // Find owner
        UserAccount owner = userAccountRepository.findById(itemDTO.getOwner_id())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + itemDTO.getOwner_id()));

        // Find category
        Category category = categoryRepository.findById(itemDTO.getCategory_id())
                .orElseThrow(() -> new IllegalArgumentException("Category not found: " + itemDTO.getCategory_id()));

        // Create Item entity
        Item item = new Item();
        item.setItemId(itemId);
        item.setItemName(itemDTO.getItemName());
        item.setDescription(itemDTO.getDescription());
        item.setImageUrl(itemDTO.getImageUrl());
        item.setOwner(owner);
        item.setCategory(category);
        item.setCreatedAt(LocalDateTime.now());

        // Save and return
        return itemRepository.save(item);
    }

    public Item createItem(PostDTO postDTO) {
        // Generate random itemId
        String itemId = UUID.randomUUID().toString();

        // Find owner
        UserAccount owner = userAccountRepository.findById(postDTO.getSellerId())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + postDTO.getSellerId()));

        // Find category
        Category category = categoryRepository.findById(postDTO.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found: " + postDTO.getCategoryId()));

        // Create Item entity
        Item item = new Item();
        item.setItemId(itemId);
        item.setItemName(postDTO.getTitle());
        item.setDescription(postDTO.getDescription());
        item.setImageUrl(postDTO.getImageUrl());
        item.setOwner(owner);
        item.setCategory(category);
        item.setCreatedAt(LocalDateTime.now());

        // Save and return
        return itemRepository.save(item);
    }

    public Item updateItem(String itemId, Item updatedItem) {
        return itemRepository.findById(itemId)
                .map(existingItem -> {
                    existingItem.setItemName(updatedItem.getItemName());
                    existingItem.setDescription(updatedItem.getDescription());
                    existingItem.setImageUrl(updatedItem.getImageUrl());
                    existingItem.setOwner(updatedItem.getOwner());
                    existingItem.setCategory(updatedItem.getCategory());
                    return itemRepository.save(existingItem);
                })
                .orElseThrow(() -> new RuntimeException("Item not found"));
    }

    public void deleteItem(String itemId) {
        itemRepository.deleteById(itemId);
    }
}
