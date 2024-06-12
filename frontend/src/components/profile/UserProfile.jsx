import React from "react";
import ProtectedLayout from "../layout/ProtectedLayout";

const UserProfile = () => {
  return (
    <ProtectedLayout title="Profile">
      <h1>You Profile Page</h1>
    </ProtectedLayout>
  );
};

export default UserProfile;
