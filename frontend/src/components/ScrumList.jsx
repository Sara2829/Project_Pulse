import React from "react";
import { Card, CardContent, Typography, Avatar } from "@mui/material";

const ScrumList = ({ project }) => {
  return (
    <Card>
      <CardContent>
        <Avatar src={project.avatarUrls} alt={project.name} />
        <Typography variant="h6">{project.name}</Typography>
        <Typography variant="body2">Key: {project.key}</Typography>
      </CardContent>
    </Card>
  );
};

export default ScrumList;
