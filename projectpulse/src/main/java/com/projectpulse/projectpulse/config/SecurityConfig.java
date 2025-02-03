package com.projectpulse.projectpulse.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @SuppressWarnings("squid:S5122") // CSRF is intentionally disabled due to stateless API design
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF for stateless API
                .authorizeHttpRequests(auth -> auth
                        // Allow Jira-related API endpoints without authentication
                        .requestMatchers(
                                "/jira/project",
                                "/jira/project/{projectId}",
                                "/projects/{projectId}/issues",
                                "/jira/project/{projectId}/issues",
                                "/jira/issue/{issueId}",
                                "/jira/issue/create",
                                "/jira/issue/update/{issueId}",
                                "/jira/issue/delete/{issueId}",
                                "/api/jira/**",
                                "/api/dialogflow",
                                "/webhook"// Allow all Jira API calls (if using proxy)
                        ).permitAll()

                        // Secure all other endpoints
                        .anyRequest().authenticated()
                )
                .httpBasic(basic -> {}); // Enable Basic Authentication

        return http.build();
    }
}
