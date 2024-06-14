import React, { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import UserContext from "../../utils/UserContext";
import YamAPI from "../../utils/YamApi";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function ProtectedRoute() {
  const { currentUser } = useContext(UserContext);
  const { userId, productId, businessId, saleId, businessSaleId } = useParams();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(true);

  useEffect(() => {
    const checkAuthorization = async () => {
      setLoading(true);
      setAuthorized(true);

      if (!currentUser) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      if (userId && parseInt(userId, 10) !== currentUser.id) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        if (productId) {
          const product = await YamAPI.getProductById(
            currentUser.id,
            productId
          );
          if (product.userId !== currentUser.id) {
            setAuthorized(false);
          }
        } else if (businessId) {
          const business = await YamAPI.getBusinessById(
            currentUser.id,
            businessId
          );
          if (business.userId !== currentUser.id) {
            setAuthorized(false);
          }
        } else if (saleId) {
          const sale = await YamAPI.getSaleById(productId, saleId);
          if (sale.userId !== currentUser.id) {
            setAuthorized(false);
          }
        } else if (businessSaleId) {
          const businessSale = await YamAPI.getBusinessSaleById(
            businessId,
            businessSaleId
          );
          if (businessSale.userId !== currentUser.id) {
            setAuthorized(false);
          }
        }
      } catch (error) {
        setAuthorized(false);
      }

      setLoading(false);
    };

    checkAuthorization();
  }, [currentUser, userId, productId, businessId, saleId, businessSaleId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!authorized) {
    return <Navigate to="/not-authorized" />;
  }

  return <Outlet />;
}
