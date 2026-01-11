// src/App.tsx
import { BrowserRouter } from "react-router-dom";
// import { AuthProvider } from "@/contexts/AuthProvider";
import AppRoutes from "@/routers/AppRoutes";
import ConfirmProvider from "@components/confirm/ConfirmProvider";

function App() {
  return (
    <BrowserRouter>
      {/* <AuthProvider>
      </AuthProvider> */}
      <ConfirmProvider>
        <AppRoutes />
      </ConfirmProvider>
    </BrowserRouter>
  );
}

export default App