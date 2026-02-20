
// src/App.tsx
import AppRoutes from "@/routers/AppRoutes";
import { AuthProvider } from "@/contexts/AuthProvider";
import { lazy } from "react";

const ConfirmProvider = lazy(() => import("@components/confirm/ConfirmProvider"));
const Toaster = lazy(() => import("react-hot-toast").then(module => ({ default: module.Toaster })));


function App() {
  return (
    <ConfirmProvider>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </ConfirmProvider>
  );
}

export default App