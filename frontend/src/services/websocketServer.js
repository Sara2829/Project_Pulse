import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';  // Updated import for WebSocket
import bodyParser from 'body-parser';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });  // Use WebSocketServer instead of WebSocket.Server

app.use(bodyParser.json());  // To parse JSON payload from JIRA webhook

// Handle JIRA Webhook POST request
app.post('/webhook', (req, res) => {
  const issueUpdate = req.body; // JIRA webhook sends the issue update here
  console.log('Received webhook data from JIRA:', issueUpdate);

  // Forward this update to WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(issueUpdate)); // Send issue data to the frontend
    }
  });

  res.sendStatus(200); // Respond with success
});

// WebSocket connection logic
wss.on('connection', (ws) => {
  console.log('Client connected');
});

server.listen(3001, () => {
  console.log('Server is running on https://localhost:3001');
});
