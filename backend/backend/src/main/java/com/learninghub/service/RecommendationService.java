package com.learninghub.service;

import com.learninghub.entity.LearningPath;
import com.learninghub.entity.Resource;
import com.learninghub.repository.ResourceRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RecommendationService {

    @Autowired
    private ResourceRepository resourceRepository;

    public void generateResources(
            LearningPath path
    ) {

        Resource youtube = new Resource();

        youtube.setTitle(
                path.getTitle() + " Full Course"
        );

        youtube.setUrl(
                "https://youtube.com"
        );

        youtube.setType("youtube");

        youtube.setLearningPath(path);

        resourceRepository.save(youtube);

        Resource article = new Resource();

        article.setTitle(
                path.getTitle() + " Roadmap"
        );

        article.setUrl(
                "https://dev.to"
        );

        article.setType("article");

        article.setLearningPath(path);

        resourceRepository.save(article);
    }
}