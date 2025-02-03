package com.projectpulse.projectpulse.service.impl;

import com.projectpulse.projectpulse.service.DialogflowService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class DialogflowServiceImpl implements DialogflowService {

    @Override
    public ResponseEntity<String> handleWebhook(Map<String, Object> requestPayload) {
        try {
            // Extract intent and parameters from the Dialogflow request
            String intentName = (String) ((Map<String, Object>) requestPayload.get("queryResult")).get("intent");

            // Process intent and form a response
            String fulfillmentText = "Sorry, I didn't understand that request.";

            if ("SampleIntent".equals(intentName)) {
                fulfillmentText = "This is a response for SampleIntent.";
            }

            // Construct response
            Map<String, Object> response = Map.of("fulfillmentText", fulfillmentText);

            return ResponseEntity.ok().body(response.toString());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing Dialogflow request: " + e.getMessage());
        }
    }
}
