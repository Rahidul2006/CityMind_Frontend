import React, { useState } from 'react';
import { Users, Server, Save } from 'lucide-react';

export const Adminstrations: React.FC = () => {
  const [aiThreshold, setAiThreshold] = useState(85);
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [slaHours, setSlaHours] = useState(24);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Municipal Administration</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            System configurations, AI automation parameters, user roles, and access control.
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 self-start sm:self-auto">
          <Save className="w-4 h-4" />
          <span>Save System Settings</span>
        </button>
      </div>

      {/* Settings Options Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Automation Settings Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Server className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">AI Model & Verification Thresholds</h2>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <label className="text-slate-700">AI Confidence Score Threshold</label>
                <span className="text-blue-600 font-bold">{aiThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={aiThreshold}
                onChange={(e) => setAiThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Complaints with AI detection confidence above {aiThreshold}% are automatically verified without manual audit.
              </p>
            </div>

            <div className="flex items-center justify-between py-2 border-t border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Automated Team Dispatch</span>
                <span className="text-[11px] text-slate-400">Auto-assign critical issues to nearest ward team</span>
              </div>
              <input
                type="checkbox"
                checked={autoDispatch}
                onChange={(e) => setAutoDispatch(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 block mb-1">Standard Critical SLA Limit (Hours)</label>
              <input
                type="number"
                value={slaHours}
                onChange={(e) => setSlaHours(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        {/* User Roles & Access Control Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Municipal Roles & Access</h2>
          </div>

          <div className="space-y-3">
            {[
              { role: 'Municipal Commissioner', count: 2, access: 'Full Admin Access', color: 'bg-purple-100 text-purple-800' },
              { role: 'Ward Executive Engineers', count: 14, access: 'Ward Dispatch & Approval', color: 'bg-blue-100 text-blue-800' },
              { role: 'Field Inspection Officers', count: 48, access: 'Mobile App Verification', color: 'bg-emerald-100 text-emerald-800' },
              { role: 'Call Center Operators', count: 12, access: 'Citizen Complaint Entry', color: 'bg-slate-100 text-slate-800' },
            ].map((item) => (
              <div key={item.role} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{item.role}</span>
                  <span className="text-[11px] text-slate-500 font-medium">{item.access}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${item.color}`}>
                  {item.count} Users
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adminstrations;