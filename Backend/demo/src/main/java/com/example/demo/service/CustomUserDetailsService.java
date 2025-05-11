package com.example.demo.service;
import com.example.demo.model.UserAccount;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;  // Giả sử bạn có một UserRepository để lấy dữ liệu người dùng

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Fetch user by email from the repository
        UserAccount userAccount = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Convert roles to granted authorities
        List<SimpleGrantedAuthority> authorities = userAccount.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getRoleName()))  // Assuming roles are mapped with Role entity
                .collect(Collectors.toList());

        // Return Spring Security's User object, which implements UserDetails
        return new User(userAccount.getEmail(), userAccount.getPassword(), authorities);
    }
}