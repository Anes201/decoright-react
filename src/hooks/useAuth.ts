import { AuthContext } from "@/contexts/AuthProvider";
import { useContext } from "react";

export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}