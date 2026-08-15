import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { IssueDetailModal } from '../modals/IssueDetailModal';
import type { PriorityIssueItem, MapMarker, AlertItem } from '../../types/dashboard';

export const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  const [selectedDateRange, setSelectedDateRange] = useState('May 13 – May 20, 2025');
  const [activeModalIssue, setActiveModalIssue] = useState<PriorityIssueItem | MapMarker | AlertItem | null>(null);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex text-slate-800 antialiased font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 min-w-0 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? 'lg:pl-64' : 'lg:pl-0'
        }`}
      >
        {/* Header Bar */}
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          unreadNotifications={12}
        />

        {/* Dynamic Route Page View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
          <Outlet context={{ setActiveModalIssue }} />
        </main>
      </div>

      {/* Interactive Issue Modal Viewer */}
      {activeModalIssue && (
        <IssueDetailModal
          issue={activeModalIssue}
          onClose={() => setActiveModalIssue(null)}
        />
      )}
    </div>
  );
};
