import Button from "./Button";
import { NavLink } from "react-router";
// import bgImage from "../assets/images/orange-gradient-1.jpg";
// import bgImage2 from "../assets/images/bg-trans-2.png";
import bgImage3 from "../assets/images/footerImage.png";
import { ArrowUpRightIcon } from "lucide-react";

// import { useContext } from "react";
// import { AuthContext } from "../Context/AuthContext";

const Footer = () => {
  // const { theme } = useContext(AuthContext);
  const image = bgImage3;

  // if (theme === "dark") {
  //   image = bgImage2;
  // } else {
  //   image = bgImage;
  // }
  return (
    <div
      className="md:mt-20 h-[90vh] bg-[#F8F3EE] md:h-[80vh] w-[95%] mb-9 px-8 py-8 flex flex-col md:flex-row md:gap-0 justify-center items-around rounded-4xl border-[#eae1d8] border-3"
      // style={{
      //   backgroundImage: `url(${image})`,
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      // }}
    >
      <div className="w-full h-full flex flex-col justify-center items-center bg-white rounded-4xl">
        <h1 className="font-advercase text-2xl md:text-3xl mb-2 text-center">
          A home for your mind.
        </h1>
        <p className="mb-6 text-center w-[90%] text-xs md:text-md">
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
