import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import ShareBoard from "./pages/Shareboard";
import NotFound from "./pages/NotFound";
import { useContext } from "react";
import { AuthContext } from "./Context/AuthContext";
import MobileSidebar from "./components/MobileSidebar";

function App() {
  const { theme } = useContext(AuthContext);

  return (
    <div
      className={`${theme === "dark" ? "bg-black text-white" : "bg-slate-200 text-black"} w-full min-h-screen flex flex-col justify-center items-center selection:bg-orange-600 selection:text-white`}
    >
      {/* <Navbar /> */}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />
        <Route path="/mobile" element={<MobileSidebar />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/brain/:shareId" element={<ShareBoard />} />

        <Route path="/*" element={<NotFound />} />

        {/* Add more routes here */}
      </Routes>
    </div>
  );
}

export default App;
