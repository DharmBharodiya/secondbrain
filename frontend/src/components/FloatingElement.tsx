import { motion } from "framer-motion";
import { useState } from "react";

const FloatingElement = ({
  children,
  position,
}: {
  children: React.ReactNode;
  position: string;
}) => {
  // ✅ generate random values once using state initializer
  const [config] = useState(() => ({
    yMove: Math.random() * 6 + 4, // 4–10px
    xMove: Math.random() * 4, // small drift
    duration: Math.random() * 2 + 2, // 2–4s
    delay: Math.random() * 2,
  }));

  return (
    <motion.div
      className={`bg-orange-500/60 backdrop-blur-2xl p-2.5 shadow-orange-500 rounded-full absolute ${position}`}
      animate={{
        y: [0, -config.yMove, 0],
        x: [0, config.xMove, 0],
      }}
      transition={{
        duration: config.duration,
        delay: config.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}

      <div className="w-full h-full bg-orange-500 blur-md absolute top-0 left-0 z-5 opacity-40"></div>
    </motion.div>
  );
};

export default FloatingElement;
