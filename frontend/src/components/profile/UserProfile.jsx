import React from "react";
import ProtectedLayout from "../layout/ProtectedLayout";
import Grid from "@mui/material/Grid";
import UserProfileInfo from "./UserProfileInfo";

const UserProfile = ({ updateUser, deleteUser }) => {
  return (
    <ProtectedLayout title="User Profile">
      <Grid container spacing={3}>
        <UserProfileInfo updateUser={updateUser} deleteUser={deleteUser} />
      </Grid>
    </ProtectedLayout>
  );
};

export default UserProfile;
