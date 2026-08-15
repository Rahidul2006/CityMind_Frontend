import React from 'react';
import { Building2, Users, CheckCircle, Clock, ArrowUpRight } from 'lucide-react';
import { DEPARTMENT_DATA } from '../data/dashboardData';

export const Departments: React.FC = () => {
  const departmentsDetail = [
    { name: 'Roads & Transport', head: 'Er. Rajesh Varma', teams: 14, activeJobs: 38, budget: '$420,000', rate: 87, color: 'bg-emerald-500' },
    { name: 'Sanitation & Waste', head: 'Anita Desai', teams: 22, activeJobs: 45, budget: '$380,000', rate: 76, color: 'bg-emerald-500' },
    { name: 'Electrical Engineering', head: 'Suresh Kumar', teams: 9, activeJobs: 18, budget: '$210,000', rate: 82, color: 'bg-emerald-500' },
    { name: 'Water Supply & Sewage', head: 'Dr. Mohan Lal', teams: 16, activeJobs: 29, budget: '$510,000', rate: 74, color: 'bg-amber-500' },
    { name: 'Drainage & Storm Water', head: 'Priya Sharma', teams: 11, activeJobs: 24, budget: '$290,000', rate: 71, color: 'bg-amber-500' },
    { name: 'Waste Management', head: 'Vikram Singh', teams: 18, activeJobs: 32, budget: '$340,000', rate: 88, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Municipal Departments</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Departmental performance, active field teams, and SLA compliance metrics.
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors self-start sm:self-auto">
          + Add New Team
        </button>
      </div>

      {/* Grid of Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departmentsDetail.map((dept) => (
          <div key={dept.name} className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{dept.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{dept.head}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {dept.rate}% SLA
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Resolution Speed Rate</span>
                  <span className="text-slate-900">{dept.rate}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${dept.color} rounded-full transition-all duration-500`} style={{ width: `${dept.rate}%` }} />
                </div>
              </div>

              {/* Detail Stats Grid */}
              <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-100 text-center">
                <div>
                  <span className="text-[11px] font-medium text-slate-400 block">Field Teams</span>
                  <span className="text-sm font-bold text-slate-900">{dept.teams} Units</span>
                </div>
                <div>
                  <span className="text-[11px] font-medium text-slate-400 block">Active Jobs</span>
                  <span className="text-sm font-bold text-blue-600">{dept.activeJobs}</span>
                </div>
                <div>
                  <span className="text-[11px] font-medium text-slate-400 block">Q2 Budget</span>
                  <span className="text-sm font-bold text-slate-900">{dept.budget}</span>
                </div>
              </div>
            </div>

            <button className="mt-5 w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-1">
              <span>View Department Logs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Departments;