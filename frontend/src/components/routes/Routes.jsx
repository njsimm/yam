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
import ProductNewPage from "../products/ProductNewPage";
import BusinessNewPage from "../businesses/BusinessNewPage";
import BusinessUpdatePage from "../businesses/BusinessUpdatePage";

export default function YamRoutes({
  login,
  register,
  createProduct,
  deleteProduct,
  createBusiness,
  deleteBusiness,
  updateBusiness,
}) {
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

        {/* -----Products----- */}
        <Route
          path="/users/:userId/products"
          element={<ProductsPage deleteProduct={deleteProduct} />}
        />
        <Route
          path="/users/:userId/products/:productId"
          element={<ProductsItemPage />}
        />
        <Route
          path="/products/add-product"
          element={<ProductNewPage createProduct={createProduct} />}
        />
        {/* -----Businesses----- */}
        <Route
          path="/users/:userId/businesses"
          element={<BusinessesPage deleteBusiness={deleteBusiness} />}
        />
        <Route
          path="/businesses/add-business"
          element={<BusinessNewPage createBusiness={createBusiness} />}
        />
        <Route
          path="/businesses/:businessId/update"
          element={<BusinessUpdatePage updateBusiness={updateBusiness} />}
        />
        {/* -----Sales----- */}
        <Route path="/users/:userId/sales" element={<SalesPage />} />
        {/* -----User Profile----- */}
        <Route path="/users/:userId/profile" element={<UserProfile />} />
      </Route>
      {/**temp 404 page */}
      <Route path="*" element={<h1>404 error</h1>} />
    </Routes>
  );
}
