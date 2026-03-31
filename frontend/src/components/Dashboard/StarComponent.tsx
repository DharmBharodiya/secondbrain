import { useState } from "react";

const StarComponent = () => {
  const [starred, setStarred] = useState(false);

  const handleStarClick = () => {
    setStarred((prev) => !prev);
  };

  return (
    <button
      className={`text-2xl ${starred ? "text-amber-800" : "text-blacks"}`}
      onClick={handleStarClick}
    >
      ★
    </button>
  );
};

export default StarComponent;
