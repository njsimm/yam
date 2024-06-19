import { useContext, useEffect, useState } from "react";
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

export default function SalesList({ deleteSale, deleteBusinessSale }) {
  const { currentUser } = useContext(UserContext);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    async function fetchSales() {
      if (currentUser) {
        try {
          let sales = await YamAPI.getAllSalesInfo(currentUser.id);
          setSalesData(
            sales.sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate))
          );
        } catch (err) {
          console.error("Problem loading sales");
        }
      }
    }
    fetchSales();
  }, [currentUser]);

  const handleDelete = async (
    saleId,
    businessSaleId,
    businessId,
    productId,
    quantitySold
  ) => {
    let response;
    if (businessSaleId) {
      response = await deleteBusinessSale(businessId, businessSaleId);
    } else {
      // Fetch the current product details
      const product = await YamAPI.getProductById(currentUser.id, productId);
      const newQuantity = product.quantity + quantitySold;

      // Update product quantity
      await YamAPI.updateProduct(currentUser.id, productId, {
        quantity: newQuantity,
      });

      // Delete the sale
      response = await deleteSale(productId, saleId);
    }
    if (response.success) {
      setSalesData(
        salesData.filter(
          (sale) =>
            !(sale.saleId === saleId && sale.businessSaleId === businessSaleId)
        )
      );
    } else {
      console.error("Failed to delete sale");
    }
  };

  const calculateProfit = (sale) => {
    const { salePrice, quantitySold, cost, businessPercentage } = sale;
    const totalReceived = salePrice * quantitySold;
    const consignmentShare = businessPercentage
      ? totalReceived * (businessPercentage / 100)
      : 0;
    const yourShare = totalReceived - consignmentShare;
    const costToMake = cost * quantitySold;
    const profit = yourShare - costToMake;
    return profit.toFixed(2);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Grid item xs={12}>
      <Paper
        elevation={10}
        sx={{ p: 2, display: "flex", flexDirection: "column" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title>Sales List</Title>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/sales/add-sale"
          >
            Add
          </Button>
        </Box>
        <Box sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">Sale Date</TableCell>
                <TableCell align="center">Product Name</TableCell>
                <TableCell align="center">Quantity Sold</TableCell>
                <TableCell align="center">Sale Price</TableCell>
                <TableCell align="center">Cost to Make</TableCell>
                <TableCell align="center">Business Name</TableCell>
                <TableCell align="center">Business Percentage</TableCell>
                <TableCell align="center">Profit</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesData.map((sale, idx) => {
                return (
                  <TableRow key={idx}>
                    <TableCell align="center">
                      {formatDate(sale.saleDate)}
                    </TableCell>
                    <TableCell align="center">{sale.name}</TableCell>
                    <TableCell align="center">{sale.quantitySold}</TableCell>
                    <TableCell align="center">{sale.salePrice}</TableCell>
                    <TableCell align="center">
                      {(sale.cost * sale.quantitySold).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      {sale.businessName || "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      {sale.businessPercentage || "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      {calculateProfit(sale)}
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          component={Link}
                          to={
                            sale.businessSaleId
                              ? `/businessSales/${sale.businessSaleId}/businesses/${sale.businessId}`
                              : `/sales/${sale.saleId}/products/${sale.productId}`
                          }
                          size="small"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            handleDelete(
                              sale.saleId,
                              sale.businessSaleId,
                              sale.businessId,
                              sale.productId,
                              sale.quantitySold
                            )
                          }
                          size="small"
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Grid>
  );
}
