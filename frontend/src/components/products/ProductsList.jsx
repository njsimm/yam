import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Title from "../dashboard/Title";
import UserContext from "../../utils/UserContext";
import YamAPI from "../../utils/YamApi";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

export default function ProductsList({ deleteProduct }) {
  const { currentUser } = useContext(UserContext);
  const [productsData, setProductsData] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      if (currentUser) {
        try {
          let products = await YamAPI.getAllProducts(currentUser.id);
          setProductsData(products);
        } catch (err) {
          console.error(
            "Products fetchProducts: problem loading products",
            err
          );
        }
      }
    }
    fetchProducts();
  }, [currentUser]);

  const handleDelete = async (productId) => {
    const response = await deleteProduct(productId);
    if (response.success) {
      setProductsData(
        productsData.filter((product) => product.id !== productId)
      );
    } else {
      console.error("Failed to delete product:", response.errors);
    }
  };

  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title>Product List</Title>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to="/products/add-product"
          >
            Add
          </Button>
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Price to Sell</TableCell>
              <TableCell align="center">Cost to Make</TableCell>
              <TableCell align="center">SKU</TableCell>
              <TableCell align="center">Minutes to Make</TableCell>
              <TableCell align="center">Qty/Inventory</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Last Updated</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productsData.map((product, idx) => (
              <TableRow key={idx}>
                <TableCell align="center">{product.name}</TableCell>
                <TableCell align="center">${product.price}</TableCell>
                <TableCell align="center">${product.cost}</TableCell>
                <TableCell align="center">{product.sku}</TableCell>
                <TableCell align="center">{product.minutesToMake}</TableCell>
                <TableCell align="center">{product.quantity}</TableCell>
                <TableCell align="center">{product.type}</TableCell>
                <TableCell align="center">{product.productUpdatedAt}</TableCell>
                <TableCell align="center">
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      component={Link}
                      to={`${product.id}`}
                      size="small"
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleDelete(product.id)}
                      size="small"
                    >
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Grid>
  );
}