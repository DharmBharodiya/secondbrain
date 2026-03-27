import Footer from "../components/Footer";
import Hero from "../components/Hero";
import HeroCardMaster from "../components/HeroCardMaster";
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

const HomePage = () => {
  return (
    <motion.div
      className="w-full min-h-screen relative flex flex-col bg-white justify-center items-center"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div variants={item}>
        <Hero />
      </motion.div>
      <HeroCardMaster />
      <Footer />
    </motion.div>
  );
};

export default HomePage;
