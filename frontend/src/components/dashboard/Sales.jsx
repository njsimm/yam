import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Title from "./Title";
import UserContext from "../../utils/UserContext";
import YamAPI from "../../utils/YamApi";
import Box from "@mui/material/Box";

export default function Sales() {
  const { currentUser } = useContext(UserContext);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    async function fetchSales() {
      if (currentUser) {
        try {
          let sales = await YamAPI.getAllSalesInfo(currentUser.id);
          setSalesData(sales);
        } catch (err) {
          console.error("Problem loading sales");
        }
      }
    }
    fetchSales();
  }, [currentUser]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

  return (
    <React.Fragment>
      <Title>Recent Sales</Title>
      <Box sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Quantity Sold</TableCell>
              <TableCell>Sale Price</TableCell>
              <TableCell>Cost to Make</TableCell>
              <TableCell align="right">Profit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesData.slice(0, 6).map((sale, idx) => {
              const costToMake = sale.quantitySold * sale.cost;
              const profit = calculateProfit(sale);

              return (
                <TableRow key={idx}>
                  <TableCell>{formatDate(sale.saleDate)}</TableCell>
                  <TableCell>{sale.name}</TableCell>
                  <TableCell>{sale.quantitySold}</TableCell>
                  <TableCell>{sale.salePrice}</TableCell>
                  <TableCell>{`$${costToMake.toFixed(2)}`}</TableCell>
                  <TableCell align="right">{`$${profit}`}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        component={Link}
        to={`/users/${currentUser.id}/sales`}
      >
        See more sales
      </Button>
    </React.Fragment>
  );
}
