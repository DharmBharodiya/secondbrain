import Button from "./Button";
import { NavLink } from "react-router";
// import bgImage from "../assets/images/orange-gradient-1.jpg";
// import bgImage2 from "../assets/images/bg-trans-2.png";
import bgImage3 from "../assets/images/footerImage.png";
import darkFooter from "../assets/images/darkfooter.png";
import { ArrowUpRightIcon } from "lucide-react";

import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const Footer = () => {
  const { theme } = useContext(AuthContext);
  let image = bgImage3;

  if (theme === "dark") {
    image = darkFooter;
  } else {
    image = bgImage3;
  }
  return (
    <div
      className={`md:mt-20 h-[90vh] md:h-[80vh] w-full md:w-[95%] md:mb-9 px-8 py-8 flex flex-col gap-2 md:flex-row md:gap-0 justify-center items-around md:rounded-4xl md:border-3 ${theme === "dark" ? "bg-[#0e0d0d] md:border-[#333333]" : "bg-[#F8F3EE] md:border-[#eae1d8]"}`}
      // style={{
      //   backgroundImage: `url(${image})`,
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      // }}
    >
      <div className="w-full h-full flex flex-col justify-center items-center bg-white rounded-4xl mr-5">
        <h1
          className={`font-advercase text-4xl md:text-6xl mb-2 text-center ${theme === "dark" ? "text-black" : "text-black"}`}
        >
          A home for <br /> your{" "}
          <span className="italic text-orange-500">mind.</span>
        </h1>
        <p
          className={`mb-6 text-center w-[55%] md:w-[45%] mt-3 text-sm md:text-md ${theme === "dark" ? "text-black" : "text-black"}`}
        >
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
          </Button>
        </NavLink>
      </div>
      <div
        className="md:h-[95%] md:w-[95%] w-full h-full rounded-4xl"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
        }}
      ></div>
    </div>
  );
};

export default Footer;
