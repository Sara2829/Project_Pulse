package com.projectpulse.projectpulse.controller;

import com.projectpulse.projectpulse.service.JiraService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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
