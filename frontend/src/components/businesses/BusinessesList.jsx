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

export default function BusinessesList({ deleteBusiness }) {
  const { currentUser } = useContext(UserContext);
  const [businessesData, setBusinessesData] = useState([]);

  useEffect(() => {
    async function fetchBusinesses() {
      if (currentUser) {
        try {
          let businesses = await YamAPI.getAllBusinesses(currentUser.id);
          setBusinessesData(businesses);
        } catch (err) {
          console.error("Problem loading businesses");
        }
      }
    }
    fetchBusinesses();
  }, [currentUser]);

  const handleDelete = async (businessId) => {
    const response = await deleteBusiness(businessId);
    if (response.success) {
      setBusinessesData(
        businessesData.filter((business) => business.id !== businessId)
      );
    } else {
      console.error("Failed to delete business:");
    }
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
          <Title>Businesses List</Title>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/businesses/add-business"
          >
            Add
          </Button>
        </Box>
        <Box sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Contact Info</TableCell>
                <TableCell align="center">Created At</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {businessesData.map((business, idx) => (
                <TableRow key={idx}>
                  <TableCell align="center">{business.name}</TableCell>
                  <TableCell align="center">{business.contactInfo}</TableCell>
                  <TableCell align="center">
                    {formatDate(business.createdAt)}
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to={`/businesses/${business.id}/update`}
                        size="small"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleDelete(business.id)}
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
        </Box>
      </Paper>
    </Grid>
  );
}
