package com.projectpulse.projectpulse.service;

import org.springframework.http.ResponseEntity;

public interface JiraService {
    public ResponseEntity<String> getAllProjects();
    public ResponseEntity<String> getProjectIssues(String projectId);
}
