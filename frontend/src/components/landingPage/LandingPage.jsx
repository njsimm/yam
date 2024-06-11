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
    <Box
      component="section"
      id="landingPage"
      sx={{
        flexGrow: 1,
      }}
    >
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          alignItems: "center",
        }}
      >
        <Grid
          container
          sx={{
            display: "flex",
            textAlign: "center",
            flexDirection: "row",
            paddingTop: "12%",
          }}
        >
          <Grid item md={6} xs={12}>
            <Typography variant="h1" component="h1" fontWeight="bold">
              yam
            </Typography>
          </Grid>

          <Grid
            item
            md={6}
            xs={12}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Box
              component="div"
              sx={{
                height: "100%",
                display: "flex",
                textAlign: "center",
                maxWidth: 450,
                marginTop: 2,
              }}
            >
              <Typography variant="body1" paragraph>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
                sequi temporibus excepturi perferendis tenetur quas provident
                voluptates laudantium. Temporibus dolorem rerum animi enim cum
                distinctio, velit sapiente laboriosam magnam voluptas. lore
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={5}
          sx={{
            display: "flex",
            flexDirection: "row",
            textAlign: "center",
            // maxWidth: 300,
            marginTop: 5,
          }}
        >
          <Grid item md={6} xs={12}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/users/login"
            >
              Login
            </Button>
          </Grid>
          <Grid item md={6} xs={12}>
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
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: 2,
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
    </Box>
  );
}
