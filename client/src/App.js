import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/auth/SignInForm";
import RegisterPage from "./components/auth/SignUpForm";
import StudentPage from "./components/dashboard/StudentPage";
import StaffPage from "./components/dashboard/StaffPage";
import RoleBasedRoute from "./components/auth/RoleBasedRoute";
import NotFound from "./components/notFound/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/student"
          element={
            <RoleBasedRoute element={StudentPage} allowedRoles={["student"]} />
          }
        />
        <Route
          path="/staff"
          element={
            <RoleBasedRoute element={StaffPage} allowedRoles={["staff"]} />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
