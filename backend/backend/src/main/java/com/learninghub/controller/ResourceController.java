package com.learninghub.controller;

import com.learninghub.entity.Resource;
import com.learninghub.repository.ResourceRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin("*")

public class ResourceController {

    @Autowired
    private ResourceRepository resourceRepository;

    @GetMapping("/{pathId}")
    public List<Resource> getResources(
            @PathVariable Long pathId
    ) {

        return resourceRepository.findByLearningPathId(pathId);
    }
}