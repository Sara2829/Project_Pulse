package com.projectpulse.projectpulse.controller;

import com.projectpulse.projectpulse.service.JiraService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jira")
public class JiraController {

    private final JiraService jiraService;

    public JiraController(JiraService jiraService) {
        this.jiraService = jiraService;
    }

    /**
     * Get all Jira projects.
     */
    @GetMapping("/projects")
    public ResponseEntity<String> getAllProjects() {
        try {
            return jiraService.getAllProjects();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching Jira projects: " + e.getMessage());
        }
    }

    /**
     * Get issues for a specific Jira project by project ID.
     */
    @GetMapping("/projects/{projectId}/issues")
    public ResponseEntity<String> getProjectIssues(@PathVariable String projectId) {
        try {
            return jiraService.getProjectIssues(projectId);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching project issues: " + e.getMessage());
        }
    }
    @PostMapping("/projects/{projectId}/issues")
    public ResponseEntity<String> createJiraIssue(
            @RequestParam String projectId,
            @RequestParam String issueTypeId,
            @RequestParam String summary,
            @RequestParam String description) {

        return jiraService.createJiraIssue(projectId, issueTypeId, summary, description);
    }
}
