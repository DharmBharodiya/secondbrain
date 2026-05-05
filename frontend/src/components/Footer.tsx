import Button from "./Button";
import { NavLink } from "react-router";
import bgImage from "../assets/images/orange-gradient-1.jpg";
import bgImage2 from "../assets/images/bg-trans-2.png";
import { ArrowUpRightIcon } from "lucide-react";

import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const Footer = () => {
  const { theme } = useContext(AuthContext);
  let image = bgImage;

  if (theme === "dark") {
    image = bgImage2;
  } else {
    image = bgImage;
  }
  return (
    <div
      className="md:mt-20 h-[40vh] md:h-[80vh] w-screen px-6 py-8 flex justify-center items-center flex-col rounded-lg"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="font-advercase text-3xl mb-2 text-center">
        A home for your mind.
      </h1>
      <p className="mb-6 text-center text-sm md:text-md">
        Join the archive of thousands who have found a better way to think.
      </p>
      <NavLink to={"/dashboard"}>
        <Button
          text="Start your archive"
          variant="black"
          extraStyles={
            "bg-black text-white shadow-xl font-semibold flex justify-center items-center"
          }
        >
          <div className="ml-2">
            <ArrowUpRightIcon />
          </div>
          {/* <img
            src="src/assets/images/white-logo.PNG"
            className="w-7 h-7 ml-2 self-start"
            alt="logo"
          /> */}
        </Button>
      </NavLink>
    </div>
  );
};

export default Footer;
