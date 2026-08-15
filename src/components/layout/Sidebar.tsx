import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare,  
  Building2, 
  PieChart, 
  Bell, 
  Settings, 
  ChevronDown,
  ChevronLeft,
  Hexagon,
  UserCheck,
  LogOut,
  SlidersHorizontal
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen,
  setIsOpen
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/complaints', label: 'Complaints', icon: MessageSquare },
    { path: '/departments', label: 'Departments', icon: Building2 },
    { path: '/analytics', label: 'Analytics', icon: PieChart },
    { path: '/alerts', label: 'Alerts', icon: Bell },
    { path: '/administration', label: 'Administration', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside 
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0b1329] text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header Branding */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800/60">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Hexagon className="w-6 h-6 text-white stroke-[2.2]" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-wide leading-none flex items-center gap-1">
                  CITYMIND AI
                </h1>
                <span className="text-[11px] font-medium text-blue-400 tracking-normal block mt-1">
                  Municipal Dashboard
                </span>
              </div>
            </Link>

            <button 
              onClick={() => setIsOpen(false)} 
              className="text-slate-400 hover:text-white hover:bg-slate-800/80 p-1.5 rounded-lg transition-colors"
              title="Close Sidebar"
              aria-label="Close Sidebar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-4 space-y-1 max-h-[calc(100vh-170px)] overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      setIsOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group text-left ${
                    isActive 
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30' 
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-slate-800/60 relative">
          {profileOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-[#14203e] border border-slate-700/60 rounded-xl shadow-xl p-2 z-10 animate-in fade-in slide-in-from-bottom-2">
              <Link 
                to="/" 
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-slate-700/50 rounded-lg"
                onClick={() => setProfileOpen(false)}
              >
                <Hexagon className="w-3.5 h-3.5 text-blue-400" />
                <span>Landing Page</span>
              </Link>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-slate-700/50 rounded-lg">
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Profile Settings</span>
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-slate-700/50 rounded-lg">
                <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
                <span>Preferences</span>
              </button>
              <div className="my-1 border-t border-slate-700/40" />
              <Link 
                to="/login" 
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg"
                onClick={() => setProfileOpen(false)}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </Link>
            </div>
          )}

          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center shrink-0 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                  alt="Admin Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">Admin Officer</p>
                <p className="text-[11px] text-slate-400 truncate">Municipal Corporation</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </aside>
    </>
  );
};
