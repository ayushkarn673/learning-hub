package com.learninghub.controller;

import com.learninghub.dto.PathRequest;
import com.learninghub.entity.LearningPath;
import com.learninghub.repository.LearningPathRepository;

import com.learninghub.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import com.learninghub.service.RecommendationService;
@RestController
@RequestMapping("/api/paths")
@CrossOrigin("*")

public class PathController {

    @Autowired
    private LearningPathRepository learningPathRepository;

    @Autowired
    private UserRepository userRepository;

    // CREATE PATH
    @PostMapping
    public LearningPath createPath(
            @RequestBody PathRequest request
    ) {

        LearningPath path = new LearningPath();

        path.setTitle(request.getTitle());
        path.setDescription(request.getDescription());
        path.setCreatedAt(LocalDateTime.now());

        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        if (email != null && !email.equals("anonymousUser")) {
            com.learninghub.entity.User user = userRepository.findByEmail(email).orElse(null);
            path.setUser(user);
        }

        LearningPath savedPath =
        learningPathRepository.save(path);

recommendationService.generateResources(savedPath);

return savedPath;
    }

    // GET ALL PATHS
    @GetMapping
    public List<LearningPath> getAllPaths() {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        if (email != null && !email.equals("anonymousUser")) {
            com.learninghub.entity.User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                return learningPathRepository.findByUserIdOrUserIsNull(user.getId());
            }
        }
        return learningPathRepository.findAll();
    }

    // GET SINGLE PATH
    @GetMapping("/{id}")
    public LearningPath getPathById(@PathVariable Long id) {
        return learningPathRepository.findById(id).orElse(null);
    }

    // DELETE PATH
    @DeleteMapping("/{id}")
    public String deletePath(@PathVariable Long id) {

        learningPathRepository.deleteById(id);

        return "Path deleted successfully!";
    }
    @Autowired
private RecommendationService recommendationService;
}