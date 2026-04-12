import { NavLink, useNavigate } from "react-router";

import BlackLogo from "../assets/images/black-logo.PNG";
import WhiteLogo from "../assets/images/white-logo.PNG";
import { useContext, useState } from "react";
import Button from "./Button";
import { AuthContext } from "@/Context/AuthContext";
import { Camera, FileImage, Moon, Quote, Sun, X } from "lucide-react";
import { FolderContent } from "@/Context/FolderContext";

const MobileSidebar = ({
  settings,
  setSettings,
  menuOpen,
  setMenuOpen,
}: {
  settings: boolean;
  setSettings: (value: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
}) => {
  const { theme, setTheme } = useContext(AuthContext);
  const {
    loggedIn,
    logOut,
    starredOpened,
    setStarredOpened,
    setSettingsOpened,
    settingsOpened,
  } = useContext(AuthContext);

  const navigate = useNavigate();
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  const { folders, setFolders } = useContext(FolderContent);

  const handleLogout = () => {
    logOut();
    // setMenuOpen(false);
    navigate("/");
  };

  //   useEffect(() => {
  //     setStarredOpened(false);
  //   }, []);

  const handleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };
  const handleStarred = () => {
    setStarredOpened(!starredOpened);
  };

  const handleSettings = () => {
    setSettingsOpened(!settingsOpened);
    setSettings(!settings);
  };

  const handleFilterClick = (type: string) => {
    if (folders === type) {
      setFolders("all"); // deselect if already selected
    } else {
      setFolders(type); // select the new type
    }
  };

  return (
    <div
      className={`fixed inset-0 top-0 left-0 right-0 bottom-0 ${theme === "dark" ? "bg-black" : "bg-white"} px-4 py-3 w-full h-screen flex flex-col justify-between items-center z-9999`}
    >
      <div className="w-[80%] mt-6 flex justify-between items-center">
        <NavLink to="/" className="flex justify-center items-center">
          <img
            src={theme === "dark" ? WhiteLogo : BlackLogo}
            className="w-7 h-7 mr-2"
            alt="logo"
          />{" "}
          <h1
            className={`${theme === "dark" ? "text-white" : "text-black"} font-advercase text-2xl`}
          >
            Archive
          </h1>
        </NavLink>
        <div className="flex justify-center items-center">
          <button onClick={() => setMenuOpen(false)} className="cursor-pointer">
            <X className="w-8 h-8 text-orange-600" />
          </button>
        </div>
      </div>
      <div className="mb-20">
        <div className="max-w-fit relative ml-4 mb-4">
          <div className="group max-w-fit ">
            <button
              className="hover:text-orange-600 transition-all duration-75 cursor-pointer font-semibold text-3xl"
              onClick={() => {
                setFolders("all");
                setSubMenuOpen((prev) => !prev);
              }}
            >
              <p>folders</p>
            </button>
            <div className="border-2 z-10 border-orange-600 absolute w-full -left-30 opacity-0 group-hover:left-0 group-hover:opacity-100 transition-all duration-400 "></div>
          </div>
          {subMenuOpen && (
            <div className="mt-3 ml-4 transition-all duration-300">
              <ul>
                <li>
                  <button
                    onClick={() => handleFilterClick("image")}
                    className="flex cursor-pointer"
                  >
                    <div className="flex justify-center items-center mr-1">
                      <FileImage className="size-4" />
                    </div>
                    <h1
                      className={
                        folders === "image" ? "text-orange-600" : "text-black"
                      }
                    >
                      images
                    </h1>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleFilterClick("instagram")}
                    className="flex cursor-pointer"
                  >
                    <div className="flex justify-center items-center mr-1">
                      <Camera className="size-4" />
                    </div>
                    <h1
                      className={
                        folders === "instagram" ? "text-orange-600" : ""
                      }
                    >
                      instagram
                    </h1>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleFilterClick("twitter")}
                    className="flex cursor-pointer"
                  >
                    <div className="flex justify-center items-center mr-1">
                      <X className="size-4" />
                    </div>
                    <h1
                      className={folders === "twitter" ? "text-orange-600" : ""}
                    >
                      twitter
                    </h1>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleFilterClick("quote")}
                    className="flex cursor-pointer"
                  >
                    <div className="flex justify-center items-center mr-1">
                      <Quote className="size-4" />
                    </div>
                    <h1
                      className={folders === "quote" ? "text-orange-600" : ""}
                    >
                      quotes
                    </h1>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="w-fit relative group ml-4 mb-4">
          <button
            className="hover:text-orange-600 transition-all duration-75 cursor-pointer font-semibold text-3xl"
            onClick={handleStarred}
          >
            {starredOpened ? (
              <p className="text-orange-500">back to dashboard</p>
            ) : (
              <p>starred</p>
            )}
          </button>
          <div className="border-2 z-10 border-orange-600 absolute w-full -left-30 opacity-0 group-hover:left-0 group-hover:opacity-100 transition-all duration-400 "></div>
        </div>
        <div className="w-fit relative group ml-4 mb-4">
          <button
            className="hover:text-orange-600 transition-all duration-75 cursor-pointer font-semibold text-3xl"
            onClick={handleSettings}
          >
            {settingsOpened ? (
              <p className="text-orange-500">back to dashboard</p>
            ) : (
              <p>settings</p>
            )}
          </button>
          <div className="border-2 z-10 border-orange-600 absolute w-full -left-30 opacity-0 group-hover:left-0 group-hover:opacity-100 transition-all duration-400 "></div>
        </div>
        <button className="ml-3 cursor-pointer" onClick={handleTheme}>
          {theme === "dark" ? <Sun /> : <Moon />}
        </button>
      </div>
      <div className="mb-10 ml-4">
        {" "}
        {!loggedIn ? (
          <>
            <NavLink to="/login">
              <Button text={"Log in"} variant="normal" extraStyles="w-full" />
            </NavLink>
            <NavLink to="/signup">
              <Button
                text={"Sign Up"}
                variant="orange"
                extraStyles="w-full hover:shadow-orange-500 hover:shadow-lg transition-all duration-75"
              />
            </NavLink>
          </>
        ) : (
          <>
            <Button
              text={"Log Out"}
              variant="orange"
              clickEvent={handleLogout}
              extraStyles="hover:shadow-orange-500 hover:shadow-lg transition-all duration-75 text-xl font-semibold px-6 py-3"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MobileSidebar;
