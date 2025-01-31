package com.projectpulse.projectpulse.service.impl;
import com.fasterxml.jackson.databind.node.ArrayNode;
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


    @Override
    public ResponseEntity<String> updateJiraIssue(String projectId, String issueIdOrKey, String summary, String description) {

        String modifiedIssueIdOrKey;
        try {
            int issueId = Integer.parseInt(issueIdOrKey);
            modifiedIssueIdOrKey = String.valueOf(issueId - 1);
        } catch (NumberFormatException e) {
            modifiedIssueIdOrKey = issueIdOrKey;
        }

        String url = jiraBaseUrl + "/rest/api/3/issue/" + modifiedIssueIdOrKey;

        JsonNodeFactory nodeFactory = JsonNodeFactory.instance;
        ObjectNode payload = nodeFactory.objectNode();
        ObjectNode fields = payload.putObject("fields");

        fields.put("summary", summary);

        ObjectNode descriptionNode = fields.putObject("description");
        descriptionNode.put("type", "doc");
        descriptionNode.put("version", 1);

        ArrayNode contentArray = descriptionNode.putArray("content");
        ObjectNode paragraph = contentArray.addObject();
        paragraph.put("type", "paragraph");

        ArrayNode paragraphContent = paragraph.putArray("content");
        ObjectNode textNode = paragraphContent.addObject();
        textNode.put("text", description);
        textNode.put("type", "text");

        HttpEntity<String> entity = new HttpEntity<>(payload.toString(), jiraHeaders);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.PUT, entity, String.class);

        return response;
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