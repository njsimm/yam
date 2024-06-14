import React, { useState, useEffect, useMemo } from "react";
import {
  ThemeProvider,
  CssBaseline,
  CircularProgress,
  Box,
} from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { lightTheme, darkTheme } from "./theme";
import YamRoutes from "./components/routes/Routes";
import useLocalStorage from "./hooks/useLocalStorage";
import YamAPI from "./utils/YamApi";
import UserContext from "./utils/UserContext";

/** The key name for storing JWT token in localStorage. The value for this key will be the JWT.
 *
 * export is used so that it can be used in other files if needed.
 */
export const TOKEN_STORAGE_ID = "yam-token";

function App() {
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  console.debug(
    "App",
    "infoLoaded=",
    infoLoaded,
    "currentUser=",
    currentUser,
    "token=",
    token
  );

  useEffect(
    function loadUserInfo() {
      console.debug("App useEffect loadUserInfo", "token=", token);

      async function getCurrentUser() {
        if (token) {
          try {
            let decodedToken = jwtDecode(token);
            let { id } = decodedToken;
            // put the token on the Api class so it can use it to call the API.
            YamAPI.token = token;
            let currentUser = await YamAPI.getCurrentUser(id);
            setCurrentUser(currentUser);
          } catch (err) {
            console.error("App loadUserInfo: problem loading", err);
            setCurrentUser(null);
          }
        }
        setInfoLoaded(true);
      }
      setInfoLoaded(false);
      getCurrentUser();
    },
    [token]
  );

  /** Handles logout. */
  function logout() {
    setCurrentUser(null);
    setToken(null);
  }

  /** Handles register.
   *
   * Automatically logs user in (set token) upon register.
   */
  async function register(formData) {
    try {
      let token = await YamAPI.register(formData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("register failed", errors);
      return { success: false, errors };
    }
  }
  /** Handles login
   *
   * Used with API
   */
  async function login(formData) {
    try {
      let token = await YamAPI.login(formData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }

  /** Handles creating a new product */
  async function createProduct(productData) {
    if (!currentUser) {
      return { success: false, errors: ["No user logged in"] };
    }
    try {
      await YamAPI.createProduct(currentUser.id, productData);
      return { success: true };
    } catch (errors) {
      console.error("createProduct failed", errors);
      return { success: false, errors };
    }
  }

  /** Handles deleting a product */
  async function deleteProduct(productId) {
    if (!currentUser) {
      return { success: false, errors: ["No user logged in"] };
    }
    try {
      await YamAPI.deleteProduct(currentUser.id, productId);
      return { success: true };
    } catch (errors) {
      console.error("deleteProduct failed", errors);
      return { success: false, errors };
    }
  }

  /** Handles creating a new business */
  async function createBusiness(businessData) {
    if (!currentUser) {
      return { success: false, errors: ["No user logged in"] };
    }
    try {
      await YamAPI.createBusiness(currentUser.id, businessData);
      return { success: true };
    } catch (errors) {
      console.error("createBusiness failed", errors);
      return { success: false, errors };
    }
  }

  /** Handles deleting a business */
  async function deleteBusiness(businessId) {
    if (!currentUser) {
      return { success: false, errors: ["No user logged in"] };
    }
    try {
      await YamAPI.deleteBusiness(currentUser.id, businessId);
      return { success: true };
    } catch (errors) {
      console.error("deleteBusiness failed", errors);
      return { success: false, errors };
    }
  }

  /** Handles updating a business */
  async function updateBusiness(businessId, updateData) {
    if (!currentUser) {
      return { success: false, errors: ["No user logged in"] };
    }
    try {
      await YamAPI.updateBusiness(currentUser.id, businessId, updateData);
      return { success: true };
    } catch (errors) {
      console.error("updateBusiness failed", errors);
      return { success: false, errors };
    }
  }

  /** Handles creating a new sale */
  async function createSale(productId, saleData) {
    if (!currentUser) {
      return { success: false, errors: ["No user logged in"] };
    }
    try {
      await YamAPI.createSale(productId, saleData);
      return { success: true };
    } catch (errors) {
      console.error("createSale failed", errors);
      return { success: false, errors };
    }
  }

  /** Handles deleting a sale */
  async function deleteSale(productId, saleId) {
    if (!currentUser) {
      return { success: false, errors: ["No user logged in"] };
    }
    try {
      await YamAPI.deleteSale(productId, saleId);
      return { success: true };
    } catch (errors) {
      console.error("deleteSale failed", errors);
      return { success: false, errors };
    }
  }

  /** Handles updating a sale */
  async function updateSale(productId, saleId, updateData) {
    if (!currentUser) {
      return { success: false, errors: ["No user logged in"] };
    }
    try {
      await YamAPI.updateSale(productId, saleId, updateData);
      return { success: true };
    } catch (errors) {
      console.error("updateSale failed", errors);
      return { success: false, errors };
    }
  }

  /** Handles creating a new business sale */
  async function createBusinessSale(businessId, businessSaleData) {
    if (!currentUser) {
      return { success: false, errors: ["No user logged in"] };
    }
    try {
      await YamAPI.createBusinessSale(businessId, businessSaleData);
      return { success: true };
    } catch (errors) {
      console.error("createBusinessSale failed", errors);
      return { success: false, errors };
    }
  }

  /** Handles deleting a business sale */
  async function deleteBusinessSale(businessId, businessSaleId) {
    if (!currentUser) {
      return { success: false, errors: ["No user logged in"] };
    }
    try {
      await YamAPI.deleteBusinessSale(businessId, businessSaleId);
      return { success: true };
    } catch (errors) {
      console.error("deleteBusinessSale failed", errors);
      return { success: false, errors };
    }
  }

  /** Handles updating a business sale */
  async function updateBusinessSale(businessId, businessSaleId, updateData) {
    if (!currentUser) {
      return { success: false, errors: ["No user logged in"] };
    }
    try {
      await YamAPI.updateBusinessSale(businessId, businessSaleId, updateData);
      return { success: true };
    } catch (errors) {
      console.error("updateBusinessSale failed", errors);
      return { success: false, errors };
    }
  }

  /** Handles updating a user */
  async function updateUser(updateData) {
    if (!currentUser) {
      return { success: false, errors: ["No user logged in"] };
    }
    try {
      await YamAPI.updateUser(currentUser.id, updateData);
      return { success: true };
    } catch (errors) {
      console.error("updateUser failed", errors);
      return { success: false, errors };
    }
  }

  /** Handles deleting a user */
  async function deleteUser() {
    if (!currentUser) {
      return { success: false, errors: ["No user logged in"] };
    }
    try {
      await YamAPI.deleteUser(currentUser.id);
      logout();
      return { success: true };
    } catch (errors) {
      console.error("deleteUser failed", errors);
      return { success: false, errors };
    }
  }

  const [mode, setMode] = useState("light");

  const theme = useMemo(
    () => (mode === "light" ? lightTheme : darkTheme),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  if (!infoLoaded)
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

  return (
    <BrowserRouter>
      <UserContext.Provider
        value={{ currentUser, setCurrentUser, mode, toggleTheme, logout }}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <YamRoutes
            login={login}
            register={register}
            createProduct={createProduct}
            deleteProduct={deleteProduct}
            createBusiness={createBusiness}
            deleteBusiness={deleteBusiness}
            updateBusiness={updateBusiness}
            createSale={createSale}
            deleteSale={deleteSale}
            updateSale={updateSale}
            createBusinessSale={createBusinessSale}
            deleteBusinessSale={deleteBusinessSale}
            updateBusinessSale={updateBusinessSale}
            updateUser={updateUser}
            deleteUser={deleteUser}
          />
        </ThemeProvider>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
