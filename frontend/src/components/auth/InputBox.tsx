import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

type InputBoxProps = {
  type: string;
  placeholder: string;
  name: string;
  value: string;
  changeEvent: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputBox = ({
  type,
  placeholder,
  name,
  value,
  changeEvent,
}: InputBoxProps) => {
  const { theme } = useContext(AuthContext);

  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className={`${theme === "dark" ? "text-white" : "text-black"} pl-2 pr-4 py-2 mb-3  border-b-3 border-orange-600 font-advercase outline-0`}
      value={value}
      onChange={changeEvent}
    />
  );
};

export default InputBox;
