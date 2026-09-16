import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { AdminAuthContext } from "../../Contex/AdminAuthContext";
import { FaLock, FaUserShield } from "react-icons/fa";

const AdminLoginPage = () => {
  const { login } = useContext(AdminAuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin/dashboard";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1B1512] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[#241D19] border border-white/10 rounded-xl shadow-2xl p-8"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-maroon/20 flex items-center justify-center mb-3">
            <FaUserShield className="text-gold text-2xl" />
          </div>
          <h1 className="text-xl font-semibold text-white">Admin Control Panel</h1>
          <p className="text-white/50 text-sm mt-1">Kairali Match Makers</p>
        </div>

        {error && (
          <p className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded p-2 mb-4 text-center">
            {error}
          </p>
        )}

        <label className="block text-white/70 text-xs uppercase tracking-wide mb-1">Username</label>
        <input
          type="text"
          autoComplete="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-gold"
          placeholder="e.g. admin"
        />

        <label className="block text-white/70 text-xs uppercase tracking-wide mb-1">Password</label>
        <div className="relative mb-6">
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pl-10 rounded bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-gold"
            placeholder="••••••••"
          />
          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold hover:bg-gold-dark disabled:opacity-60 text-ink font-semibold py-3 rounded transition"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>

        <p className="text-white/30 text-xs text-center mt-6">
          Restricted access — staff credentials only.
        </p>
      </form>
    </div>
  );
};

export default AdminLoginPage;
