package com.learninghub.controller;

import com.learninghub.dto.LoginRequest;
import com.learninghub.dto.RegisterRequest;
import com.learninghub.entity.User;
import com.learninghub.repository.UserRepository;
import com.learninghub.security.JwtUtil;
import com.learninghub.security.OtpStorage;
import com.learninghub.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    // ── REGISTER (direct, kept for backward compat) ──
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    // ── SEND OTP ──
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {

        String email = body.get("email");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered!");
        }

        // Generate 6-digit OTP
        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);

        OtpStorage.otpMap.put(email, otp);

        emailService.sendOtp(email, otp);

        return ResponseEntity.ok("OTP Sent");
    }

    // ── VERIFY OTP + REGISTER ──
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {

        String email    = body.get("email");
        String otp      = body.get("otp");
        String storedOtp = OtpStorage.otpMap.get(email);

        if (storedOtp == null || !storedOtp.equals(otp)) {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid or expired OTP");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered!");
        }

        User user = new User();
        user.setUsername(body.get("username"));
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(body.get("password")));
        userRepository.save(user);

        OtpStorage.otpMap.remove(email);

        return ResponseEntity.ok("Registration Successful");
    }

    // ── LOGIN ──
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found!");
        }

        boolean passwordMatch = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword());

        if (passwordMatch) {
            String token = JwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(token);
        }

        return ResponseEntity.badRequest().body("Invalid password!");
    }
}