import { useNavigate } from "react-router-dom";
import {Building2, Factory, Users, Tags, FileCog, Receipt, FileText, Settings} from "lucide-react"
export const Dashboard = () => {
    const navigate = useNavigate();
  const navigation = [
    {
      name: "Companies",
      path: "/companies",
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
      path: "/invoices",
      icon: Receipt,
    },
    {
      name: "Templates",
      path: "/templates",
      icon: FileText,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];
return (
     <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="flex flex-wrap items-center justify-between bg-white px-4 sm:px-6 h-auto sm:h-14 shadow-sm gap-3">
        <nav className="flex flex-1 flex-wrap items-center gap-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return(
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <Icon
                    size={17}
                    strokeWidth={1.8}
                  />
                  <span>{item.name}</span>
                </button>
            )
          })}
        </nav>
      </header>
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <p className="mt-4 text-gray-600">
        Welcome to Statement generation. Use the navigation above to manage
        companies, templates, and more.
      </p>
    </div>
)
}