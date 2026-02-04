import { useState } from "react";
import api from "../utils/axios";

const GeneratedInterview = () => {
  const [skill, setSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [interview, setInterview] = useState(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!skill) {
      setError("Oops! I need a skill to start 🎨");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await api.post("/api/chat/generate", { skill });
      setInterview(res.data);  
    } catch {
      setError("My circuits are a bit fuzzy. Try again? ☁️");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFE] bg-[radial-gradient(at_top_right,#E0E7FF_0%,#FDFCFE_100%)] p-4 md:p-10 font-sans selection:bg-purple-100">
      <div className="max-w-2xl mx-auto">
        
        
        <div className="flex flex-col items-center mb-12 animate-in fade-in slide-in-from-top duration-700">
          <div className="relative mb-4">
             <div className="w-24 h-24 bg-linear-to-tr from-purple-400 to-pink-300 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-xl shadow-purple-200 animate-pulse">
               🤖
             </div>
             <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 border-4 border-white rounded-full"></div>
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">
            Interview <span className="text-purple-500">Buddy</span>
          </h1>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-1">AI-Powered Tutor</p>
        </div>

        
        <div className="bg-white rounded-[2.5rem] p-3 shadow-[0_30px_60px_-15px_rgba(147,51,234,0.15)] border border-purple-50/50 flex flex-col md:flex-row gap-2 group transition-all focus-within:ring-4 focus-within:ring-purple-100">
          <input
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder="Type a skill... (e.g. React)"
            className="flex-1 px-8 py-4 rounded-4xl bg-slate-50 text-slate-700 placeholder:text-slate-400 outline-none font-semibold text-lg border-2 border-transparent focus:border-purple-200 transition-all"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-purple-600 text-white px-10 py-4 rounded-4xl font-black text-lg shadow-lg shadow-purple-200 hover:bg-purple-700 active:scale-95 transition-all disabled:bg-purple-300 disabled:shadow-none"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                Magic...
              </div>
            ) : "Ask Buddy!"}
          </button>
        </div>

        {error && (
          <div className="mt-6 text-center animate-bounce text-pink-500 font-bold bg-pink-50 py-3 rounded-2xl border border-pink-100">
            {error}
          </div>
        )}

        
        <div className="mt-16 space-y-10">
          {interview ? (
            <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="flex items-center gap-3 mb-8 opacity-60">
                <div className="h-px flex-1 bg-purple-200"></div>
                <span className="text-xs font-black text-purple-400 uppercase tracking-widest">Discussion: {interview.QnA_On}</span>
                <div className="h-px flex-1 bg-purple-200"></div>
              </div>

              <div className="flex flex-col gap-8">
                {interview.questions.map((q, i) => (
                  <div key={i} className="flex flex-col gap-3 group">
                    
                    
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-lg shadow-sm shrink-0">🐾</div>
                      <div className="bg-white px-6 py-4 rounded-[1.8rem] rounded-tl-none shadow-sm border border-slate-100 max-w-[90%]">
                        <p className="text-lg font-bold text-slate-800 leading-snug">{q.question}</p>
                      </div>
                    </div>

                    
                    <div className="flex items-start gap-3 flex-row-reverse">
                       <div className="w-10 h-10 rounded-2xl bg-purple-500 flex items-center justify-center text-lg shadow-lg shadow-purple-200 shrink-0">✨</div>
                       <div className="bg-purple-600 px-6 py-5 rounded-4xl rounded-tr-none shadow-xl shadow-purple-100 max-w-[85%] group-hover:scale-[1.01] transition-transform">
                          <p className="text-purple-100 text-[10px] font-black uppercase tracking-widest mb-1">Buddy's Advice</p>
                          <p className="text-white leading-relaxed font-medium">{q.answer}</p>
                       </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ) : !loading && (
            <div className="text-center py-24 animate-pulse">
               <p className="text-slate-300 font-black text-3xl italic tracking-tighter uppercase">I'm ready to help you!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratedInterview;