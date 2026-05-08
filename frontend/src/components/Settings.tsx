import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useUpdateUsername } from "../hooks/useContentQueries";
import { UpdatePassword, UpdateSharedQuote } from "../services/ContentService";

const Settings = ({
  username,
  setUsername,
}: {
  username: string;
  setUsername: (value: string) => void;
}) => {
  const [theUsername, setTheUsername] = useState(username);
  const [message, setMessage] = useState("");
  const [sharedQuote, setSharedQuote] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const handleUpdateSharedQuote = async () => {
    if (!sharedQuote.trim()) {
      setMessage("Shared quote cannot be empty.");
      return;
    }

    if (token) {
      try {
        const result = await UpdateSharedQuote(token, sharedQuote.trim());
        setMessage(result.message || "Shared quote updated successfully!");
        setSharedQuote("");
      } catch (error: any) {
        setMessage(error.message || "Failed to update shared quote");
        console.error("Update error:", error);
      }
    }
  };

  const handleUpdatePassword = async () => {
    if (!oldPassword.trim() || !newPassword.trim()) {
      setMessage("Both passwords are required.");
      return;
    }

    if (oldPassword.length < 6) {
      setMessage("Old password must be at least 6 characters.");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    if (oldPassword === newPassword) {
      setMessage("New password must be different from old password.");
      return;
    }

    if (token) {
      try {
        const result = await UpdatePassword(token, oldPassword, newPassword);
        setMessage(result.message || "Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (error: any) {
        setMessage(error.message || "Failed to update password");
        console.error("Update error:", error);
      }
    }
  };

  return (
    <div className="p-6 pl-2 ml-0 md:ml-10 flex flex-col md:pt-10 pt-30 h-screen flex-1 w-full overflow-y-auto">
      <div className="mb-8 ml-10">
        <h1 className="font-advercase text-5xl">Settings</h1>
        <p>all things - you</p>
      </div>

      {/* Message Display */}
      {message && (
        <div className="ml-10 mb-6 p-3 rounded-md bg-orange-300 text-orange-800">
          {message}
        </div>
      )}

      {/* Update Username Section */}
      <div className="ml-10 w-fit mb-12">
        <h2 className="text-orange-500 text-lg font-semibold mb-3">
          Update username:
        </h2>
        <input
          className={`${theme === "dark" ? "text-gray-300 bg-gray-900" : "text-gray-800 bg-white"} text-2xl w-full border-b-2 border-orange-600 outline-0 mb-3 font-garamond font-light placeholder-orange-500`}
          type="text"
          placeholder="Username"
          name="username"
          value={theUsername}
          onChange={(e) => setTheUsername(e.target.value)}
        />
        <button
          className="text-white bg-orange-500 w-full md:w-48 px-4 py-2 rounded-md cursor-pointer hover:bg-orange-600 transition-colors"
          onClick={handleUpdate}
        >
          Update Username
        </button>
      </div>

      {/* Update Shared Quote Section */}
      <div className="ml-10 w-fit mb-12">
        <h2 className="text-orange-500 text-lg font-semibold mb-3">
          Update shared quote:
        </h2>
        <textarea
          className={`${theme === "dark" ? "text-gray-300 bg-gray-900" : "text-gray-800 bg-white"} text-lg w-full border-2 border-orange-600 outline-0 mb-3 font-garamond p-3 rounded-md placeholder-orange-500 resize-none`}
          placeholder="Enter your shared quote..."
          name="sharedQuote"
          value={sharedQuote}
          onChange={(e) => setSharedQuote(e.target.value)}
          rows={3}
        />
        <button
          className="text-white bg-orange-500 w-full md:w-48 px-4 py-2 rounded-md cursor-pointer hover:bg-orange-600 transition-colors"
          onClick={handleUpdateSharedQuote}
        >
          Update Quote
        </button>
      </div>

      {/* Update Password Section */}
      <div className="ml-10 w-fit mb-12">
        <h2 className="text-orange-500 text-lg font-semibold mb-3">
          Update password:
        </h2>
        <div className="space-y-3">
          <input
            className={`${theme === "dark" ? "text-gray-300 bg-gray-900" : "text-gray-800 bg-white"} text-lg w-full border-b-2 border-orange-600 outline-0 mb-3 font-garamond font-light placeholder-orange-500 p-2`}
            type="password"
            placeholder="Old password"
            name="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            className={`${theme === "dark" ? "text-gray-300 bg-gray-900" : "text-gray-800 bg-white"} text-lg w-full border-b-2 border-orange-600 outline-0 mb-3 font-garamond font-light placeholder-orange-500 p-2`}
            type="password"
            placeholder="New password"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            className={`${theme === "dark" ? "text-gray-300 bg-gray-900" : "text-gray-800 bg-white"} text-lg w-full border-b-2 border-orange-600 outline-0 mb-3 font-garamond font-light placeholder-orange-500 p-2`}
            type="password"
            placeholder="Confirm new password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button
          className="text-white bg-orange-500 w-full md:w-48 px-4 py-2 rounded-md cursor-pointer hover:bg-orange-600 transition-colors"
          onClick={handleUpdatePassword}
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default Settings;
