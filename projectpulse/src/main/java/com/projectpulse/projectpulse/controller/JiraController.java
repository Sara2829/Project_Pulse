package com.projectpulse.projectpulse.controller;

import com.projectpulse.projectpulse.service.JiraService;
import com.projectpulse.projectpulse.service.impl.JiraServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/api/jira")
public class JiraController {

    private final JiraServiceImpl jiraService;

    public JiraController(JiraServiceImpl jiraService) {
        this.jiraService = jiraService;
    }

    /**
     * Get all Jira projects.
     */
    @GetMapping("/projects")
    public ResponseEntity<String> getAllProjects() {
        return jiraService.getAllProjects();
    }

    /**
     * Get issues for a specific Jira project.
     */
    @GetMapping("/projects/{projectId}/issues")
    public ResponseEntity<String> getProjectIssues(@PathVariable String projectId) {
        return jiraService.getProjectIssues(projectId);
    }

    @PutMapping("/update-issue/{issueIdOrKey}")
    public ResponseEntity<String> updateIssue(
            @PathVariable String issueIdOrKey,
            @RequestBody Map<String, Object> updatePayload) {

        String response = jiraService.updateIssue(issueIdOrKey, updatePayload);
        return ResponseEntity.ok(response);
    }



}
