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
  return (
    <div
      className={`w-full h-auto px-4 py-4 rounded-lg shadow-md ${extraStyles}`}
    >
      <div className="h-37 md:h-30 w-[95%]">
        <p className="text-[12px] md:text-xs mb-1">{Icon}</p>
        <h1 className="font-bold font-advercase text-2xl text-gray-900">
          {title}
        </h1>
        <p className="text-[13px] md:text-sm text-gray-700">{description}</p>
      </div>
      <div className="w-full h-40 rounded-md">
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
