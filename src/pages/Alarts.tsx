import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { RecentAlerts } from '../components/dashboard/RecentAlerts';
import { ALERTS_DATA } from '../data/dashboardData';
import { AlertTriangle, ShieldAlert, Bell, Sparkles } from 'lucide-react';
import type { PriorityIssueItem, MapMarker, AlertItem } from '../types/dashboard';

interface OutletContextType {
  setActiveModalIssue: (issue: PriorityIssueItem | MapMarker | AlertItem | null) => void;
}

export const Alarts: React.FC = () => {
  const { setActiveModalIssue } = useOutletContext<OutletContextType>();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Municipal Alert System</h1>
            <p className="text-xs sm:text-sm text-red-100 font-medium mt-0.5">
              Live emergency alerts, SLA breach warnings, and AI disaster risk predictions.
            </p>
          </div>
        </div>

        <button className="px-4 py-2 bg-white text-red-700 font-bold text-xs rounded-xl shadow-md hover:bg-red-50 transition-colors shrink-0">
          + Broadcast Emergency Notice
        </button>
      </div>

      {/* Alert Level Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-red-700 block">Critical Emergencies</span>
            <span className="text-2xl font-extrabold text-red-900">4 Active</span>
          </div>
          <AlertTriangle className="w-7 h-7 text-red-600" />
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-700 block">SLA Warnings</span>
            <span className="text-2xl font-extrabold text-amber-900">7 Breaching</span>
          </div>
          <Bell className="w-7 h-7 text-amber-600" />
        </div>

        <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-purple-700 block">AI Predictions</span>
            <span className="text-2xl font-extrabold text-purple-900">3 Risk Zones</span>
          </div>
          <Sparkles className="w-7 h-7 text-purple-600" />
        </div>
      </div>

      {/* Main Alerts Component */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <RecentAlerts
          alerts={ALERTS_DATA}
          onSelectAlert={(alert) => setActiveModalIssue(alert)}
        />
      </div>
    </div>
  );
};

export default Alarts;