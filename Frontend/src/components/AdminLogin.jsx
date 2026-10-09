
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

export function AdminLoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_LOCALHOST_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid admin credentials."
        );
      }

      // Adapt `data.user.role` to your actual login response structure.
if (data.user?.role !== "ADMIN") {
  throw new Error("This account does not have administrator access.");
}

      // The backend must verify that this account has the ADMIN role.
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.message || "Unable to log in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl md:grid md:grid-cols-2">
        {/* Left panel */}
        <div className="hidden bg-slate-950 p-10 text-white md:flex md:flex-col md:justify-between">
          <div>
            <div className="mb-10 flex items-center gap-3">
              <div className="rounded-xl bg-indigo-500 p-3">
                <ShieldCheck size={26} />
              </div>
              <div>
                <h1 className="text-xl font-bold">
                  StatementForge
                </h1>
                <p className="text-sm text-slate-400">
                  ERP Management Platform
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold leading-tight">
              Manage your business operations securely.
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              Administrator access for managing companies,
              vendors, industries, templates, and statements.
            </p>
          </div>

          <p className="text-sm text-slate-500">
            Authorized administrators only.
          </p>
        </div>

        {/* Admin login form */}
        <div className="p-6 sm:p-10 md:p-12">
          <div className="mb-8 inline-flex rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <ShieldCheck size={28} />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Admin Login
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Sign in with your administrator credentials.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Administrator Email
              </label>

              <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 focus-within:border-indigo-500">
                <Mail size={18} className="text-slate-400" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="admin@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full py-3 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 focus-within:border-indigo-500">
                <LockKeyhole
                  size={18}
                  className="text-slate-400"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full py-3 text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In as Admin"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-7 border-t border-slate-100 pt-5 text-center text-sm text-slate-600">
            Not an administrator?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              User Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
