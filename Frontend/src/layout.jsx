import { useNavigate, Outlet } from "react-router-dom";
import {
  Building2,
  Factory,
  Users,
  Tags,
  FileCog,
  Receipt,
  FileText,
  Settings,
  LayoutDashboard,
} from "lucide-react";
export const Layout = () => {
    const navigate = useNavigate();
  const navigation = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Companies",
      path: "/company",
      icon: Building2,
    },
    {
      name: "Industries",
      path: "/industries",
      icon: Factory,
    },
    {
      name: "Vendors",
      path: "/vendors",
      icon: Users,
    },
    {
      name: "Vendor Categories",
      path: "/vendor-categories",
      icon: Tags,
    },
    {
      name: "Generator",
      path: "/generator",
      icon: FileCog,
    },
    {
      name: "Invoices",
      path: "/invoice",
      icon: Receipt,
    },
    {
      name: "Templates",
      path: "/template",
      icon: FileText,
    },
    {
      name: "Settings",
      path: "/setting",
      icon: Settings,
    },
  ];
  return (
    <div className="h-screen bg-slate-50 flex">
      <aside className="w-64 h-screen bg-white border-r border-slate-200 shadow-sm flex flex-col">
        <div className="h-16 shrink-0 flex items-center justify-center px-4 border-b border-slate-200">
          <h1 className="text-xl font-bold text-indigo-600">
            Statement Generator
                     </h1>
        </div>
        <nav className="flex-1 flex flex-col">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="flex-1
                  w-full
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-2
                  px-3
                  py-3
                  text-center
                  text-sm
                  font-medium
                  text-slate-600
                  dark:text-slate-300
                  border-b
                  border-slate-200
                  dark:border-slate-700
                  transition
                  hover:bg-indigo-50
                  hover:text-indigo-600
                  dark:hover:bg-slate-800
                  dark:hover:text-indigo-400"
              >
                <Icon size={28} strokeWidth={1.8} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-950">
        <Outlet />
      </main>
      </div>
  )
}