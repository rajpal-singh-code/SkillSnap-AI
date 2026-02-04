import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../utils/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.user);

  const handleLogout = async () => {
    try {
      await api.post("/logout", {}, { withCredentials: true });
      dispatch(clearUser());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-black/30 border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Gemini
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-white font-medium">
                👋 Hi, <span className="font-semibold">{user.firstName} {user.lastName}</span>
              </span>
              <button onClick={handleLogout}
                className="px-5 py-2 rounded-full bg-linear-to-r from-red-500 to-pink-500 text-white font-semibold shadow-md">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login"
              className="px-6 py-2 rounded-full bg-linear-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-md">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;