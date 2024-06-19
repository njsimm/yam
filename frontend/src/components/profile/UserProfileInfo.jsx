import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import UserContext from "../../utils/UserContext";

const UserProfileInfo = ({ updateUser, deleteUser }) => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
  });
  const [originalData, setOriginalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const userData = {
        username: currentUser.username || "",
        email: currentUser.email || "",
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
      };
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [currentUser]);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((fData) => ({
      ...fData,
      [name]: value,
    }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const response = await updateUser(formData);
    if (response.success) {
      setCurrentUser({ ...currentUser, ...formData });
      setIsEditing(false);
    } else {
      console.error("Failed to update user");
    }
  };

  const handleDelete = async () => {
    const response = await deleteUser();
    if (response.success) {
      navigate("/");
    } else {
      console.error("Failed to delete user");
    }
  };

  const handleEditClick = (evt) => {
    evt.preventDefault();
    setIsEditing(true);
  };

  const handleCancelClick = (evt) => {
    evt.preventDefault();
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleChangePasswordClick = (evt) => {
    evt.preventDefault();
    navigate(`/users/${currentUser.id}/change-password`);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid item xs={12}>
      <Paper
        elevation={10}
        sx={{ p: 2, display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h6" gutterBottom>
          Edit Profile
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <TextField
            fullWidth
            margin="normal"
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={!isEditing}
          />
          {!isEditing && (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleChangePasswordClick}
              sx={{ mt: 2 }}
            >
              Change Password
            </Button>
          )}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            {isEditing ? (
              <>
                <Button variant="contained" color="primary" type="submit">
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCancelClick}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEditClick}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleClickOpen}
                >
                  Delete
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Paper>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete your profile? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default UserProfileInfo;
