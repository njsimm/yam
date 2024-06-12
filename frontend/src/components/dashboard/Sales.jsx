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
          console.error("Sales fetchSales: problem loading sales", err);
        }
      }
    }
    fetchSales();
  }, [currentUser]);
  return (
    <React.Fragment>
      <Title>Recent Sales</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Quantity Sold</TableCell>
            <TableCell>Sale Price</TableCell>
            <TableCell align="right">Total Recieved</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* add uuid later */}
          {salesData.slice(0, 6).map((sale, idx) => {
            const totalReceived = sale.quantitySold * sale.salePrice;
            const adjustedTotalReceived = sale.businessPercentage
              ? totalReceived * (1 - sale.businessPercentage / 100)
              : totalReceived;

            return (
              <TableRow key={idx}>
                <TableCell>{sale.saleDate}</TableCell>
                <TableCell>{sale.name}</TableCell>
                <TableCell>{sale.quantitySold}</TableCell>
                <TableCell>{sale.salePrice}</TableCell>
                <TableCell align="right">{`$${adjustedTotalReceived.toFixed(
                  2
                )}`}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Button
        variant="outlined"
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
