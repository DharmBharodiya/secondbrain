import { motion } from "framer-motion";

type ButtonProps = {
  text: string;
  variant: "orange" | "normal" | "white";
  extraStyles?: string;
  children?: React.ReactNode;
  clickEvent?: () => void;
};

const styles = {
  base: "px-4 py-2 rounded-full cursor-pointer",
  orange: "bg-orange-500 text-white",
  normal: "bg-transparent text-gray-600",
  white: "bg-white text-orange-500",
  cta: "bg-orange-500 text-white",
};

const Button = ({
  text,
  variant,
  extraStyles,
  children,
  clickEvent,
}: ButtonProps) => {
  const variantStyles = styles[variant];
  return (
    <motion.button
      className={`${styles.base} ${variantStyles} ${extraStyles && extraStyles}`}
      onClick={clickEvent}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {text}
      {children}
    </motion.button>
  );
};

export default Button;
