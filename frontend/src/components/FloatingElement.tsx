import { Link } from "lucide-react";

const FloatingElement = ({
  children,
  position,
}: {
  children: React.ReactNode;
  position: string;
}) => {
  return (
    <>
      <div
        className={`bg-orange-500/40 backdrop-blur-2xl p-2.5 shadow-orange-500 rounded-full absolute ${position}`}
      >
        {/* <Link size={20} className="z-10" /> */}
        {children}
        <div className="w-full h-full bg-orange-500 blur-md absolute top-0 left-0 z-5 opacity-40"></div>
      </div>
    </>
  );
};

export default FloatingElement;
