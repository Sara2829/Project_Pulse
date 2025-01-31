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
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { fetchProjectDetails, fetchProjectIssues } from "../services/jiraApi";

const ProjectDashboard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState(null);

  // State for the create issue dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [newIssue, setNewIssue] = useState({
    summary: "",
    description: "",
    issueTypeId: "10001", // Default to Task
  });
  // Add below the existing dialog state
  const [editingIssue, setEditingIssue] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

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
  }, [projectId]);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleChange = (e) => {
    setNewIssue({ ...newIssue, [e.target.name]: e.target.value });
  };

  const handleCreateIssue = async () => {
    try {
      const url = `http://localhost:8080/api/jira/projects/10000/issues?projectId=10000&issueTypeId=${
        newIssue.issueTypeId
      }&summary=${encodeURIComponent(
        newIssue.summary
      )}&description=${encodeURIComponent(newIssue.description)}`;

      const response = await fetch(url, { method: "POST" });

      if (!response.ok) throw new Error("Failed to create issue");

      const createdIssue = await response.json();
      setIssues([...issues, createdIssue]); // Add new issue to the list
      handleCloseDialog();
    } catch (error) {
      console.error("Error creating issue:", error);
    }
  };
  // Add above handleCreateIssue
  const handleEditOpen = (issue) => {
    setEditingIssue(issue);
    setOpenEditDialog(true);
  };

  const handleEditChange = (e) => {
    setEditingIssue({
      ...editingIssue,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateIssue = async () => {
    try {
      const url = `http://localhost:8080/api/jira/update-issue/${
        editingIssue.id
      }?projectId=${projectId}&issueIdOrKey=${
        editingIssue.id
      }&summary=${encodeURIComponent(
        editingIssue.summary
      )}&description=${encodeURIComponent(editingIssue.description)}`;

      const response = await fetch(url, { method: "PUT" });

      if (!response.ok) throw new Error("Failed to update issue");

      // Update local state
      setIssues(
        issues.map((issue) =>
          issue.id === editingIssue.id ? editingIssue : issue
        )
      );

      setOpenEditDialog(false);
      setEditingIssue(null);
    } catch (error) {
      console.error("Error updating issue:", error);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "default"; // Handle undefined status
    const statusColors = {
      done: "success",
      "in progress": "warning",
      todo: "secondary",
      backlog: "info",
    };
    return statusColors[status.toLowerCase()] || "default";
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!project) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h4">Project not found</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          theme.palette.mode === "dark"
            ? theme.palette.background.default
            : alpha(theme.palette.primary.light, 0.1),
        p: 4,
      }}
    >
      <IconButton
        onClick={() => navigate(-1)}
        sx={{ mb: 2, color: theme.palette.text.primary }}
      >
        <ArrowBackIcon fontSize="large" />
      </IconButton>

      <Grid container spacing={4}>
        {/* Project Overview Section */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: "blur(10px)",
              borderRadius: 4,
            }}
          >
            <CardContent>
              <Typography variant="h3" gutterBottom>
                {project?.name || "Unknown Project"}
              </Typography>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                gutterBottom
              >
                Project Key: {project?.key || "N/A"}
              </Typography>
              <Typography variant="body1" paragraph>
                {project?.description || "No description available"}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h6" align="center">
                    {issues.length}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    align="center"
                    color="textSecondary"
                  >
                    Total Issues
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" align="center">
                    {project?.lead?.displayName || "N/A"}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    align="center"
                    color="textSecondary"
                  >
                    Project Lead
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Issues Section */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              background: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: "blur(10px)",
              borderRadius: 4,
            }}
          >
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Recent Issues
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenDialog}
                sx={{ mb: 2 }}
              >
                Create Issue
              </Button>
              <List sx={{ maxHeight: 600, overflow: "auto" }}>
                {issues.length === 0 ? (
                  <Typography variant="body1" color="textSecondary">
                    No issues found for this project
                  </Typography>
                ) : (
                  issues.map((issue) => (
                    <React.Fragment key={issue.id}>
                      <ListItem>
                        <ListItemText
                          // Modify the ListItemText's primary prop to include the Edit button
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Chip
                                label={issue.status}
                                color={getStatusColor(issue.status)}
                                size="small"
                              />
                              <Typography variant="body1">
                                {issue.key}: {issue.summary}
                              </Typography>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditOpen(issue);
                                }}
                                sx={{ ml: "auto" }}
                              >
                                Edit
                              </Button>
                            </Box>
                          }
                          secondary={`Created by: ${
                            issue.creator?.displayName || "Unknown"
                          }`}
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

      {/* Create Issue Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Create New Issue</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Summary"
            name="summary"
            value={newIssue.summary}
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={newIssue.description}
            onChange={handleChange}
            margin="dense"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            select
            label="Issue Type"
            name="issueTypeId"
            value={newIssue.issueTypeId}
            onChange={handleChange}
            margin="dense"
          >
            <MenuItem value="10001">Task</MenuItem>
            <MenuItem value="10002">Bug</MenuItem>
            <MenuItem value="10003">Story</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {isEditing ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateIssue}
            >
              Update
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateIssue}
            >
              Create
            </Button>
          )}
        </DialogActions>
      </Dialog>
      {/* Add below the Create Issue Dialog */}
<Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
  <DialogTitle>Edit Issue</DialogTitle>
  <DialogContent>
    <TextField 
      fullWidth 
      label="Summary" 
      name="summary" 
      value={editingIssue?.summary || ""} 
      onChange={handleEditChange} 
      margin="dense" 
    />
    <TextField 
      fullWidth 
      label="Description" 
      name="description" 
      value={editingIssue?.description || ""} 
      onChange={handleEditChange} 
      margin="dense" 
      multiline 
      rows={3} 
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
    <Button variant="contained" color="primary" onClick={handleUpdateIssue}>
      Update
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
};

export default ProjectDashboard;
