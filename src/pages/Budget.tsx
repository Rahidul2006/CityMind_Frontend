import React, { useState } from 'react';
import { 
  Wallet, 
  Banknote, 
  CreditCard, 
  TrendingUp, 
  ClipboardList, 
  CheckCircle2, 
  Calendar, 
  ChevronDown, 
  Download, 
  AlertTriangle, 
  Info, 
  X, 
  Check, 
  Users, 
  Truck, 
  Wrench, 
  Package, 
  Car, 
  Trash2, 
  Zap, 
  Droplet, 
  Waves, 
  Recycle, 
  ArrowRight
} from 'lucide-react';

export const Budget: React.FC = () => {
  const [selectedDateRange] = useState('May 13 – May 20, 2025');
  const [showReportModal, setShowReportModal] = useState(false);
  const [activeModal, setActiveModal] = useState<'expenditures' | 'alerts' | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [trendHoverIndex, setTrendHoverIndex] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Helper icon renderer for departments
  const renderDeptIcon = (deptName: string) => {
    switch (deptName) {
      case 'Roads & Transport': return <Car className="w-3.5 h-3.5 text-white" />;
      case 'Sanitation': return <Trash2 className="w-3.5 h-3.5 text-white" />;
      case 'Electrical': return <Zap className="w-3.5 h-3.5 text-white" />;
      case 'Water Supply': return <Droplet className="w-3.5 h-3.5 text-white" />;
      case 'Drainage': return <Waves className="w-3.5 h-3.5 text-white" />;
      case 'Waste Management': return <Recycle className="w-3.5 h-3.5 text-white" />;
      default: return <Wrench className="w-3.5 h-3.5 text-white" />;
    }
  };

  // Months for Trend Chart
  const monthsTrend = ["Apr '24", "May '24", "Jun '24", "Jul '24", "Aug '24", "Sep '24", "Oct '24", "Nov '24", "Dec '24", "Jan '25", "Feb '25"];
  const budgetTrendData = [10, 15, 20, 25, 30, 35, 40, 43, 46, 48, 50];
  const expTrendData = [5, 9, 13, 17, 21, 24, 27, 29, 30.5, 31.8, 32.4];

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

      {/* Top Action Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Budget & Resources</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Track budgets, expenditures, and resource utilization across departments
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            onClick={() => showToast('Select Date Range modal')}
            className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>{selectedDateRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* 1. TOP STAT CARDS ROW (6 Cards) */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Total Budget */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-sky-100/80 text-sky-600 flex items-center justify-center shrink-0">
            <Wallet className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Total Budget (FY 2024-25)</span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 block mt-0.5">₹50.00 Cr</span>
            <span className="text-[11px] font-medium text-slate-500 block">Allocated Budget</span>
          </div>
        </div>

        {/* Card 2: Total Expenditure */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
            <Banknote className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Total Expenditure</span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 block mt-0.5">₹32.40 Cr</span>
            <span className="text-[11px] font-medium text-slate-500 block">64.8% of total budget</span>
          </div>
        </div>

        {/* Card 3: Remaining Budget */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-purple-100/80 text-purple-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Remaining Budget</span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 block mt-0.5">₹17.60 Cr</span>
            <span className="text-[11px] font-medium text-slate-500 block">35.2% remaining</span>
          </div>
        </div>

        {/* Card 4: Projected Utilization */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-amber-100/80 text-amber-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Projected Utilization</span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 block mt-0.5">₹45.80 Cr</span>
            <span className="text-[11px] font-medium text-slate-500 block">91.6% by year end</span>
          </div>
        </div>

        {/* Card 5: Total Work Orders */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
            <ClipboardList className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Total Work Orders</span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 block mt-0.5">2,842</span>
            <span className="text-[11px] font-medium text-slate-500 block">Across all departments</span>
          </div>
        </div>

        {/* Card 6: Avg. Cost per Issue */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-rose-100/80 text-rose-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Avg. Cost per Issue</span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 block mt-0.5">₹11,407</span>
            <span className="text-[11px] font-medium text-slate-500 block">This period</span>
          </div>
        </div>
      </section>

      {/* 2. MIDDLE ROW 1: BUDGET UTILIZATION OVERVIEW, BUDGET VS EXP TREND, BUDGET BY DEPT */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Budget Utilization Overview Donut (col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between">
          <h2 className="text-base font-bold text-slate-900 mb-3">Budget Utilization Overview</h2>

          <div className="flex items-center gap-4 py-2">
            {/* Donut Chart */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="12" strokeDasharray="99 251" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray="48 251" strokeDashoffset="-99" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="12" strokeDasharray="38 251" strokeDashoffset="-147" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#06b6d4" strokeWidth="12" strokeDasharray="28 251" strokeDashoffset="-185" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#a855f7" strokeWidth="12" strokeDasharray="18 251" strokeDashoffset="-213" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#14b8a6" strokeWidth="12" strokeDasharray="14 251" strokeDashoffset="-231" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ec4899" strokeWidth="12" strokeDasharray="5 251" strokeDashoffset="-245" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-extrabold text-slate-900 leading-tight">₹32.40 Cr</span>
                <span className="text-[11px] font-bold text-slate-800">64.8%</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Utilized</span>
              </div>
            </div>

            {/* Legend List */}
            <div className="flex-1 space-y-1 text-xs">
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Roads & Transport
                </span>
                <span className="font-bold text-slate-900">₹12.80 Cr <span className="text-slate-400 font-normal">(39.5%)</span></span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Sanitation
                </span>
                <span className="font-bold text-slate-900">₹6.20 Cr <span className="text-slate-400 font-normal">(19.1%)</span></span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Electrical
                </span>
                <span className="font-bold text-slate-900">₹4.90 Cr <span className="text-slate-400 font-normal">(15.1%)</span></span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" /> Water Supply
                </span>
                <span className="font-bold text-slate-900">₹3.70 Cr <span className="text-slate-400 font-normal">(11.4%)</span></span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-purple-500" /> Drainage
                </span>
                <span className="font-bold text-slate-900">₹2.40 Cr <span className="text-slate-400 font-normal">(7.4%)</span></span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-teal-500" /> Waste Management
                </span>
                <span className="font-bold text-slate-900">₹1.80 Cr <span className="text-slate-400 font-normal">(5.6%)</span></span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-pink-500" /> Public Works
                </span>
                <span className="font-bold text-slate-900">₹0.60 Cr <span className="text-slate-400 font-normal">(1.9%)</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Budget vs Expenditure Trend Dual Line (col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-base font-bold text-slate-900">Budget vs Expenditure Trend</h2>
            <div className="flex items-center gap-3 text-[11px] font-semibold">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-1 bg-blue-600 rounded-full" />
                <span className="text-slate-600">Budget (Cumulative)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-1 bg-emerald-500 rounded-full" />
                <span className="text-slate-600">Expenditure (Cumulative)</span>
              </div>
            </div>
          </div>

          {/* SVG Trend Line Canvas */}
          <div className="relative w-full h-56 my-1">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              {/* Y Grid Ticks */}
              {[
                { y: 20, label: '60' },
                { y: 50, label: '50' },
                { y: 80, label: '40' },
                { y: 110, label: '30' },
                { y: 140, label: '20' },
                { y: 170, label: '10' },
                { y: 195, label: '0' }
              ].map((grid, idx) => (
                <g key={idx}>
                  <line x1="35" y1={grid.y} x2="490" y2={grid.y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="28" y={grid.y + 4} textAnchor="end" fontSize="9" fill="#94a3b8" fontWeight="500">
                    {grid.label}
                  </text>
                </g>
              ))}

              {/* Line 1: Budget Cumulative (Blue) */}
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="40,165 85,150 130,135 175,120 220,105 265,90 310,75 355,66 400,57 445,51 490,45"
              />

              {/* Line 2: Expenditure Cumulative (Green) */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="40,180 85,168 130,156 175,144 220,132 265,123 310,114 355,108 400,103 445,99 490,97"
              />

              {/* Dots */}
              {monthsTrend.map((_, i) => {
                const cx = 40 + i * 45;
                const bY = 195 - (budgetTrendData[i] / 60) * 175;
                const eY = 195 - (expTrendData[i] / 60) * 175;
                const isH = trendHoverIndex === i;

                return (
                  <g key={i} onMouseEnter={() => setTrendHoverIndex(i)} onMouseLeave={() => setTrendHoverIndex(null)} className="cursor-pointer">
                    <circle cx={cx} cy={bY} r={isH ? 5.5 : 3.5} fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx={cx} cy={eY} r={isH ? 5.5 : 3.5} fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                  </g>
                );
              })}

              {/* Static Callout Box matching screenshot at Mar '25 / Feb '25 */}
              <g transform="translate(355, 115)">
                <rect width="125" height="42" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.05))" />
                <text x="8" y="14" fill="#64748b" fontSize="8" fontWeight="bold">Mar '25</text>
                <text x="8" y="26" fill="#334155" fontSize="8" fontWeight="semibold">Budget: ₹50.00 Cr</text>
                <text x="8" y="37" fill="#334155" fontSize="8" fontWeight="semibold">Expenditure: ₹32.40 Cr</text>
              </g>
            </svg>
          </div>

          <div className="flex justify-between text-[9px] font-semibold text-slate-400 pt-1 border-t border-slate-100">
            {monthsTrend.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        {/* Budget by Department Table (col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between">
          <h2 className="text-base font-bold text-slate-900 mb-3">Budget by Department</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                  <th className="py-2">Department</th>
                  <th className="py-2 text-center">Allocated (₹)</th>
                  <th className="py-2 text-center">Utilized (₹)</th>
                  <th className="py-2 text-right">Utilization %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: 'Roads & Transport', alloc: '₹15.00 Cr', util: '₹12.80 Cr', pct: 85.3, color: '#3b82f6' },
                  { name: 'Sanitation', alloc: '₹8.00 Cr', util: '₹6.20 Cr', pct: 77.5, color: '#10b981' },
                  { name: 'Electrical', alloc: '₹6.00 Cr', util: '₹4.90 Cr', pct: 81.7, color: '#f59e0b' },
                  { name: 'Water Supply', alloc: '₹5.00 Cr', util: '₹3.70 Cr', pct: 74.0, color: '#06b6d4' },
                  { name: 'Drainage', alloc: '₹4.00 Cr', util: '₹2.40 Cr', pct: 60.0, color: '#a855f7' },
                  { name: 'Waste Management', alloc: '₹3.00 Cr', util: '₹1.80 Cr', pct: 60.0, color: '#14b8a6' },
                  { name: 'Public Works', alloc: '₹4.00 Cr', util: '₹0.60 Cr', pct: 15.0, color: '#ec4899' },
                ].map((row) => (
                  <tr key={row.name} className="hover:bg-slate-50">
                    <td className="py-2 font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: row.color }}>
                          {renderDeptIcon(row.name)}
                        </div>
                        <span className="truncate">{row.name}</span>
                      </div>
                    </td>
                    <td className="py-2 text-center text-slate-600 font-medium">{row.alloc}</td>
                    <td className="py-2 text-center text-slate-900 font-bold">{row.util}</td>
                    <td className="py-2 text-right font-bold text-slate-900">
                      <div className="flex items-center justify-end gap-2">
                        <span>{row.pct}%</span>
                        <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                          <div className="h-full rounded-full" style={{ width: `${row.pct}%`, backgroundColor: row.color }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 font-bold text-slate-900 text-xs">
                  <td className="py-2">Total</td>
                  <td className="py-2 text-center">₹50.00 Cr</td>
                  <td className="py-2 text-center text-blue-600">₹32.40 Cr</td>
                  <td className="py-2 text-right">64.8%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </section>

      {/* 3. MIDDLE ROW 2: EXPENDITURE BY ISSUE TYPE, BUDGET BY WARD (TOP 10), RESOURCE UTILIZATION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Expenditure by Issue Type Donut (col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between">
          <h2 className="text-base font-bold text-slate-900 mb-3">Expenditure by Issue Type</h2>

          <div className="flex items-center gap-4 py-2">
            {/* Donut Chart */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="12" strokeDasharray="96 251" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray="49 251" strokeDashoffset="-96" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="12" strokeDasharray="45 251" strokeDashoffset="-145" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#06b6d4" strokeWidth="12" strokeDasharray="25 251" strokeDashoffset="-190" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#a855f7" strokeWidth="12" strokeDasharray="21 251" strokeDashoffset="-215" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#64748b" strokeWidth="12" strokeDasharray="15 251" strokeDashoffset="-236" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-extrabold text-slate-900 leading-tight">₹32.40 Cr</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Total Spent</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Potholes
                </span>
                <span className="font-bold text-slate-900">₹12.40 Cr <span className="text-slate-400 font-normal">(38.3%)</span></span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Drain Blockage
                </span>
                <span className="font-bold text-slate-900">₹6.30 Cr <span className="text-slate-400 font-normal">(19.4%)</span></span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Garbage Overflow
                </span>
                <span className="font-bold text-slate-900">₹5.80 Cr <span className="text-slate-400 font-normal">(17.9%)</span></span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" /> Water Leakage
                </span>
                <span className="font-bold text-slate-900">₹3.20 Cr <span className="text-slate-400 font-normal">(9.9%)</span></span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-purple-500" /> Streetlight Repair
                </span>
                <span className="font-bold text-slate-900">₹2.70 Cr <span className="text-slate-400 font-normal">(8.3%)</span></span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-slate-500" /> Others
                </span>
                <span className="font-bold text-slate-900">₹2.00 Cr <span className="text-slate-400 font-normal">(6.2%)</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Budget by Ward Top 10 Horizontal Bar (col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-base font-bold text-slate-900">Budget by Ward (Top 10)</h2>
            <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-400">
              <span>Allocated (₹)</span>
              <span>Utilized (₹)</span>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { ward: 'Ward 14', alloc: '₹4.20 Cr', util: '₹2.80 Cr', pct: 84 },
              { ward: 'Ward 8', alloc: '₹3.80 Cr', util: '₹2.60 Cr', pct: 76 },
              { ward: 'Ward 12', alloc: '₹3.60 Cr', util: '₹2.30 Cr', pct: 72 },
              { ward: 'Ward 5', alloc: '₹3.20 Cr', util: '₹2.10 Cr', pct: 64 },
              { ward: 'Ward 3', alloc: '₹3.00 Cr', util: '₹1.90 Cr', pct: 60 },
              { ward: 'Ward 7', alloc: '₹2.80 Cr', util: '₹1.80 Cr', pct: 56 },
              { ward: 'Ward 10', alloc: '₹2.40 Cr', util: '₹1.40 Cr', pct: 48 },
              { ward: 'Ward 4', alloc: '₹2.20 Cr', util: '₹1.30 Cr', pct: 44 },
              { ward: 'Ward 11', alloc: '₹1.90 Cr', util: '₹1.10 Cr', pct: 38 },
              { ward: 'Ward 2', alloc: '₹1.90 Cr', util: '₹1.10 Cr', pct: 38 },
            ].map((item) => (
              <div key={item.ward} className="space-y-0.5">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-slate-700">{item.ward}</span>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="text-slate-500 font-medium">{item.alloc}</span>
                    <span className="text-slate-900 font-bold">{item.util}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px] font-semibold text-slate-400 mt-1">
            <span>0</span>
            <span>1 Cr</span>
            <span>2 Cr</span>
            <span>3 Cr</span>
            <span>4 Cr</span>
            <span>5 Cr</span>
          </div>
        </div>

        {/* Resource Utilization Tiles (col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between">
          <h2 className="text-base font-bold text-slate-900 mb-3">Resource Utilization</h2>

          <div className="grid grid-cols-2 gap-3 flex-1">
            {/* Tile 1: Workforce */}
            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block">Workforce</span>
                  <p className="text-sm font-extrabold text-slate-900">1,245 <span className="text-xs text-slate-400 font-normal">/ 1,600</span></p>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-600 block">77.8% <span className="text-slate-400 font-normal">Utilized</span></span>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '77.8%' }} />
                </div>
              </div>
            </div>

            {/* Tile 2: Vehicles */}
            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block">Vehicles</span>
                  <p className="text-sm font-extrabold text-slate-900">312 <span className="text-xs text-slate-400 font-normal">/ 450</span></p>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-600 block">69.3% <span className="text-slate-400 font-normal">Utilized</span></span>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '69.3%' }} />
                </div>
              </div>
            </div>

            {/* Tile 3: Equipment */}
            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block">Equipment</span>
                  <p className="text-sm font-extrabold text-slate-900">178 <span className="text-xs text-slate-400 font-normal">/ 250</span></p>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-600 block">71.2% <span className="text-slate-400 font-normal">Utilized</span></span>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '71.2%' }} />
                </div>
              </div>
            </div>

            {/* Tile 4: Materials */}
            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block">Materials</span>
                  <p className="text-sm font-extrabold text-slate-900">62%</p>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-medium text-slate-500 block">Average Availability</span>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '62%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* 4. BOTTOM ROW: RECENT EXPENDITURES (LEFT) & BUDGET ALERTS (RIGHT) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Recent Expenditures Table (col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-3">Recent Expenditures</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[550px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                    <th className="py-2.5 px-2">Date</th>
                    <th className="py-2.5 px-2">Work Order ID</th>
                    <th className="py-2.5 px-2">Department</th>
                    <th className="py-2.5 px-2">Issue Type</th>
                    <th className="py-2.5 px-2">Ward</th>
                    <th className="py-2.5 px-2 text-right">Amount (₹)</th>
                    <th className="py-2.5 px-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {[
                    { date: 'May 20, 2025', wo: 'WO-4521', dept: 'Roads & Transport', issue: 'Pothole Repair', ward: 'Ward 14', amount: '₹1,25,000', status: 'Completed' },
                    { date: 'May 19, 2025', wo: 'WO-4488', dept: 'Sanitation', issue: 'Drain Blockage', ward: 'Ward 8', amount: '₹85,000', status: 'Completed' },
                    { date: 'May 18, 2025', wo: 'WO-4442', dept: 'Electrical', issue: 'Streetlight Repair', ward: 'Ward 12', amount: '₹62,500', status: 'Completed' },
                    { date: 'May 18, 2025', wo: 'WO-4410', dept: 'Water Supply', issue: 'Water Leakage', ward: 'Ward 5', amount: '₹90,000', status: 'In Progress' },
                    { date: 'May 17, 2025', wo: 'WO-4366', dept: 'Waste Management', issue: 'Garbage Overflow', ward: 'Ward 3', amount: '₹48,000', status: 'Completed' },
                  ].map((row) => (
                    <tr key={row.wo} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-2 text-slate-600">{row.date}</td>
                      <td className="py-3 px-2 font-bold text-slate-900">{row.wo}</td>
                      <td className="py-3 px-2 text-slate-700">{row.dept}</td>
                      <td className="py-3 px-2 text-slate-600">{row.issue}</td>
                      <td className="py-3 px-2 text-slate-600">{row.ward}</td>
                      <td className="py-3 px-2 text-right font-bold text-slate-900">{row.amount}</td>
                      <td className="py-3 px-2 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          row.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setActiveModal('expenditures')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Expenditures</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Budget Alerts List (col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-3">Budget Alerts</h2>

            <div className="space-y-3">
              {/* Alert 1 */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-rose-600">High Utilization Alert</h4>
                    <span className="text-[10px] text-slate-400 font-medium">May 20, 2025</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">Roads & Transport budget utilization is at 85.3%</p>
                </div>
              </div>

              {/* Alert 2 */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-amber-600">Budget Running Low</h4>
                    <span className="text-[10px] text-slate-400 font-medium">May 19, 2025</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">Drainage department has only 18% of budget remaining</p>
                </div>
              </div>

              {/* Alert 3 */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-blue-600">SLA Impact Warning</h4>
                    <span className="text-[10px] text-slate-400 font-medium">May 18, 2025</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">Low budget in Electrical may impact 14 pending work orders</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setActiveModal('alerts')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Alerts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* MODAL 1: Download Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Export Budget & Resource Report</h3>
              </div>
              <button onClick={() => setShowReportModal(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Export Format</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-xl">
                  <option>PDF Financial Summary (.pdf)</option>
                  <option>Excel Department Expenditure (.xlsx)</option>
                  <option>CSV Raw Expenditure Log (.csv)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Include Sections</label>
                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <label className="flex items-center gap-2 font-medium text-slate-700">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" /> Department-wise Allocations
                  </label>
                  <label className="flex items-center gap-2 font-medium text-slate-700">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" /> Resource & Fleet Utilization
                  </label>
                  <label className="flex items-center gap-2 font-medium text-slate-700">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" /> Audit Log & Work Orders
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
                  showToast('Budget report downloaded successfully!');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md"
              >
                Download Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: View All Expenditures */}
      {activeModal === 'expenditures' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">All Municipal Expenditures Log</h3>
              <button onClick={() => setActiveModal(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                    <th className="py-2">Date</th>
                    <th className="py-2">Work Order ID</th>
                    <th className="py-2">Department</th>
                    <th className="py-2">Issue Type</th>
                    <th className="py-2 text-right">Amount (₹)</th>
                    <th className="py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { date: 'May 20, 2025', wo: 'WO-4521', dept: 'Roads & Transport', issue: 'Pothole Repair', amount: '₹1,25,000', status: 'Completed' },
                    { date: 'May 19, 2025', wo: 'WO-4488', dept: 'Sanitation', issue: 'Drain Blockage', amount: '₹85,000', status: 'Completed' },
                    { date: 'May 18, 2025', wo: 'WO-4442', dept: 'Electrical', issue: 'Streetlight Repair', amount: '₹62,500', status: 'Completed' },
                    { date: 'May 18, 2025', wo: 'WO-4410', dept: 'Water Supply', issue: 'Water Leakage', amount: '₹90,000', status: 'In Progress' },
                    { date: 'May 17, 2025', wo: 'WO-4366', dept: 'Waste Management', issue: 'Garbage Overflow', amount: '₹48,000', status: 'Completed' },
                    { date: 'May 16, 2025', wo: 'WO-4310', dept: 'Public Works', issue: 'Bridge Gap Fix', amount: '₹2,10,000', status: 'Completed' },
                  ].map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 text-slate-600">{r.date}</td>
                      <td className="py-2.5 font-bold text-slate-900">{r.wo}</td>
                      <td className="py-2.5 text-slate-700">{r.dept}</td>
                      <td className="py-2.5 text-slate-600">{r.issue}</td>
                      <td className="py-2.5 text-right font-bold text-slate-900">{r.amount}</td>
                      <td className="py-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          r.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: View All Alerts */}
      {activeModal === 'alerts' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex justify-between items-center border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-slate-900 text-base">All Budget & Resource Alerts</h3>
              </div>
              <button onClick={() => setActiveModal(null)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl">
                <h4 className="font-bold text-rose-700">High Utilization Alert</h4>
                <p className="text-slate-600 mt-0.5">Roads & Transport budget utilization is at 85.3% (₹12.80 Cr of ₹15.00 Cr used).</p>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <h4 className="font-bold text-amber-700">Budget Running Low</h4>
                <p className="text-slate-600 mt-0.5">Drainage department has only 18% of budget remaining for Q4.</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <h4 className="font-bold text-blue-700">SLA Impact Warning</h4>
                <p className="text-slate-600 mt-0.5">Low budget in Electrical may impact 14 pending work orders.</p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Budget;