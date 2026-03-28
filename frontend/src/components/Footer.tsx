import Button from "./Button";
import { NavLink } from "react-router";
import bgImage from "../assets/images/orange-gradient-1.jpg";

const Footer = () => {
  return (
    <div
      className="md:mt-20 h-[40vh] md:h-[80vh] w-screen px-6 py-8 flex justify-center items-center flex-col rounded-lg"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="font-advercase text-3xl mb-2 text-center">
        Ready to clear your head?
      </h1>
      <p className="mb-6 text-center text-sm md:text-md">
        Join the archive of thousands who have found a better way to think.
      </p>
      <NavLink to={"/dashboard"}>
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
    </div>
  );
};

export default Footer;
