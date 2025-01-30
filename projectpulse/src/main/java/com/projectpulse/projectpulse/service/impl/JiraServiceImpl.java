package com.projectpulse.projectpulse.service.impl;

import com.projectpulse.projectpulse.service.JiraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.Base64;
import java.util.Map;
import java.util.Collections;

@Service
public class JiraServiceImpl implements JiraService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    private final RestTemplate restTemplate;
    private final HttpHeaders jiraHeaders;
    private final String jiraBaseUrl;
    @Value("${jira.api.url}")
    private String jiraApiUrl;

    @Value("${jira.username}")
    private String jiraUsername;

    @Value("${jira.api.token}")
    private String jiraApiToken;

    @Autowired
    public JiraServiceImpl(RestTemplate restTemplate, HttpHeaders jiraHeaders, String jiraBaseUrl,WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.jiraHeaders = jiraHeaders;
        this.jiraBaseUrl = jiraBaseUrl;
        this.webClient = webClientBuilder.baseUrl(jiraApiToken).build();
        this.objectMapper = objectMapper;
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

    @Override
    public String updateIssue(String issueIdOrKey, Map<String, Object> updatePayload) {
        String authHeader = "Basic " + getBase64Auth();

        try {
            // Convert payload map to JSON string
            String requestBody = objectMapper.writeValueAsString(updatePayload);

            return webClient.put()
                    .uri("/rest/api/3/issue/" + issueIdOrKey)
                    .header(HttpHeaders.AUTHORIZATION, authHeader)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block(); // Blocking call to get response synchronously
        } catch (Exception e) {
            e.printStackTrace();
            return "Error updating Jira issue: " + e.getMessage();
        }
    }

    // Fix: Implement getBase64Auth()
    private String getBase64Auth() {
        String credentials = jiraUsername + ":" + jiraApiToken;
        return Base64.getEncoder().encodeToString(credentials.getBytes());
    }
}


