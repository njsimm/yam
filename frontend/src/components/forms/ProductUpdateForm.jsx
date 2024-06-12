import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Container, Typography } from "@mui/material";

export default function ProductUpdateForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    cost: "",
    sku: "",
    minutesToMake: "",
    type: "",
    quantity: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        cost: product.cost || "",
        sku: product.sku || "",
        minutesToMake: product.minutesToMake || "",
        type: product.type || "",
        quantity: product.quantity || "",
      });
    }
  }, [product]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Convert string values to numbers for the appropriate fields
    const updatedFormData = {
      ...formData,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      quantity: parseInt(formData.quantity, 10),
      minutesToMake: formData.minutesToMake
        ? parseInt(formData.minutesToMake, 10)
        : null,
    };
    onSave(updatedFormData);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Update Product
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="price"
            label="Price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            type="number"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="cost"
            label="Cost"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            type="number"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="sku"
            label="SKU"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            id="minutesToMake"
            label="Minutes to Make"
            name="minutesToMake"
            value={formData.minutesToMake}
            onChange={handleChange}
            type="number"
          />
          <TextField
            margin="normal"
            fullWidth
            id="type"
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="quantity"
            label="Quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            type="number"
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
            <Button variant="outlined" color="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
