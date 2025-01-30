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
  alpha
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import ScrumList from "./ScrumList";
import { fetchProjects } from "../services/jiraApi";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const navigate = useNavigate(); // Initialize useNavigate

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

  const handleCardClick = (projectId) => {
    navigate(`/projectdashboard/${projectId}`); // Redirect to the ProjectDashboard page
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: theme.palette.mode === 'dark' 
        ? theme.palette.background.default 
        : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)} 0%, ${alpha(theme.palette.secondary.light, 0.2)} 100%)`,
    }}>
      {/* Header Section */}
      <Box sx={{
        p: 4,
        background: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.8) 
          : alpha(theme.palette.common.white, 0.9),
        backdropFilter: 'blur(10px)',
        boxShadow: theme.shadows[2],
        position: 'sticky',
        top: 0,
        zIndex: 1
      }}>
        <Typography 
          variant="h3" 
          sx={{
            fontWeight: 700,
            letterSpacing: 2,
            color: theme.palette.mode === 'dark' 
              ? theme.palette.primary.contrastText 
              : theme.palette.primary.dark,
            textAlign: 'center'
          }}
        >
          Jira Projects
          <Typography 
            variant="subtitle1" 
            sx={{ 
              mt: 1,
              color: theme.palette.text.secondary,
              letterSpacing: 1
            }}
          >
            Active Projects Overview
          </Typography>
        </Typography>
      </Box>

      {/* Main Content Area */}
      <Box sx={{
        flex: 1,
        p: 4,
        overflow: 'auto',
      }}>
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100%',
            width: '100%'
          }}>
            <Fade in={loading}>
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress 
                  size={60}
                  thickness={4}
                  sx={{ 
                    color: theme.palette.primary.main,
                    animationDuration: '800ms',
                  }}
                />
                <Typography 
                  variant="body1"
                  sx={{ 
                    mt: 2,
                    color: theme.palette.text.secondary,
                    fontStyle: 'italic'
                  }}
                >
                  Loading your workspace...
                </Typography>
              </Box>
            </Fade>
          </Box>
        ) : (
          <Grid 
            container 
            spacing={4}
          >
            {projects.map((project, index) => (
              <Grow 
                in={!loading}
                key={project.id}
                timeout={(index + 1) * 300}
              >
                <Grid item xs={12} sm={6} lg={4} xl={3}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: theme.shadows[6],
                        cursor: 'pointer',
                      },
                      background: theme.palette.background.paper,
                      borderRadius: 4,
                      overflow: 'visible',
                      position: 'relative',
                      minHeight: 300,
                      border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    }}
                    onClick={() => handleCardClick(project.id)} // Add click handler
                  >
                    <CardContent sx={{ 
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        mb: 2
                      }}>
                        {project.avatarUrl && (
                          <CardMedia
                            component="img"
                            image={project.avatarUrl}
                            sx={{ 
                              width: 56,
                              height: 56,
                              borderRadius: 2,
                              boxShadow: theme.shadows[2]
                            }}
                          />
                        )}
                        <Box>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 600,
                              lineHeight: 1.2
                            }}
                          >
                            {project.name}
                          </Typography>
                          <Typography 
                            variant="body2"
                            sx={{ 
                              color: theme.palette.text.secondary,
                              fontSize: '0.8rem'
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
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            textAlign: 'center', 
            py: 8,
            color: theme.palette.text.secondary
          }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              No Projects Found
            </Typography>
            <Typography variant="body1">
              Create a new project or check your connection to Jira
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
