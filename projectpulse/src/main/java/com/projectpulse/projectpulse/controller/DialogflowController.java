package com.projectpulse.projectpulse.controller;

import com.projectpulse.projectpulse.service.DialogflowService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dialogflow")
public class DialogflowController {

    private final DialogflowService dialogflowService;

    public DialogflowController(DialogflowService dialogflowService) {
        this.dialogflowService = dialogflowService;
    }

    /**
     * Handles webhook requests from Dialogflow.
     */
    @PostMapping("/webhook")
    public ResponseEntity<Map<String, String>> handleDialogflowWebhook(@RequestBody Map<String, Object> requestBody) {
        try {
            // Extract queryResult safely
            Map<String, Object> queryResult = (Map<String, Object>) requestBody.get("queryResult");

            // Extract intent
            Map<String, Object> intent = (Map<String, Object>) queryResult.get("intent");
            String intentName = (String) intent.get("displayName");

            // Extract parameters (if needed)
            Map<String, Object> parameters = (Map<String, Object>) queryResult.get("parameters");

            // Example logic
            String responseText = "Default response";
            if ("SampleIntent".equals(intentName)) {
                responseText = "Hello from SampleIntent!";
            }

            // Construct response
            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("fulfillmentText", responseText);

            return ResponseEntity.ok(responseMap);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("fulfillmentText", "Error processing request: " + e.getMessage()));
        }
    }

}
