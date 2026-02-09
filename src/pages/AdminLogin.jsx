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
      await API.post("/admin/login", { email, password }, { withCredentials: true });
      navigate("/admin-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Access Denied");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center px-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-stone-200 rounded-[2.5rem] shadow-xl p-12 space-y-10"
      >
        <div className="text-center space-y-3">
          <p className="text-[10px] uppercase tracking-[0.5em] text-amber-700 font-bold">
            Studio Archives
          </p>
          <h1 className="text-4xl font-serif italic text-stone-800">
            Admin Vault
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase text-stone-400 font-bold">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-stone-50 rounded-xl border border-stone-100 outline-none focus:ring-1 ring-amber-600 text-sm"
            />
          </div>

          {/* Password */}
          <div className="space-y-2 relative">
            <label className="text-[10px] uppercase text-stone-400 font-bold">
              Password
            </label>
            <input
              type={show ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-stone-50 rounded-xl border border-stone-100 outline-none focus:ring-1 ring-amber-600 text-sm pr-12"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-4 top-11 text-stone-400"
            >
              {show ? <EyeSlashIcon className="w-5" /> : <EyeIcon className="w-5" />}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-xs text-center font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[55px] bg-stone-900 text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-amber-800 transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <LockClosedIcon className="w-4" />
            {loading ? "Authenticating..." : "Enter Vault"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
