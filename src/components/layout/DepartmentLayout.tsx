import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Building2,
  LayoutDashboard,
  ClipboardList,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const DepartmentLayout: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const rawUser = localStorage.getItem('userData');
    if (rawUser) {
      try {
        setUserData(JSON.parse(rawUser));
      } catch (e) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    localStorage.removeItem('departmentId');
    navigate('/department/login');
  };

  const navItems = [
    { to: '/department/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/department/tasks', label: 'Assigned Tasks', icon: ClipboardList },
    { to: '/department/priority', label: 'Priority Issues', icon: AlertTriangle },
    { to: '/department/map', label: 'Map View', icon: MapPin },
    { to: '/department/resolved', label: 'Resolved Tasks', icon: CheckCircle2 },
    { to: '/department/profile', label: 'Profile', icon: User },
  ];

  const departmentName = userData?.departmentName || userData?.department?.name || 'Department Operations';
  const officerName = userData?.name || 'Department Officer';

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* 1. DARK NAVY SIDEBAR (DESKTOP) */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-950 text-white border-r border-slate-800 shrink-0 sticky top-0 h-screen z-30">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white leading-none">CITYMIND AI</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mt-1 block">
                Department Portal
              </span>
            </div>
          </div>

          {/* Department Name Badge */}
          <div className="mt-4 bg-slate-900 border border-slate-800/90 p-3 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Assigned Unit</span>
            <p className="text-xs font-bold text-white truncate mt-0.5">{departmentName}</p>
            <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-3 h-3" />
              <span>{officerName}</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Footer */}
        <div className="p-3 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Navbar */}
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-20 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div>
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                {departmentName}
              </span>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>Welcome back,</span>
                <span className="font-extrabold">{officerName}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-700">Field Operational</span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950 text-white p-4 space-y-1 border-b border-slate-800 animate-in slide-in-from-top-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        )}

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DepartmentLayout;
