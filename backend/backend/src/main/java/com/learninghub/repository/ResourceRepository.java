package com.learninghub.repository;

import com.learninghub.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResourceRepository
        extends JpaRepository<Resource, Long> {

    List<Resource> findByLearningPathId(Long pathId);
}