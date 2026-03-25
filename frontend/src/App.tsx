import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-white selection:bg-orange-600 selection:text-white">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Add more routes here */}
      </Routes>
    </div>
  );
}

export default App;
