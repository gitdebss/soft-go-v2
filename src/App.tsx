import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";


function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster />
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
