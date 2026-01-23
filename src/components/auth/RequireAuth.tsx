
import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { PATHS } from "@/routers/Paths";
import Spinner from "../common/Spinner";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex flex-col gap-4 items-center justify-center h-hero">
      <Spinner size="lg" />
      <span className="text-xs"> Preparing your account… </span>
    </div>
  ) ;

  if (!user) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

   return children;
}
