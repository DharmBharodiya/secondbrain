import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Navigate } from "react-router";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { loggedIn } = useContext(AuthContext);

  if (loggedIn) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PublicRoute;
