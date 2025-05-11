package com.example.demo.service;

import com.example.demo.dto.ActivityDTO;
import com.example.demo.enumpack.ActivityType;
import com.example.demo.model.Activity;
import com.example.demo.model.UserAccount;
import com.example.demo.repository.ActivityRepository;
import com.example.demo.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }

    public Optional<Activity> getActivityById(String id) {
        return activityRepository.findById(id);
    }

    public Activity createActivity(ActivityDTO activityDTO) {
        Activity activity = toEntity(activityDTO);
        return activityRepository.save(activity);
    }

    public Optional<Activity> updateActivity(String id, ActivityDTO activityDTO) {
        return activityRepository.findById(id).map(existingActivity -> {
            existingActivity.setTitle(activityDTO.getTitle());
            existingActivity.setDescription(activityDTO.getDescription());
            existingActivity.setGoalAmount(activityDTO.getGoalAmount());
            existingActivity.setAmountRaised(activityDTO.getAmountRaised());
            existingActivity.setImage(activityDTO.getImage());
            existingActivity.setActivityType(ActivityType.valueOf(activityDTO.getActivityType()));
            existingActivity.setEndDate(activityDTO.getEndDate());
            existingActivity.setUpdatedAt(LocalDateTime.now());
            return activityRepository.save(existingActivity);
        });
    }

    public boolean deleteActivity(String id) {
        Optional<Activity> existingActivity = activityRepository.findById(id);
        if (existingActivity.isPresent()) {
            activityRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private Activity toEntity(ActivityDTO dto) {
        UserAccount organizer = userRepository.findById(dto.getOrganizerId())
                .orElseThrow(() -> new EntityNotFoundException("Seller not found with ID: " + dto.getOrganizerId()));

        Activity activity = new Activity();
        activity.setActivityId(dto.getActivityId() != null ? dto.getActivityId() : UUID.randomUUID().toString());
        activity.setOrganizer(organizer);
        activity.setTitle(dto.getTitle());
        activity.setDescription(dto.getDescription());
        activity.setGoalAmount(dto.getGoalAmount());
        activity.setAmountRaised(dto.getAmountRaised() != null ? dto.getAmountRaised() : BigDecimal.ZERO);
        activity.setImage(dto.getImage());
        activity.setActivityType(ActivityType.valueOf(dto.getActivityType()));
        activity.setStartDate(dto.getStartDate() != null ? dto.getStartDate() : LocalDateTime.now());
        activity.setEndDate(dto.getEndDate());
        activity.setCreatedAt(LocalDateTime.now());
        activity.setUpdatedAt(LocalDateTime.now());

        return activity;
    }

    private ActivityDTO toDTO(Activity activity) {
        ActivityDTO dto = new ActivityDTO();
        dto.setActivityId(activity.getActivityId());
        dto.setOrganizerId(activity.getOrganizer().getUserId());
        dto.setTitle(activity.getTitle());
        dto.setDescription(activity.getDescription());
        dto.setGoalAmount(activity.getGoalAmount());
        dto.setAmountRaised(activity.getAmountRaised());
        dto.setImage(activity.getImage());
        dto.setActivityType(activity.getActivityType().toString());
        dto.setStartDate(activity.getStartDate());
        dto.setEndDate(activity.getEndDate());
        dto.setCreatedAt(activity.getCreatedAt());
        dto.setUpdatedAt(activity.getUpdatedAt());
        return dto;
    }
}