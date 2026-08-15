import React from 'react';
import { PieChart, TrendingUp, BarChart3, ShieldCheck, Zap } from 'lucide-react';
import { CATEGORY_DATA, STATUS_DATA } from '../data/dashboardData';

export const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Municipal Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Real-time analytics, AI detection trends, and city-wide performance Insights.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 fill-emerald-500" />
            AI Analytics Engine Active
          </span>
        </div>
      </div>

      {/* Top 3 Analytical Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Monthly Resolution Rate</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">84.2%</h3>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +4.1% from last month
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">AI Accuracy Rating</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">96.8%</h3>
            <span className="text-xs font-bold text-blue-600 flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 1,180 Verified Pins
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Average Turnaround Time</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">1.8 Days</h3>
            <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> 0.6 days faster than SLA
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <PieChart className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Table */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Category Volume Distribution</h2>
          <div className="space-y-3">
            {CATEGORY_DATA.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{cat.name}</span>
                  <span className="text-slate-900">{cat.count} Issues ({cat.percentage}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Resolution Status Metrics</h2>
          <div className="space-y-3">
            {STATUS_DATA.map((st) => (
              <div key={st.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{st.name}</span>
                  <span className="text-slate-900">{st.count} Records ({st.percentage}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${st.percentage}%`, backgroundColor: st.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;