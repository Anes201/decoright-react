
// src/App.tsx
import AppRoutes from "@/routers/AppRoutes";
import ConfirmProvider from "@components/confirm/ConfirmProvider";
import { AuthProvider } from "@/contexts/AuthProvider";
import { Toaster } from "react-hot-toast";

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