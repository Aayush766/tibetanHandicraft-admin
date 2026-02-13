import { useState } from "react";
import { API } from "../api";
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Adjusted to use your full URL if necessary, or just the endpoint
      await API.post("/admin/login", { email, password }, { withCredentials: true });
      navigate("/admin-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Access Denied: Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center px-6 font-sans relative overflow-hidden">
      {/* Subtle Background Decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-amber-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white border border-stone-100 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 md:p-14 z-10"
      >
        {/* Brand Header */}
        <div className="text-center space-y-4 mb-10">
          <div className="flex justify-center">
            <div className="w-20 h-20 p-2 bg-white rounded-2xl shadow-sm border border-stone-50 overflow-hidden">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-serif font-bold text-stone-800 tracking-tight">
              Tibetan Handicraft
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-600 font-black">
              & Jewellery Admin
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-[9px] ml-1 uppercase text-stone-400 font-bold tracking-widest">
              Administrator Email
            </label>
            <input
              type="email"
              required
              placeholder="admin@tibetanhandicraft.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 outline-none focus:border-emerald-500 focus:bg-white transition-all text-sm text-stone-700"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5 relative">
            <label className="text-[9px] ml-1 uppercase text-stone-400 font-bold tracking-widest">
              Secure Password
            </label>
            <input
              type={show ? "text" : "password"}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 outline-none focus:border-emerald-500 focus:bg-white transition-all text-sm text-stone-700 pr-12"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-4 top-[38px] text-stone-400 hover:text-emerald-600 transition-colors"
            >
              {show ? <EyeSlashIcon className="w-5" /> : <EyeIcon className="w-5" />}
            </button>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-red-500 text-[11px] text-center font-semibold bg-red-50 py-2 rounded-lg"
            >
              {error}
            </motion.p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[60px] bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.25em] rounded-2xl hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-3 mt-4 disabled:bg-stone-300"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LockClosedIcon className="w-4" />
                Access Dashboard
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-stone-400 font-medium italic">
            Authorized Personnel Only — Tibetan Handicraft & Jewellery Archive
          </p>
        </div>
      </motion.div>
    </div>
  );
}