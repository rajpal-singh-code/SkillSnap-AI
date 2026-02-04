import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Welcome = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070707] px-6 selection:bg-emerald-500/30 font-sans tracking-tight">
      
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-125 h-125 bg-emerald-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-125 h-125 bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-[#0f0f0f] border border-white/5 rounded-4xl p-10 md:p-14 shadow-2xl">
          
          <div className="flex justify-center mb-10">
            <div className="w-12 h-12 rounded-full bg-linear-to-tr from-emerald-400 to-cyan-400 p-px">
              <div className="w-full h-full rounded-full bg-[#0f0f0f] flex items-center justify-center text-xl">
                ✨
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-10 text-center">
            <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-500 font-black">
              Verified Session
            </p>
            <h1 className="text-3xl md:text-4xl font-medium text-white tracking-tighter">
              Welcome back, <span className="text-slate-400">{user ? user.firstName : "Guest"}</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium max-w-62.5 mx-auto leading-relaxed">
              Your intelligent interview workspace is synchronized and ready.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Link to="/chat">
              <button className="w-full py-4 rounded-xl bg-white text-[11px] font-black uppercase tracking-[0.2em] text-black hover:bg-emerald-400 transition-all duration-300 active:scale-[0.98]">
                Start Interview Prep
              </button>
            </Link>
            
            <Link to="/profile">
              <button className="w-full py-4 rounded-xl bg-white/3 border border-white/8 text-[11px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/8 transition-all duration-300 active:scale-[0.98]">
                View Profile
              </button>
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-4 opacity-20">
            <div className="h-px w-8 bg-white"></div>
            <span className="text-[9px] font-medium text-white uppercase tracking-[0.3em]">AI Interface v2.5</span>
            <div className="h-px w-8 bg-white"></div>
          </div>
        </div>
      </div>

      
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] pointer-events-none"></div>
    </div>
  );
};

export default Welcome;