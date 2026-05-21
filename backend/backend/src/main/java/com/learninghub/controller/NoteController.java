package com.learninghub.controller;

import com.learninghub.dto.NoteRequest;
import com.learninghub.entity.LearningPath;
import com.learninghub.entity.Note;
import com.learninghub.repository.LearningPathRepository;
import com.learninghub.repository.NoteRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin("*")

public class NoteController {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private LearningPathRepository learningPathRepository;

    // CREATE NOTE
    @PostMapping
    public Note createNote(@RequestBody NoteRequest request) {

        LearningPath path =
                learningPathRepository
                        .findById(request.getPathId())
                        .orElseThrow();

        Note note = new Note();

        note.setTitle(request.getTitle());
        note.setContent(request.getContent());

        note.setStatus("pending");

        note.setLastReviewed(LocalDateTime.now());

        note.setLearningPath(path);

        return noteRepository.save(note);
    }

    // GET NOTES BY PATH ID
    @GetMapping("/path/{pathId}")
    public List<Note> getNotesByPath(
            @PathVariable Long pathId
    ) {

        return noteRepository.findByLearningPathId(pathId);
    }

    // MARK NOTE AS DONE
    @PutMapping("/{id}")
    public Note markAsDone(@PathVariable Long id) {

        Note note =
                noteRepository.findById(id).orElseThrow();

        note.setStatus("done");

        note.setLastReviewed(LocalDateTime.now());

        return noteRepository.save(note);
    }

    // DELETE NOTE
    @DeleteMapping("/{id}")
    public String deleteNote(@PathVariable Long id) {

        noteRepository.deleteById(id);

        return "Note deleted successfully!";
    }
}