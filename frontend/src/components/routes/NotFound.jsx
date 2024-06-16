import React from "react";
import ProtectedLayout from "../layout/ProtectedLayout";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/users/dashboard");
  };

  return (
    <ProtectedLayout title="Page Not Found">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
        }}
      >
        <Paper elevation={10} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h3" component="h1" gutterBottom>
            404 - Not Found
          </Typography>
          <Typography variant="body1" gutterBottom>
            The page you are looking for does not exist.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleGoBack}>
            Go to Dashboard
          </Button>
        </Paper>
      </Box>
    </ProtectedLayout>
  );
};

export default NotFound;
