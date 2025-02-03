package com.projectpulse.projectpulse.service.impl;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectpulse.projectpulse.config.JiraConfig;
import com.projectpulse.projectpulse.service.JiraService;

import java.util.Base64;
import java.util.List;
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
     * Fetches all Jira projects using WebClient for asynchronous/non-blocking calls.
     */
    public ResponseEntity<String> getAllProjects() {
        String url = jiraBaseUrl + "/rest/api/3/project";

        try {
            // Send GET request using WebClient
            String response = webClient.get()
                    .uri(url)
                    .headers(headers -> headers.addAll(jiraHeaders))
                    .retrieve()
                    .bodyToMono(String.class)  // Get response body as a string
                    .block();  // Block to wait for the response in this example (to keep it synchronous)

            // Check if response is null or empty
            if (response == null || response.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No Jira projects found.");
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Log the exception (you can replace this with a proper logging framework)
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching Jira projects: " + e.getMessage());
        }
    }

    /**
     * Fetches all issues for a specific Jira project.
     */
    public ResponseEntity<String> getProjectIssues(String projectId) {
        String url = jiraBaseUrl + "/rest/api/3/search?jql=project=" + projectId;

        HttpEntity<String> entity = new HttpEntity<>(jiraHeaders);
        return restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
    }

    // Edit Issue method
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

        JsonNode payload = objectMapper.createObjectNode();
        JsonNode fields = ((ObjectNode) payload).putObject("fields");

        ((ObjectNode) fields).putObject("project").put("id", projectId);
        ((ObjectNode) fields).put("summary", summary);
        ((ObjectNode) fields).putObject("issuetype").put("id", issueTypeId);

        ObjectNode descriptionNode = ((ObjectNode) fields).putObject("description");
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
