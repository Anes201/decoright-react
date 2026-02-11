
import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

import Spinner from "../common/Spinner";
import { UserRoles } from "@/constants";
import type { Role } from "@/types/auth";

export default function RequireAdmin({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex flex-col gap-4 items-center justify-center h-hero">
      <Spinner size="lg" />
      <span className="text-xs"> Preparing your account… </span>
    </div>
  );

  if (!user) return null; // RequireAuth should handle this

  if ([UserRoles.ADMIN].includes(user.role as Role) === false) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
