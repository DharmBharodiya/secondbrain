import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <motion.div
      className="w-full min-h-screen bg-white flex justify-center items-center flex-col"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h1 className="m-0 inline text-orange-500 text-[160px] font-bold">404</h1>
      <h1 className="text-2xl">this is not in memory yet</h1>
    </motion.div>
  );
};

export default NotFound;
