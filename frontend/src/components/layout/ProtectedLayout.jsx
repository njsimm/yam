import React, { useContext } from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import ModeNightRoundedIcon from "@mui/icons-material/ModeNightRounded";
import { Navigate } from "react-router-dom";
import { mainListItems, secondaryListItems } from "./ListItems";
import UserContext from "../../utils/UserContext";
import SidebarContext from "../../utils/SidebarContext";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: theme.palette.primary.main,
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const ProtectedLayout = ({ children, title }) => {
  const { currentUser, mode, toggleTheme } = useContext(UserContext);
  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);

  if (!currentUser) {
    return <Navigate to="/users/login" />;
  }

  const yamIcon =
    mode === "dark" ? "/96px-yellow-yam-icon.png" : "/96px-purple-yam-icon.png";

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="absolute" open={isSidebarOpen}>
        <Toolbar
          sx={{
            pr: "24px",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleSidebar}
            sx={{
              marginRight: "36px",
              ...(isSidebarOpen && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <img
            src={yamIcon}
            alt="Yam Icon"
            style={{ width: "32px", marginRight: "12px" }}
          />
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            {title}
          </Typography>
          <IconButton
            color="inherit"
            onClick={toggleTheme}
            aria-label="button to toggle theme"
          >
            {mode === "dark" ? (
              <WbSunnyRoundedIcon fontSize="small" />
            ) : (
              <ModeNightRoundedIcon fontSize="small" />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={isSidebarOpen}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={toggleSidebar}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          {mainListItems()}
          <Divider sx={{ my: 1 }} />
          {secondaryListItems()}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default ProtectedLayout;
