import { useContext, useState } from "react";
import { UpdateUsername } from "../services/ContentService";
import { AuthContext } from "../Context/AuthContext";

const Settings = ({
  username,
  setUsername,
}: {
  username: string;
  setUsername: (value: string) => void;
}) => {
  const [theUsername, setTheUsername] = useState(username);
  const [message, setMessage] = useState("");
  const { token, theme } = useContext(AuthContext);

  const handleUpdate = async () => {
    if (theUsername === username) {
      setMessage("Enter a new username.");
      return;
    } else {
      if (token) {
        const result = await UpdateUsername(theUsername, token);

        setMessage(result.message);
        console.log("REsult: ", result.message);
        setUsername(theUsername);
      }
    }
  };

  return (
    <div className="p-6 ml-10 flex flex-col md:pt-10 pt-30 h-screen flex-1 w-full ">
      <div className="mb-6 ml-10">
        <h1 className="font-advercase text-5xl">Settings</h1>
        <p>all things - you</p>
      </div>
      <div className="ml-10 w-fit">
        <input
          className={`${theme === "dark" ? "text-gray-300" : "text-gray-800"}  text-3xl w-full border-b-2 border-orange-600 outline-0 mb-3 font-garamond font-light placeholder-orange-500`}
          type="text"
          placeholder="Username"
          name="username"
          value={theUsername}
          onChange={(e) => setTheUsername(e.target.value)}
        />
        <button
          className="text-white bg-orange-500 w-full px-2 py-2 rounded-md cursor-pointer"
          onClick={handleUpdate}
        >
          Update
        </button>
        <p className="text-red-600">{message}</p>
      </div>
    </div>
  );
};

export default Settings;
