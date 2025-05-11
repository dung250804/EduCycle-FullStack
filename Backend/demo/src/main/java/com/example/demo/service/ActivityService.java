package com.example.demo.service;

import com.example.demo.model.Activity;
import com.example.demo.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    public Activity createActivity(Activity activity) {
        return activityRepository.save(activity);
    }

    public Optional<Activity> getActivityById(String activityId) {
        return activityRepository.findById(activityId);
    }

    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }

    public Activity updateActivity(Activity activity) {
        return activityRepository.save(activity);
    }

    public void deleteActivity(String activityId) {
        activityRepository.deleteById(activityId);
    }
}