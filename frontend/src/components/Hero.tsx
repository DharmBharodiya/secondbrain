import Button from "./Button";
import { NavLink } from "react-router";
import bgImage from "../assets/images/bg-trans-3.png";
import bgImage2 from "../assets/images/bg-trans-3.png";
import whiteLogo from "../assets/images/white-logo.PNG";
import orangeLogo from "../assets/images/orange-logo.PNG";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const Hero = () => {
  const { theme } = useContext(AuthContext);
  let image = bgImage;

  if (theme === "dark") {
    image = bgImage2;
  } else {
    image = bgImage;
  }

  return (
    <div
      className="w-full flex flex-col justify-center items-center h-[80vh] md:h-screen"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "bottom",
        width: "100vw",
      }}
    >
      <div className="flex justify-center items-center flex-col">
        <h1
          className={`${theme === "dark" ? "text-white" : " text-black"} text-center font-garamond text-6xl md:text-8xl`}
        >
          Your second brain, <br /> <span className="italic">organized</span>
        </h1>
        <p className="text-sm font-semibold md:text-sm mt-5 w-[80%] md:w-[55%] text-center">
          {/* Archive is your space for thoughts, visuals, and everything worth
          keeping — a place to collect, revisit, and share what matters. */}
          Archive is an intellectual sanctuary for your fragmented thoughts. We
          curate, connect and catalyze your ideas into a unified stream of
          intelligence.
        </p>
      </div>
      <div className="mt-8 flex gap-4">
        <NavLink to="/dashboard">
          <Button
            text="Start your archive"
            variant="orange"
            extraStyles={
              " shadow-orange-500 shadow-xl font-semibold flex justify-center items-center"
            }
          >
            <img
              src={whiteLogo}
              className="w-7 h-7 ml-2 self-start"
              alt="logo"
            />
          </Button>
        </NavLink>
        <Button
          text="learn more →"
          variant={theme == "dark" ? "dark" : "normal"}
          extraStyles="text-black"
        />
      </div>
    </div>
  );
};

export default Hero;
