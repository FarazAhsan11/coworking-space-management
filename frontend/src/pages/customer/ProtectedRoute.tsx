import { Navigate } from "react-router-dom";
import { useApp } from "@/store/AppContext";
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { state } = useApp();
  if (!state.currentUser) return <Navigate to="/" replace />;
  return <>{children}</>;
}
