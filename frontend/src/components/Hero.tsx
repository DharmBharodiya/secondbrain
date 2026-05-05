import Button from "./Button";
import { NavLink } from "react-router";
// import bgImage from "../assets/images/bg-trans-3.png";
// import bgImage2 from "../assets/images/bg-trans-3.png";
import whiteLogo from "../assets/images/white-logo.PNG";
import bgImage3 from "../assets/images/solar2.jpg";
import bgDarkImage from "../assets/images/solardark1.jpg";
// import orangeLogo from "../assets/images/orange-logo.PNG";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Image, Link } from "lucide-react";
import FloatingElement from "./FloatingElement";

const Hero = () => {
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
      className="w-full overflow-x-hidden flex flex-col justify-center items-center h-[80vh] md:h-screen relative"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "bottom",
        width: "100vw",
      }}
    >
      {/* <div className="bg-orange-500/40 backdrop-blur-2xl p-2.5 shadow-orange-500 rounded-full absolute top-105 left-40">
        <Link size={20} className="z-10" />
        <div className="w-full h-full bg-orange-500 blur-md absolute top-0 left-0 z-5 opacity-40"></div>
      </div> */}
      <FloatingElement position="top-105 left-50">
        <Link size={20} className="z-10" />
      </FloatingElement>
      <FloatingElement position="top-75 right-50">
        <Image size={20} className="z-10" />
      </FloatingElement>
      <div className="flex justify-center items-center flex-col">
        <div className="bg-white/70 backdrop-blur-sm shadow-md flex justify-center items-center gap-3 px-4 py-2 rounded-3xl">
          <div className="w-2 h-2 bg-orange-500 rounded-full relative">
            <div className="absolute -top-1/2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-400 rounded-full blur opacity-70"></div>
          </div>

          <p className="text-sm font-semibold md:text-sm text-center">
            your mind, organized
          </p>
        </div>
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
