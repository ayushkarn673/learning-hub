package com.learninghub.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "resources")

public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String url;

    private String type;

    @ManyToOne
    @JoinColumn(name = "path_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private LearningPath learningPath;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LearningPath getLearningPath() {
        return learningPath;
    }

    public void setLearningPath(LearningPath learningPath) {
        this.learningPath = learningPath;
    }
}