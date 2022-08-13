import * as React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Deposits from "../../components/AdminDashboard/Deposits";
import AdminDashboardProduct from "../../components/AdminDashboard/Products";

function Dashboard() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        LAYOUT THÔI NHÉ, CHƯA CÓ API
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <Deposits />
        </Paper>
      </Grid>
      {/* Recent Questions */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <AdminDashboardProduct />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default function AdminDashboard() {
  return <Dashboard />;
}
