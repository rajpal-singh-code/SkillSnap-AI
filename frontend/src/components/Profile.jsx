import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useSelector((state) => state.user);

  if (!user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#030303]">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-white text-[10px] uppercase tracking-[0.5em] font-black"
        >
          Initializing Session...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#030303] overflow-hidden relative selection:bg-emerald-500/30 font-sans">
      
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] size-96 bg-emerald-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] size-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -50, x: Math.random() * 100 + "%", opacity: 0 }}
          animate={{ y: "110vh", opacity: [0, 0.3, 0] }}
          transition={{
            repeat: Infinity,
            duration: 8 + Math.random() * 5,
            ease: "linear",
            delay: Math.random() * 5,
          }}
          className="absolute text-emerald-500/20 text-xs"
        >
          ✦
        </motion.div>
      ))}

      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-12 w-full max-w-sm text-center relative z-10 shadow-2xl ring-1 ring-white/10"
      >
        <div className="flex justify-center mb-8">
           <div className="size-20 rounded-full bg-linear-to-tr from-emerald-500 to-cyan-400 p-px">
              <div className="size-full rounded-full bg-[#0a0a0a] flex items-center justify-center text-3xl">
                👤
              </div>
           </div>
        </div>

        <div className="space-y-1 mb-10">
          <p className="text-[9px] uppercase tracking-[0.4em] text-emerald-500 font-black">Identity Verified</p>
          <h2 className="text-2xl font-light text-white tracking-tighter">
            {user.firstName} <span className="text-slate-500">{user.lastName}</span>
          </h2>
        </div>

        <div className="space-y-4 text-center mb-10">
          <div className="py-3 border-y border-white/5">
            <p className="text-[8px] uppercase tracking-[0.3em] text-slate-500 mb-1">Electronic Mail</p>
            <p className="text-xs text-slate-200 font-medium">{user.emailId}</p>
          </div>
        </div>

        
        <Link to="/">
          <button className="w-full py-4 rounded-xl bg-white text-[10px] font-black uppercase tracking-[0.3em] text-black transition-all hover:bg-emerald-400 active:scale-95 shadow-lg shadow-white/5">
            Back to Home
          </button>
        </Link>

        <div className="mt-10 opacity-20">
           <p className="text-[7px] uppercase tracking-[0.4em] text-white">System Data Encrypted</p>
        </div>
      </motion.div>

      
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] pointer-events-none"></div>
    </div>
  );
};

export default Profile;