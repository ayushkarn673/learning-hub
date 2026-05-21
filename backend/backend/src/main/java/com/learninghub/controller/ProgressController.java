package com.learninghub.controller;

import com.learninghub.dto.ProgressResponse;
import com.learninghub.repository.NoteRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin("*")

public class ProgressController {

    @Autowired
    private NoteRepository noteRepository;

    @GetMapping("/{pathId}")
    public ProgressResponse getProgress(
            @PathVariable Long pathId
    ) {

        long total =
                noteRepository.countByLearningPathId(pathId);

        long completed =
                noteRepository
                        .countByLearningPathIdAndStatus(
                                pathId,
                                "done"
                        );

        double percentage = 0;

        if(total > 0) {
            percentage =
                    ((double) completed / total) * 100;
        }

        return new ProgressResponse(
                (int) total,
                (int) completed,
                percentage
        );
    }
}