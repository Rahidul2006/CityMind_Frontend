import React, { useState } from 'react';
import { STATUS_DATA } from '../../data/dashboardData';
import type { StatusData } from '../../types/dashboard';

interface StatusChartProps {
  data?: StatusData[];
}

export const StatusChart: React.FC<StatusChartProps> = ({ data }) => {
  const chartData = data && data.length > 0 ? data : STATUS_DATA;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const radius = 52;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;
  const totalCount = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-5 flex flex-col justify-between h-full">
      <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3">Issues by Status</h2>

      <div className="flex flex-col items-center flex-1 justify-between gap-3">
        {/* SVG Donut Chart Canvas */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center my-1">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
            {chartData.map((item, index) => {
              const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((cumulativePercent / 100) * circumference);
              cumulativePercent += item.percentage;

              const isHovered = hoveredIndex === index;

              return (
                <circle
                  key={item.name}
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </svg>

          {/* Center Text Badge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-base font-extrabold text-slate-900 leading-tight">
              {hoveredIndex !== null ? (chartData[hoveredIndex]?.count ?? 0) : totalCount}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 truncate max-w-[80px]">
              {hoveredIndex !== null ? (chartData[hoveredIndex]?.name ?? 'Total') : 'Total'}
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="w-full space-y-1 pt-1 border-t border-slate-100/80">
          {chartData.map((item, index) => (
            <div
              key={item.name}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex items-center justify-between text-xs px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                hoveredIndex === index ? 'bg-slate-100 font-semibold' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-700 font-medium truncate text-[11px] sm:text-xs">{item.name}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-900 font-semibold text-[11px] shrink-0">
                <span>{item.percentage}%</span>
                <span className="text-slate-400 font-normal">({item.count})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
