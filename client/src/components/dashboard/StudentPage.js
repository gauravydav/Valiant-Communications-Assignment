import React, { useState, useRef } from "react";
import axios from "axios";
import { Button, TextField, Container, Box, Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../logout/LogoutButton";
import * as Yup from "yup";

const StudentPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const inputFileRef = useRef(null);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    contactNumber: Yup.string()
      .matches(/^[9|8|6|7]\d{9}$/, "Invalid phone number")
      .required("Phone number is required"),
    resume: Yup.mixed().required("Resume is required"),
  });

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleContactNumberChange = (e) => {
    setContactNumber(e.target.value);
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    setResume(file);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(
        { name, email, contactNumber, resume },
        { abortEarly: false }
      );

      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("contactNumber", contactNumber);
      formData.append("resume", resume);

      const response = await axios.post(
        "http://localhost:12000/api/submitDetails",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        }
      );

      setMessage(response.data.message);
      setSeverity("success");
      setOpen(true);

      setName("");
      setEmail("");
      setContactNumber("");
      setResume(null);
      inputFileRef.current.value = "";
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errorMessage = error.errors.join(" ");
        setMessage(errorMessage);
      } else {
        setMessage("Server Error");
        console.error("Error submitting form:", error);
      }
      setSeverity("error");
      setOpen(true);
    }
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        marginTop: "3rem",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Student Page</h1>
      <LogoutButton />
      <Box p={3} style={{ borderRadius: "10px", marginBottom: "20px" }}>
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              label="Name"
              fullWidth
              value={name}
              onChange={handleNameChange}
              margin="normal"
              variant="outlined"
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Email"
              fullWidth
              type="email"
              value={email}
              onChange={handleEmailChange}
              margin="normal"
              variant="outlined"
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Contact Number"
              fullWidth
              value={contactNumber}
              onChange={handleContactNumberChange}
              margin="normal"
              variant="outlined"
            />
          </Box>
          <Box mb={2}>
            <input
              type="file"
              accept=".pdf"
              onChange={handleResumeChange}
              style={{ marginBottom: "10px" }}
              ref={inputFileRef}
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ display: "block", margin: "auto" }}
          >
            Submit
          </Button>
        </form>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={severity}
            sx={{ backgroundColor: severity === "success" ? "#4caf50" : "" }}
          >
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default StudentPage;
