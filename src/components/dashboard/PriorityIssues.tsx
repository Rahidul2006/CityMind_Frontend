import React from 'react';
import { MapPin, Clock, ArrowRight, Wrench } from 'lucide-react';
import type { PriorityIssueItem } from '../../types/dashboard';

interface PriorityIssuesProps {
  issues: PriorityIssueItem[];
  onSelectIssue: (issue: PriorityIssueItem) => void;
  onViewAll?: () => void;
}

export const PriorityIssues: React.FC<PriorityIssuesProps> = ({ 
  issues, 
  onSelectIssue,
  onViewAll 
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-5 flex flex-col h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">Priority Issues</h2>
        <button 
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          View All
        </button>
      </div>

      {/* Issue Items List */}
      <div className="space-y-3 flex-1 max-h-[250px] overflow-y-auto pr-1">
        {issues.map((issue) => {
          const isCritical = issue.severity === 'Critical';
          const isHigh = issue.severity === 'High';

          return (
            <div
              key={issue.id}
              onClick={() => onSelectIssue(issue)}
              className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50/70 transition-all duration-150 cursor-pointer group"
            >
              {/* Thumbnail Image */}
              <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                <img
                  src={issue.imageUrl}
                  alt={issue.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              {/* Information */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    {issue.title}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase shrink-0 ${
                      isCritical
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : isHigh
                        ? 'bg-orange-100 text-orange-700 border border-orange-200'
                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {issue.severity}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 mt-1">
                  <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                  <span className="truncate">{issue.location}</span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium mt-1.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Reported: {issue.reportedTime}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-500">
                    <Wrench className="w-3 h-3 text-slate-400" />
                    Est. Repair: {issue.estRepairTime}
                  </span>
                  <span className="font-bold text-slate-700">
                    Score: <span className={isCritical ? 'text-red-600' : 'text-slate-800'}>{issue.score}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Link */}
      <div className="mt-4 pt-3 border-t border-slate-100 text-center">
        <a href="/issues">
        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:gap-2 transition-all"
        >
          <span>View All Priority Issues</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        </a>
      </div>
      </div>
  );
};
