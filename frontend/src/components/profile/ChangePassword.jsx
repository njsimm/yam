import React from "react";
import ProtectedLayout from "../layout/ProtectedLayout";
import Grid from "@mui/material/Grid";
import ChangePasswordForm from "../forms/ChangePasswordForm";

const ChangePassword = ({ updateUser }) => {
  return (
    <ProtectedLayout title="Change Password">
      <Grid container spacing={3}>
        <ChangePasswordForm updateUser={updateUser} />
      </Grid>
    </ProtectedLayout>
  );
};

export default ChangePassword;
