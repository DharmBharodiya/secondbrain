import { useContext, useState } from "react";
import InputBox from "../components/auth/InputBox";
import { NavLink, useNavigate } from "react-router";
import { AuthContext } from "../Context/AuthContext";
import Navbar from "../components/Navbar";
import { useLogin } from "../hooks/useContentQueries";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { theme } = useContext(AuthContext);

  const context = useContext(AuthContext);
  const { setToken, setLoggedIn } = context || {
    token: null,
    setToken: () => {},
    setLoggedIn: () => {},
  };

  const navigate = useNavigate();

  const loginMutation = useLogin();
  // const handleLogin = async () => {

  //   // Validate inputs
  //   if (!username.trim()) {
  //     setError("Username is required");
  //     return;
  //   }
  //   if (!password.trim()) {
  //     setError("Password is required");
  //     return;
  //   }

  //   setError("");
  //   setMessage("");
  //   setIsLoading(true); 

  //   try {
  //     const result = await LoginService({ username, password });

  //     // Check if login was successful
  //     if (result.token) {
  //       const token = result.token;
  //       localStorage.setItem("token", token);
  //       setToken(token);
  //       setLoggedIn(true);
  //       setMessage(result.message || "Login successful!");
  //       console.log("Login Successful. Token: " + token);

  //       setTimeout(() => {
  //         navigate("/dashboard");
  //       }, 1000);
  //     } else {
  //       // Handle login failure
  //       setError(result.message || "Invalid username or password");
  //       console.log("Login failed:", result.message);
  //     }
  //   } catch (e) {
  //     const errorMessage =
  //       e instanceof Error ? e.message : "An error occurred during login";
  //     setError(errorMessage);
  //     console.error("Login Error:", e);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleLogin = () => {
  if (!username.trim()) {
    setError("Username is required");
    return;
  }
  if (!password.trim()) {
    setError("Password is required");
    return;
  }

  setError("");
  setMessage("");

  loginMutation.mutate(
    { username, password },
    {
      onSuccess: (result) => {
        if (result.token) {
          const token = result.token;
          localStorage.setItem("token", token);
          setToken(token);
          setLoggedIn(true);
          setMessage(result.message || "Login successful!");

          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
        } else {
          setError(result.message || "Invalid username or password");
        }
      },
      onError: (err) => {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred during login";
        setError(errorMessage);
      },
    }
  );
};

  // Clear error when user starts typing
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError("");
  };

  return (
    <>
      <Navbar />
      <div className="mt-30 md:mt-4 flex-col md:flex md:flex-row justify-center items-center">
        <div className="hidden md:block rounded-lg md:mb-0 mb-5">
          <img
            className="w-80 h-80 rounded-lg"
            src="src/assets/images/orange-1.jpeg"
            alt="image"
          />
        </div>
        <div className="md:ml-10 w-80">
          <div className="flex justify-center items-center flex-col">
            <h1
              className={`${theme === "dark" ? "text-white" : "text-black"} font-advercase text-2xl `}
            >
              Welcome Back
            </h1>
            <p className={`${theme === "dark" ? "text-white" : "text-black"}`}>
              Step back into your space
            </p>
          </div>
          <div className="flex flex-col mt-3">
            <InputBox
              type="text"
              placeholder="Enter your username"
              name="username"
              value={username}
              changeEvent={handleUsernameChange}
            />
            <InputBox
              type="password"
              placeholder="Enter your password"
              name="password"
              value={password}
              changeEvent={handlePasswordChange}
            />
            <button
              className={`${theme === "dark" ? "bg-white text-black" : "bg-black text-white"} px-6 py-2 rounded-lg font-semibold cursor-pointer transition-opacity ${loginMutation.isPending ? "opacity-60 cursor-not-allowed" : ""}`}
              onClick={handleLogin}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Log In"}
            </button>
            {error && (
              <p className="text-sm text-red-500 text-center mt-2 font-medium">
                {error}
              </p>
            )}
            {message && (
              <p className="text-sm text-green-500 text-center mt-2 font-medium">
                {message}
              </p>
            )}
            <p
              className={`text-sm text-center mt-4 ${theme === "dark" ? "text-white" : "text-black"}`}
            >
              new →{" "}
              <NavLink to="/signup" className="text-orange-600">
                {" "}
                register yourself
              </NavLink>
            </p>
          </div>
        </div>
        <div className="block md:hidden mt-4 md:mt-0 rounded-lg md:mb-0 mb-5">
          <img
            className="w-80 h-80 rounded-lg"
            src="src/assets/images/orange-1.jpeg"
            alt="image"
          />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
