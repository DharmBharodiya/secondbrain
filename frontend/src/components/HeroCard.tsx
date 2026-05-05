import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

interface HeroCardProps {
  icon: string;
  title: string;
  description: string;
  src: string;
  extraStyles?: string;
}

const HeroCard = ({
  icon: Icon,
  title,
  description,
  src,
  extraStyles,
}: HeroCardProps) => {
  const { theme } = useContext(AuthContext);

  return (
    <div
      className={`w-full h-auto px-4 py-4 rounded-lg shadow-md ${theme === "dark" ? "bg-[#11110F]" : "bg-white"} ${extraStyles}`}
    >
      <div className="w-[95%] h-auto">
        <p className="text-[12px] md:text-xs mb-1">{Icon}</p>
        <h1
          className={`${theme === "dark" ? "text-white" : "text-black"} font-bold font-advercase text-2xl`}
        >
          {title}
        </h1>
        <p
          className={`${theme === "dark" ? "text-white" : "text-black"} text-[13px] md:text-sm`}
        >
          {description}
        </p>
      </div>
      <div className="w-full h-40 rounded-md mt-3">
        <img
          className="w-full h-40 object-cover rounded-md"
          src={src}
          alt={title}
        />
      </div>
    </div>
  );
};

export default HeroCard;
