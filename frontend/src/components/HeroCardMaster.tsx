import HeroCard from "./HeroCard";
import { motion } from "framer-motion";
import orange1 from "../assets/images/orange-1.jpeg";
import orange2 from "../assets/images/orange-2.jpeg";
import orange3 from "../assets/images/orange-3.jpeg";
import orange4 from "../assets/images/orange-4.jpeg";

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
    <div className="w-full lg:w-[80%] h-full flex flex-col justify-center items-center  px-10 py-5">
      <div className="w-full flex justify-center flex-col items-center mb-4">
        <h1 className="font-bold text-orange-500 text-xs">
          BUILT FOR HOW YOU THINK
        </h1>
        <h1 className="font-advercase mt-1 text-2xl">
          A system for your thoughts
        </h1>
      </div>
      <motion.div
        className="w-full grid md:grid-cols-2 md:px-6 px-1 py-2 gap-y-6 gap-x-2 md:gap-x-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={item}>
          <HeroCard
            title="Capture"
            description="Instantly save fragments of inspiration, web clippings, and fleeting ideas. No folders, no friction. Just the essence"
            src={orange1}
            icon="INTENTIONAL ENTRY"
          />
        </motion.div>
        <motion.div variants={item}>
          <HeroCard
            title="Collect"
            description="Archive bridges connnections between your notes. Watch your knowledge map itself in real-time"
            src={orange4}
            icon="SEMANTIC HUB"
          />
        </motion.div>
        <motion.div variants={item}>
          <HeroCard
            title="Reflect"
            description="Turn raw data into refined insights with an interface that stays out of your way."
            src={orange2}
            icon="COGNITIVE SPACE "
          />
        </motion.div>
        <motion.div variants={item}>
          <HeroCard
            title="Archive"
            description="Your life's work, securely stored. Searchable by concept, color or feeling. Never lose a spark of genius again."
            src={orange3}
            icon={"ETERNAL STORAGE"}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroCardMaster;
