import React, { useContext, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Title from "./Title";
import UserContext from "../../utils/UserContext";
import YamAPI from "../../utils/YamApi";

export default function TotalMoney() {
  const { currentUser } = useContext(UserContext);
  const [totalMoney, setTotalMoney] = useState(0);

  useEffect(() => {
    async function fetchSales() {
      if (currentUser) {
        try {
          let sales = await YamAPI.getAllSalesInfo(currentUser.id);
          let total = sales.reduce((acc, sale) => {
            const totalReceived = sale.quantitySold * sale.salePrice;
            const costToMake = sale.quantitySold * sale.cost;
            const profit = totalReceived - costToMake;
            const adjustedProfit = sale.businessPercentage
              ? profit * (1 - sale.businessPercentage / 100)
              : profit;
            return acc + adjustedProfit;
          }, 0);
          setTotalMoney(total);
        } catch (err) {
          console.error("TotalMoney fetchSales: problem loading sales", err);
        }
      }
    }
    fetchSales();
  }, [currentUser]);

  return (
    <React.Fragment>
      <Title>Total Money Made</Title>
      <Typography component="p" variant="h4">
        ${totalMoney.toFixed(2)}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {new Date().toLocaleDateString()}
      </Typography>
    </React.Fragment>
  );
}
