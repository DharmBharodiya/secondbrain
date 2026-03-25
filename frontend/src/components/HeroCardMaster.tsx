import HeroCard from "./HeroCard";

const HeroCardMaster = () => {
  return (
    <div className="w-full md:w-[80%] h-full flex flex-col justify-center items-center  px-10 py-5">
      <div className="w-full grid place-items-center md:grid-cols-2 grid-rows-2 px-6 py-2 gap-y-6 gap-x-4">
        <HeroCard
          title="Capture"
          description="Instantly save fragments of inspiration, web clippings, and fleeting ideas. No folders, no friction. Just the essence"
          src="src/assets/images/orange-1.jpeg"
          icon="INTENTIONAL ENTRY"
        />
        <HeroCard
          title="Collect"
          description="Archive bridges connnections between your notes. Watch your knowledge map itself in real-time"
          src="src/assets/images/orange-4.jpeg"
          icon="SEMANTIC HUB"
        />
        <HeroCard
          title="Reflect"
          description="Turn raw data into refined insights with an interface that stays out of your way."
          src="src/assets/images/orange-2.jpeg"
          icon="COGNITIVE SPACE "
        />
        <HeroCard
          title="Archive"
          description="Your life's work, securely stored. Searchable by concept, color or feeling. Never lose a spark of genius again."
          src="src/assets/images/orange-3.jpeg"
          icon={"ETERNAL STORAGE"}
        />
      </div>
    </div>
  );
};

export default HeroCardMaster;
