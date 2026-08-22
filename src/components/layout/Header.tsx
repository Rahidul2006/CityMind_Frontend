import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, Bell, Settings, ChevronDown, Menu } from 'lucide-react';
import { NotificationsModal } from '../modals/NotificationsModal';
import { DateRangeModal } from '../modals/DateRangeModal';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  selectedDateRange: string;
  setSelectedDateRange: (range: string) => void;
  unreadNotifications: number;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  isSidebarOpen,
  selectedDateRange,
  setSelectedDateRange,
  unreadNotifications
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const location = useLocation();

  const getHeaderTitle = () => {
    switch (location.pathname) {
      case '/departments':
        return {
          title: 'Departments',
          subtitle: 'Manage departments, track performance and workload'
        };
      case '/budget':
        return {
          title: 'Budget & Resources',
          subtitle: 'Track budgets, expenditures, and resource utilization across departments'
        };
      case '/complaints':
        return {
          title: 'Complaints',
          subtitle: 'Track and resolve municipal complaints'
        };
      case '/analytics':
        return {
          title: 'Analytics',
          subtitle: 'Municipal performance & data insights'
        };
      case '/alerts':
        return {
          title: 'Alerts',
          subtitle: 'Real-time system & emergency alerts'
        };
      case '/administration':
        return {
          title: 'Administration',
          subtitle: 'Manage system settings & staff'
        };
      default:
        return {
          title: 'Overview Dashboard',
          subtitle: 'Welcome back, Admin Officer'
        };
    }
  };

  const headerMeta = getHeaderTitle();

  const isDashboardPage = 
    location.pathname === '/dashboard' || 
    location.pathname === '/';

  const isHideRightControls = 
    isDashboardPage ||
    location.pathname === '/departments' || 
    location.pathname === '/complaints' || 
    location.pathname.startsWith('/department');

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 lg:px-8 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Title & Greeting */}
        <div className="flex items-center gap-3">
          {!isSidebarOpen && (
            <button 
              onClick={onToggleSidebar}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors border border-slate-200/60 shadow-2xs animate-in fade-in zoom-in-95"
              title="Open Sidebar"
              aria-label="Open Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
              {headerMeta.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {headerMeta.subtitle}
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        {!isHideRightControls && (
          <div className="flex items-center gap-2.5 sm:gap-3 self-end sm:self-auto">
            {/* Date Picker Button */}
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 transition-colors shadow-2xs"
              >
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>{selectedDateRange}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showDatePicker && (
                <DateRangeModal 
                  selectedRange={selectedDateRange} 
                  onSelectRange={(range) => {
                    setSelectedDateRange(range);
                    setShowDatePicker(false);
                  }} 
                  onClose={() => setShowDatePicker(false)}
                />
              )}
            </div>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition-colors shadow-2xs"
                title="Notifications"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {showNotifications && (
                <NotificationsModal onClose={() => setShowNotifications(false)} />
              )}
            </div>

            {/* Settings Button */}
            <button 
              className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition-colors shadow-2xs"
              title="Settings"
            >
              <Settings className="w-4.5 h-4.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
