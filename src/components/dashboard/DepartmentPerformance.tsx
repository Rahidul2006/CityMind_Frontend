import React from 'react';
import { DEPARTMENT_DATA } from '../../data/dashboardData';

interface DepartmentPerformanceProps {
  onViewAll?: () => void;
}

export const DepartmentPerformance: React.FC<DepartmentPerformanceProps> = ({ onViewAll }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-5 flex flex-col h-full">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">Department Performance</h2>
        <button 
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          View All
        </button>
      </div>

      <div className="space-y-3.5 flex-1 justify-center flex flex-col">
        {DEPARTMENT_DATA.map((dept) => (
          <div key={dept.name} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700">{dept.name}</span>
              <span className="text-slate-900">{dept.percentage}%</span>
            </div>
            
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${dept.percentage}%`,
                  backgroundColor: dept.color
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
