package com.projectpulse.projectpulse.service;

import com.projectpulse.projectpulse.config.JiraConfig;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class JiraService {

    private final RestTemplate restTemplate;
    private final HttpHeaders jiraHeaders;
    private final String jiraBaseUrl;

    public JiraService(JiraConfig jiraConfig) {
        this.restTemplate = new RestTemplate();
        this.jiraHeaders = jiraConfig.jiraHeaders();
        this.jiraBaseUrl = jiraConfig.jiraBaseUrl();
    }

    /**
     * Fetches all Jira projects.
     */
    public ResponseEntity<String> getAllProjects() {
        String url = jiraBaseUrl + "/rest/api/3/project";

        HttpEntity<String> entity = new HttpEntity<>(jiraHeaders);
        return restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
    }

    /**
     * Fetches all issues for a specific Jira project.
     */
    public ResponseEntity<String> getProjectIssues(String projectId) {
        String url = jiraBaseUrl + "/rest/api/3/search?jql=project=" + projectId;

        HttpEntity<String> entity = new HttpEntity<>(jiraHeaders);
        return restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
    }



}
