import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./store/AppContext";
import { Toaster } from "sonner";

import CustomerLogin from "./pages/customer/Login";
import CustomerDashboard from "./pages/customer/Dashboard";

import OfficeLogin from "./pages/office/Login";
import { Dashboard as OfficeDashboard } from "./pages/office/Dashboard";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { state, initializing } = useApp();
  
  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!state.currentUser) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CustomerLogin />} />
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/office-login" element={<OfficeLogin />} />
      <Route path="/office/dashboard" element={<OfficeDashboard />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppProvider>
        <Toaster position="top-right" richColors />
        <AppRoutes />
      </AppProvider>
    </Router>
  );
}

export default App;