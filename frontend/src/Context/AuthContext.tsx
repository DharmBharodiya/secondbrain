import { createContext, useCallback } from "react";
import { useState, useEffect } from "react";

type Tags = {
  _id: string;
  title: string;
};

type UserContent = {
  title: string;
  type:
    | "youtube"
    | "twitter"
    | "spotify"
    | "default"
    | "article"
    | "quote"
    | "note"
    | "instagram"
    | string;
  link: string;
  notes: string;
  _id: string;
  tags: Tags[];
};

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  logOut: () => void;
  editData: UserContent;
  setEditData: (value: UserContent) => void;
  theme: "light" | "dark";
  setTheme: (value: "light" | "dark") => void;
  starredOpened: boolean;
  setStarredOpened: (value: boolean) => void;
  settingsOpened: boolean;
  setSettingsOpened: (value: boolean) => void;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  loggedIn: false,
  setLoggedIn: () => {},
  logOut: () => {},
  editData: {
    title: "",
    type: "",
    link: "",
    tags: [],
    notes: "",
    _id: "",
  },
  setEditData: () => {},
  theme: "light",
  setTheme: () => {},
  starredOpened: false,
  setStarredOpened: () => {},
  settingsOpened: false,
  setSettingsOpened: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>("");
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [editData, setEditData] = useState<UserContent>({
    title: "",
    type: "",
    link: "",
    tags: [],
    notes: "",
    _id: "",
  });
  const [settingsOpened, setSettingsOpened] = useState(false);

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [starredOpened, setStarredOpenedState] = useState(false);

  // Memoized wrapper to update state with logging
  const setStarredOpened = useCallback((value: boolean) => {
    console.log("setStarredOpened called with:", value);
    setStarredOpenedState(value);
  }, []);

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
      value={{
        token,
        setToken,
        loggedIn,
        setLoggedIn,
        logOut,
        editData,
        setEditData,
        theme,
        setTheme,
        starredOpened,
        setStarredOpened,
        settingsOpened,
        setSettingsOpened,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
