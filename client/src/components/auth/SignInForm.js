import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
  Link,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import MuiAlert from "@mui/material/Alert";
import * as yup from "yup";

const SignInForm = () => {
  const navigate = useNavigate();
  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
    showPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [userRole, setUserRole] = useState("");

  const validationSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
  });

  const handlePasswordVisibility = () => {
    setSignInData((prevData) => ({
      ...prevData,
      showPassword: !prevData.showPassword,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignInData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await validationSchema.validate(signInData, { abortEarly: false });

      const response = await axios.post(
        "http://localhost:12000/api/auth/login",
        signInData
      );

      const { token } = response.data;
      localStorage.setItem("token", token);
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;
      setUserRole(userRole);
      setSnackbarSeverity("success");
      setSnackbarMessage(`Navigating to ${userRole} page...`);
      setSnackbarOpen(true);

      setTimeout(() => {
        if (userRole === "student") {
          navigate("/student");
        } else if (userRole === "staff") {
          navigate("/staff");
        } else {
          console.error("Unknown role:", userRole);
        }
      }, 2000);
    } catch (error) {
      console.error("Login failed:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage(error.message || "An error occurred");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate("/register");
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper
      elevation={3}
      sx={{ padding: 3, width: "300px", margin: "auto", marginTop: "3rem" }}
    >
      <form onSubmit={handleSignInSubmit}>
        <Typography
          component="div"
          style={{ textAlign: "center", marginTop: 1 }}
        >
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Login here...
          </Typography>
        </Typography>

        <TextField
          label="Username"
          type="text"
          fullWidth
          margin="normal"
          name="username"
          value={signInData.username}
          onChange={handleInputChange}
          error={!!snackbarMessage && !signInData.username}
          helperText={!!snackbarMessage && !signInData.username && snackbarMessage}
        />

        <TextField
          label="Password"
          type={signInData.showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          name="password"
          value={signInData.password}
          onChange={handleInputChange}
          error={!!snackbarMessage && !signInData.password}
          helperText={!!snackbarMessage && !signInData.password && snackbarMessage}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handlePasswordVisibility}>
                  {signInData.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            marginTop: 2,
            bgcolor: "#0f2761",
            borderRadius: 20,
            color: "white",
          }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress color="inherit" size={24} />
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <Typography
        component="div"
        style={{ textAlign: "center", marginTop: 1 }}
      >
        <Link href="#" onClick={handleRegisterClick}>
          Not registered? Register here
        </Link>
      </Typography>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Paper>
  );
};

export default SignInForm;
