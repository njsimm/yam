import React from "react";
import ProtectedLayout from "../layout/ProtectedLayout";
import ProductNewForm from "../forms/ProductNewForm";
import Grid from "@mui/material/Grid";

const ProductNewPage = ({ createProduct }) => {
  return (
    <ProtectedLayout title="Products">
      <Grid container spacing={3}>
        <ProductNewForm createProduct={createProduct} />
      </Grid>
    </ProtectedLayout>
  );
};

export default ProductNewPage;
