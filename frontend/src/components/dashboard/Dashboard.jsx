import React from "react";
import ProtectedLayout from "../layout/ProtectedLayout";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TotalMoney from "./TotalMoney";
import Sales from "./Sales";
import Chart from "./Chart";

export default function Dashboard() {
  return (
    <ProtectedLayout title="Dashboard">
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            elevation={10}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <Chart />
          </Paper>
        </Grid>
        {/* Total Sales */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            elevation={10}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <TotalMoney />
          </Paper>
        </Grid>
        {/* Recent Sales */}
        <Grid item xs={12}>
          <Paper
            elevation={10}
            sx={{ p: 2, display: "flex", flexDirection: "column" }}
          >
            <Sales />
          </Paper>
        </Grid>
      </Grid>
    </ProtectedLayout>
  );
}
