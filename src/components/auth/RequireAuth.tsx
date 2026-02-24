
import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { PATHS } from "@/routers/Paths";
import Spinner from "@components/common/Spinner";
import type { Role } from "@/types/auth";

export default function RequireAuth({
  children,
  role
}: {
  children: JSX.Element;
  role?: Role;
}) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return (
    <div className="flex flex-col gap-4 items-center justify-center h-hero">
      <Spinner size="lg" />
      <span className="text-xs"> Preparing your account… </span>
    </div>
  );

  if (!user) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  // For admin role guard, use isAdmin boolean which covers both admin and super_admin
  if (role === 'admin' && !isAdmin) {
    return <Navigate to={PATHS.ROOT} replace />;
  }

  // For any other specific role, do an exact check
  if (role && role !== 'admin' && user.role !== role) {
    return <Navigate to={PATHS.ROOT} replace />;
  }

  return children;
}
