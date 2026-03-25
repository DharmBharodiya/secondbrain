import { createContext } from "react";
import { useState, useEffect } from "react";

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
};

export const AuthContext = createContext<AuthContextType | null>({
  token: null,
  setToken: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>("");
  const [loading, setLoading] = useState(true);

  // Restore token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
