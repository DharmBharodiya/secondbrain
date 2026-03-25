import Button from "./Button";
import { NavLink } from "react-router";

const Hero = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center mt-40 md:mt-60 mb-20">
      <div className="flex justify-center items-center flex-col">
        <h1 className="font-garamond text-6xl md:text-8xl text-gray-800 text-center">
          Your second brain, <br /> <span className="italic">organized</span>
        </h1>
        <p className="text-sm md:text-sm mt-5 w-[80%] md:w-[55%] text-center">
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
              src="src/assets/images/white-logo.PNG"
              className="w-7 h-7 ml-2 self-start"
              alt="logo"
            />
          </Button>
        </NavLink>
        <Button text="learn more →" variant="normal" />
      </div>
    </div>
  );
};

export default Hero;
