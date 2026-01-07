// src/App.tsx
import { BrowserRouter } from "react-router-dom";
// import { AuthProvider } from "@/contexts/AuthProvider";
import AppRoutes from "@/routers/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      {/* <AuthProvider>
      </AuthProvider> */}
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App