 import {Link} from "react-router-dom";
 import { ShieldCheck, FileText, UserRound } from "lucide-react";
  export function AuthNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-lg bg-indigo-600 p-2 text-white">
            <FileText size={22} />
          </div>

          <span className="text-lg font-bold text-slate-400 sm:text-xl">
            StatementForge
          </span>
        </Link>

        {/* Login options */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-500 px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 sm:px-4"
          >
            <UserRound size={17} />
            <span>User Login</span>
          </Link>

          <Link
            to="/admin/login"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:px-4"
          >
            <ShieldCheck size={17} />
            <span>Admin Login</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}