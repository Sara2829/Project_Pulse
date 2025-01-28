import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  useTheme,
  Card,
  CardContent,
  CardMedia,
  Fade,
  Grow,
  alpha,
  IconButton,
  Slide,
  Button,
} from "@mui/material";
import ScrumList from "./ScrumList";
import { fetchProjects } from "../services/jiraApi";
import ChatIcon from "@mui/icons-material/Chat";
import Chatbot from "./Chatbot"; // Import the Chatbot component

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDashboard, setOpenDashboard] = useState(false); // For controlling open/close
  const [openChatbot, setOpenChatbot] = useState(false); // For controlling Chatbot visibility
  const theme = useTheme();

  useEffect(() => {
    const getProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    getProjects();
  }, []);

  const handleOpenChatbot = () => {
    setOpenChatbot(true); // Open Chatbot
  };

  const handleCloseChatbot = () => {
    setOpenChatbot(false); // Close Chatbot
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background:
          theme.palette.mode === "dark"
            ? theme.palette.background.default
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)} 0%, ${alpha(
                theme.palette.secondary.light,
                0.2
              )} 100%)`,
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          p: 4,
          background:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.background.paper, 0.8)
              : alpha(theme.palette.common.white, 0.9),
          backdropFilter: "blur(10px)",
          boxShadow: theme.shadows[2],
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            letterSpacing: 2,
            color:
              theme.palette.mode === "dark"
                ? theme.palette.primary.contrastText
                : theme.palette.primary.dark,
            textAlign: "center",
          }}
        >
          Jira Projects
          <Typography
            variant="subtitle1"
            sx={{
              mt: 1,
              color: theme.palette.text.secondary,
              letterSpacing: 1,
            }}
          >
            Active Projects Overview
          </Typography>
        </Typography>
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          p: 4,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <Fade in={loading}>
              <Box sx={{ textAlign: "center" }}>
                <CircularProgress
                  size={60}
                  thickness={4}
                  sx={{
                    color: theme.palette.primary.main,
                    animationDuration: "800ms",
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    mt: 2,
                    color: theme.palette.text.secondary,
                    fontStyle: "italic",
                  }}
                >
                  Loading your workspace...
                </Typography>
              </Box>
            </Fade>
          </Box>
        ) : (
          <Grid container spacing={4} sx={{ flex: 1 }}>
            {projects.map((project, index) => (
              <Grow in={!loading} key={project.id} timeout={(index + 1) * 300}>
                <Grid item xs={12} sm={6} lg={4} xl={3}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: theme.shadows[6],
                      },
                      background: theme.palette.background.paper,
                      borderRadius: 4,
                      overflow: "visible",
                      position: "relative",
                      minHeight: 300,
                      border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    }}
                  >
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        {project.avatarUrl && (
                          <CardMedia
                            component="img"
                            image={project.avatarUrl}
                            sx={{
                              width: 56,
                              height: 56,
                              borderRadius: 2,
                              boxShadow: theme.shadows[2],
                            }}
                          />
                        )}
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                            {project.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: "0.8rem",
                            }}
                          >
                            {project.key}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <ScrumList project={project} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grow>
            ))}
          </Grid>
        )}

        {!loading && projects.length === 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              textAlign: "center",
              py: 8,
              color: theme.palette.text.secondary,
            }}
          >
            <Typography variant="h4" sx={{ mb: 2 }}>
              No Projects Found
            </Typography>
            <Typography variant="body1">
              Create a new project or check your connection to Jira
            </Typography>
          </Box>
        )}
      </Box>

      {/* Chatbot */}
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 380,
          height: 600,
          backgroundColor: "#fff",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
          zIndex: 20,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "1.5rem",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ margin: 0, fontWeight: 600, fontSize: "1.3rem" }}>AI Assistant</h3>
            <p style={{ margin: "0.3rem 0 0", opacity: 0.9, fontSize: "0.85rem" }}>
              Powered by GPT
            </p>
          </div>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1.5rem",
              background: "linear-gradient(to bottom right, #f8f9ff, #f6f6f6)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Chatbot Messages */}
              {messages.map((message, index) => (
                <div
                  key={index}
                  style={{
                    maxWidth: "75%",
                    padding: "0.8rem 1.2rem",
                    borderRadius: "1.2rem",
                    lineHeight: 1.4,
                    animation: "messageFade 0.3s ease-out",
                    fontSize: "0.95rem",
                    ...(message.role === "user" ? { background: "#667eea", color: "white" } : { background: "#fff", color: "#2d3748" }),
                  }}
                >
                  {message.content}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              padding: "1rem",
              background: "white",
              borderTop: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              style={{
                flex: 1,
                padding: "0.8rem 1.2rem",
                border: "none",
                borderRadius: "2rem",
                background: "#f8f9ff",
                fontSize: "0.95rem",
                marginRight: "0.8rem",
                outline: "none",
                color: "#1a1a1a",
              }}
              placeholder="Type your message..."
            />
            <button
              style={{
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                color: "white",
                border: "2px solid rgba(255, 255, 255, 0.2)",
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(124, 58, 237, 0.3)",
              }}
              onClick={handleSendMessage}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      </Box>

      {/* Button to toggle chatbot visibility */}
      <IconButton
        sx={{
          position: "fixed",
          bottom: 20,
          right: 100,
          backgroundColor: "#7c3aed",
          color: "white",
          borderRadius: "50%",
          padding: "10px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          "&:hover": {
            backgroundColor: "#6d28d9",
          },
        }}
        onClick={handleOpenChatbot}
      >
        <ChatIcon />
      </IconButton>
    </Box>
  );
};

export default Dashboard;
