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

const BusinessSchema = Yup.object().shape({
  name: Yup.string()
    .max(100, "Name must be less than 100 characters")
    .required("Name is required"),
  contactInfo: Yup.string(),
});

const BusinessNewForm = ({ createBusiness }) => {
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
            Add New Business
          </Typography>
          {errorMessage && (
            <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <Formik
            initialValues={{
              name: "",
              contactInfo: "",
            }}
            validationSchema={BusinessSchema}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(true);
              setErrorMessage("");

              const businessData = {
                ...values,
              };

              createBusiness(businessData).then((response) => {
                setSubmitting(false);
                if (response.success) {
                  navigate(`/users/${currentUser.id}/businesses`);
                } else {
                  const errorMsg =
                    Array.isArray(response.errors) && response.errors.length > 0
                      ? response.errors.join(", ")
                      : "Failed to create business. Please check your inputs and try again.";
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
                  id="contactInfo"
                  label="Contact Information"
                  name="contactInfo"
                  onChange={handleChange}
                  onBlur={handleBlur}
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
                  Add Business
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

export default BusinessNewForm;
