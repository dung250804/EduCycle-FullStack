package com.example.demo.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cloudinary")
public class CloudinaryController {

    @Autowired
    private Cloudinary cloudinary;

    @Data
    static class SignatureRequest {
        private String timestamp;
    }

    @Data
    static class SignatureResponse {
        private String signature;
        private String timestamp;
    }

    @PostMapping("/signature")
    public ResponseEntity<SignatureResponse> generateSignature(@RequestBody SignatureRequest request) {
        if (request.getTimestamp() == null) {
            return ResponseEntity.badRequest().body(null);
        }

        try {
            // Generate signature
            Map<String, Object> params = ObjectUtils.asMap("timestamp", request.getTimestamp());
            String signature = cloudinary.apiSignRequest(params, cloudinary.config.apiSecret);

            SignatureResponse response = new SignatureResponse();
            response.setSignature(signature);
            response.setTimestamp(request.getTimestamp());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}