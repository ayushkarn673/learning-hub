package com.learninghub.repository;

import com.learninghub.entity.LearningPath;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface LearningPathRepository extends JpaRepository<LearningPath, Long> {
    @Query("SELECT lp FROM LearningPath lp WHERE lp.user.id = :userId OR lp.user IS NULL")
    List<LearningPath> findByUserIdOrUserIsNull(@Param("userId") Long userId);
}

