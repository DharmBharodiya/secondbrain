type ButtonProps = {
  text: string;
  variant: "orange" | "normal";
  extraStyles?: string;
  children?: React.ReactNode;
  clickEvent?: () => void;
};

const styles = {
  base: "px-4 py-2 rounded-full cursor-pointer",
  orange: "bg-orange-500 text-white",
  normal: "bg-transparent text-gray-600",
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
    <button
      className={`${styles.base} ${variantStyles} ${extraStyles && extraStyles}`}
      onClick={clickEvent}
    >
      {text}
      {children}
    </button>
  );
};

export default Button;
