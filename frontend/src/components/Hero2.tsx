import Button from "./Button";
import { NavLink } from "react-router";
// import bgImage from "../assets/images/bg-trans-3.png";
// import bgImage2 from "../assets/images/bg-trans-3.png";
import whiteLogo from "../assets/images/white-logo.PNG";
import bgImage3 from "../assets/images/solarNewLight.jpg";
import bgDarkImage from "../assets/images/solarNewDark.jpg";
// import orangeLogo from "../assets/images/orange-logo.PNG";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const Hero2 = () => {
  const { theme } = useContext(AuthContext);
  // let image = bgImage;
  let image = bgImage3;
  if (theme === "dark") {
    image = bgDarkImage;
  } else {
    image = bgImage3;
  }

  return (
    <div
      className={`w-screen overflow-hidden flex h-[80vh] md:h-screen ${theme === "dark" ? "bg-[#0A0A0C]" : "bg-[#FCF7F2]"}`}
      //   style={{
      //     backgroundImage: `url(${image})`,
      //     backgroundSize: "cover",
      //     backgroundPosition: "bottom",
      //     width: "100vw",
      //   }}
    >
      <div className="w-1/2 h-full flex justify-center items-center flex-col">
        <div className="flex ml-40 justify-center items-start flex-col">
          <div className="bg-white/70 backdrop-blur-sm shadow-md flex justify-center items-center gap-3 px-4 py-2 rounded-3xl">
            <div className="w-2 h-2 bg-orange-500 rounded-full relative">
              <div className="absolute -top-1/2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-400 rounded-full blur opacity-70"></div>
            </div>

            <p className="text-sm font-semibold md:text-sm text-center">
              your mind, organized
            </p>
          </div>
          <h1
            className={`${theme === "dark" ? "text-white" : " text-black"} text-left font-garamond text-5xl md:text-7xl w-[80%] md:w-[55%]`}
          >
            Your second brain, <br /> <span className="italic">organized</span>
          </h1>
          <p className="text-sm font-semibold md:text-sm mt-5 w-[80%] md:w-[55%] text-left">
            {/* Archive is your space for thoughts, visuals, and everything worth
          keeping — a place to collect, revisit, and share what matters. */}
            Archive is an intellectual sanctuary for your fragmented thoughts.
            We curate, connect and catalyze your ideas into a unified stream of
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
      <div
        className="w-1/2 h-full bg-[#11110F] flex justify-center items-center"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "contain",
          backgroundPosition: "top",
        }}
      ></div>
    </div>
  );
};

export default Hero2;
