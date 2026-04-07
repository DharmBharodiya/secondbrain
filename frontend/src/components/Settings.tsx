import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useUpdateUsername } from "../hooks/useContentQueries";

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

  const updateMutation = useUpdateUsername();

  const handleUpdate = async () => {
    // Check if username is the same as current
    if (theUsername === username) {
      setMessage("Enter a new username.");
      return;
    }

    // Check if username is empty or only whitespace
    if (!theUsername.trim()) {
      setMessage("Username cannot be empty.");
      return;
    }

    // Check minimum length
    if (theUsername.trim().length < 3) {
      setMessage("Username must be at least 3 characters long.");
      return;
    }

    if (token) {
      try {
        const result = await updateMutation.mutateAsync({
          newUsername: theUsername.trim(),
          token,
        });

        setMessage(result.message || "Username updated successfully!");
        console.log("Result: ", result.message);
        setUsername(theUsername.trim());
      } catch (error: any) {
        // Display specific error messages
        let errorMsg = error.message || "Failed to update username";

        // Detect 500 error (username duplicate/already exists)
        if (errorMsg.includes("400")) {
          errorMsg = "Username already exists.";
        }

        setMessage(errorMsg);
        console.error("Update error:", error);
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
