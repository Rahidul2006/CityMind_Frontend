import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface InfrastructureHealthProps {
  onViewAll?: () => void;
}

export const InfrastructureHealth: React.FC<InfrastructureHealthProps> = ({ onViewAll }) => {
  const score = 72; // out of 100
  const maxScore = 100;
  
  // Arc path length for R=60 semi-circle is PI * 60 = 188.495
  const arcLength = Math.PI * 60;
  const strokeDashoffset = arcLength * (1 - score / maxScore);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-5 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between gap-2 mb-2">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">Infrastructure Health Index</h2>
        <button 
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          View All
        </button>
      </div>

      <div className="flex flex-col items-center justify-between flex-1 gap-3 py-1">
        {/* Semi-circle Gauge Meter Canvas */}
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-28 flex justify-center items-end">
            <svg className="w-48 h-28 overflow-visible" viewBox="0 0 160 92">
              <defs>
                <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="30%" stopColor="#f97316" />
                  <stop offset="65%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>

              {/* Background Track Arc */}
              <path
                d="M 20 80 A 60 60 0 0 1 140 80"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="16"
                strokeLinecap="round"
              />

              {/* Colored Gauge Fill Arc */}
              <path
                d="M 20 80 A 60 60 0 0 1 140 80"
                fill="none"
                stroke="url(#healthGradient)"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={arcLength}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Score Center Text Overlay */}
            <div className="absolute bottom-0 text-center">
              <div className="flex items-baseline justify-center gap-0.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{score}</span>
                <span className="text-xs font-bold text-slate-400">/{maxScore}</span>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">
                Overall City Health
              </p>
            </div>
          </div>

          {/* Status Badge Tag */}
          <div className="mt-3">
            <span className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200 shadow-2xs">
              Needs Attention
            </span>
          </div>
        </div>

        {/* Bottom Info Section Grid */}
        <div className="w-full pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center">
          <div className="border-r border-slate-100 pr-2">
            <span className="text-[11px] font-medium text-slate-400 block">Trend</span>
            <div className="flex items-center justify-center text-sm font-bold text-emerald-600 mt-0.5">
              <ArrowUpRight className="w-4 h-4 mr-0.5 stroke-[2.5]" />
              <span>6%</span>
            </div>
            <span className="text-[10px] text-slate-400">from last month</span>
          </div>

          <div className="pl-2">
            <span className="text-[11px] font-medium text-slate-400 block">Rank</span>
            <div className="text-base font-extrabold text-slate-900 mt-0.5">
              12 <span className="text-xs font-semibold text-slate-400">/ 100</span>
            </div>
            <span className="text-[10px] text-slate-400">Smart Cities</span>
          </div>
        </div>
      </div>
    </div>
  );
};
