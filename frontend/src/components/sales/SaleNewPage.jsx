import React from "react";
import ProtectedLayout from "../layout/ProtectedLayout";
import SaleNewForm from "../forms/SaleNewForm";
import Grid from "@mui/material/Grid";

const SaleNewPage = ({ createSale, createBusinessSale }) => {
  return (
    <ProtectedLayout title="Sales">
      <Grid container spacing={3}>
        <SaleNewForm
          createSale={createSale}
          createBusinessSale={createBusinessSale}
        />
      </Grid>
    </ProtectedLayout>
  );
};

export default SaleNewPage;
