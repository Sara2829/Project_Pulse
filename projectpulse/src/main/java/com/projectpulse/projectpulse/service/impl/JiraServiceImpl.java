package com.projectpulse.projectpulse.service.impl;
import org.springframework.web.reactive.function.client.WebClient;
import com.projectpulse.projectpulse.config.JiraConfig;
import com.projectpulse.projectpulse.service.JiraService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.Base64;
import java.util.Map;

@Service
public class JiraServiceImpl implements JiraService {

    private final RestTemplate restTemplate;
    private final HttpHeaders jiraHeaders;
    private final String jiraBaseUrl;
    private final ObjectMapper objectMapper;
    private final WebClient webClient;


    @Value("${jira.username}")
    private String username;

    @Value("${jira.api-token}")
    private String apiToken;


    public JiraServiceImpl(JiraConfig jiraConfig, WebClient webClient) {
        this.webClient = webClient;
        this.restTemplate = new RestTemplate();
        this.jiraHeaders = jiraConfig.jiraHeaders();
        this.jiraBaseUrl = jiraConfig.jiraBaseUrl();
        this.objectMapper = new ObjectMapper();

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



    //    /Edit  Issue method
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

    private String getBase64Auth() {
        String credentials = username + ":" + apiToken;
        return Base64.getEncoder().encodeToString(credentials.getBytes());
    }


    @Override
    public ResponseEntity<String> createJiraIssue(String projectId, String issueTypeId, String summary, String description) {
        String url = jiraBaseUrl + "/rest/api/3/issue";

        JsonNodeFactory nodeFactory = JsonNodeFactory.instance;
        ObjectNode payload = nodeFactory.objectNode();
        ObjectNode fields = payload.putObject("fields");

        fields.putObject("project").put("id", projectId);
        fields.put("summary", summary);
        fields.putObject("issuetype").put("id", issueTypeId);

        ObjectNode descriptionNode = fields.putObject("description");
        descriptionNode.put("type", "doc");
        descriptionNode.put("version", 1);
        descriptionNode.putArray("content")
                .addObject()
                .put("type", "paragraph")
                .putArray("content")
                .addObject()
                .put("text", description)
                .put("type", "text");

        HttpEntity<String> entity = new HttpEntity<>(payload.toString(), jiraHeaders);
        return restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
    }
}