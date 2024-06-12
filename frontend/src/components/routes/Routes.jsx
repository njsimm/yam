import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "../landingPage/LandingPage";
import LoginForm from "../forms/LoginForm";
import RegisterForm from "../forms/RegisterForm";
import Dashboard from "../dashboard/Dashboard";
import UserContext from "../../utils/UserContext";
import ProtectedRoute from "./ProtectedRoute";
import ProductsPage from "../products/ProductsPage";
import ProductsItemPage from "../products/ProductsItemPage";
import BusinessesPage from "../businesses/BusinessesPage";
import SalesPage from "../sales/SalesPage";
import UserProfile from "../profile/UserProfile";

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
        <Route path="/users/:userId/products" element={<ProductsPage />} />
        <Route
          path="/users/:userId/products/:productId"
          element={<ProductsItemPage />}
        />
        <Route path="/users/:userId/businesses" element={<BusinessesPage />} />
        <Route path="/users/:userId/sales" element={<SalesPage />} />
        <Route path="/users/:userId/profile" element={<UserProfile />} />
      </Route>
      {/**temp 404 page */}
      <Route path="*" element={<h1>404 error</h1>} />
    </Routes>
  );
}
