import React from "react";
import ProtectedLayout from "../layout/ProtectedLayout";
import ProductsList from "./ProductsList";
import Grid from "@mui/material/Grid";

const ProductsPage = () => {
  return (
    <ProtectedLayout title="Products">
      <Grid container spacing={3}>
        <ProductsList />
      </Grid>
    </ProtectedLayout>
  );
};

export default ProductsPage;
