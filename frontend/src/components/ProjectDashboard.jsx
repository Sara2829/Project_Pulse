import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Grid, 
  useTheme,
  Card,
  CardContent,
  IconButton,
  alpha,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {fetchProjects, fetchProjectDetails, fetchProjectIssues } from "../services/jiraApi";

const ProjectDashboard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProjectData = async () => {
      try {
        const [projectData, issuesData] = await Promise.all([
          fetchProjectDetails(projectId),
          fetchProjectIssues(projectId),
        ]);
        setProject(projectData);
        setIssues(issuesData);
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };
  
    getProjectData();
  
    // WebSocket connection
    const socket = new WebSocket("ws://localhost:3001");
  
    socket.onopen = () => {
      console.log("WebSocket connected");
  
      // Optionally, send the project ID to filter updates for this project
      socket.send(JSON.stringify({ projectId }));
    };
  
    socket.onmessage = (event) => {
      const updatedIssue = JSON.parse(event.data);
  
      // Update the issues state with the new/updated issue
      setIssues((prevIssues) => {
        const existingIndex = prevIssues.findIndex(
          (issue) => issue.id === updatedIssue.id
        );
  
        if (existingIndex !== -1) {
          // Update existing issue
          const updatedIssues = [...prevIssues];
          updatedIssues[existingIndex] = updatedIssue;
          return updatedIssues;
        }
  
        // Add new issue
        return [...prevIssues, updatedIssue];
      });
    };
  
    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };
  
    return () => {
      socket.close();
    };
  }, [projectId]);
  

  const getStatusColor = (status) => {
    const statusColors = {
      'done': 'success',
      'in progress': 'warning',
      'todo': 'secondary',
      'backlog': 'info'
    };
    return statusColors[status.toLowerCase()] || 'default';
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!project) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh'
      }}>
        <Typography variant="h4">Project not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: theme.palette.mode === 'dark' 
        ? theme.palette.background.default 
        : alpha(theme.palette.primary.light, 0.1),
      p: 4
    }}>
      <IconButton 
        onClick={() => navigate(-1)}
        sx={{ mb: 2, color: theme.palette.text.primary }}
      >
        <ArrowBackIcon fontSize="large" />
      </IconButton>

      <Grid container spacing={4}>
        {/* Project Overview Section */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
            borderRadius: 4
          }}>
            <CardContent>
              <Typography variant="h3" gutterBottom>
                {project.name}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Project Key: {project.key}
              </Typography>
              <Typography variant="body1" paragraph>
                {project.description || 'No description available'}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h6" align="center">
                    {issues.length}
                  </Typography>
                  <Typography variant="subtitle2" align="center" color="textSecondary">
                    Total Issues
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" align="center">
                    {project.lead?.displayName || 'N/A'}
                  </Typography>
                  <Typography variant="subtitle2" align="center" color="textSecondary">
                    Project Lead
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Issues Section */}
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            background: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
            borderRadius: 4
          }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Recent Issues
              </Typography>
              <List sx={{ maxHeight: 600, overflow: 'auto' }}>
                {issues.length === 0 ? (
                  <Typography variant="body1" color="textSecondary">
                    No issues found for this project
                  </Typography>
                ) : (
                  issues.map((issue) => (
                    <React.Fragment key={issue.id}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Chip 
                                label={issue.status.toUpperCase()} 
                                color={getStatusColor(issue.status)}
                                size="small"
                              />
                              <Typography variant="body1">
                                {issue.key}: {issue.summary}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="textSecondary"
                              >
                                Created by: {issue.creator?.displayName || 'Unknown'}
                              </Typography>
                              <br />
                              <Typography
                                component="span"
                                variant="body2"
                                color="textSecondary"
                              >
                                Priority: {issue.priority}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

ProjectDashboard.propTypes = {
  // Add prop types if needed
};

export default ProjectDashboard;