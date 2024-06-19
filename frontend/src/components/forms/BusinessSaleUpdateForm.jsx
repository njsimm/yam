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
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../../utils/UserContext";
import YamAPI from "../../utils/YamApi";

const BusinessSaleSchema = Yup.object().shape({
  quantitySold: Yup.number()
    .integer("Quantity sold must be an integer")
    .min(1, "Quantity sold must be at least 1")
    .required("Quantity sold is required"),
  salePrice: Yup.number()
    .min(0, "Sale price must be at least 0")
    .required("Sale price is required"),
  businessPercentage: Yup.number()
    .min(0, "Business percentage must be between 0 and 100")
    .max(100, "Business percentage must be between 0 and 100"),
  saleDate: Yup.date().required("Sale date is required"),
  businessId: Yup.number().required("Business is required"),
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

const BusinessSaleUpdateForm = ({ updateBusinessSale }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [initialValues, setInitialValues] = useState({
    quantitySold: "",
    salePrice: "",
    businessPercentage: "",
    saleDate: "",
    businessId: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [businesses, setBusinesses] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const { businessId, businessSaleId } = useParams();

  useEffect(() => {
    async function fetchBusinessSale() {
      if (currentUser && businessId && businessSaleId) {
        try {
          const businessSale = await YamAPI.getBusinessSaleById(
            businessId,
            businessSaleId
          );
          setInitialValues({
            quantitySold: businessSale.quantitySold || "",
            salePrice: businessSale.salePrice || "",
            businessPercentage: businessSale.businessPercentage || "",
            saleDate: formatDateForInput(businessSale.saleDate) || "",
            businessId: businessSale.businessId || "",
          });

          // Fetch all businesses for the current user
          const userBusinesses = await YamAPI.getAllBusinesses(currentUser.id);
          setBusinesses(userBusinesses);
        } catch (err) {
          setErrorMessage(`Error fetching business sale: ${err.message}`);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchBusinessSale();
  }, [currentUser, businessId, businessSaleId]);

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
            Update Business Sale
          </Typography>
          {errorMessage && (
            <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={BusinessSaleSchema}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(true);
              setErrorMessage("");

              const updatedValues = {
                ...values,
                quantitySold: parseInt(values.quantitySold, 10),
                salePrice: parseFloat(values.salePrice),
                businessPercentage: parseFloat(values.businessPercentage),
                saleDate: formatDateForApi(values.saleDate),
              };

              updateBusinessSale(
                businessId,
                businessSaleId,
                updatedValues
              ).then((response) => {
                setSubmitting(false);
                if (response.success) {
                  navigate(`/users/${currentUser.id}/sales`);
                } else {
                  const errorMsg =
                    Array.isArray(response.errors) && response.errors.length > 0
                      ? response.errors.join(", ")
                      : "Failed to update business sale. Please check your inputs and try again.";
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
                <Select
                  fullWidth
                  id="businessId"
                  name="businessId"
                  value={values.businessId}
                  onChange={(e) => setFieldValue("businessId", e.target.value)}
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
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isSubmitting}
                >
                  Update Business Sale
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

export default BusinessSaleUpdateForm;
