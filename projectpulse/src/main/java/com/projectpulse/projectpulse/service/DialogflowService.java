package com.projectpulse.projectpulse.service;

import org.springframework.http.ResponseEntity;
import java.util.Map;

public interface DialogflowService {
    ResponseEntity<String> handleWebhook(Map<String, Object> requestPayload);
}
