import React from "react";
import ProtectedLayout from "../layout/ProtectedLayout";
import BusinessNewForm from "../forms/BusinessNewForm";
import Grid from "@mui/material/Grid";

const BusinessNewPage = ({ createBusiness }) => {
  return (
    <ProtectedLayout title="Businesses">
      <Grid container spacing={3}>
        <BusinessNewForm createBusiness={createBusiness} />
      </Grid>
    </ProtectedLayout>
  );
};

export default BusinessNewPage;
