import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Chatbot from "./components/Chatbot";
import ProjectDashboard from "./components/ProjectDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/projectdashboard/:projectId" element={<ProjectDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
