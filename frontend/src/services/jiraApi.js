import axios from "axios";

// Use the Vite proxy route to access Jira API
const API_BASE_URL = "/jira-api/rest/api/3";  // Proxy will handle this

const API_EMAIL = import.meta.env.VITE_JIRA_EMAIL;
const API_TOKEN = import.meta.env.VITE_JIRA_API_TOKEN;

const authHeader = `Basic ${btoa(`${API_EMAIL}:${API_TOKEN}`)}`;
console.log("authHeader:", authHeader);

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
