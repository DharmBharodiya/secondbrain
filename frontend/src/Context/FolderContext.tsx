import { createContext, useState } from "react";

type FolderContextType = {
  folders: string | null;
  setFolders: React.Dispatch<React.SetStateAction<string | null>>;
};

export const FolderContent = createContext<FolderContextType>({
  folders: "all",
  setFolders: () => {},
});

export const FolderProvider = ({ children }: { children: React.ReactNode }) => {
  const [folders, setFolders] = useState<string | null>("all");

  return (
    <FolderContent.Provider value={{ folders, setFolders }}>
      {children}
    </FolderContent.Provider>
  );
};
