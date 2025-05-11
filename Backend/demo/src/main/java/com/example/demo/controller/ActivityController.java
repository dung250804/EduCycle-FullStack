package com.example.demo.controller;

import com.example.demo.dto.ActivityDTO;
import com.example.demo.enumpack.ActivityType;
import com.example.demo.model.Activity;
import com.example.demo.model.UserAccount;
import com.example.demo.repository.ActivityRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "http://localhost:8000")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityRepository activityRepository;

    // Get all activities
    @GetMapping
    public List<Activity> getAllActivities() {
        return activityService.getAllActivities();
    }

    // Get activity by ID
    @GetMapping("/{id}")
    public ResponseEntity<Activity> getActivityById(@PathVariable String id) {
        Optional<Activity> activity = activityService.getActivityById(id);
        return activity.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create new activity
    @PostMapping
    public ResponseEntity<Activity> createActivity(@RequestBody ActivityDTO activityDTO) {
        return ResponseEntity.ok(activityService.createActivity(activityDTO));
    }

    // Update activity
    @PutMapping("/{id}")
    public ResponseEntity<Activity> updateActivity(@PathVariable String id, @RequestBody ActivityDTO activityDTO) {
        Optional<Activity> updated = activityService.updateActivity(id, activityDTO);
        return updated.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> patchActivity(
            @PathVariable String id,
            @RequestBody Map<String, Object> updates
    ) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Activity not found"));

        updates.forEach((key, value) -> {
            switch (key) {
                case "title" -> activity.setTitle((String) value);
                case "description" -> activity.setDescription((String) value);
                case "goalAmount" -> activity.setGoalAmount(new BigDecimal(value.toString()));
                case "amountRaised" -> activity.setAmountRaised(new BigDecimal(value.toString()));
                case "image" -> activity.setImage((String) value);
                case "activityType" -> activity.setActivityType(ActivityType.valueOf(value.toString()));
                case "startDate" -> activity.setStartDate(LocalDateTime.parse(value.toString()));
                case "endDate" -> activity.setEndDate(LocalDateTime.parse(value.toString()));
                case "updatedAt" -> activity.setUpdatedAt(LocalDateTime.now());
                case "organizerId" -> {
                    UserAccount organizer = userRepository.findById(value.toString())
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Organizer not found"));
                    activity.setOrganizer(organizer);
                }
                // Nếu cần, có thể xử lý thêm phần posts
            }
        });

        activity.setUpdatedAt(LocalDateTime.now());
        activityRepository.save(activity);
        return ResponseEntity.ok(activity);
    }

    // Delete activity
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable String id) {
        try {
            boolean deleted = activityService.deleteActivity(id);
            if (deleted) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}