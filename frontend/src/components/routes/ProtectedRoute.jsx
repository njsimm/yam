import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UserContext from "../../utils/UserContext";

export default function ProtectedRoute() {
  const { currentUser } = useContext(UserContext);

  if (!currentUser) {
    return <Navigate to="/users/login" />;
  }

  return <Outlet />;
}
