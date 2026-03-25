import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { UserFetchService } from "../services/AuthService";

const Dashboard = () => {
  const [username, setUsername] = useState("");

  const context = useContext(AuthContext);
  const token = context?.token;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        try {
          const result = await UserFetchService(token);

          setUsername(result.user.username);
        } catch (e) {
          console.log("User fetch error: " + e);
        }
      }
    };

    fetchUserProfile();
  }, [token]);

  return (
    <div>
      <h1 className="text-2xl font-advercase">Dashboard</h1>
      <p>Username: {username}</p>
    </div>
  );
};

export default Dashboard;
