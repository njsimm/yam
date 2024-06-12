import React, { useContext } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import AssignmentIcon from "@mui/icons-material/Assignment";
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
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Products" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate(`/users/${userId}/businesses`)}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Businesses" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate(`/users/${userId}/sales`)}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Sales" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate(`/users/${userId}/profile`)}>
        <ListItemIcon>
          <BarChartIcon />
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
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </React.Fragment>
  );
};
