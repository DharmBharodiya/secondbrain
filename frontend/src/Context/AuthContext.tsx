import { createContext } from "react";
import { useState, useEffect } from "react";

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  logOut: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  loggedIn: false,
  setLoggedIn: () => {},
  logOut: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>("");
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  // Restore token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setLoggedIn(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  function logOut() {
    localStorage.removeItem("token");
    setToken("");
    setLoggedIn(false);
  }

  return (
    <AuthContext.Provider
      value={{ token, setToken, loggedIn, setLoggedIn, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};
