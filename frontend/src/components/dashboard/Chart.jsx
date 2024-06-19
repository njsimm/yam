import { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { BarChart } from "@mui/x-charts/BarChart";
import YamAPI from "../../utils/YamApi";
import UserContext from "../../utils/UserContext";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

export default function Chart() {
  const { currentUser } = useContext(UserContext);
  const [dataset, setDataset] = useState({});
  const [selectedYear, setSelectedYear] = useState("");

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

  useEffect(() => {
    async function fetchSalesData() {
      if (currentUser) {
        try {
          let sales = await YamAPI.getAllSalesInfo(currentUser.id);

          let yearlySales = {};

          sales.forEach((sale) => {
            const saleDate = new Date(sale.saleDate);
            const saleYear = saleDate.getFullYear();
            const saleMonth = saleDate.getMonth();
            const profit = calculateProfit(sale);

            if (!yearlySales[saleYear]) {
              yearlySales[saleYear] = Array(12)
                .fill(0)
                .map(() => ({
                  sales: 0,
                  businessSales: 0,
                  combinedSales: 0,
                }));
            }

            if (sale.businessSaleId) {
              yearlySales[saleYear][saleMonth].businessSales += profit;
            } else {
              yearlySales[saleYear][saleMonth].sales += profit;
            }
            yearlySales[saleYear][saleMonth].combinedSales += profit;
          });

          setDataset(yearlySales);

          // Set the initial selected year to the current year or the first available year
          const currentYear = new Date().getFullYear().toString();
          if (yearlySales[currentYear]) {
            setSelectedYear(currentYear);
          } else {
            setSelectedYear(Object.keys(yearlySales)[0] || "");
          }
        } catch (err) {
          console.error("Problem loading sales");
        }
      }
    }

    fetchSalesData();
  }, [currentUser]);

  const handleChangeYear = (event) => {
    setSelectedYear(event.target.value);
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const series =
    selectedYear && dataset[selectedYear]
      ? [
          {
            label: "Direct Sales",
            data: dataset[selectedYear].map((item) => item.sales),
          },
          {
            label: "Business Sales",
            data: dataset[selectedYear].map((item) => item.businessSales),
          },
          {
            label: "Combined Sales",
            data: dataset[selectedYear].map((item) => item.combinedSales),
          },
        ].map((s) => ({
          ...s,
          highlightScope: {
            highlighted: "series",
            faded: "global",
          },
          tooltipFormatter: (value) => value.toFixed(2),
        }))
      : [];

  // Calculate the maximum value from the dataset for the selected year
  const maxValue =
    selectedYear && dataset[selectedYear]
      ? Math.max(
          ...dataset[selectedYear].flatMap((item) => [
            item.sales,
            item.businessSales,
            item.combinedSales,
          ])
        )
      : 0;

  // Calculate the minimum value from the dataset for the selected year
  const minValue =
    selectedYear && dataset[selectedYear]
      ? Math.min(
          0,
          ...dataset[selectedYear].flatMap((item) => [
            item.sales,
            item.businessSales,
            item.combinedSales,
          ])
        )
      : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
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
      </Box>
      {selectedYear && dataset[selectedYear] ? (
        <BarChart
          height={200}
          series={series}
          xAxis={[
            {
              scaleType: "band",
              data: months,
            },
          ]}
          yAxis={[
            {
              min: minValue,
              max: maxValue + 10,
            },
          ]}
          skipAnimation={false}
        />
      ) : (
        <Box
          sx={{
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p>No data available for the selected year.</p>
        </Box>
      )}
    </Box>
  );
}
