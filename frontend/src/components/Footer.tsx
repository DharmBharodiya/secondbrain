import Button from "./Button";

const Footer = () => {
  return (
    <div
      className="w-[80%] mt-20 h-auto px-6 py-8 flex justify-center items-center flex-col mb-15 rounded-lg"
      //   style={{
      //     backgroundImage: `url("src/assets/images/orange-bg-1.jpg")`,
      //     backgroundSize: "cover",
      //   }}
    >
      <h1 className="font-advercase text-3xl mb-2">
        Ready to clear your head?
      </h1>
      <p className="mb-6">
        Join the archive of thousands who have found a better way to think.
      </p>
      <Button
        variant="orange"
        text="Start your archive"
        extraStyles={" shadow-orange-500 shadow-xl font-semibold"}
      />
    </div>
  );
};

export default Footer;
