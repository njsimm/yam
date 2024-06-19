import { useState, useContext, useEffect } from "react";
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

// Helper function to format date and time for input field
const formatDateTimeForInput = (date) => {
  const pad = (num) => num.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are zero-indexed
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
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
  const [SelectedProductPrice, setSelectedProductPrice] = useState(null);
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
          console.error("Failed to get information");
        }
      }
    }
    fetchBusinessesAndProducts();
  }, [currentUser]);

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
              salePrice: SelectedProductPrice || 0,
              saleDate: formatDateTimeForInput(new Date()), // Set default to current date and time
              businessId: "",
              businessPercentage: 0,
              isBusinessSale: false,
            }}
            validationSchema={SaleSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);
              setErrorMessage("");

              const saleData = {
                productId: values.productId,
                quantitySold: values.quantitySold,
                salePrice: Number(values.salePrice), // Convert to number
                saleDate: convertToISODate(values.saleDate), // Convert date to ISO format
              };

              try {
                const handleSale = values.isBusinessSale
                  ? await createBusinessSale(values.businessId, {
                      ...saleData,
                      businessPercentage: values.businessPercentage,
                    })
                  : await createSale(values.productId, saleData);

                if (handleSale.success) {
                  if (!values.isBusinessSale) {
                    // Fetch the current product details
                    const product = await YamAPI.getProductById(
                      currentUser.id,
                      values.productId
                    );
                    const newQuantity = product.quantity - values.quantitySold;

                    // Update product quantity
                    await YamAPI.updateProduct(
                      currentUser.id,
                      values.productId,
                      {
                        quantity: newQuantity,
                      }
                    );
                  }
                  navigate(`/users/${currentUser.id}/sales`);
                } else {
                  const errorMsg =
                    Array.isArray(handleSale.errors) &&
                    handleSale.errors.length > 0
                      ? handleSale.errors.join(", ")
                      : "Failed to create sale. Please check your inputs and try again.";
                  setErrorMessage(errorMsg);
                }
              } catch (error) {
                setErrorMessage(
                  "Failed to create sale and update product. Please try again."
                );
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              setFieldValue,
              isSubmitting,
            }) => (
              <Form>
                <Select
                  fullWidth
                  id="productId"
                  name="productId"
                  value={values.productId}
                  onChange={async (e) => {
                    handleChange(e);
                    const productId = e.target.value;
                    if (productId) {
                      const product = await YamAPI.getProductById(
                        currentUser.id,
                        productId
                      );
                      setSelectedProductPrice(product.price);
                      setFieldValue("salePrice", product.price);
                    }
                  }}
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
                        if (e.target.checked && businesses.length > 0) {
                          setFieldValue("businessId", businesses[0].id);
                        } else {
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
                      variant="contained"
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

export default SaleNewForm;
