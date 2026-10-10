import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layers3, UserRound, Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { AuthNavbar } from "./AuthNavbar";


export function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_LOCALHOST_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim(),
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to create your account.");
      }

      navigate("/login", {
        state: { message: "Account created successfully. Please log in." },
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  return (
    <div className="min-h-screen bg-slate-50">
        <AuthNavbar />
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-2">
      <aside className="hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <Link to="/signup" className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-600 p-3">
            <Layers3 size={25} />
          </div>
          <span className="text-xl font-bold">StatementForge</span>
        </Link>

        <div className="max-w-lg">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-400">
            Financial workspace
          </p>
          <h1 className="text-5xl font-bold leading-tight">
            Financial operations,
            <span className="mt-2 block text-blue-400">made simpler.</span>
          </h1>
          <p className="mt-6 leading-7 text-slate-400">
            Manage company records, organize financial data, generate
            statements and keep invoices organized in one place.
          </p>
        </div>

        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} StatementForge
        </p>
      </aside>

      <main className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <Link to="/signup" className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="rounded-xl bg-blue-600 p-2.5 text-white">
              <Layers3 size={23} />
            </div>
            <span className="text-lg font-bold text-slate-900">
              StatementForge
            </span>
          </Link>

          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Get started
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Create your account
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Enter your details to get started with StatementForge.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
                First Name
              </label>
              <div className="relative">
                <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                type="text"
                name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                //   autoComplete="name"
                  maxLength={100}
                  required
                  className={inputClass}
                />
                </div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
                Last Name
              </label>
              <div className="relative">
                <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  id="name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  maxLength={100}
                  className={inputClass}
                />
              </div>

            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  autoComplete="email"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
    </div>
  );
}
