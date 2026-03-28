import { useContext } from "react";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import HeroCardMaster from "../components/HeroCardMaster";
import { motion } from "framer-motion";
import { AuthContext } from "../Context/AuthContext";

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
  const { theme } = useContext(AuthContext);

  return (
    <motion.div
      className={`${theme === "dark" ? "text-white bg-black" : "bg-white text-black"} w-full min-h-screen relative flex flex-col justify-center items-center`}
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
