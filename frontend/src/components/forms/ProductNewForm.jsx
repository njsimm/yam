import React, { useState, useContext } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserContext from "../../utils/UserContext";

const ProductSchema = Yup.object().shape({
  name: Yup.string()
    .max(100, "Name must be less than 100 characters")
    .required("Name is required"),
  description: Yup.string(),
  price: Yup.number().typeError("Price must be a number"),
  cost: Yup.number().typeError("Cost must be a number"),
  sku: Yup.string().max(50, "SKU must be less than 50 characters"),
  minutesToMake: Yup.number().typeError("Minutes to Make must be a number"),
  type: Yup.string().max(50, "Type must be less than 50 characters"),
  quantity: Yup.number().typeError("Quantity must be a number").default(0),
});

const ProductNewForm = ({ createProduct }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={10} sx={{ p: 3, mt: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Add New Product
          </Typography>
          {errorMessage && (
            <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <Formik
            initialValues={{
              name: "",
              description: "",
              price: "",
              cost: "",
              sku: "",
              minutesToMake: "",
              type: "",
              quantity: "",
            }}
            validationSchema={ProductSchema}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(true);
              setErrorMessage("");

              const productData = {
                ...values,
                price: values.price ? parseFloat(values.price) : null,
                cost: values.cost ? parseFloat(values.cost) : null,
                minutesToMake: values.minutesToMake
                  ? parseInt(values.minutesToMake, 10)
                  : null,
                quantity: values.quantity ? parseInt(values.quantity, 10) : 0,
                sku: values.sku ? values.sku : null,
                description: values.description ? values.description : null,
                type: values.type ? values.type : null,
              };

              createProduct(productData).then((response) => {
                setSubmitting(false);
                if (response.success) {
                  navigate(`/users/${currentUser.id}/products`);
                } else {
                  const errorMsg =
                    Array.isArray(response.errors) && response.errors.length > 0
                      ? response.errors.join(", ")
                      : "Failed to create product. Please check your inputs and try again.";
                  setErrorMessage(errorMsg);
                }
              });
            }}
          >
            {({ errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form>
                <TextField
                  margin="normal"
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="description"
                  label="Description"
                  name="description"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="price"
                  label="Price"
                  name="price"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.price && Boolean(errors.price)}
                  helperText={touched.price && errors.price}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="cost"
                  label="Cost"
                  name="cost"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.cost && Boolean(errors.cost)}
                  helperText={touched.cost && errors.cost}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="sku"
                  label="SKU"
                  name="sku"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.sku && Boolean(errors.sku)}
                  helperText={touched.sku && errors.sku}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="minutesToMake"
                  label="Minutes to Make"
                  name="minutesToMake"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.minutesToMake && Boolean(errors.minutesToMake)}
                  helperText={touched.minutesToMake && errors.minutesToMake}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="type"
                  label="Type"
                  name="type"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.type && Boolean(errors.type)}
                  helperText={touched.type && errors.type}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="quantity"
                  label="Quantity"
                  name="quantity"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.quantity && Boolean(errors.quantity)}
                  helperText={touched.quantity && errors.quantity}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isSubmitting}
                >
                  Add Product
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mb: 2 }}
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProductNewForm;
