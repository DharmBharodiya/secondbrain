import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { loggedIn } = useContext(AuthContext);

  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
