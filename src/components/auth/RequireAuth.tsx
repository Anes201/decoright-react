
import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) return null; // or spinner

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
