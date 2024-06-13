import React from "react";
import ProtectedLayout from "../layout/ProtectedLayout";
import SaleUpdateForm from "../forms/SaleUpdateForm";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";

const SaleUpdatePage = ({ updateSale }) => {
  const { productId, saleId } = useParams();

  return (
    <ProtectedLayout title="Update Sale">
      <Grid container spacing={3}>
        <SaleUpdateForm
          productId={productId}
          saleId={saleId}
          updateSale={updateSale}
        />
      </Grid>
    </ProtectedLayout>
  );
};

export default SaleUpdatePage;
