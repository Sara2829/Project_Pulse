package com.projectpulse.projectpulse.service;

import org.springframework.http.ResponseEntity;

public interface JiraService {
    ResponseEntity<String> getAllProjects();
    ResponseEntity<String> getProjectIssues(String projectId);
    ResponseEntity<String> createJiraIssue(String projectId, String issueTypeId, String summary, String description);
}
