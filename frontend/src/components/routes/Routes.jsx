import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "../landingPage/LandingPage";
import LoginForm from "../forms/LoginForm";
import RegisterForm from "../forms/RegisterForm";
import Dashboard from "../dashboard/Dashboard";
import UserContext from "../../utils/UserContext";
import ProtectedRoute from "./ProtectedRoute";

export default function YamRoutes({ login, register }) {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/users/login" element={<LoginForm login={login} />} />
      <Route
        path="/users/register"
        element={<RegisterForm register={register} />}
      />
      <Route element={<ProtectedRoute />}>
        <Route path="/users/dashboard" element={<Dashboard />} />
        <Route
          path="/users/:userId/products"
          element={<h1>products page</h1>}
        />
        <Route
          path="/users/:userId/businesses"
          element={<h1>business page</h1>}
        />
        <Route path="/users/:userId/sales" element={<h1>sales page</h1>} />
        <Route path="/users/:userId/profile" element={<h1>profile</h1>} />
      </Route>
      {/**temp 404 page */}
      <Route path="*" element={<h1>404 error</h1>} />
    </Routes>
  );
}
