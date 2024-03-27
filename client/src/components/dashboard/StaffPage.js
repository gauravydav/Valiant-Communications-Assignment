import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../logout/LogoutButton";

const StaffPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [uploadHistory, setUploadHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUploadHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:12000/api/upload-history",
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const formattedData = response.data.map((record) => ({
          ...record,
          uploadDateTime: new Date(record.uploadDateTime).toLocaleString(),
        }));
        setUploadHistory(formattedData);
      } catch (error) {
        console.error("Error fetching upload history:", error);
      }
    };

    fetchUploadHistory();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  const downloadResume = async (resumeUrl, fileName) => {
    try {
      const response = await fetch(`http://localhost:12000/${resumeUrl}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // Set the filename
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading resume:", error);
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: "50px" }}>
      <div>
        <h1 style={{ textAlign: "center" }}>Staff Page</h1>
        <LogoutButton />
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Contact Number</TableCell>
                <TableCell>Upload Date and Time</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {uploadHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No data available. Please ask students to fill in their
                    details.
                  </TableCell>
                </TableRow>
              ) : (
                uploadHistory
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((record) => (
                    <TableRow key={record._id}>
                      <TableCell>{record.name}</TableCell>
                      <TableCell>{record.email}</TableCell>
                      <TableCell>{record.contactNumber}</TableCell>
                      <TableCell>{record.uploadDateTime}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() =>
                            window.open(
                              `http://localhost:12000/${record.resumeUrl}`,
                              "_blank"
                            )
                          }
                        >
                          View Resume
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() =>
                            downloadResume(record.resumeUrl, record.name)
                          }
                        >
                          Download Resume
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={uploadHistory.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </Container>
  );
};

export default StaffPage;
