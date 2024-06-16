import React from "react";
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  Alert,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().min(1).max(100).required("Name is required"),
  description: Yup.string(),
  price: Yup.number(),
  cost: Yup.number(),
  sku: Yup.string().max(50),
  minutesToMake: Yup.number().integer(),
  type: Yup.string().max(50),
  quantity: Yup.number().integer().required("Quantity is required"),
});

export default function ProductUpdateForm({
  product,
  onSave,
  onCancel,
  errorMessage,
}) {
  const initialValues = {
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    cost: product?.cost || "",
    sku: product?.sku || "",
    minutesToMake: product?.minutesToMake || "",
    type: product?.type || "",
    quantity: product?.quantity || "",
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Update Product
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            onSave({
              ...values,
              price: parseFloat(values.price),
              cost: parseFloat(values.cost),
              quantity: parseInt(values.quantity, 10),
              minutesToMake: values.minutesToMake
                ? parseInt(values.minutesToMake, 10)
                : null,
            }).finally(() => {
              setSubmitting(false);
            });
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              {errorMessage && (
                <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
                  {errorMessage}
                </Alert>
              )}
              <Field
                as={TextField}
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
              />
              <ErrorMessage name="name" component="div" />
              <Field
                as={TextField}
                margin="normal"
                fullWidth
                id="description"
                label="Description"
                name="description"
              />
              <ErrorMessage name="description" component="div" />
              <Field
                as={TextField}
                margin="normal"
                required
                fullWidth
                id="price"
                label="Price"
                name="price"
                type="number"
              />
              <ErrorMessage name="price" component="div" />
              <Field
                as={TextField}
                margin="normal"
                required
                fullWidth
                id="cost"
                label="Cost"
                name="cost"
                type="number"
              />
              <ErrorMessage name="cost" component="div" />
              <Field
                as={TextField}
                margin="normal"
                required
                fullWidth
                id="sku"
                label="SKU"
                name="sku"
              />
              <ErrorMessage name="sku" component="div" />
              <Field
                as={TextField}
                margin="normal"
                fullWidth
                id="minutesToMake"
                label="Minutes to Make"
                name="minutesToMake"
                type="number"
              />
              <ErrorMessage name="minutesToMake" component="div" />
              <Field
                as={TextField}
                margin="normal"
                fullWidth
                id="type"
                label="Type"
                name="type"
              />
              <ErrorMessage name="type" component="div" />
              <Field
                as={TextField}
                margin="normal"
                required
                fullWidth
                id="quantity"
                label="Quantity"
                name="quantity"
                type="number"
              />
              <ErrorMessage name="quantity" component="div" />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  Save
                </Button>
                <Button variant="contained" color="primary" onClick={onCancel}>
                  Cancel
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}
