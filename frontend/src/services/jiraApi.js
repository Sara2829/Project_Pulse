import axios from "axios";

// Use the Vite proxy route to access Jira API
const API_BASE_URL = "/jira-api/rest/api/3"; // Proxy will handle this

const API_EMAIL = import.meta.env.VITE_JIRA_EMAIL;
const API_TOKEN = import.meta.env.VITE_JIRA_API_TOKEN;

const authHeader = `Basic ${btoa(`${API_EMAIL}:${API_TOKEN}`)}`;
console.log("authHeader:", authHeader);

// Fetch all projects
export const fetchProjects = async () => {
  const response = await axios.get(`${API_BASE_URL}/project`, {
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
  });

  return response.data.map((project) => ({
    id: project.id,
    key: project.key,
    name: project.name,
    avatarUrls: project.avatarUrls["48x48"],
  }));
};

// Fetch details of a specific project by projectId
export const fetchProjectDetails = async (projectId) => {
  const response = await axios.get(`${API_BASE_URL}/project/${projectId}`, {
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
  });

  return {
    id: response.data.id,
    key: response.data.key,
    name: response.data.name,
    description: response.data.description,
    lead: response.data.lead.displayName,
    avatarUrls: response.data.avatarUrls["48x48"],
  };
};

// Fetch all issues for a specific project by projectId
export const fetchProjectIssues = async (projectId) => {
  const jqlQuery = `project=${projectId}`;
  const response = await axios.get(`${API_BASE_URL}/search`, {
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    params: {
      jql: jqlQuery,
    },
  });

  return response.data.issues.map((issue) => ({
    id: issue.id,
    key: issue.key,
    summary: issue.fields.summary,
    status: issue.fields.status.name,
    assignee: issue.fields.assignee ? issue.fields.assignee.displayName : "Unassigned",
    reporter: issue.fields.reporter ? issue.fields.reporter.displayName : "Unknown",
  }));
};
