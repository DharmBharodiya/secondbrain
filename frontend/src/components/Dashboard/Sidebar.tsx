import { NavLink, useNavigate } from "react-router";

import BlackLogo from "../../assets/images/black-logo.PNG";
import WhiteLogo from "../../assets/images/white-logo.PNG";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Button from "../Button";
import { Moon, Sun, ImageIcon } from "lucide-react";

const Sidebar = ({
  settings,
  setSettings,
}: {
  settings: boolean;
  setSettings: (value: boolean) => void;
}) => {
  const sidebarList = ["starred", "settings"];
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

  return (
    <div
      className={`${theme === "dark" ? "bg-orange-900/30" : "bg-slate-100"} px-4 py-3 shrink-0 h-screen w-60 flex flex-col justify-between`}
    >
      <div className="ml-4 mt-6 flex">
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
      </div>
      <div className="mb-20">
        {/* {sidebarList.map((bar, index) => (
          <div className="w-fit relative group ml-4 mb-4" key={index}>
            <a
              href={bar}
              className="hover:text-orange-600 transition-all duration-75 cursor-pointer font-semibold text-xl"
            >
              {bar}
            </a>
            <div className="border-2 z-10 border-orange-600 absolute w-full -left-30 opacity-0 group-hover:left-0 group-hover:opacity-100 transition-all duration-400 "></div>
          </div>
        ))} */}
        <div className="w-fit relative group ml-4 mb-4">
          <button
            className="hover:text-orange-600 transition-all duration-75 cursor-pointer font-semibold text-xl"
            onClick={handleSettings}
          >
            <p>folders</p>
          </button>
          <div className="border-2 z-10 border-orange-600 absolute w-full -left-30 opacity-0 group-hover:left-0 group-hover:opacity-100 transition-all duration-400 "></div>
          <div className="mt-3 ml-4">
            <ul>
              <li>
                <div className="flex">
                  <div className="flex justify-center items-center mr-1">
                    <ImageIcon className="size-4" />
                  </div>
                  <h1>images</h1>
                </div>
              </li>
              <li>
                <div className="flex">
                  <div className="flex justify-center items-center mr-1">
                    <ImageIcon className="size-4" />
                  </div>
                  <h1>instagram</h1>
                </div>
              </li>
              <li>
                <div className="flex">
                  <div className="flex justify-center items-center mr-1">
                    <ImageIcon className="size-4" />
                  </div>
                  <h1>twitter</h1>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-fit relative group ml-4 mb-4">
          <button
            className="hover:text-orange-600 transition-all duration-75 cursor-pointer font-semibold text-xl"
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
            className="hover:text-orange-600 transition-all duration-75 cursor-pointer font-semibold text-xl"
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
              extraStyles="hover:shadow-orange-500 hover:shadow-lg transition-all duration-75"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
