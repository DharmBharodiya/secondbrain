import { useContext, useState } from "react";
import InputBox from "../components/auth/InputBox";
import { NavLink, useNavigate } from "react-router";
import { LoginService } from "../services/AuthService";
import { AuthContext } from "../Context/AuthContext";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const context = useContext(AuthContext);
  const { setToken, setLoggedIn } = context || {
    token: null,
    setToken: () => {},
    setLoggedIn: () => {},
  };

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await LoginService({ username, password });
      if (result) {
        const token = result.token;

        localStorage.setItem("token", token);
        setToken(token);
        setLoggedIn(true);
        setMessage(result.message);
        console.log(
          "Login Successful. Token: " + token + " Message: " + result.message,
        );
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        console.log("Login Error");
        setMessage(result.message);
      }
    } catch (e) {
      console.log("Login Error: " + e);
    }
  };

  return (
    <div className="mt-30 min-h-screen md:mt-4 flex-col md:flex md:flex-row justify-center items-center">
      <div className="hidden md:block rounded-lg md:mb-0 mb-5">
        <img
          className="w-80 h-80 rounded-lg"
          src="src/assets/images/orange-1.jpeg"
          alt="image"
        />
      </div>
      <div className="md:ml-10 w-80">
        <div className="flex justify-center items-center flex-col">
          <h1 className="font-advercase text-2xl ">Welcome Back</h1>
          <p>Step back into your space</p>
        </div>
        <div className="flex flex-col mt-3">
          <InputBox
            type="text"
            placeholder="Enter your username"
            name="username"
            value={username}
            changeEvent={(e) => setUsername(e.target.value)}
          />
          <InputBox
            type="password"
            placeholder="Enter your password"
            name="password"
            value={password}
            changeEvent={(e) => setPassword(e.target.value)}
          />
          <button
            className="text-white bg-black px-6 py-2 rounded-lg font-semibold cursor-pointer"
            onClick={handleLogin}
          >
            Log In
          </button>
          <p className="text-sm text-red-500 text-center">{message}</p>
          <p className="text-sm text-center mt-2">
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
  );
};

export default LoginPage;
