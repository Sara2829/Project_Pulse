package com.projectpulse.projectpulse.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface JiraService {
    ResponseEntity<String> getAllProjects();
    ResponseEntity<String> getProjectIssues(String projectId);
    public ResponseEntity<String> updateJiraIssue(String projectId,String issueIdOrKey, String summary, String description);
    ResponseEntity<String> createJiraIssue(String projectId, String issueTypeId, String summary, String description);
}
