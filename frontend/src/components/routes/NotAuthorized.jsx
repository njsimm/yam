import React from "react";
import ProtectedLayout from "../layout/ProtectedLayout";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";

const NotAuthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/users/dashboard");
  };

  return (
    <ProtectedLayout title="Not Authorized">
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
            Not Authorized
          </Typography>
          <Typography variant="body1" gutterBottom>
            You do not have permission to view this page.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleGoBack}>
            Go to Dashboard
          </Button>
        </Paper>
      </Box>
    </ProtectedLayout>
  );
};

export default NotAuthorized;
