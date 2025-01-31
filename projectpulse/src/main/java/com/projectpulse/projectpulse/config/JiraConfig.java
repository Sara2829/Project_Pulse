package com.projectpulse.projectpulse.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Configuration
public class JiraConfig {

    @Value("${jira.base-url}")
    private String jiraBaseUrl;

    @Value("${jira.username}")
    private String jiraUsername;

    @Value("${jira.api-token}")
    private String jiraApiToken;

    /**
     * Configures HTTP headers for Jira API requests, ensuring proper authentication.
     */
    @Bean
    public HttpHeaders jiraHeaders() {
        HttpHeaders headers = new HttpHeaders();

        // Encode username and API token in Base64 for Basic Authentication
        String auth = jiraUsername + ":" + jiraApiToken;
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));

        headers.set(HttpHeaders.AUTHORIZATION, "Basic " + encodedAuth);
        headers.setContentType(MediaType.APPLICATION_JSON);

        return headers;
    }

    /**
     * Returns Jira Base URL for API requests.
     */
    @Bean
    public String jiraBaseUrl() {
        return jiraBaseUrl;
    }
}
