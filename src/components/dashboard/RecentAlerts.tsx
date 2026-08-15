import React from 'react';
import { AlertTriangle, Sparkles, Info, ArrowRight } from 'lucide-react';
import type { AlertItem } from '../../types/dashboard';

interface RecentAlertsProps {
  alerts: AlertItem[];
  onSelectAlert: (alert: AlertItem) => void;
  onViewAll?: () => void;
}

export const RecentAlerts: React.FC<RecentAlertsProps> = ({ 
  alerts, 
  onSelectAlert, 
  onViewAll 
}) => {
  const getSeverityStyles = (severity: AlertItem['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          cardBg: 'bg-red-50/50 border-red-200/80 hover:bg-red-50',
          iconBg: 'bg-red-100 text-red-600',
          titleColor: 'text-red-900',
          descColor: 'text-red-700/80',
          badgeColor: 'text-red-500'
        };
      case 'warning':
        return {
          cardBg: 'bg-amber-50/50 border-amber-200/80 hover:bg-amber-50',
          iconBg: 'bg-amber-100 text-amber-600',
          titleColor: 'text-amber-900',
          descColor: 'text-amber-800/80',
          badgeColor: 'text-amber-500'
        };
      case 'purple':
        return {
          cardBg: 'bg-purple-50/50 border-purple-200/80 hover:bg-purple-50',
          iconBg: 'bg-purple-100 text-purple-600',
          titleColor: 'text-purple-900',
          descColor: 'text-purple-800/80',
          badgeColor: 'text-purple-500'
        };
      case 'info':
      default:
        return {
          cardBg: 'bg-blue-50/50 border-blue-200/80 hover:bg-blue-50',
          iconBg: 'bg-blue-100 text-blue-600',
          titleColor: 'text-blue-900',
          descColor: 'text-blue-800/80',
          badgeColor: 'text-blue-500'
        };
    }
  };

  const getAlertIcon = (type: AlertItem['type']) => {
    switch (type) {
      case 'Pothole': return AlertTriangle;
      case 'SLA': return AlertTriangle;
      case 'Prediction': return Sparkles;
      case 'Complaint': return Info;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">Recent Alerts</h2>
        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
        >
          <span>View All Alerts</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of Alert Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {alerts.map((alert) => {
          const styles = getSeverityStyles(alert.severity);
          const Icon = getAlertIcon(alert.type);

          return (
            <div
              key={alert.id}
              onClick={() => onSelectAlert(alert)}
              className={`p-3.5 sm:p-4 rounded-2xl border ${styles.cardBg} transition-all duration-200 cursor-pointer flex items-start gap-3 shadow-2xs hover:shadow-xs group`}
            >
              <div className={`w-9 h-9 rounded-xl ${styles.iconBg} flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform`}>
                <Icon className="w-4.5 h-4.5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className={`text-xs font-bold ${styles.titleColor} truncate`}>
                    {alert.title}
                  </h3>
                  <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                    {alert.time}
                  </span>
                </div>

                <p className={`text-[11px] font-medium ${styles.descColor} mt-1 leading-snug line-clamp-2`}>
                  {alert.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
