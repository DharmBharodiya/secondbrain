import HeroCard from "./HeroCard";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08, // delay between each child
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const HeroCardMaster = () => {
  return (
    <div className="w-full md:w-[80%] h-full flex flex-col justify-center items-center  px-10 py-5">
      <motion.div
        className="w-full grid place-items-center md:grid-cols-2 grid-rows-2 px-6 py-2 gap-y-6 gap-x-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={item}>
          <HeroCard
            title="Capture"
            description="Instantly save fragments of inspiration, web clippings, and fleeting ideas. No folders, no friction. Just the essence"
            src="src/assets/images/orange-1.jpeg"
            icon="INTENTIONAL ENTRY"
          />
        </motion.div>
        <motion.div variants={item}>
          <HeroCard
            title="Collect"
            description="Archive bridges connnections between your notes. Watch your knowledge map itself in real-time"
            src="src/assets/images/orange-4.jpeg"
            icon="SEMANTIC HUB"
          />
        </motion.div>
        <motion.div variants={item}>
          <HeroCard
            title="Reflect"
            description="Turn raw data into refined insights with an interface that stays out of your way."
            src="src/assets/images/orange-2.jpeg"
            icon="COGNITIVE SPACE "
          />
        </motion.div>
        <motion.div variants={item}>
          <HeroCard
            title="Archive"
            description="Your life's work, securely stored. Searchable by concept, color or feeling. Never lose a spark of genius again."
            src="src/assets/images/orange-3.jpeg"
            icon={"ETERNAL STORAGE"}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroCardMaster;
