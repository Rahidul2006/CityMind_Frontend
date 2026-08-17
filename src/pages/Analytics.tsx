import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Target, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  ChevronDown, 
  RotateCcw, 
  Download, 
  MapPin, 
  X, 
  Check, 
  Info
} from 'lucide-react';

export const Analytics: React.FC = () => {
  // Filter States
  const [selectedDateRange, setSelectedDateRange] = useState('May 13 – May 20, 2025');
  const [viewBy, setViewBy] = useState('Week');
  const [issueTypeFilter, setIssueTypeFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [wardFilter, setWardFilter] = useState('All');

  // Interactive Hover state for Line Chart
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);

  // Hotspot Modal state
  const [selectedHotspot, setSelectedHotspot] = useState<{
    name: string;
    ward: string;
    issues: number;
    severity: string;
    topCategory: string;
  } | null>(null);

  // Download Report Modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleResetFilters = () => {
    setSelectedDateRange('May 13 – May 20, 2025');
    setViewBy('Week');
    setIssueTypeFilter('All');
    setDepartmentFilter('All');
    setWardFilter('All');
    showToast('Filters reset to default view.');
  };

  // Static / Dynamic Data Arrays based on filters
  const dateLabels = ['May 13', 'May 14', 'May 15', 'May 16', 'May 17', 'May 18', 'May 19', 'May 20'];

  // Map Hotspots Data
  const mapHotspots = [
    { id: 'h1', x: 28, y: 35, size: 28, color: 'rgba(239, 68, 68, 0.85)', name: 'MG Road Junction', ward: 'Ward 14', issues: 482, severity: 'Critical', topCategory: 'Potholes' },
    { id: 'h2', x: 55, y: 30, size: 24, color: 'rgba(249, 115, 22, 0.85)', name: 'Park Street Market', ward: 'Ward 8', issues: 320, severity: 'High', topCategory: 'Garbage Overflow' },
    { id: 'h3', x: 42, y: 58, size: 26, color: 'rgba(239, 68, 68, 0.85)', name: 'Central Highway Dark Zone', ward: 'Ward 12', issues: 295, severity: 'Critical', topCategory: 'Broken Streetlights' },
    { id: 'h4', x: 72, y: 48, size: 22, color: 'rgba(245, 158, 11, 0.85)', name: 'Lake View Pipeline Hub', ward: 'Ward 3', issues: 210, severity: 'Medium', topCategory: 'Water Leakage' },
    { id: 'h5', x: 22, y: 68, size: 20, color: 'rgba(239, 68, 68, 0.85)', name: 'Subway Fissure Crossing', ward: 'Ward 11', issues: 184, severity: 'High', topCategory: 'Drain Blockage' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-top-2">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Top Action Header Bar (matching Download Report top right) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Comprehensive insights and data analytics for smart decision making
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Date Range Picker Display */}
          <button
            onClick={() => showToast('Select Date Range modal')}
            className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>{selectedDateRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Download Report Button */}
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* 1. TOP STAT CARDS ROW (6 Stat Cards) */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Total Issues */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-sky-100/80 text-sky-600 flex items-center justify-center shrink-0">
            <FileText className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Total Issues</span>
            <span className="text-2xl font-bold text-slate-900 block mt-0.5">12,842</span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3" /> 18.6% <span className="text-slate-400 font-normal">from last period</span>
            </span>
          </div>
        </div>

        {/* Card 2: Resolved Issues */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Resolved Issues</span>
            <span className="text-2xl font-bold text-slate-900 block mt-0.5">8,642</span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3" /> 16.4% <span className="text-slate-400 font-normal">from last period</span>
            </span>
          </div>
        </div>

        {/* Card 3: Resolution Rate */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-purple-100/80 text-purple-600 flex items-center justify-center shrink-0">
            <Clock className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Resolution Rate</span>
            <span className="text-2xl font-bold text-slate-900 block mt-0.5">67.3%</span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3" /> 4.2% <span className="text-slate-400 font-normal">from last period</span>
            </span>
          </div>
        </div>

        {/* Card 4: Avg. Resolution Time */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-amber-100/80 text-amber-600 flex items-center justify-center shrink-0">
            <Target className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Avg. Resolution Time</span>
            <span className="text-2xl font-bold text-slate-900 block mt-0.5">2.4 days</span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <TrendingDown className="w-3 h-3 text-emerald-600" /> 0.4 days <span className="text-slate-400 font-normal">from last period</span>
            </span>
          </div>
        </div>

        {/* Card 5: Overdue Issues */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-rose-100/80 text-rose-500 flex items-center justify-center shrink-0">
            <Clock className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Overdue Issues</span>
            <span className="text-2xl font-bold text-slate-900 block mt-0.5">38</span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <TrendingDown className="w-3 h-3 text-emerald-600" /> 15.6% <span className="text-slate-400 font-normal">from last period</span>
            </span>
          </div>
        </div>

        {/* Card 6: Citizen Satisfaction */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-sky-100/80 text-sky-600 flex items-center justify-center shrink-0">
            <Star className="w-5.5 h-5.5 fill-sky-600 text-sky-600" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Citizen Satisfaction</span>
            <span className="text-2xl font-bold text-slate-900 block mt-0.5">4.2 / 5</span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3" /> 0.3 <span className="text-slate-400 font-normal">from last period</span>
            </span>
          </div>
        </div>
      </section>

      {/* 2. FILTER CONTROL BAR CARD */}
      <section className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
          {/* Date Range Dropdown */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Date Range</label>
            <div className="relative">
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pr-7 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <option value="May 13 – May 20, 2025">May 13 – May 20, 2025</option>
                <option value="May 01 – May 12, 2025">May 01 – May 12, 2025</option>
                <option value="April 2025">April 2025</option>
                <option value="Q1 2025">Q1 2025</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* View By */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">View By</label>
            <div className="relative">
              <select
                value={viewBy}
                onChange={(e) => setViewBy(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pr-7 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <option value="Day">Day</option>
                <option value="Week">Week</option>
                <option value="Month">Month</option>
                <option value="Quarter">Quarter</option>
                <option value="Year">Year</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Issue Type */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Issue Type</label>
            <div className="relative">
              <select
                value={issueTypeFilter}
                onChange={(e) => setIssueTypeFilter(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pr-7 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Potholes">Potholes</option>
                <option value="Garbage Overflow">Garbage Overflow</option>
                <option value="Broken Streetlights">Broken Streetlights</option>
                <option value="Water Leakage">Water Leakage</option>
                <option value="Drain Blockage">Drain Blockage</option>
                <option value="Road Cracks">Road Cracks</option>
                <option value="Others">Others</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Department</label>
            <div className="relative">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pr-7 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Roads & Transport">Roads & Transport</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Electrical">Electrical</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Drainage">Drainage</option>
                <option value="Waste Management">Waste Management</option>
                <option value="Public Works">Public Works</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Ward */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Ward</label>
            <div className="relative">
              <select
                value={wardFilter}
                onChange={(e) => setWardFilter(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pr-7 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Ward 14">Ward 14</option>
                <option value="Ward 8">Ward 8</option>
                <option value="Ward 12">Ward 12</option>
                <option value="Ward 5">Ward 5</option>
                <option value="Ward 3">Ward 3</option>
                <option value="Ward 7">Ward 7</option>
                <option value="Ward 10">Ward 10</option>
                <option value="Ward 4">Ward 4</option>
                <option value="Ward 11">Ward 11</option>
                <option value="Ward 2">Ward 2</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Reset Filters Button */}
          <button
            onClick={handleResetFilters}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-blue-600 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </section>

      {/* 3. MIDDLE ROW 1: ISSUES OVER TIME (LEFT), CATEGORY DONUT & SEVERITY DONUT */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Issues Over Time Line Chart Card (col-span-6) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h2 className="text-base font-bold text-slate-900">Issues Over Time</h2>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-blue-600 rounded-full" />
                <span className="text-slate-600">Reported</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-emerald-500 rounded-full" />
                <span className="text-slate-600">Resolved</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-rose-500 rounded-full" />
                <span className="text-slate-600">Overdue</span>
              </div>
            </div>
          </div>

          {/* Interactive SVG Chart Canvas */}
          <div className="relative w-full h-64 my-2">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              {/* Background Horizontal Grid Lines & Y-Axis Labels */}
              {[
                { y: 20, label: '2.5K' },
                { y: 55, label: '2K' },
                { y: 90, label: '1.5K' },
                { y: 125, label: '1K' },
                { y: 160, label: '500' },
                { y: 195, label: '0' }
              ].map((grid, idx) => (
                <g key={idx}>
                  <line x1="40" y1={grid.y} x2="490" y2={grid.y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="32" y={grid.y + 4} textAnchor="end" fontSize="10" fill="#94a3b8" fontWeight="500">
                    {grid.label}
                  </text>
                </g>
              ))}

              {/* Line 1: Reported (Blue) */}
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="40,140  100,105  165,95  230,88  295,65  360,82  425,60  490,45"
              />

              {/* Line 2: Resolved (Green) */}
              <polyline
                fill="none"
                stroke="#22c55e"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="40,175  100,152  165,130  230,118  295,100  360,122  425,110  490,90"
              />

              {/* Line 3: Overdue (Red) */}
              <polyline
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="40,190  100,188  165,185  230,182  295,178  360,177  425,175  490,173"
              />

              {/* Data Points on Hover */}
              {[
                { x: 40, rep: 800, res: 300, ov: 80 },
                { x: 100, rep: 1300, res: 600, ov: 100 },
                { x: 165, rep: 1450, res: 900, ov: 120 },
                { x: 230, rep: 1550, res: 1100, ov: 130 },
                { x: 295, rep: 1850, res: 1350, ov: 140 },
                { x: 360, rep: 1600, res: 1050, ov: 150 },
                { x: 425, rep: 1950, res: 1200, ov: 160 },
                { x: 490, rep: 2200, res: 1500, ov: 180 },
              ].map((pt, i) => {
                const isHovered = activePointIndex === i;
                return (
                  <g 
                    key={i} 
                    onMouseEnter={() => setActivePointIndex(i)} 
                    onMouseLeave={() => setActivePointIndex(null)}
                    className="cursor-pointer"
                  >
                    {/* Dots */}
                    <circle cx={pt.x} cy={195 - (pt.rep / 2500) * 175} r={isHovered ? 6 : 4} fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                    <circle cx={pt.x} cy={195 - (pt.res / 2500) * 175} r={isHovered ? 6 : 4} fill="#22c55e" stroke="#ffffff" strokeWidth="2" />
                    <circle cx={pt.x} cy={195 - (pt.ov / 2500) * 175} r={isHovered ? 5 : 3.5} fill="#ef4444" stroke="#ffffff" strokeWidth="2" />

                    {/* Interactive Tooltip Card */}
                    {isHovered && (
                      <g transform={`translate(${Math.min(pt.x - 40, 400)}, 10)`}>
                        <rect width="95" height="50" rx="8" fill="#0f172a" opacity="0.95" />
                        <text x="8" y="16" fill="#ffffff" fontSize="9" fontWeight="bold">{dateLabels[i]}</text>
                        <text x="8" y="28" fill="#60a5fa" fontSize="9">Rep: {pt.rep.toLocaleString()}</text>
                        <text x="8" y="38" fill="#4ade80" fontSize="9">Res: {pt.res.toLocaleString()}</text>
                        <text x="8" y="47" fill="#f87171" fontSize="9">Overdue: {pt.ov}</text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* X-Axis Date Ticks */}
          <div className="flex justify-between text-[11px] font-semibold text-slate-400 pt-2 border-t border-slate-100">
            {dateLabels.map((date) => (
              <span key={date}>{date}</span>
            ))}
          </div>
        </div>

        {/* Issues by Category Donut Card (col-span-3) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between">
          <h2 className="text-base font-bold text-slate-900 mb-3">Issues by Category</h2>

          <div className="flex items-center gap-3">
            {/* SVG Donut */}
            <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {/* 7 Segment Donut */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ef4444" strokeWidth="12" strokeDasharray="90 251" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f97316" strokeWidth="12" strokeDasharray="50 251" strokeDashoffset="-90" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="12" strokeDasharray="39 251" strokeDashoffset="-140" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="12" strokeDasharray="31 251" strokeDashoffset="-179" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#a855f7" strokeWidth="12" strokeDasharray="25 251" strokeDashoffset="-210" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#14b8a6" strokeWidth="12" strokeDasharray="11 251" strokeDashoffset="-235" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#64748b" strokeWidth="12" strokeDasharray="6 251" strokeDashoffset="-246" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-extrabold text-slate-900">12,842</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Total</span>
              </div>
            </div>

            {/* Legend Details */}
            <div className="flex-1 space-y-1 text-xs">
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> Potholes
                </span>
                <span className="font-bold text-slate-900">35.7% <span className="text-slate-400 font-normal">(4,583)</span></span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-orange-500" /> Garbage Overflow
                </span>
                <span className="font-bold text-slate-900">20.1% <span className="text-slate-400 font-normal">(2,581)</span></span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Broken Streetlights
                </span>
                <span className="font-bold text-slate-900">15.4% <span className="text-slate-400 font-normal">(1,975)</span></span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Water Leakage
                </span>
                <span className="font-bold text-slate-900">12.3% <span className="text-slate-400 font-normal">(1,579)</span></span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-purple-500" /> Drain Blockage
                </span>
                <span className="font-bold text-slate-900">9.8% <span className="text-slate-400 font-normal">(1,258)</span></span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-teal-500" /> Road Cracks
                </span>
                <span className="font-bold text-slate-900">4.2% <span className="text-slate-400 font-normal">(540)</span></span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-slate-500" /> Others
                </span>
                <span className="font-bold text-slate-900">2.5% <span className="text-slate-400 font-normal">(326)</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Issues by Severity Donut Card (col-span-3) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between">
          <h2 className="text-base font-bold text-slate-900 mb-3">Issues by Severity</h2>

          <div className="flex items-center gap-3">
            {/* SVG Donut */}
            <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {/* 5 Severity Segments */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ef4444" strokeWidth="12" strokeDasharray="21 251" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f97316" strokeWidth="12" strokeDasharray="62 251" strokeDashoffset="-21" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="12" strokeDasharray="101 251" strokeDashoffset="-83" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray="46 251" strokeDashoffset="-184" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#06b6d4" strokeWidth="12" strokeDasharray="21 251" strokeDashoffset="-230" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-extrabold text-slate-900">12,842</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Total</span>
              </div>
            </div>

            {/* Severity Legend */}
            <div className="flex-1 space-y-2 text-xs">
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> Critical
                </span>
                <span className="font-bold text-slate-900">8.2% <span className="text-slate-400 font-normal">(1,051)</span></span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-orange-500" /> High
                </span>
                <span className="font-bold text-slate-900">24.7% <span className="text-slate-400 font-normal">(3,172)</span></span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Medium
                </span>
                <span className="font-bold text-slate-900">40.3% <span className="text-slate-400 font-normal">(5,171)</span></span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Low
                </span>
                <span className="font-bold text-slate-900">18.6% <span className="text-slate-400 font-normal">(2,389)</span></span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" /> Very Low
                </span>
                <span className="font-bold text-slate-900">8.2% <span className="text-slate-400 font-normal">(1,059)</span></span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* 4. MIDDLE ROW 2: ISSUES BY WARD (TOP 10), HEATMAP MAP & AVG RESOLUTION TIME BY DEPT */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Issues by Ward Top 10 (col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between">
          <h2 className="text-base font-bold text-slate-900 mb-3">Issues by Ward (Top 10)</h2>

          <div className="space-y-2">
            {[
              { ward: 'Ward 14', count: '1,842', pct: 90 },
              { ward: 'Ward 8', count: '1,423', pct: 72 },
              { ward: 'Ward 12', count: '1,256', pct: 64 },
              { ward: 'Ward 5', count: '1,124', pct: 58 },
              { ward: 'Ward 3', count: '982', pct: 50 },
              { ward: 'Ward 7', count: '856', pct: 44 },
              { ward: 'Ward 10', count: '784', pct: 40 },
              { ward: 'Ward 4', count: '712', pct: 36 },
              { ward: 'Ward 11', count: '645', pct: 33 },
              { ward: 'Ward 2', count: '598', pct: 30 },
            ].map((item) => (
              <div key={item.ward} className="space-y-0.5 group">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-slate-700">{item.ward}</span>
                  <span className="text-slate-900 font-bold">{item.count}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-500" 
                    style={{ width: `${item.pct}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between text-[10px] font-semibold text-slate-400 mt-2">
            <span>0</span>
            <span>500</span>
            <span>1K</span>
            <span>1.5K</span>
            <span>2K</span>
          </div>
        </div>

        {/* Top Issue Locations (Hotspots Map) (col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between relative overflow-hidden">
          <h2 className="text-base font-bold text-slate-900 mb-3 z-10">Top Issue Locations (Hotspots)</h2>

          {/* Interactive Map Visualizer Container */}
          <div className="relative w-full h-64 rounded-xl border border-slate-200/70 overflow-hidden bg-[#eef2f6]">
            {/* SVG Stylized Map Streets Grid Background */}
            <svg className="w-full h-full opacity-60" viewBox="0 0 300 200">
              {/* Rivers / Waterway */}
              <path d="M 0,110 Q 80,140 160,80 T 300,100" fill="none" stroke="#93c5fd" strokeWidth="18" opacity="0.6" />
              {/* Main Road Lines Grid */}
              <line x1="20" y1="0" x2="120" y2="200" stroke="#cbd5e1" strokeWidth="4" />
              <line x1="140" y1="0" x2="240" y2="200" stroke="#cbd5e1" strokeWidth="4" />
              <line x1="0" y1="60" x2="300" y2="40" stroke="#cbd5e1" strokeWidth="4" />
              <line x1="0" y1="160" x2="300" y2="150" stroke="#cbd5e1" strokeWidth="4" />
              <line x1="60" y1="0" x2="280" y2="180" stroke="#e2e8f0" strokeWidth="2" />
              <line x1="0" y1="100" x2="200" y2="0" stroke="#e2e8f0" strokeWidth="2" />
            </svg>

            {/* Glowing Heatmap Spot Elements */}
            {mapHotspots.map((hs) => (
              <button
                key={hs.id}
                onClick={() => setSelectedHotspot(hs)}
                style={{
                  left: `${hs.x}%`,
                  top: `${hs.y}%`,
                  width: `${hs.size * 2}px`,
                  height: `${hs.size * 2}px`,
                  backgroundColor: hs.color
                }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full blur-sm hover:blur-none hover:scale-125 transition-all duration-300 shadow-lg cursor-pointer border border-white/50 animate-pulse"
                title={`${hs.name} - Click for details`}
              />
            ))}

            {/* Heatmap Vertical Gradient Legend */}
            <div className="absolute right-3 top-3 bottom-3 w-3 rounded-full bg-gradient-to-b from-red-500 via-amber-400 to-emerald-500 shadow-md flex flex-col justify-between py-1 items-center">
              <span className="text-[9px] font-bold text-white uppercase tracking-tighter drop-shadow-xs">H</span>
              <span className="text-[9px] font-bold text-white uppercase tracking-tighter drop-shadow-xs">L</span>
            </div>
            <span className="absolute right-8 top-2 text-[9px] font-bold text-slate-500">High</span>
            <span className="absolute right-8 bottom-2 text-[9px] font-bold text-slate-500">Low</span>
          </div>

          <p className="text-[11px] text-slate-400 font-medium text-center mt-2">
            Click any hotspot pin on map to inspect location complaint density.
          </p>
        </div>

        {/* Avg. Resolution Time by Department (col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between">
          <h2 className="text-base font-bold text-slate-900 mb-1">Avg. Resolution Time by Department</h2>
          <span className="text-[11px] text-slate-400 font-medium block mb-3">Days</span>

          {/* Vertical Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-48 pt-4 px-2">
            {[
              { dept: 'Roads & Transport', short: 'Roads & Transport', days: '2.1', heightPct: 65 },
              { dept: 'Sanitation', short: 'Sanitation', days: '1.8', heightPct: 50 },
              { dept: 'Electrical', short: 'Electrical', days: '2.6', heightPct: 80 },
              { dept: 'Water Supply', short: 'Water Supply', days: '2.3', heightPct: 70 },
              { dept: 'Drainage', short: 'Drainage', days: '2.9', heightPct: 90 },
              { dept: 'Waste Mgmt', short: 'Waste Mgmt', days: '1.9', heightPct: 55 },
              { dept: 'Public Works', short: 'Public Works', days: '2.2', heightPct: 68 },
            ].map((item) => (
              <div key={item.dept} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[11px] font-bold text-slate-800">{item.days}</span>
                <div className="w-full max-w-[28px] bg-slate-100 rounded-t-lg h-full flex items-end overflow-hidden">
                  <div 
                    className="w-full bg-emerald-500 group-hover:bg-emerald-600 rounded-t-lg transition-all duration-500"
                    style={{ height: `${item.heightPct}%` }}
                  />
                </div>
                <span className="text-[9px] font-semibold text-slate-600 text-center truncate w-full" title={item.dept}>
                  {item.short}
                </span>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* 5. BOTTOM ROW: RESOLUTION RATE BY DEPT, COMPARATIVE ANALYTICS & SLA COMPLIANCE GAUGE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Resolution Rate by Department (col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between">
          <h2 className="text-base font-bold text-slate-900 mb-4">Resolution Rate by Department</h2>

          <div className="space-y-3">
            {[
              { name: 'Roads & Transport', rate: 87 },
              { name: 'Sanitation', rate: 76 },
              { name: 'Electrical', rate: 82 },
              { name: 'Water Supply', rate: 74 },
              { name: 'Drainage', rate: 71 },
              { name: 'Waste Management', rate: 88 },
              { name: 'Public Works', rate: 83 },
            ].map((dept) => (
              <div key={dept.name} className="space-y-1 group">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{dept.name}</span>
                  <span className="text-slate-900 font-bold">{dept.rate}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${dept.rate}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparative Analytics (Grouped Bar Chart) (col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-base font-bold text-slate-900">Comparative Analytics</h2>
            <div className="flex items-center gap-3 text-[11px] font-semibold">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-blue-600 rounded-xs" />
                <span className="text-slate-600">This Period</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-slate-300 rounded-xs" />
                <span className="text-slate-600">Last Period</span>
              </div>
            </div>
          </div>

          {/* Grouped Bar Chart */}
          <div className="space-y-4 py-2">
            {[
              { title: 'Total Issues', curr: '12,842', last: '10,821', currPct: 85, lastPct: 72 },
              { title: 'Resolved Issues', curr: '8,642', last: '7,425', currPct: 75, lastPct: 65 },
              { title: 'Overdue Issues', curr: '38', last: '45', currPct: 25, lastPct: 35 },
              { title: 'Avg. Resolution Time (days)', curr: '2.4', last: '2.8', currPct: 55, lastPct: 65 },
            ].map((comp, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{comp.title}</span>
                  <div className="flex gap-2 text-[11px]">
                    <span className="font-bold text-blue-600">{comp.curr}</span>
                    <span className="text-slate-400">vs</span>
                    <span className="font-medium text-slate-500">{comp.last}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 h-3">
                  <div className="h-full bg-blue-600 rounded-sm transition-all duration-500" style={{ width: `${comp.currPct}%` }} />
                  <div className="h-full bg-slate-300 rounded-sm transition-all duration-500" style={{ width: `${comp.lastPct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px] font-semibold text-slate-400">
            <span>0</span>
            <span>5K</span>
            <span>10K</span>
            <span>15K</span>
          </div>
        </div>

        {/* SLA Compliance (Semi-Circle Speedometer Gauge) (col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between">
          <h2 className="text-base font-bold text-slate-900 mb-2">SLA Compliance</h2>

          <div className="flex items-center gap-4 py-2">
            {/* SVG Speedometer Semi-Circle Gauge */}
            <div className="relative w-40 h-24 shrink-0 flex items-end justify-center">
              <svg viewBox="0 0 100 55" className="w-full h-full">
                {/* Arc Background Segments */}
                <path d="M 10,50 A 40,40 0 0,1 70,16" fill="none" stroke="#22c55e" strokeWidth="12" strokeLinecap="round" />
                <path d="M 72,17 A 40,40 0 0,1 86,30" fill="none" stroke="#ef4444" strokeWidth="12" strokeLinecap="round" />
                <path d="M 87,32 A 40,40 0 0,1 90,50" fill="none" stroke="#f59e0b" strokeWidth="12" strokeLinecap="round" />

                {/* Gauge Needle */}
                <line x1="50" y1="50" x2="72" y2="24" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="50" cy="50" r="4" fill="#1e293b" />
              </svg>

              {/* Center Gauge Text overlay */}
              <div className="absolute bottom-0 text-center">
                <span className="text-xl font-extrabold text-slate-900 block leading-none">87%</span>
                <span className="text-[10px] font-bold text-slate-500 block mt-0.5">SLA Met</span>
              </div>
            </div>

            {/* SLA Legend List */}
            <div className="flex-1 space-y-2 text-xs">
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> SLA Met
                </span>
                <span className="font-bold text-slate-900">87% <span className="text-slate-400 font-normal">(11,172)</span></span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> SLA Breached
                </span>
                <span className="font-bold text-slate-900">8% <span className="text-slate-400 font-normal">(1,027)</span></span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> SLA Warning
                </span>
                <span className="font-bold text-slate-900">5% <span className="text-slate-400 font-normal">(643)</span></span>
              </div>
            </div>
          </div>

          <div className="text-center pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500">Target: <strong className="text-slate-800">90%</strong></span>
          </div>
        </div>

      </section>

      {/* FOOTER NOTE */}
      <footer className="pt-2 text-center">
        <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          All analytics data is based on the selected date range and filters.
        </p>
      </footer>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* MODAL 1: Download Report Dialog */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Export Analytics Report</h3>
              </div>
              <button onClick={() => setShowReportModal(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Export Format</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-xl">
                  <option>PDF Executive Summary (.pdf)</option>
                  <option>Excel Raw Dataset (.xlsx)</option>
                  <option>CSV Municipal Data (.csv)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Include Sections</label>
                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <label className="flex items-center gap-2 font-medium text-slate-700">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" /> Issues Over Time Trend
                  </label>
                  <label className="flex items-center gap-2 font-medium text-slate-700">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" /> Ward Top 10 Density
                  </label>
                  <label className="flex items-center gap-2 font-medium text-slate-700">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" /> SLA Compliance Breakdown
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => setShowReportModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs">
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  showToast('Analytics report downloaded successfully!');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md"
              >
                Download Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Hotspot Location Details Dialog */}
      {selectedHotspot && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex justify-between items-center border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-slate-900 text-base">{selectedHotspot.name}</h3>
              </div>
              <button onClick={() => setSelectedHotspot(null)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[11px] text-slate-400 font-medium block">Ward Location</span>
                <p className="font-bold text-slate-900">{selectedHotspot.ward}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 font-medium block">Issue Density</span>
                  <p className="font-bold text-rose-600 text-base">{selectedHotspot.issues} Complaints</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 font-medium block">Primary Category</span>
                  <p className="font-bold text-slate-800">{selectedHotspot.topCategory}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button 
                onClick={() => setSelectedHotspot(null)}
                className="px-4 py-1.5 bg-slate-900 text-white font-bold rounded-xl text-xs"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Analytics;