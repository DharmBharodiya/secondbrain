import Button from "./Button";
import { useState, useEffect, useContext } from "react";
import { Menu, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { AuthContext } from "../Context/AuthContext";
import BlackLogo from "../assets/images/black-logo.PNG";
import WhiteLogo from "../assets/images/white-logo.PNG";
import Sidebar from "./Dashboard/Sidebar";
import Settings from "./Settings";
import MobileSidebar from "./MobileSidebar";

interface NavbarProps {
  scrollElement?: HTMLElement | null;
}

const Navbar2 = ({ scrollElement }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settings, setSettings] = useState(false);

  const navigate = useNavigate();

  const { theme, setTheme } = useContext(AuthContext);

  const { loggedIn, logOut } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollElement) {
        setScrolled(scrollElement.scrollTop > 20);
      } else {
        setScrolled(window.scrollY > 20);
      }
    };

    const element = scrollElement || window;
    element.addEventListener("scroll", handleScroll);
    return () => element.removeEventListener("scroll", handleScroll);
  }, [scrollElement]);

  return (
    <div
      className={` fixed top-10 left-0 right-0 rounded-full z-10000 px-3 py-3 ${scrolled ? "bg-white/70 backdrop-blur-sm shadow-md py-3 w-[90%] md:w-[60%] flex flex-col justify-between items-center ml-auto mr-auto" : "w-[90%] mr-5 ml-5 flex flex-col justify-between items-center"}`}
    >
      <div className="flex justify-between w-full">
        <div className="ml-4 flex justify-center items-center">
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

        <div className="flex justify-center items-center md:hidden relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="cursor-pointer"
          >
            {!menuOpen ? (
              <Menu className="text-orange-600 font-bold self-center" />
            ) : (
              <X className="text-orange-600 font-bold self-center justify-center" />
            )}
          </button>

          {/* {menuOpen ? <MobileMenu /> : ""} */}
        </div>
      </div>
      <div>
        {menuOpen && (
          <MobileSidebar
            settings={settings}
            setSettings={setSettings}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
          />
        )}
      </div>
    </div>
  );
};

export default Navbar2;
