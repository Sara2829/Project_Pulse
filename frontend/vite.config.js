import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/jira-api': {
        target: 'https://airtransportmanagement.atlassian.net', // Jira API base URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/jira-api/, ''), // Remove the /jira-api prefix
        secure: false,  // Set to false if SSL issues occur
      },
    },
  },
})
