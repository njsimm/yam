import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  CircularProgress,
  Button,
  Paper,
  Box,
} from "@mui/material";
import UserContext from "../../utils/UserContext";
import YamAPI from "../../utils/YamApi";
import ProtectedLayout from "../layout/ProtectedLayout";
import ProductUpdateForm from "../forms/ProductUpdateForm";

const ProductsItemPage = () => {
  const { currentUser } = useContext(UserContext);
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const product = await YamAPI.getProductById(currentUser.id, productId);
        setProduct(product);
        setLoading(false);
      } catch (err) {
        console.error("Product fetchProduct: problem loading product", err);
        setLoading(false);
      }
    }
    fetchProduct();
  }, [currentUser, productId]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
    setErrorMessage(""); // Clear error message on cancel
  };

  const handleSave = async (formData) => {
    try {
      const updatedProduct = await YamAPI.updateProduct(
        currentUser.id,
        productId,
        formData
      );
      setProduct(updatedProduct);
      setEditMode(false);
      setErrorMessage(""); // Clear error message on successful save
    } catch (err) {
      console.error("Product updateProduct: problem updating product", err);
      setErrorMessage(
        "Error updating product: " +
          (err.response?.data?.message ||
            "Check all fields and make sure name is not already being used.")
      );
    }
  };

  const handleBackClick = () => {
    navigate(`/users/${currentUser.id}/products`);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!product) {
    return (
      <ProtectedLayout title="Product Details">
        <Typography variant="h6">Product not found</Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleBackClick}
          sx={{ mt: 2 }}
        >
          Back to Products
        </Button>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout title="Product Details">
      <Container>
        <Paper sx={{ p: 2 }}>
          {editMode ? (
            <ProductUpdateForm
              product={product}
              onSave={handleSave}
              onCancel={handleCancelClick}
              errorMessage={errorMessage} // Pass error message to the form
            />
          ) : (
            <Box>
              <Typography variant="h4" gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {product.description}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Price: ${product.price}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Cost: ${product.cost}
              </Typography>
              <Typography variant="body1" gutterBottom>
                SKU: {product.sku}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Minutes to Make: {product.minutesToMake}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Type: {product.type}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Qty/Inventory: {product.quantity}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Created At: {product.productCreatedAt}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Last Updated At: {product.productUpdatedAt}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Quantity Updated At: {product.quantityUpdatedAt}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleEditClick}
                sx={{ mt: 2 }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleBackClick}
                sx={{ mt: 2, ml: 2 }}
              >
                Back to Products
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </ProtectedLayout>
  );
};

export default ProductsItemPage;