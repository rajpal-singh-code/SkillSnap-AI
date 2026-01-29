import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios"; // ✅ default import

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const res = await api.post(
      "/login",
      { emailId, password },
      { withCredentials: true }
    );

    const { user } = res.data;

    localStorage.setItem("user", JSON.stringify(user));
    dispatch(addUser({ user }));

    navigate("/");
  } catch (err) {
    const errorMsg =
      err?.response?.data?.error ||
      "Login failed";

    setError(errorMsg);
  }
};


  const handleSignUp = async () => {
    try {
      await api.post("/signup", {
        firstName,
        lastName,
        emailId,
        password,
      });

      setIsLoginForm(true);
      setError("");
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Signup failed";

      setError(typeof errorMsg === "string" ? errorMsg : "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://t4.ftcdn.net/jpg/03/92/25/09/360_F_392250914_2Od8jNRBPgpMu8W29vCh4hiu5EUXbgGU.jpg')" }}>
      <div className="backdrop-blur-lg bg-white/30 w-95 rounded-3xl shadow-2xl p-6">
        <h2 className="text-center text-3xl font-bold text-white mb-6">
          {isLoginForm ? "Welcome Back 👋" : "Create Account ✨"}
        </h2>
        {!isLoginForm && (
          <>
            <input type="text" value={firstName} placeholder="First name"
              className="w-full px-4 py-3 mb-4 rounded-2xl bg-white/80 focus:outline-none"
              onChange={(e) => setFirstName(e.target.value)} />
            <input type="text" value={lastName} placeholder="Last name"
              className="w-full px-4 py-3 mb-4 rounded-2xl bg-white/80 focus:outline-none"
              onChange={(e) => setLastName(e.target.value)} />
          </>
        )}
        <input type="email" value={emailId} placeholder="Email address"
          className="w-full px-4 py-3 mb-4 rounded-2xl bg-white/80 focus:outline-none"
          onChange={(e) => setEmailId(e.target.value)} />
        <input type="password" value={password} placeholder="Password"
          className="w-full px-4 py-3 mb-4 rounded-2xl bg-white/80 focus:outline-none"
          onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-red-500 text-sm mb-3 text-center font-bold">{error}</p>}
        <button onClick={isLoginForm ? handleLogin : handleSignUp}
          className="w-full py-3 mt-2 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold">
          {isLoginForm ? "Login" : "Sign Up"}
        </button>
        <p className="text-center text-white mt-4 cursor-pointer hover:underline"
          onClick={() => { setIsLoginForm(!isLoginForm); setError(""); }}>
          {isLoginForm ? "New user? Sign up here" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default Login;
