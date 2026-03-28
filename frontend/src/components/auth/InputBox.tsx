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
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className="pl-2 pr-4 py-2 mb-3 text-black border-b-3 border-orange-600 font-advercase outline-0"
      value={value}
      onChange={changeEvent}
    />
  );
};

export default InputBox;
