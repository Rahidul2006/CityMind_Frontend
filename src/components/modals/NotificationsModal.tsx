import React from 'react';
import { NOTIFICATIONS_DATA } from '../../data/dashboardData';
import { Bell, CheckCheck, X, AlertCircle, RefreshCw, Server } from 'lucide-react';

interface NotificationsModalProps {
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ onClose }) => {
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-40 overflow-hidden animate-in fade-in slide-in-from-top-2">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold">Municipal Alerts & Notifications</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
          {NOTIFICATIONS_DATA.map((item) => (
            <div 
              key={item.id} 
              className={`p-3.5 hover:bg-slate-50 transition-colors flex gap-3 ${
                item.unread ? 'bg-blue-50/40' : ''
              }`}
            >
              <div className="mt-0.5">
                {item.type === 'alert' && <AlertCircle className="w-4 h-4 text-red-500" />}
                {item.type === 'update' && <RefreshCw className="w-4 h-4 text-blue-500" />}
                {item.type === 'system' && <Server className="w-4 h-4 text-emerald-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-800 truncate">{item.title}</p>
                  <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.message}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <button className="text-blue-600 font-medium hover:underline flex items-center gap-1">
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all as read
          </button>
          <span className="text-slate-400 text-[11px]">12 Unread</span>
        </div>
      </div>
    </>
  );
};
