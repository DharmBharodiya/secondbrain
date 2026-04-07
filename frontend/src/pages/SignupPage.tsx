import { useContext, useState } from "react";
import InputBox from "../components/auth/InputBox";
import { NavLink, useNavigate } from "react-router";
import { SignupService } from "../services/AuthService";
import { AuthContext } from "../Context/AuthContext";
import Navbar from "../components/Navbar";
import { useSignup } from "../hooks/useContentQueries";

const SignupPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const { theme } = useContext(AuthContext);

  const [message, setMessage] = useState("");

  const signupMutation = useSignup();

  const handleSignup = async () => {
    signupMutation.mutate(
      { username, password },
      {
        onSuccess: (result) => {
          if (result) {
            setMessage(result);
            console.log("Signup Successful.");
            setTimeout(() => {
              navigate("/login");
            }, 1000);
          } else {
            setMessage(result);
            console.log("Error");
          }
        },
        onError: (err) => {
          console.log("Signup Error: ", err);
        },
      },
    );
  };

  return (
    <>
      <Navbar />
      <div className="mt-30 md:mt-4 flex-col md:flex md:flex-row justify-center items-center">
        <div className="hidden md:block rounded-lg md:mb-0 mb-5">
          <img
            className="w-80 h-80 rounded-lg"
            src="src/assets/images/orange-2.jpeg"
            alt="image"
          />
        </div>
        <div className="md:ml-10 w-80">
          <div className="flex justify-center items-center flex-col">
            <h1 className="font-advercase text-2xl ">Create your archive</h1>
            <p>Start collecting what matters</p>
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
              className={`${theme === "dark" ? "bg-white text-black" : "bg-black text-white"} px-6 py-2 rounded-lg font-semibold cursor-pointer`}
              onClick={handleSignup}
            >
              Sign Up
            </button>
            <p className="text-sm text-red-600 text-center">{message}</p>
            <p className="text-sm text-center mt-2">
              already an user →
              <NavLink to="/login" className="text-orange-600">
                login
              </NavLink>
            </p>
          </div>
        </div>
        <div className="block md:hidden mt-4 md:mt-0 rounded-lg md:mb-0 mb-5">
          <img
            className="w-80 h-80 rounded-lg"
            src="src/assets/images/orange-3.jpeg"
            alt="image"
          />
        </div>
      </div>
    </>
  );
};

export default SignupPage;
