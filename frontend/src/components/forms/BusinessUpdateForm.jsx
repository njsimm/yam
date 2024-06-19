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

const BusinessSchema = Yup.object().shape({
  name: Yup.string()
    .max(100, "Name must be less than 100 characters")
    .required("Name is required"),
  contactInfo: Yup.string(),
});

const BusinessUpdateForm = ({ updateBusiness }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [initialValues, setInitialValues] = useState({
    name: "",
    contactInfo: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const { businessId } = useParams();

  useEffect(() => {
    async function fetchBusiness() {
      if (currentUser && businessId) {
        try {
          const business = await YamAPI.getBusinessById(
            currentUser.id,
            businessId
          );
          setInitialValues({
            name: business.name || "",
            contactInfo: business.contactInfo || "",
          });
        } catch (err) {
          console.error("Problem loading business");
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchBusiness();
  }, [currentUser, businessId]);

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
            Update Business
          </Typography>
          {errorMessage && (
            <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={BusinessSchema}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(true);
              setErrorMessage("");

              const businessData = {
                ...values,
                contactInfo: values.contactInfo ? values.contactInfo : null,
              };

              updateBusiness(businessId, businessData).then((response) => {
                setSubmitting(false);
                if (response.success) {
                  navigate(`/users/${currentUser.id}/businesses`);
                } else {
                  const errorMsg =
                    Array.isArray(response.errors) && response.errors.length > 0
                      ? response.errors.join(", ")
                      : "Failed to update business. Please check your inputs and try again.";
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
            }) => (
              <Form>
                <TextField
                  margin="normal"
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="contactInfo"
                  label="Contact Information"
                  name="contactInfo"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.contactInfo}
                  error={touched.contactInfo && Boolean(errors.contactInfo)}
                  helperText={touched.contactInfo && errors.contactInfo}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isSubmitting}
                >
                  Update Business
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

export default BusinessUpdateForm;
