import Button from "./Button";
import { NavLink } from "react-router";

const Footer = () => {
  return (
    <div
      className="w-[80%] mt-20 h-auto px-6 py-8 flex justify-center items-center flex-col mb-15 rounded-lg"
      //   style={{
      //     backgroundImage: `url("src/assets/images/orange-bg-1.jpg")`,
      //     backgroundSize: "cover",
      //   }}
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
