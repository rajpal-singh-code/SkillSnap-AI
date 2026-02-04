import { useState } from "react";
import api from "../utils/axios";

const Chat = () => {
  const [skill, setSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [interview, setInterview] = useState(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!skill) {
      setError("Please enter a skill");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setInterview(null);

      const res = await api.post("/api/chat/generate", { skill });
      setInterview(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] bg-[radial-gradient(circle_at_top_right,#1e1b4b_0%,#0a0a0c_100%)] p-4 md:p-10 text-slate-100">
      <div className="max-w-4xl mx-auto">
        
      
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black tracking-tight bg-linear-to-r from-violet-400 via-fuchsia-300 to-cyan-400 bg-clip-text text-transparent">
            Gemini Interviewer
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Master your next tech interview with AI</p>
        </div>

       
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-2 shadow-2xl flex flex-col md:flex-row gap-2 transition-all focus-within:border-violet-500/50">
          <input
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder="What skill should we practice? (e.g. Node.js)"
            className="flex-1 px-6 py-4 rounded-2xl bg-transparent text-white placeholder:text-slate-500 outline-none font-medium"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-8 py-4 rounded-2xl bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold transition-all shadow-lg shadow-violet-900/20 disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Analyzing...
              </span>
            ) : "Generate Questions"}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center font-medium animate-pulse">
            {error}
          </div>
        )}

        
        {interview && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-violet-400">
                Session: {interview.QnA_On}
              </h2>
              <div className="h-px flex-1 bg-linear-to-r from-violet-500/50 to-transparent"></div>
            </div>

            <div className="grid gap-6">
              {interview.questions.map((q, i) => (
                <div key={i} className="group relative bg-white/3 border border-white/5 rounded-3xl p-6 md:p-8 hover:bg-white/5 hover:border-violet-500/30 transition-all">
                  <div className="absolute -top-3 -left-2 px-3 py-1 bg-violet-600 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-lg shadow-violet-900/40">
                    Q-{i + 1}
                  </div>
                  <p className="text-xl font-bold text-white mb-4 leading-tight group-hover:text-violet-300 transition-colors">
                    {q.question}
                  </p>
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                      {q.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 text-center opacity-40 hover:opacity-100 transition-opacity">
               <p className="text-xs font-medium italic">End of Session — Good luck with your preparation!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;