package com.projectpulse.projectpulse.controller;

import com.projectpulse.projectpulse.service.impl.JiraServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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


}
