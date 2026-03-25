import Button from "./Button";

const MobileMenu = () => {
  return (
    <div className="w-full min-h-screen">
      <div className="hidden md:flex justify-center items-center">
        <Button text={"Log in"} variant="normal" />
        <Button
          text={"Sign Up"}
          variant="orange"
          extraStyles=" hover:shadow-orange-500 hover:shadow-xl transition-all duration-75"
        />
      </div>
    </div>
  );
};

export default MobileMenu;
