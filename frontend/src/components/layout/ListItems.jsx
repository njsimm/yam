import React, { useContext } from "react";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import StorefrontIcon from "@mui/icons-material/Storefront";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import UserContext from "../../utils/UserContext";
import { useNavigate } from "react-router-dom";

export const mainListItems = () => {
  const navigate = useNavigate();

  const { currentUser } = useContext(UserContext);

  const userId = currentUser.id;

  return (
    <React.Fragment>
      <ListItemButton onClick={() => navigate("/users/dashboard")}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate(`/users/${userId}/products`)}>
        <ListItemIcon>
          <ColorLensIcon />
        </ListItemIcon>
        <ListItemText primary="Products" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate(`/users/${userId}/businesses`)}>
        <ListItemIcon>
          <StorefrontIcon />
        </ListItemIcon>
        <ListItemText primary="Businesses" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate(`/users/${userId}/sales`)}>
        <ListItemIcon>
          <MonetizationOnIcon />
        </ListItemIcon>
        <ListItemText primary="Sales" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate(`/users/${userId}/profile`)}>
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItemButton>
    </React.Fragment>
  );
};

export const secondaryListItems = () => {
  const { logout } = React.useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <React.Fragment>
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </React.Fragment>
  );
};
