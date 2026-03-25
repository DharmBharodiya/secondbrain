type ButtonProps = {
  text: string;
  variant: "orange" | "normal";
  extraStyles?: string;
  children?: React.ReactNode;
};

const styles = {
  base: "px-4 py-2 rounded-full cursor-pointer",
  orange: "bg-orange-500 text-white",
  normal: "bg-transparent text-gray-600",
  cta: "bg-orange-500 text-white",
};

const Button = ({ text, variant, extraStyles, children }: ButtonProps) => {
  const variantStyles = styles[variant];
  return (
    <button
      className={`${styles.base} ${variantStyles} ${extraStyles && extraStyles}`}
    >
      {text}
      {children}
    </button>
  );
};

export default Button;
