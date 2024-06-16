import React, { useContext, useEffect } from "react";
import { Box, Typography, Button, Grid, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import ModeNightRoundedIcon from "@mui/icons-material/ModeNightRounded";
import UserContext from "../../utils/UserContext";

export default function LandingPage() {
  const { currentUser, mode, toggleTheme } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/users/dashboard");
    }
  }, [currentUser, navigate]);

  return (
    <Grid
      container
      component="section"
      id="landingPage"
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        alignItems: "center",
      }}
    >
      <Grid
        item
        lg={12}
        sx={{
          display: "flex",
          paddingTop: "12%",
          width: "100%",
        }}
      >
        <Grid
          container
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Grid item md={6} xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h1" component="h1" fontWeight="bold">
              yam
            </Typography>
            <Typography variant="h5" component="p">
              your. art. matters.
            </Typography>
          </Grid>

          <Grid
            item
            md={6}
            xs={12}
            sx={{ height: "100%", textAlign: "center", mt: 3 }}
          >
            <Box sx={{ maxWidth: "500px", margin: "0 auto" }}>
              <Typography variant="body1" paragraph>
                yam was designed with artists, vendors, handmade crafters, and
                small business owners in mind. It is a comprehensive platform
                that allows you to efficiently manage and track inventory,
                direct sales, business sales, SKU numbers, and more all in one
                place.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        item
        lg={12}
        sx={{
          width: "100%",
          marginTop: 5,
        }}
      >
        <Grid
          container
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: { xs: "center", md: "flex-end" },
            paddingRight: { md: 35 },
            gap: 5,
          }}
        >
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/users/login"
            >
              Login
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/users/register"
            >
              Register
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        item
        lg={12}
        sx={{
          width: "100%",
          marginTop: 4,
        }}
      >
        <Grid
          container
          sx={{
            width: "100%",
            justifyContent: "center",
          }}
        >
          <IconButton
            onClick={toggleTheme}
            aria-label="button to toggle theme"
            sx={{ minWidth: "32px", height: "32px", p: "4px" }}
          >
            {mode === "dark" ? (
              <WbSunnyRoundedIcon fontSize="small" />
            ) : (
              <ModeNightRoundedIcon fontSize="small" />
            )}
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
}
