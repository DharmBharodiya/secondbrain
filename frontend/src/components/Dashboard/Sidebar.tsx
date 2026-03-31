import { NavLink } from "react-router";

import BlackLogo from "../../assets/images/black-logo.PNG";
import WhiteLogo from "../../assets/images/white-logo.PNG";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

const Sidebar = () => {
  const sidebarList = [
    "starred",
    "quotes",
    "images",
    "settings",
    "theme",
    "logout",
    "login",
    "signup",
  ];
  const { theme } = useContext(AuthContext);

  return (
    <div className="bg-slate-100 px-4 py-3 shrink-0 h-screen w-60 flex flex-col justify-between">
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
        {sidebarList.map((bar, index) => (
          <div className="w-fit relative group ml-4 mb-4" key={index}>
            <a
              href={bar}
              className="hover:text-orange-600 transition-all duration-75 cursor-pointer font-semibold text-xl"
            >
              {bar}
            </a>
            <div className="border-2 z-10 border-orange-600 absolute w-full -left-30 opacity-0 group-hover:left-0 group-hover:opacity-100 transition-all duration-400 "></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
