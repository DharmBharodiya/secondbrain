import Button from "./Button";

const Navbar = () => {
  return (
    <div className="w-[60%] flex justify-between fixed top-10 items-center bg-white rounded-full px-3 py-3 shadow-lg">
      <div className="ml-4">
        <h1 className="font-semibold text-xl text-gray-800 italic ">Archive</h1>
      </div>
      <div className="flex w-[20%] justify-between items-center gap-2">
        <h1 className="text-pink-400 font-semibold text-lg">What</h1>
        <h1 className="text-green-400 font-semibold text-lg">How</h1>
        <h1 className="text-yellow-400 font-semibold text-lg">Where</h1>
      </div>
      <div className="flex justify-center items-center">
        <Button text={"Log in"} variant="normal" />
        <Button text={"Sign Up"} variant="orange" />
      </div>
    </div>
  );
};

export default Navbar;
