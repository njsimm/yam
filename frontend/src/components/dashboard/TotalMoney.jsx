import React, { useContext, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Title from "./Title";
import UserContext from "../../utils/UserContext";
import YamAPI from "../../utils/YamApi";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function TotalMoney() {
  const { currentUser } = useContext(UserContext);
  // const [totalMoney, setTotalMoney] = useState(0);
  const [dataset, setDataset] = useState({ All: 0 });
  const [selectedYear, setSelectedYear] = useState("All");

  useEffect(() => {
    async function fetchSalesData() {
      if (currentUser) {
        try {
          let sales = await YamAPI.getAllSalesInfo(currentUser.id);

          let yearlySales = { All: 0 };

          sales.forEach((sale) => {
            const saleDate = new Date(sale.saleDate);
            const saleYear = saleDate.getFullYear();
            const profit = calculateProfit(sale);

            if (!yearlySales[saleYear]) {
              yearlySales[saleYear] = 0;
            }

            yearlySales[saleYear] += profit;
            yearlySales.All += profit;
          });

          setDataset(yearlySales);

          // Set the initial selected year to the current year or "All"
          const currentYear = new Date().getFullYear().toString();
          if (yearlySales[currentYear]) {
            setSelectedYear(currentYear);
          } else {
            setSelectedYear("All");
          }
        } catch (err) {
          console.error("Problem loading information");
        }
      }
    }

    fetchSalesData();
  }, [currentUser]);

  const handleChangeYear = (event) => {
    setSelectedYear(event.target.value);
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
    return parseFloat(profit.toFixed(2));
  };

  return (
    <React.Fragment>
      <FormControl size="small" sx={{ width: 120, mb: 2 }}>
        <InputLabel id="year-select-label">Select Year</InputLabel>
        <Select
          labelId="year-select-label"
          value={selectedYear}
          onChange={handleChangeYear}
          label="Select Year"
        >
          {Object.keys(dataset).map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Title>Total Money Made</Title>
      <Typography component="p" variant="h4">
        ${dataset[selectedYear] ? dataset[selectedYear].toFixed(2) : 0.0}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {selectedYear === "All"
          ? `as of ${new Date().toLocaleDateString()}`
          : `in ${selectedYear}`}
      </Typography>
    </React.Fragment>
  );
}
