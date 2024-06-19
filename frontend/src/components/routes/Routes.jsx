import { Routes, Route } from "react-router-dom";
import LandingPage from "../landingPage/LandingPage";
import LoginForm from "../forms/LoginForm";
import RegisterForm from "../forms/RegisterForm";
import Dashboard from "../dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import ProductsPage from "../products/ProductsPage";
import ProductsItemPage from "../products/ProductsItemPage";
import BusinessesPage from "../businesses/BusinessesPage";
import SalesPage from "../sales/SalesPage";
import UserProfile from "../profile/UserProfile";
import ProductNewPage from "../products/ProductNewPage";
import BusinessNewPage from "../businesses/BusinessNewPage";
import BusinessUpdatePage from "../businesses/BusinessUpdatePage";
import SaleNewPage from "../sales/SaleNewPage";
import SaleUpdatePage from "../sales/SaleUpdatePage";
import BusinessSaleUpdatePage from "../sales/BusinessSaleUpdatePage";
import ChangePassword from "../profile/ChangePassword";
import NotAuthorized from "./NotAuthorized";
import NotFound from "./NotFound";

export default function YamRoutes({
  login,
  register,
  createProduct,
  deleteProduct,
  createBusiness,
  deleteBusiness,
  updateBusiness,
  createSale,
  deleteSale,
  updateSale,
  createBusinessSale,
  deleteBusinessSale,
  updateBusinessSale,
  updateUser,
  deleteUser,
}) {
  return (
    <Routes>
      {/* -----General Routes----- */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/users/login" element={<LoginForm login={login} />} />
      <Route
        path="/users/register"
        element={<RegisterForm register={register} />}
      />

      {/* -----Protected Routes----- */}
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
        <Route
          path="/users/:userId/sales"
          element={
            <SalesPage
              deleteSale={deleteSale}
              deleteBusinessSale={deleteBusinessSale}
            />
          }
        />
        <Route
          path="/sales/add-sale"
          element={
            <SaleNewPage
              createSale={createSale}
              createBusinessSale={createBusinessSale}
            />
          }
        />
        <Route
          path="/sales/:saleId/products/:productId"
          element={<SaleUpdatePage updateSale={updateSale} />}
        />
        <Route
          path="/businessSales/:businessSaleId/businesses/:businessId"
          element={
            <BusinessSaleUpdatePage updateBusinessSale={updateBusinessSale} />
          }
        />

        {/* -----User Profile----- */}
        <Route
          path="/users/:userId/profile"
          element={
            <UserProfile updateUser={updateUser} deleteUser={deleteUser} />
          }
        />
        <Route
          path="/users/:userId/change-password"
          element={<ChangePassword updateUser={updateUser} />}
        />
      </Route>

      {/* -----Misc.----- */}
      <Route path="/not-authorized" element={<NotAuthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
