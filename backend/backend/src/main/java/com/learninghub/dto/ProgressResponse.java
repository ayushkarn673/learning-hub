package com.learninghub.dto;

public class ProgressResponse {

    private int totalNotes;

    private int completedNotes;

    private double completionPercentage;

    public ProgressResponse() {
    }

    public ProgressResponse(int totalNotes, int completedNotes, double completionPercentage) {
        this.totalNotes = totalNotes;
        this.completedNotes = completedNotes;
        this.completionPercentage = completionPercentage;
    }

    public int getTotalNotes() {
        return totalNotes;
    }

    public void setTotalNotes(int totalNotes) {
        this.totalNotes = totalNotes;
    }

    public int getCompletedNotes() {
        return completedNotes;
    }

    public void setCompletedNotes(int completedNotes) {
        this.completedNotes = completedNotes;
    }

    public double getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(double completionPercentage) {
        this.completionPercentage = completionPercentage;
    }
}
