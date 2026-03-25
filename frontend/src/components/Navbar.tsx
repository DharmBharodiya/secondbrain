import Button from "./Button";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={` fixed top-10 rounded-full px-3 py-3 ${scrolled ? "bg-white/70 backdrop-blur-sm shadow-md py-3 w-[60%] flex justify-between items-center" : "w-full mr-5 ml-5 flex justify-around items-center"}`}
    >
      <div className="ml-4">
        <h1 className="font-advercase text-xl text-gray-800 ">Archive</h1>
      </div>

      <div className="hidden md:flex justify-center items-center">
        <Button text={"Log in"} variant="normal" />
        <Button
          text={"Sign Up"}
          variant="orange"
          extraStyles=" hover:shadow-orange-500 hover:shadow-xl transition-all duration-75"
        />
      </div>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="cursor-pointer"
        >
          {!menuOpen ? (
            <Menu className="text-orange-600 font-bold" />
          ) : (
            <X className="text-orange-600 font-bold" />
          )}
        </button>

        {/* {menuOpen ? <MobileMenu /> : ""} */}

        {menuOpen ? (
          <div
            className={`absolute -left-50 top-12 w-fit px-4 rounded-md ${scrolled ? "bg-white/70 backdrop-blur-lg shadow-md py-3 w-[60%] flex justify-between items-center" : "flex justify-around items-center"}`}
          >
            <div className="flex justify-center items-center">
              <Button text={"Log in"} variant="normal" />
              <Button
                text={"Sign Up"}
                variant="orange"
                extraStyles=" hover:shadow-orange-500 hover:shadow-xl transition-all duration-75"
              />
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
