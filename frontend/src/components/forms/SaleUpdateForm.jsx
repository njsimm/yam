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
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../../utils/UserContext";
import YamAPI from "../../utils/YamApi";

const SaleSchema = Yup.object().shape({
  quantitySold: Yup.number()
    .integer("Quantity sold must be a whole number")
    .min(1, "Quantity sold must be at least 1")
    .required("Quantity sold is required"),
  salePrice: Yup.number()
    .min(0, "Sale price must be at least 0")
    .required("Sale price is required"),
  saleDate: Yup.date().required("Sale date is required"),
});

const formatDateForInput = (dateString) => {
  const date = new Date(dateString);
  const pad = (num) => num.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are zero-indexed
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const formatDateForApi = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString();
};

const SalesUpdateForm = ({ updateSale }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [initialValues, setInitialValues] = useState({
    quantitySold: "",
    salePrice: "",
    saleDate: "",
  });
  const [oldQuantity, setOldQuantity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const { productId, saleId } = useParams();

  useEffect(() => {
    async function fetchSale() {
      if (currentUser && productId && saleId) {
        try {
          const sale = await YamAPI.getSaleById(productId, saleId);
          setInitialValues({
            quantitySold: sale.quantitySold || "",
            salePrice: sale.salePrice || "",
            saleDate: formatDateForInput(sale.saleDate) || "",
          });
          setOldQuantity(sale.quantitySold);
        } catch (err) {
          setErrorMessage(`Error fetching sale: ${err.message}`);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchSale();
  }, [currentUser, productId, saleId]);

  if (isLoading) {
    return (
      <Container component="main" maxWidth="sm">
        <Paper sx={{ p: 3, mt: 3, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Paper>
      </Container>
    );
  }

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
            Update Sale
          </Typography>
          {errorMessage && (
            <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={SaleSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);
              setErrorMessage("");

              const updatedValues = {
                ...values,
                quantitySold: Number(values.quantitySold),
                salePrice: Number(values.salePrice),
                saleDate: formatDateForApi(values.saleDate),
              };

              try {
                const product = await YamAPI.getProductById(
                  currentUser.id,
                  productId
                );
                const quantityDifference =
                  updatedValues.quantitySold - oldQuantity;
                const newQuantity = product.quantity - quantityDifference;

                // Check if the new quantity exceeds the current inventory
                if (newQuantity < 0) {
                  setErrorMessage(
                    "The updated quantity exceeds the current inventory."
                  );
                  setSubmitting(false);
                  return;
                }

                // Update product quantity
                await YamAPI.updateProduct(currentUser.id, productId, {
                  quantity: newQuantity,
                });

                const response = await updateSale(
                  productId,
                  saleId,
                  updatedValues
                );
                setSubmitting(false);
                if (response.success) {
                  navigate(`/users/${currentUser.id}/sales`);
                } else {
                  const errorMsg =
                    Array.isArray(response.errors) && response.errors.length > 0
                      ? response.errors.join(", ")
                      : "Failed to update sale. Please check your inputs and try again.";
                  setErrorMessage(errorMsg);
                }
              } catch (error) {
                setErrorMessage(
                  "Failed to update sale and product. Please try again."
                );
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
              isSubmitting,
            }) => (
              <Form>
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
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isSubmitting}
                >
                  Update Sale
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

export default SalesUpdateForm;
