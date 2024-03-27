import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
  Link,
  Snackbar,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MuiAlert from '@mui/material/Alert';
import * as yup from 'yup';

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
  name: yup.string().required('Name is required'),
  contactNumber: yup.string().matches(/^[6789]\d{9}$/, 'Invalid phone number').required('Contact number is required'),
});

const SignUpForm = () => {
  const navigate = useNavigate();
  const [signUpData, setSignUpData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    contactNumber: "",
    showPassword: false,
    showConfirmPassword: false,
  });
  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handlePasswordVisibility = () => {
    setSignUpData((prevData) => ({
      ...prevData,
      showPassword: !prevData.showPassword,
    }));
  };

  const handleConfirmPasswordVisibility = () => {
    setSignUpData((prevData) => ({
      ...prevData,
      showConfirmPassword: !prevData.showConfirmPassword,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await schema.validate(signUpData, { abortEarly: false });
  
      const newUser = {
        username: signUpData.username,
        email: signUpData.email,
        password: signUpData.password,
        name: signUpData.name,
        contactNumber: signUpData.contactNumber
      };
  
      await axios.post("http://localhost:12000/api/auth/register", newUser);
  
      setSnackbarSeverity("success");
      setSnackbarMessage("Registered successfully. You can now login.");
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Registration failed:', error);
      
      if (error && error.inner) {
        setErrors(error.inner.reduce((acc, current) => {
          acc[current.path] = current.message;
          return acc;
        }, {}));
      } else {
        console.error('Error:', error?.response?.data?.message);
        setErrors({});
      }
  
      setSnackbarSeverity("error");
      setSnackbarMessage( error?.response?.data?.message || "An error occurred during registration.");
      setSnackbarOpen(true);
    }
  };
  
  useEffect(() => {
    const isAuthenticated = false;
    if (isAuthenticated) {
      navigate('/'); 
    }
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{ padding: 3, width: "300px", margin: "auto", marginTop: "3rem" }}
      >
        <Typography component="div" style={{ textAlign: "center", marginTop: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Register here...
          </Typography>
        </Typography>

        <form onSubmit={handleSignUpSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            name="username"
            value={signUpData.username}
            onChange={handleInputChange}
            error={!!errors.username}
            helperText={errors.username}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            name="email"
            value={signUpData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Password"
            type={signUpData.showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            name="password"
            value={signUpData.password}
            onChange={handleInputChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handlePasswordVisibility}>
                    {signUpData.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            label="Confirm Password"
            type={signUpData.showConfirmPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            name="confirmPassword"
            value={signUpData.confirmPassword}
            onChange={handleInputChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleConfirmPasswordVisibility}>
                    {signUpData.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
         
         <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            name="name"
            value={signUpData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Contact Number"
            fullWidth
            margin="normal"
            name="contactNumber"
            value={signUpData.contactNumber}
            onChange={handleInputChange}
            error={!!errors.contactNumber}
            helperText={errors.contactNumber}
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
          >
            Sign Up
          </Button>
        </form>

        <Typography
          component="div"
          style={{ textAlign: "center", marginTop: 1 }}
        >
          <Link href="/" onClick={() => navigate('/')}>
            Already registered? Login here
          </Link>
        </Typography>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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
    </>
  );
};

export default SignUpForm;

