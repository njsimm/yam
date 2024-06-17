import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import UserContext from "../../utils/UserContext";

const noSpacesOrUppercase = (value) =>
  !/\s/.test(value) && value === value.toLowerCase();

const RegisterSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(1, "First name must be at least 1 character")
    .max(50, "First name must be at most 50 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(1, "Last name must be at least 1 character")
    .max(100, "Last name must be at most 100 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required")
    .test(
      "no-spaces-or-uppercase",
      "Email cannot contain spaces or uppercase letters",
      noSpacesOrUppercase
    ),
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be at most 50 characters")
    .required("Username is required")
    .test(
      "no-spaces-or-uppercase",
      "Username cannot contain spaces or uppercase letters",
      noSpacesOrUppercase
    ),
  password: Yup.string()
    .min(5, "Password must be at least 5 characters")
    .max(72, "Password must be at most 72 characters")
    .required("Password is required"),
});

export default function RegisterForm({ register }) {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (currentUser) {
      navigate("/users/dashboard");
    }
  }, [currentUser, navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LoginRoundedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Register
        </Typography>
        {errorMessage && (
          <Alert severity="error" sx={{ width: "100%", mt: 2, mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            password: "",
          }}
          validationSchema={RegisterSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setErrorMessage("");
            // Convert email and username to lowercase and remove spaces
            const sanitizedValues = {
              ...values,
              email: values.email.toLowerCase().replace(/\s/g, ""),
              username: values.username.toLowerCase().replace(/\s/g, ""),
            };
            let response = await register(sanitizedValues);
            setSubmitting(false);
            if (response.success) {
              navigate("/users/dashboard");
            } else {
              const errorMsg =
                Array.isArray(response.errors) && response.errors.length > 0
                  ? response.errors.join(", ")
                  : "Registration failed. Please try again.";
              setErrorMessage(errorMsg);
            }
          }}
        >
          {({ errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.firstName && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting}
              >
                Register
              </Button>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/users/login"
                sx={{ justifyContent: "center", width: "100%" }}
              >
                Already have an account? Login
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}
