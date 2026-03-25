import Button from "./Button";
import { useState, useEffect, useContext } from "react";
import { Menu, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { AuthContext } from "../Context/AuthContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

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

  return (
    <div
      className={` fixed top-10 rounded-full px-3 py-3 ${scrolled ? "bg-white/70 backdrop-blur-sm shadow-md py-3 w-[80%] md:w-[60%] flex justify-between items-center" : "w-full mr-5 ml-5 flex justify-around items-center"}`}
    >
      <div className="ml-4 flex justify-center items-center">
        <NavLink to="/" className="flex justify-center items-center">
          <img
            src="src/assets/images/black-logo.PNG"
            className="w-7 h-7 mr-2"
            alt="logo"
          />{" "}
          <h1 className="font-advercase text-2xl text-gray-800 ">Archive</h1>
        </NavLink>
      </div>

      <div className="hidden md:flex justify-center items-center">
        {!loggedIn ? (
          <>
            <NavLink to="/login">
              <Button text={"Log in"} variant="normal" />
            </NavLink>
            <NavLink to="/signup">
              <Button
                text={"Sign Up"}
                variant="orange"
                extraStyles=" hover:shadow-orange-500 hover:shadow-xl transition-all duration-75"
              />
            </NavLink>
          </>
        ) : (
          <Button
            text={"Log Out"}
            variant="orange"
            clickEvent={handleLogout}
            extraStyles="hover:shadow-orange-500 hover:shadow-xl transition-all duration-75"
          />
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
            className={`absolute -left-45 top-5 px-4 rounded-full bg-white/70 backdrop-blur-lg shadow-md py-3 w-fit flex justify-between items-center `}
          >
            <div className="hidden md:flex justify-center items-center">
              {!loggedIn ? (
                <>
                  <NavLink to="/login">
                    <Button text={"Log in"} variant="normal" />
                  </NavLink>
                  <NavLink to="/signup">
                    <Button
                      text={"Sign Up"}
                      variant="orange"
                      extraStyles=" hover:shadow-orange-500 hover:shadow-xl transition-all duration-75"
                    />
                  </NavLink>
                </>
              ) : (
                <Button
                  text={"Log Out"}
                  variant="orange"
                  clickEvent={handleLogout}
                  extraStyles="hover:shadow-orange-500 hover:shadow-xl transition-all duration-75"
                />
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
