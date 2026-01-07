
import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import type { JSX } from "react";
import type { Role } from "@/types/auth";

export default function RequireRole({
  roles,
  children,
}: {
  roles: Role[];
  children: JSX.Element;
}) {
  const { user } = useAuth();

  if (!user) return null; // RequireAuth should handle this

  if (!roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
