import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/auth/SignInForm";
import RegisterPage from "./components/auth/SignUpForm";
import StudentPage from "./components/dashboard/StudentPage";
import StaffPage from "./components/dashboard/StaffPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/staff" element={<StudentPage />} />
        <Route path="/student" element={<StaffPage />} />
      </Routes>
    </Router>
  );
}

export default App;
