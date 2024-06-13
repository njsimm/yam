import React from "react";
import ProtectedLayout from "../layout/ProtectedLayout";
import BusinessUpdateForm from "../forms/BusinessUpdateForm";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";

const BusinessUpdatePage = ({ updateBusiness }) => {
  const { businessId } = useParams();

  return (
    <ProtectedLayout title="Update Business">
      <Grid container spacing={3}>
        <BusinessUpdateForm
          businessId={businessId}
          updateBusiness={updateBusiness}
        />
      </Grid>
    </ProtectedLayout>
  );
};

export default BusinessUpdatePage;
