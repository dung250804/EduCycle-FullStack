package com.example.demo.controller;

import com.example.demo.model.AuthResponse;
import com.example.demo.model.LoginRequest;
import com.example.demo.model.UserAccount;
import com.example.demo.repository.UserRepository;
import com.example.demo.webtoken.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            UserDetails user = (UserDetails) authentication.getPrincipal();
            String token = jwtService.generateToken(user);
            UserAccount userAccount = userRepository.findByEmail(user.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//            System.out.println(userAccount.getRoles().toString());
            return ResponseEntity.ok(new AuthResponse(token, userAccount.getUserId(), userAccount.getRolesName(), userAccount.getName(), userAccount.getAvatar()));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }
}

