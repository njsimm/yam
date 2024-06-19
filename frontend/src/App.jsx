import { useState, useEffect } from "react";
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
import { SidebarProvider } from "./utils/SidebarContext";

/** The key name for storing JWT token in localStorage. The value for this key will be the JWT.
 *
 * export is used so that it can be used in other files if needed.
 */
export const TOKEN_STORAGE_ID = "yam-token";

function App() {
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [mode, setMode] = useLocalStorage("theme", "light");

  useEffect(
    function loadUserInfo() {
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
      return { success: false, errors };
    }
  }

  const theme = mode === "light" ? lightTheme : darkTheme;

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
        <SidebarProvider>
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
        </SidebarProvider>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
