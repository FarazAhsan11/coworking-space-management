import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/customer/Login";
import CustomerDashboard from "@/pages/customer/Dashboard";
import ProtectedRoute from "@/pages/customer/ProtectedRoute";
import { Dashboard as OfficeDashboard } from "@/pages/office/Dashboard";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/office" element={<OfficeDashboard />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
