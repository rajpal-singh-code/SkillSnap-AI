import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

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

      const { user, token } = res.data;
      dispatch(setUser({ user, token }));
      navigate("/");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          "Login failed"
      );
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
      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          "Signup failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      
      {/* LEFT PANEL */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-900 to-indigo-900 items-center justify-center relative text-white">
        <div className="px-12">
          <h1 className="text-4xl font-semibold">Hello!</h1>
          <h2 className="text-5xl font-bold mt-2 leading-tight">
            Have a <br /> GOOD DAY
          </h2>
        </div>

        {/* Decorative shapes */}
        <div className="absolute top-12 left-10 w-24 h-24 rounded-full bg-white/10"></div>
        <div className="absolute bottom-20 right-16 w-32 h-32 rounded-full bg-white/5"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 rounded-full bg-white/10"></div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white">
        <div className="w-full max-w-md px-8">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
            {isLoginForm ? "Login" : "Create Account"}
          </h2>

          {!isLoginForm && (
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-1/2 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-1/2 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          )}

          <input
            type="email"
            placeholder="Username"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            className="w-full mb-4 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-2 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          {error && (
            <p className="text-red-500 text-sm mb-3 font-medium">
              {error}
            </p>
          )}

          <div className="text-right mb-6">
            <span className="text-sm text-indigo-600 cursor-pointer hover:underline">
              forgot password?
            </span>
          </div>

          <button
            onClick={isLoginForm ? handleLogin : handleSignUp}
            className="w-full bg-indigo-900 text-white py-3 rounded-lg font-semibold hover:bg-indigo-800 transition"
          >
            {isLoginForm ? "Login" : "Sign up"}
          </button>

          <p
            className="mt-6 text-sm text-indigo-600 cursor-pointer text-center hover:underline"
            onClick={() => {
              setIsLoginForm(!isLoginForm);
              setError("");
            }}
          >
            {isLoginForm
              ? "Don't have an account? Create an account"
              : "Already have an account? Login"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
