package com.projectpulse.projectpulse.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import java.util.Map;

public interface JiraService {
    public ResponseEntity<String> getAllProjects();
    public ResponseEntity<String> getProjectIssues(String projectId);
    String updateIssue(String issueIdOrKey, Map<String, Object> updatePayload);

}
