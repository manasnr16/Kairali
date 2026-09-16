import React, { useContext, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { FaChartPie, FaUsers, FaSignOutAlt, FaBars, FaTimes, FaUserShield } from "react-icons/fa";
import { AdminAuthContext } from "../../Contex/AdminAuthContext";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FaChartPie, end: true },
  { to: "/admin/dashboard/profiles", label: "Profiles", icon: FaUsers },
];

const AdminPanelLayout = () => {
  const { admin, logout } = useContext(AdminAuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  const SidebarContent = (
    <>
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <FaUserShield className="text-gold text-2xl" />
        <div>
          <p className="text-white font-semibold leading-tight">Admin Panel</p>
          <p className="text-white/40 text-xs leading-tight">Kairali Match Makers</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive ? "bg-gold text-ink" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <item.icon /> {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <p className="px-3 text-white/40 text-xs mb-2 truncate">
          Signed in as <span className="text-white/70">{admin?.username}</span>
        </p>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-red-500/10 hover:text-red-400 transition"
        >
          <FaSignOutAlt /> Log Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F5F1E9] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-[#1B1512] shrink-0">{SidebarContent}</aside>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-[#1B1512] flex flex-col">{SidebarContent}</aside>
        </div>
      )}

      <div className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between bg-[#1B1512] px-4 py-4">
          <div className="flex items-center gap-2 text-white font-semibold">
            <FaUserShield className="text-gold" /> Admin Panel
          </div>
          <button onClick={() => setSidebarOpen(true)} className="text-white text-xl">
            <FaBars />
          </button>
        </div>
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed top-4 right-4 z-50 text-white text-xl"
          >
            <FaTimes />
          </button>
        )}

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminPanelLayout;
