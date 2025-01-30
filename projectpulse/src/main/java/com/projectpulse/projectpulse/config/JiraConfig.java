package com.projectpulse.projectpulse.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.Base64;

@Configuration
public class JiraConfig {

    @Value("${jira.base-url}")
    private String jiraBaseUrl;

    @Value("${jira.username}")
    private String username;

    @Value("${jira.api-token}")
    private String apiToken;

    @Bean
    public HttpHeaders jiraHeaders() {
        String auth = username + ":" + apiToken;
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.AUTHORIZATION, "Basic " + encodedAuth);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    @Bean
    public String jiraBaseUrl() {
        return jiraBaseUrl;
    }
}
