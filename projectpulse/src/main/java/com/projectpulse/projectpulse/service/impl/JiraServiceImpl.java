package com.projectpulse.projectpulse.service.impl;

import com.projectpulse.projectpulse.service.JiraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class JiraServiceImpl implements JiraService {

    private final RestTemplate restTemplate;
    private final HttpHeaders jiraHeaders;
    private final String jiraBaseUrl;

    @Autowired
    public JiraServiceImpl(RestTemplate restTemplate, HttpHeaders jiraHeaders, String jiraBaseUrl) {
        this.restTemplate = restTemplate;
        this.jiraHeaders = jiraHeaders;
        this.jiraBaseUrl = jiraBaseUrl;
    }

    /**
     * Fetches all Jira projects.
     */
    @Override
    public ResponseEntity<String> getAllProjects() {
        String url = jiraBaseUrl + "/rest/api/3/project";

        HttpEntity<String> entity = new HttpEntity<>(jiraHeaders);
        return restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
    }

    /**
     * Fetches all issues for a specific Jira project.
     */
    @Override
    public ResponseEntity<String> getProjectIssues(String projectId) {
        String url = jiraBaseUrl + "/rest/api/3/search?jql=project=" + projectId;

        HttpEntity<String> entity = new HttpEntity<>(jiraHeaders);
        return restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
    }
}
