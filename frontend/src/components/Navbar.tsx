import Button from "./Button";
import { useState, useEffect, useContext } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { AuthContext } from "../Context/AuthContext";
import BlackLogo from "../assets/images/black-logo.PNG";
import WhiteLogo from "../assets/images/white-logo.PNG";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const { theme, setTheme } = useContext(AuthContext);

  const { loggedIn, logOut } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logOut();
    setMenuOpen(false);
    navigate("/");
  };

  const handleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <div
      className={` fixed top-10 rounded-full z-10000 px-3 py-3 ${scrolled ? "bg-white/70 backdrop-blur-sm shadow-md py-3 w-[80%] md:w-[60%] flex justify-between items-center" : "w-full mr-5 ml-5 flex justify-around items-center"}`}
    >
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

      <div className="hidden md:flex justify-center items-center">
        {!loggedIn ? (
          <>
            <NavLink to="/login">
              <Button
                text={"Log in"}
                variant={theme === "dark" ? "dark" : "normal"}
              />
            </NavLink>
            <NavLink to="/signup">
              <Button
                text={"Sign Up"}
                variant="orange"
                extraStyles=" hover:shadow-orange-500 hover:shadow-xl transition-all duration-75"
              />
            </NavLink>
            <button className="ml-3 cursor-pointer" onClick={handleTheme}>
              {theme === "dark" ? <Sun /> : <Moon />}
            </button>
          </>
        ) : (
          <>
            <Button
              text={"Log Out"}
              variant="orange"
              clickEvent={handleLogout}
              extraStyles="hover:shadow-orange-500 hover:shadow-xl transition-all duration-75"
            />
            <button className="ml-3 cursor-pointer" onClick={handleTheme}>
              {theme === "dark" ? <Sun /> : <Moon />}
            </button>
          </>
        )}
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

        {menuOpen ? (
          <div
            className={`absolute -right-2 top-10 px-4 rounded-full bg-white/50 backdrop-blur-md shadow-md py-3 min-w-max flex  flex-col justify-between items-center `}
          >
            <div className="md:hidden flex justify-center items-center whitespace-nowrap">
              {!loggedIn ? (
                <>
                  <NavLink to="/login">
                    <Button
                      text={"Log in"}
                      variant="normal"
                      extraStyles="w-full"
                    />
                  </NavLink>
                  <NavLink to="/signup">
                    <Button
                      text={"Sign Up"}
                      variant="orange"
                      extraStyles="w-full hover:shadow-orange-500 hover:shadow-xl transition-all duration-75"
                    />
                  </NavLink>
                  <button
                    className="ml-3 cursor-pointer w-full"
                    onClick={handleTheme}
                  >
                    {theme === "dark" ? <Sun /> : <Moon />}
                  </button>
                </>
              ) : (
                <>
                  <Button
                    text={"Log Out"}
                    variant="orange"
                    clickEvent={handleLogout}
                    extraStyles="hover:shadow-orange-500 hover:shadow-xl transition-all duration-75"
                  />
                  <button className="ml-3 cursor-pointer" onClick={handleTheme}>
                    {theme === "dark" ? <Sun /> : <Moon />}
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Navbar;
