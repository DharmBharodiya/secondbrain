type ButtonProps = {
  text: string;
  variant: "orange" | "normal";
  extraStyles?: string;
};

const styles = {
  base: "px-4 py-2 rounded-full cursor-pointer",
  orange: "bg-orange-500 text-white",
  normal: "bg-transparent text-gray-600",
  cta: "bg-orange-500 text-white",
};

const Button = ({ text, variant, extraStyles }: ButtonProps) => {
  const variantStyles = styles[variant];
  return (
    <button
      className={`${styles.base} ${variantStyles} ${extraStyles && extraStyles}`}
    >
      {text}
    </button>
  );
};

export default Button;
