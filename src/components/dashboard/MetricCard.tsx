import React from 'react';
import { 
  ClipboardList, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  Hourglass, 
  Clock, 
  Timer, 
  Brain,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import type { MetricData } from '../../types/dashboard';

interface MetricCardProps {
  data: MetricData;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({ data, onClick }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'clipboard-list': return ClipboardList;
      case 'alert-circle': return AlertCircle;
      case 'file-text': return FileText;
      case 'check-circle-2': return CheckCircle2;
      case 'hourglass': return Hourglass;
      case 'clock': return Clock;
      case 'timer': return Timer;
      case 'brain': return Brain;
      default: return ClipboardList;
    }
  };

  const IconComponent = getIcon(data.icon);
  const isUp = data.type === 'increase';

  // Smart unit parsing (combines numbers + units like '0.4 days' into the highlighted change metric)
  const changeTokens = data.change.split(' ');
  const secondTokenIsUnit = ['days', 'day', 'hrs', 'hr', 'hours', 'mins'].includes(changeTokens[1]?.toLowerCase());
  
  const highlightVal = secondTokenIsUnit 
    ? `${changeTokens[0]} ${changeTokens[1]}` 
    : changeTokens[0];
    
  const remainingLabel = secondTokenIsUnit 
    ? data.change.slice(data.change.indexOf(changeTokens[2] || ''))
    : data.change.slice(data.change.indexOf(' ') + 1);

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl p-3 sm:p-3.5 xl:p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between h-full"
    >
      <div className="flex items-start justify-between gap-1.5">
        <span className="text-[11px] sm:text-[12px] xl:text-[13px] font-semibold text-slate-600 leading-snug">
          {data.title}
        </span>
        <div className={`w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 rounded-full ${data.iconBg} flex items-center justify-center shrink-0`}>
          <IconComponent className={`w-3.5 h-3.5 sm:w-4 sm:h-4 xl:w-4.5 xl:h-4.5 ${data.iconColor}`} />
        </div>
      </div>

      <div className="mt-2">
        <h3 className="text-lg sm:text-xl xl:text-2xl font-extrabold text-slate-900 tracking-tight">
          {data.value}
        </h3>
        
        <div className="flex items-center gap-1 mt-1 text-xs font-semibold flex-wrap">
          {isUp ? (
            <span className={`flex items-center shrink-0 ${data.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 stroke-[2.5]" />
              {highlightVal}
            </span>
          ) : (
            <span className={`flex items-center shrink-0 ${data.isPositive ? 'text-emerald-600' : 'text-amber-600'}`}>
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 stroke-[2.5]" />
              {highlightVal}
            </span>
          )}
          <span className="text-slate-400 font-medium text-[10px] sm:text-[11px] leading-tight">
            {remainingLabel}
          </span>
        </div>
      </div>
    </div>
  );
};
