import React from "react";
import ProtectedLayout from "../layout/ProtectedLayout";
import BusinessSaleUpdateForm from "../forms/BusinessSaleUpdateForm";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";

const BusinessSaleUpdatePage = ({ updateBusinessSale }) => {
  const { businessId, businessSaleId } = useParams();

  return (
    <ProtectedLayout title="Update Business Sale">
      <Grid container spacing={3}>
        <BusinessSaleUpdateForm
          businessId={businessId}
          businessSaleId={businessSaleId}
          updateBusinessSale={updateBusinessSale}
        />
      </Grid>
    </ProtectedLayout>
  );
};

export default BusinessSaleUpdatePage;
