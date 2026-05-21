package com.learninghub.repository;

import com.learninghub.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository
        extends JpaRepository<Note, Long> {

    List<Note> findByLearningPathId(Long pathId);

long countByLearningPathId(Long pathId);

long countByLearningPathIdAndStatus(
        Long pathId,
        String status
);}