import Button from "./Button";

const Hero = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="flex justify-center items-center flex-col">
        <h1 className="font-garamond text-8xl text-gray-800 text-center">
          Your second brain, <br /> <span className="italic">organized</span>
        </h1>
        <p className="mt-5 w-[55%] text-center">
          Archive is your space for thoughts, visuals, and everything worth
          keeping — a place to collect, revisit, and share what matters.
        </p>
      </div>
      <div className="mt-8 flex gap-4">
        <Button text="Start your archive" variant="orange" />
        <Button text="learn more →" variant="normal" />
      </div>
    </div>
  );
};

export default Hero;
