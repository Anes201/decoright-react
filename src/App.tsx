
import AppRoutes from "@/routers/AppRoutes";
import ConfirmProvider from "@components/confirm/ConfirmProvider";

function App() {
  return (
    <ConfirmProvider>
      <AppRoutes />
    </ConfirmProvider>
  );
}

export default App