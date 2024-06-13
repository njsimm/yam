import React, { useState, useContext, useEffect } from "react";
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
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserContext from "../../utils/UserContext";
import YamAPI from "../../utils/YamApi";

// Helper function to convert date to ISO format
const convertToISODate = (date) => {
  const isoDate = new Date(date);
  return isoDate.toISOString();
};

const SaleSchema = Yup.object().shape({
  productId: Yup.number().required("Product is required"),
  quantitySold: Yup.number()
    .integer("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .required("Quantity is required"),
  salePrice: Yup.number()
    .min(0, "Price must be at least 0")
    .required("Sale price is required"),
  saleDate: Yup.date().required("Sale date is required"),
  businessPercentage: Yup.number()
    .min(0)
    .max(100, "Business percentage must be between 0 and 100"),
});

const SaleNewForm = ({ createSale, createBusinessSale }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    async function fetchBusinessesAndProducts() {
      if (currentUser) {
        try {
          const userBusinesses = await YamAPI.getAllBusinesses(currentUser.id);
          setBusinesses(userBusinesses);
          const userProducts = await YamAPI.getAllProducts(currentUser.id);
          setProducts(userProducts);
        } catch (err) {
          console.error("Failed to fetch businesses and products", err);
        }
      }
    }
    fetchBusinessesAndProducts();
  }, [currentUser]);

  return (
    <Container component="main" maxWidth="sm">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Add New Sale
          </Typography>
          {errorMessage && (
            <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <Formik
            initialValues={{
              productId: "",
              quantitySold: 1,
              salePrice: 0,
              saleDate: "",
              businessId: "",
              businessPercentage: 0,
              isBusinessSale: false,
            }}
            validationSchema={SaleSchema}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(true);
              setErrorMessage("");

              const saleData = {
                productId: values.productId,
                quantitySold: values.quantitySold,
                salePrice: values.salePrice,
                saleDate: convertToISODate(values.saleDate), // Convert date to ISO format
              };

              const handleSale = values.isBusinessSale
                ? createBusinessSale(values.businessId, {
                    ...saleData,
                    businessPercentage: values.businessPercentage,
                  })
                : createSale(values.productId, saleData);

              handleSale.then((response) => {
                setSubmitting(false);
                if (response.success) {
                  navigate(`/users/${currentUser.id}/sales`);
                } else {
                  const errorMsg =
                    Array.isArray(response.errors) && response.errors.length > 0
                      ? response.errors.join(", ")
                      : "Failed to create sale. Please check your inputs and try again.";
                  setErrorMessage(errorMsg);
                }
              });
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              isSubmitting,
              setFieldValue,
            }) => (
              <Form>
                <Select
                  fullWidth
                  id="productId"
                  name="productId"
                  value={values.productId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.productId && Boolean(errors.productId)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Product
                  </MenuItem>
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
                    </MenuItem>
                  ))}
                </Select>
                <TextField
                  margin="normal"
                  fullWidth
                  id="quantitySold"
                  label="Quantity Sold"
                  name="quantitySold"
                  type="number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.quantitySold}
                  error={touched.quantitySold && Boolean(errors.quantitySold)}
                  helperText={touched.quantitySold && errors.quantitySold}
                  inputProps={{ step: 1 }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="salePrice"
                  label="Sale Price"
                  name="salePrice"
                  type="number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.salePrice}
                  error={touched.salePrice && Boolean(errors.salePrice)}
                  helperText={touched.salePrice && errors.salePrice}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="saleDate"
                  label="Sale Date"
                  name="saleDate"
                  type="datetime-local"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.saleDate}
                  error={touched.saleDate && Boolean(errors.saleDate)}
                  helperText={touched.saleDate && errors.saleDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      id="isBusinessSale"
                      name="isBusinessSale"
                      checked={values.isBusinessSale}
                      onChange={(e) => {
                        handleChange(e);
                        if (!e.target.checked) {
                          setFieldValue("businessId", "");
                          setFieldValue("businessPercentage", 0);
                        }
                      }}
                    />
                  }
                  label="Is Business Sale"
                />
                {values.isBusinessSale && (
                  <>
                    <Select
                      fullWidth
                      id="businessId"
                      name="businessId"
                      value={values.businessId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.businessId && Boolean(errors.businessId)}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Select Business
                      </MenuItem>
                      {businesses.map((business) => (
                        <MenuItem key={business.id} value={business.id}>
                          {business.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="businessPercentage"
                      label="Business Percentage"
                      name="businessPercentage"
                      type="number"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.businessPercentage}
                      error={
                        touched.businessPercentage &&
                        Boolean(errors.businessPercentage)
                      }
                      helperText={
                        touched.businessPercentage && errors.businessPercentage
                      }
                    />
                    <Button
                      fullWidth
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate(`/businesses/add-business`)}
                      sx={{ mt: 2 }}
                    >
                      Don’t see your business? Click here to add it
                    </Button>
                  </>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isSubmitting}
                >
                  Add Sale
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
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

export default SaleNewForm;
