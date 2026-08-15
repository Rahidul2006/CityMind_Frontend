import React, { useState } from 'react';
import { 
  Building2, 
  Trash2, 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  Target, 
  ChevronDown, 
  Plus, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  X, 
  Zap, 
  Droplet, 
  Waves, 
  Recycle, 
  Wrench, 
  Car, 
  AlertTriangle,
  UserCheck,
  Download,
  Filter,
  Check,
  TrendingUp,
  ArrowRight,
  Eye,
  Sliders
} from 'lucide-react';

export interface DepartmentItem {
  id: string;
  name: string;
  head: string;
  teams: number;
  assigned: number;
  active: number;
  resolved: number;
  overdue: number;
  avgResolutionTime: string;
  avgHours: number;
  slaCompliance: number;
  budget: string;
  color: string; // Hex color for chart bars
  badgeBg: string; // Tailwind bg for icon badge
  iconName: 'car' | 'trash' | 'zap' | 'droplet' | 'waves' | 'recycle' | 'wrench' | 'building';
  workloadPct: number;
}

const INITIAL_DEPARTMENTS: DepartmentItem[] = [
  {
    id: 'dept-1',
    name: 'Roads & Transport',
    head: 'Er. Rajesh Varma',
    teams: 14,
    assigned: 352,
    active: 198,
    resolved: 132,
    overdue: 12,
    avgResolutionTime: '2.1 days',
    avgHours: 50.4,
    slaCompliance: 87,
    budget: '$420,000',
    color: '#f97316', // Orange
    badgeBg: 'bg-orange-500',
    iconName: 'car',
    workloadPct: 27.4
  },
  {
    id: 'dept-2',
    name: 'Sanitation',
    head: 'Anita Desai',
    teams: 22,
    assigned: 268,
    active: 172,
    resolved: 96,
    overdue: 8,
    avgResolutionTime: '1.8 days',
    avgHours: 43.2,
    slaCompliance: 76,
    budget: '$380,000',
    color: '#10b981', // Green
    badgeBg: 'bg-emerald-500',
    iconName: 'trash',
    workloadPct: 20.9
  },
  {
    id: 'dept-3',
    name: 'Electrical',
    head: 'Suresh Kumar',
    teams: 9,
    assigned: 214,
    active: 128,
    resolved: 80,
    overdue: 6,
    avgResolutionTime: '2.6 days',
    avgHours: 62.4,
    slaCompliance: 82,
    budget: '$210,000',
    color: '#f59e0b', // Yellow / Amber
    badgeBg: 'bg-amber-500',
    iconName: 'zap',
    workloadPct: 16.7
  },
  {
    id: 'dept-4',
    name: 'Water Supply',
    head: 'Dr. Mohan Lal',
    teams: 16,
    assigned: 156,
    active: 96,
    resolved: 58,
    overdue: 4,
    avgResolutionTime: '2.3 days',
    avgHours: 55.2,
    slaCompliance: 74,
    budget: '$510,000',
    color: '#3b82f6', // Blue
    badgeBg: 'bg-blue-500',
    iconName: 'droplet',
    workloadPct: 12.2
  },
  {
    id: 'dept-5',
    name: 'Drainage',
    head: 'Priya Sharma',
    teams: 11,
    assigned: 184,
    active: 112,
    resolved: 64,
    overdue: 10,
    avgResolutionTime: '2.9 days',
    avgHours: 69.6,
    slaCompliance: 71,
    budget: '$290,000',
    color: '#a855f7', // Purple
    badgeBg: 'bg-purple-500',
    iconName: 'waves',
    workloadPct: 14.3
  },
  {
    id: 'dept-6',
    name: 'Waste Management',
    head: 'Vikram Singh',
    teams: 18,
    assigned: 110,
    active: 68,
    resolved: 40,
    overdue: 2,
    avgResolutionTime: '1.9 days',
    avgHours: 45.6,
    slaCompliance: 88,
    budget: '$340,000',
    color: '#14b8a6', // Teal
    badgeBg: 'bg-teal-500',
    iconName: 'recycle',
    workloadPct: 8.6
  },
  {
    id: 'dept-7',
    name: 'Public Works',
    head: 'Rohan Mehta',
    teams: 8,
    assigned: 92,
    active: 68,
    resolved: 24,
    overdue: 0,
    avgResolutionTime: '2.2 days',
    avgHours: 52.8,
    slaCompliance: 83,
    budget: '$270,000',
    color: '#ec4899', // Pink
    badgeBg: 'bg-pink-500',
    iconName: 'wrench',
    workloadPct: 0
  }
];

export const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentItem[]>(INITIAL_DEPARTMENTS);
  const [filterDepartment, setFilterDepartment] = useState<string>('All');
  const [performanceMetric, setPerformanceMetric] = useState<'sla' | 'time' | 'resolved' | 'active'>('sla');
  
  // Modal states
  const [activeModal, setActiveModal] = useState<
    'details' | 'add' | 'assign' | 'sla' | 'workOrders' | 'report' | 'settings' | 'fullReport' | 'allOverdue' | null
  >(null);
  const [selectedDept, setSelectedDept] = useState<DepartmentItem | null>(null);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper icon renderer
  const renderDeptIcon = (iconName: string, className = "w-4 h-4 text-white") => {
    switch (iconName) {
      case 'car': return <Car className={className} />;
      case 'trash': return <Trash2 className={className} />;
      case 'zap': return <Zap className={className} />;
      case 'droplet': return <Droplet className={className} />;
      case 'waves': return <Waves className={className} />;
      case 'recycle': return <Recycle className={className} />;
      case 'wrench': return <Wrench className={className} />;
      default: return <Building2 className={className} />;
    }
  };

  // Filtered department list for table
  const filteredDepartments = filterDepartment === 'All'
    ? departments
    : departments.filter(d => d.name === filterDepartment);

  // Top overdue departments sorted descending
  const overdueDepartments = [...departments]
    .filter(d => d.overdue > 0)
    .sort((a, b) => b.overdue - a.overdue);

  // Calculation for KPI totals
  const totalDeptsCount = departments.length;
  const totalAssignedIssues = departments.reduce((acc, d) => acc + (d.assigned || 0), 0);
  const totalActiveIssues = departments.reduce((acc, d) => acc + d.active, 0);
  const totalResolvedIssues = departments.reduce((acc, d) => acc + d.resolved, 0);
  const totalOverdueIssues = departments.reduce((acc, d) => acc + d.overdue, 0);

  // Render Horizontal chart bar width & label based on metric
  const getMetricValue = (dept: DepartmentItem) => {
    switch (performanceMetric) {
      case 'sla':
        return { pct: dept.slaCompliance, label: `${dept.slaCompliance}%` };
      case 'time': {
        // max hours scaling e.g. 72h max
        const pct = Math.min(100, Math.round((dept.avgHours / 72) * 100));
        return { pct, label: dept.avgResolutionTime };
      }
      case 'resolved': {
        const pct = dept.assigned > 0 ? Math.round((dept.resolved / dept.assigned) * 100) : 0;
        return { pct, label: `${dept.resolved} (${pct}%)` };
      }
      case 'active': {
        const maxActive = Math.max(...departments.map(d => d.active));
        const pct = maxActive > 0 ? Math.round((dept.active / maxActive) * 100) : 0;
        return { pct, label: `${dept.active} active` };
      }
    }
  };

  // SVG Donut Chart Math
  const totalWorkloadCount = totalAssignedIssues;
  let cumulativeAngle = 0;
  const donutSlices = departments.map((dept) => {
    const pct = totalWorkloadCount > 0 ? (dept.assigned / totalWorkloadCount) : 0;
    const strokeDasharray = `${pct * 283} 283`;
    const strokeDashoffset = -cumulativeAngle * 283;
    cumulativeAngle += pct;
    return {
      dept,
      strokeDasharray,
      strokeDashoffset,
      pctDisplay: (pct * 100).toFixed(1)
    };
  });

  // Handle Form Submission for Add Department
  const [newDeptForm, setNewDeptForm] = useState({
    name: '',
    head: '',
    teams: 10,
    assigned: 120,
    active: 70,
    resolved: 50,
    overdue: 3,
    avgResolutionTime: '2.0 days',
    slaCompliance: 85,
    budget: '$300,000',
    color: '#3b82f6',
    iconName: 'building' as DepartmentItem['iconName']
  });

  const handleAddDepartmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptForm.name || !newDeptForm.head) return;

    const newDept: DepartmentItem = {
      id: `dept-${Date.now()}`,
      name: newDeptForm.name,
      head: newDeptForm.head,
      teams: Number(newDeptForm.teams),
      assigned: Number(newDeptForm.assigned),
      active: Number(newDeptForm.active),
      resolved: Number(newDeptForm.resolved),
      overdue: Number(newDeptForm.overdue),
      avgResolutionTime: newDeptForm.avgResolutionTime,
      avgHours: 48,
      slaCompliance: Number(newDeptForm.slaCompliance),
      budget: newDeptForm.budget,
      color: newDeptForm.color,
      badgeBg: 'bg-blue-600',
      iconName: newDeptForm.iconName,
      workloadPct: 10
    };

    setDepartments([...departments, newDept]);
    setActiveModal(null);
    showToast(`Department "${newDept.name}" created successfully!`);
    setNewDeptForm({
      name: '',
      head: '',
      teams: 10,
      assigned: 120,
      active: 70,
      resolved: 50,
      overdue: 3,
      avgResolutionTime: '2.0 days',
      slaCompliance: 85,
      budget: '$300,000',
      color: '#3b82f6',
      iconName: 'building'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-top-2">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP STAT CARDS ROW (6 Cards matching image) */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Total Departments */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-sky-100/80 text-sky-600 flex items-center justify-center shrink-0">
            <Building2 className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Total Departments</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-slate-900">{totalDeptsCount}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Active departments</span>
          </div>
        </div>

        {/* Card 2: Total Assigned Issues */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
            <Trash2 className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Total Assigned Issues</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-slate-900">{totalAssignedIssues.toLocaleString()}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Across all departments</span>
          </div>
        </div>

        {/* Card 3: Active Issues */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-purple-100/80 text-purple-600 flex items-center justify-center shrink-0">
            <ClipboardList className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Active Issues</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-slate-900">{totalActiveIssues.toLocaleString()}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Currently in progress</span>
          </div>
        </div>

        {/* Card 4: Resolved Issues */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-amber-100/80 text-amber-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Resolved Issues</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-slate-900">{totalResolvedIssues.toLocaleString()}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">This week</span>
          </div>
        </div>

        {/* Card 5: Overdue Issues */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-rose-100/80 text-rose-500 flex items-center justify-center shrink-0">
            <Clock className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Overdue Issues</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-slate-900">{totalOverdueIssues}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Require attention</span>
          </div>
        </div>

        {/* Card 6: Avg. Resolution Time */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-teal-100/80 text-teal-600 flex items-center justify-center shrink-0">
            <Target className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Avg. Resolution Time</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-slate-900">2.4 days</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Across all departments</span>
          </div>
        </div>
      </section>

      {/* 2. MIDDLE SECTION: DEPARTMENT OVERVIEW (LEFT) & PERFORMANCE (RIGHT) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Department Overview Table (col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Department Overview</h2>
            
            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">Filter:</span>
              <div className="relative">
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-slate-700 cursor-pointer transition-colors focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="All">All Departments</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                  <th className="py-2.5 px-2">Department</th>
                  <th className="py-2.5 px-2 text-center">Assigned</th>
                  <th className="py-2.5 px-2 text-center">Active</th>
                  <th className="py-2.5 px-2 text-center">Resolved</th>
                  <th className="py-2.5 px-2 text-center">Overdue</th>
                  <th className="py-2.5 px-2 text-center">Avg. Resolution Time</th>
                  <th className="py-2.5 px-2 text-left">SLA Compliance</th>
                  <th className="py-2.5 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredDepartments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-slate-50/80 transition-colors group">
                    {/* Department Name & Icon */}
                    <td className="py-3 px-2 font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-2xs"
                          style={{ backgroundColor: dept.color }}
                        >
                          {renderDeptIcon(dept.iconName, "w-3.5 h-3.5 text-white")}
                        </div>
                        <span className="truncate max-w-[140px] sm:max-w-none">{dept.name}</span>
                      </div>
                    </td>

                    {/* Assigned */}
                    <td className="py-3 px-2 text-center font-medium text-slate-600">
                      {dept.assigned ? dept.assigned : '-'}
                    </td>

                    {/* Active */}
                    <td className="py-3 px-2 text-center font-medium text-slate-600">
                      {dept.active}
                    </td>

                    {/* Resolved */}
                    <td className="py-3 px-2 text-center font-bold text-emerald-600">
                      {dept.resolved}
                    </td>

                    {/* Overdue */}
                    <td className="py-3 px-2 text-center font-bold text-rose-500">
                      {dept.overdue > 0 ? dept.overdue : '-'}
                    </td>

                    {/* Avg Resolution Time */}
                    <td className="py-3 px-2 text-center font-medium text-slate-600">
                      {dept.avgResolutionTime}
                    </td>

                    {/* SLA Compliance Progress Bar */}
                    <td className="py-3 px-2">
                      <div className="w-24 space-y-1">
                        <span className="text-[11px] font-semibold text-slate-700 block">
                          {dept.slaCompliance}%
                        </span>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${dept.slaCompliance}%`,
                              backgroundColor: dept.slaCompliance >= 80 ? '#22c55e' : dept.slaCompliance >= 75 ? '#10b981' : '#eab308'
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Action Button */}
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => {
                          setSelectedDept(dept);
                          setActiveModal('details');
                        }}
                        className="px-2.5 py-1.5 border border-blue-200 hover:border-blue-400 bg-blue-50/50 hover:bg-blue-50 text-blue-600 font-semibold text-[11px] rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: Department Performance Chart (col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4 flex flex-col justify-between min-h-[460px]">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Department Performance</h2>
              <button 
                onClick={() => setActiveModal('fullReport')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              >
                View Full Report
              </button>
            </div>

            {/* Performance Metric Selector */}
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200/70 p-2 rounded-xl mb-6 text-xs">
              <span className="text-slate-500 font-medium">Performance Metric:</span>
              <div className="relative">
                <select
                  value={performanceMetric}
                  onChange={(e) => setPerformanceMetric(e.target.value as any)}
                  className="appearance-none bg-white border border-slate-200 rounded-lg px-3 py-1 pr-7 text-xs font-semibold text-slate-800 cursor-pointer shadow-2xs"
                >
                  <option value="sla">SLA Compliance</option>
                  <option value="time">Resolution Speed</option>
                  <option value="resolved">Resolved Rate</option>
                  <option value="active">Active Workload</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Horizontal Bar Chart List */}
            <div className="space-y-4">
              {departments.map((dept) => {
                const metric = getMetricValue(dept);
                return (
                  <div key={dept.id} className="space-y-1 group">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700 group-hover:text-slate-900 transition-colors">
                        {dept.name}
                      </span>
                      <span className="text-slate-800 font-bold">{metric.label}</span>
                    </div>

                    {/* Bar Container */}
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${metric.pct}%`,
                          backgroundColor: dept.color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart X-Axis Ticks (0%, 25%, 50%, 75%, 100%) */}
          <div className="pt-4 border-t border-slate-100 flex justify-between text-[11px] font-medium text-slate-400">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>
      </section>

      {/* 3. BOTTOM SECTION: 3 CARDS SIDE-BY-SIDE */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* CARD 1: Workload Distribution (Donut Chart) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between">
          <h2 className="text-base font-bold text-slate-900 mb-4">Workload Distribution</h2>
          
          <div className="flex items-center gap-4 py-2">
            {/* SVG Donut Chart with Center Text */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {donutSlices.map((slice, idx) => (
                  <circle
                    key={idx}
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke={slice.dept.color}
                    strokeWidth="10"
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                  />
                ))}
              </svg>
              {/* Inner Donut Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-lg font-extrabold text-slate-900 leading-tight">
                  {totalAssignedIssues.toLocaleString()}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Total Issues
                </span>
              </div>
            </div>

            {/* Legend List */}
            <div className="flex-1 space-y-1.5 text-xs">
              {departments.map((dept) => (
                <div key={dept.id} className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2 truncate">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: dept.color }} 
                    />
                    <span className="truncate font-medium text-[11px]">{dept.name}</span>
                  </div>
                  <span className="font-bold text-[11px] text-slate-900">
                    {dept.workloadPct > 0 ? `${dept.workloadPct}%` : '-'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 2: Top Overdue Departments */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-base font-bold text-slate-900">Top Overdue Departments</h2>
            <button 
              onClick={() => setActiveModal('allOverdue')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-3 py-1">
            {overdueDepartments.slice(0, 4).map((dept) => (
              <div 
                key={dept.id} 
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white"
                    style={{ backgroundColor: dept.color }}
                  >
                    {renderDeptIcon(dept.iconName, "w-4 h-4 text-white")}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{dept.name}</h4>
                    <span className="text-[11px] text-rose-500 font-bold">
                      {dept.overdue} Overdue
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedDept(dept);
                    setActiveModal('details');
                  }}
                  className="px-3 py-1 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-blue-600 text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 3: Department Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between">
          <h2 className="text-base font-bold text-slate-900 mb-3">Department Quick Actions</h2>

          <div className="grid grid-cols-2 gap-2.5">
            {/* 1. Add Department */}
            <button 
              onClick={() => setActiveModal('add')}
              className="p-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-200 rounded-xl text-left transition-all group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100/80 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Plus className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Add Department</h4>
              <p className="text-[10px] text-slate-400 font-medium">Create a new department</p>
            </button>

            {/* 2. Assign Staff */}
            <button 
              onClick={() => setActiveModal('assign')}
              className="p-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-200 rounded-xl text-left transition-all group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100/80 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Assign Staff</h4>
              <p className="text-[10px] text-slate-400 font-medium">Manage department staff</p>
            </button>

            {/* 3. Set SLA */}
            <button 
              onClick={() => setActiveModal('sla')}
              className="p-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-200 rounded-xl text-left transition-all group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100/80 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Set SLA</h4>
              <p className="text-[10px] text-slate-400 font-medium">Configure SLA targets</p>
            </button>

            {/* 4. View Work Orders */}
            <button 
              onClick={() => setActiveModal('workOrders')}
              className="p-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-200 rounded-xl text-left transition-all group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100/80 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">View Work Orders</h4>
              <p className="text-[10px] text-slate-400 font-medium">Department-wise orders</p>
            </button>

            {/* 5. Generate Report */}
            <button 
              onClick={() => setActiveModal('report')}
              className="p-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-200 rounded-xl text-left transition-all group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100/80 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Generate Report</h4>
              <p className="text-[10px] text-slate-400 font-medium">Performance reports</p>
            </button>

            {/* 6. Department Settings */}
            <button 
              onClick={() => setActiveModal('settings')}
              className="p-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-200 rounded-xl text-left transition-all group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100/80 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Settings className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Department Settings</h4>
              <p className="text-[10px] text-slate-400 font-medium">Manage preferences</p>
            </button>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* INTERACTIVE MODALS */}
      {/* ========================================================================= */}

      {/* MODAL 1: Department Details Modal */}
      {activeModal === 'details' && selectedDept && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
                  style={{ backgroundColor: selectedDept.color }}
                >
                  {renderDeptIcon(selectedDept.iconName, "w-5 h-5 text-white")}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedDept.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">Department Head: {selectedDept.head}</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Stat Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-medium text-slate-400">Assigned Issues</span>
                  <p className="text-lg font-bold text-slate-900">{selectedDept.assigned}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-medium text-slate-400">Active Workload</span>
                  <p className="text-lg font-bold text-blue-600">{selectedDept.active}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-medium text-slate-400">Resolved</span>
                  <p className="text-lg font-bold text-emerald-600">{selectedDept.resolved}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-medium text-slate-400">Overdue</span>
                  <p className="text-lg font-bold text-rose-500">{selectedDept.overdue}</p>
                </div>
              </div>

              {/* SLA & Speed Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">SLA Compliance Rate</span>
                    <span className="text-slate-900">{selectedDept.slaCompliance}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ width: `${selectedDept.slaCompliance}%`, backgroundColor: selectedDept.color }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Target is set to minimum 80% SLA compliance.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-xs font-semibold text-slate-600">Avg. Resolution Speed</span>
                  <p className="text-xl font-extrabold text-slate-900">{selectedDept.avgResolutionTime}</p>
                  <p className="text-[11px] text-slate-500">Field Units Active: <strong className="text-slate-800">{selectedDept.teams} Teams</strong></p>
                </div>
              </div>

              {/* Recent Department Activity */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Active Field Tasks</h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">Task #DEP-9042 - Road Pothole Patching</span>
                      <p className="text-[11px] text-slate-500">Assigned to Team 4 • MG Road Ward 14</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px]">In Progress</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">Task #DEP-8811 - Emergency Inspection</span>
                      <p className="text-[11px] text-slate-500">Assigned to Supervisor {selectedDept.head}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">On Track</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  showToast(`Department settings synced for ${selectedDept.name}`);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Department Modal */}
      {activeModal === 'add' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Add New Department</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDepartmentSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Department Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Parks & Recreation"
                  value={newDeptForm.name}
                  onChange={(e) => setNewDeptForm({...newDeptForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Department Head / Officer *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Dr. Jane Smith"
                  value={newDeptForm.head}
                  onChange={(e) => setNewDeptForm({...newDeptForm, head: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Field Teams Count</label>
                  <input 
                    type="number" 
                    value={newDeptForm.teams}
                    onChange={(e) => setNewDeptForm({...newDeptForm, teams: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target SLA (%)</label>
                  <input 
                    type="number" 
                    value={newDeptForm.slaCompliance}
                    onChange={(e) => setNewDeptForm({...newDeptForm, slaCompliance: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department Color</label>
                  <input 
                    type="color" 
                    value={newDeptForm.color}
                    onChange={(e) => setNewDeptForm({...newDeptForm, color: e.target.value})}
                    className="w-full h-9 p-1 border border-slate-200 rounded-xl cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Icon Category</label>
                  <select 
                    value={newDeptForm.iconName}
                    onChange={(e) => setNewDeptForm({...newDeptForm, iconName: e.target.value as any})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="building">Building / General</option>
                    <option value="car">Roads / Transport</option>
                    <option value="trash">Sanitation</option>
                    <option value="zap">Electrical</option>
                    <option value="droplet">Water</option>
                    <option value="waves">Drainage</option>
                    <option value="recycle">Recycle</option>
                    <option value="wrench">Public Works</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setActiveModal(null)} 
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Assign Staff Modal */}
      {activeModal === 'assign' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex justify-between items-center border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Assign Department Staff</h3>
              </div>
              <button onClick={() => setActiveModal(null)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Department</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-xl">
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.teams} Teams active)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Staff Member / Field Unit</label>
                <input 
                  type="text" 
                  placeholder="e.g. Team Leader Officer #14" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assignment Role</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-xl">
                  <option>Field Crew Leader</option>
                  <option>Inspection Officer</option>
                  <option>Emergency Response Specialist</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => setActiveModal(null)} className="px-3 py-1.5 bg-slate-100 font-bold text-slate-700 rounded-lg text-xs">Cancel</button>
              <button 
                onClick={() => {
                  setActiveModal(null);
                  showToast('Staff member assigned successfully!');
                }} 
                className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg text-xs shadow-md"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Set SLA Modal */}
      {activeModal === 'sla' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex justify-between items-center border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Configure Department SLA Targets</h3>
              </div>
              <button onClick={() => setActiveModal(null)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Department</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-xl">
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name} (Current SLA: {d.slaCompliance}%)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target SLA Compliance (%)</label>
                <input 
                  type="range" 
                  min="50" 
                  max="100" 
                  defaultValue="85"
                  className="w-full accent-blue-600 cursor-pointer" 
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>50% (Min)</span>
                  <span className="font-bold text-blue-600">85% Target</span>
                  <span>100% (Strict)</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Maximum Allowed Resolution Time</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-xl">
                  <option>24 Hours (Urgent)</option>
                  <option>48 Hours (Standard)</option>
                  <option>72 Hours (Relaxed)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => setActiveModal(null)} className="px-3 py-1.5 bg-slate-100 font-bold text-slate-700 rounded-lg text-xs">Cancel</button>
              <button 
                onClick={() => {
                  setActiveModal(null);
                  showToast('SLA Targets updated successfully!');
                }} 
                className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg text-xs shadow-md"
              >
                Save SLA Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: View Work Orders Modal */}
      {activeModal === 'workOrders' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Department Work Orders</h3>
              </div>
              <button onClick={() => setActiveModal(null)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { id: 'WO-1049', dept: 'Roads & Transport', task: 'Pothole asphalt repair', status: 'In Progress', priority: 'High' },
                { id: 'WO-1050', dept: 'Sanitation', task: 'Market waste bin clearing', status: 'Assigned', priority: 'Medium' },
                { id: 'WO-1051', dept: 'Electrical', task: 'Highway dark zone streetlight repair', status: 'In Progress', priority: 'Critical' },
                { id: 'WO-1052', dept: 'Water Supply', task: 'Main pipeline leak patch', status: 'Completed', priority: 'High' },
                { id: 'WO-1053', dept: 'Drainage', task: 'Storm drain blockage removal', status: 'Overdue', priority: 'Critical' },
              ].map((wo) => (
                <div key={wo.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{wo.id} • {wo.dept}</span>
                    <p className="text-[11px] text-slate-500">{wo.task}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    wo.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                    wo.status === 'Overdue' ? 'bg-rose-100 text-rose-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {wo.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button onClick={() => setActiveModal(null)} className="px-4 py-1.5 bg-slate-900 text-white font-bold rounded-xl text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: Generate Report Modal */}
      {activeModal === 'report' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Generate Department Performance Report</h3>
              <p className="text-xs text-slate-500 mt-1">Export comprehensive departmental workloads and SLA metrics.</p>
            </div>

            <div className="space-y-2 text-xs text-left bg-slate-50 p-3 rounded-xl border border-slate-100">
              <label className="flex items-center gap-2 font-medium text-slate-700">
                <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                Include SLA Compliance breakdown
              </label>
              <label className="flex items-center gap-2 font-medium text-slate-700">
                <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                Include Overdue & Resolution logs
              </label>
              <label className="flex items-center gap-2 font-medium text-slate-700">
                <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                Include Budget & Resource utilization
              </label>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs">
                Cancel
              </button>
              <button 
                onClick={() => {
                  setActiveModal(null);
                  showToast('Department report generated and downloaded!');
                }} 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: Department Settings Modal */}
      {activeModal === 'settings' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex justify-between items-center border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Department Settings</h3>
              </div>
              <button onClick={() => setActiveModal(null)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">Auto SLA Escalation</span>
                  <p className="text-[11px] text-slate-500">Notify department head 4h before SLA breach</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">Automatic Workload Balancing</span>
                  <p className="text-[11px] text-slate-500">Reassign overflow tasks to nearby teams</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">Daily Summary Broadcasts</span>
                  <p className="text-[11px] text-slate-500">Send daily resolution summaries to supervisors</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => setActiveModal(null)} className="px-3 py-1.5 bg-slate-100 font-bold text-slate-700 rounded-lg text-xs">Close</button>
              <button 
                onClick={() => {
                  setActiveModal(null);
                  showToast('Department settings saved successfully!');
                }} 
                className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg text-xs shadow-md"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: View Full Report Modal */}
      {activeModal === 'fullReport' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Full Department Performance Report</h3>
                <p className="text-xs text-slate-500">Comparative metrics across all 7 active departments</p>
              </div>
              <button onClick={() => setActiveModal(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
                <span className="text-[11px] text-blue-600 font-medium">Highest SLA Score</span>
                <p className="text-lg font-extrabold text-blue-900">Waste Management (88%)</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                <span className="text-[11px] text-emerald-600 font-medium">Fastest Avg Resolution</span>
                <p className="text-lg font-extrabold text-emerald-900">Sanitation (1.8 days)</p>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-center">
                <span className="text-[11px] text-rose-600 font-medium">Most Overdue Issues</span>
                <p className="text-lg font-extrabold text-rose-900">Roads & Transport (12)</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                    <th className="py-2">Department</th>
                    <th className="py-2">Head</th>
                    <th className="py-2 text-center">Teams</th>
                    <th className="py-2 text-center">Active Jobs</th>
                    <th className="py-2 text-center">SLA Compliance</th>
                    <th className="py-2 text-right">Budget</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {departments.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="py-2.5 font-bold text-slate-900">{d.name}</td>
                      <td className="py-2.5 text-slate-600">{d.head}</td>
                      <td className="py-2.5 text-center font-semibold">{d.teams} Units</td>
                      <td className="py-2.5 text-center text-blue-600 font-bold">{d.active}</td>
                      <td className="py-2.5 text-center font-bold text-emerald-600">{d.slaCompliance}%</td>
                      <td className="py-2.5 text-right font-bold text-slate-800">{d.budget}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 bg-slate-100 font-bold text-slate-700 rounded-xl text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 9: View All Overdue Modal */}
      {activeModal === 'allOverdue' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex justify-between items-center border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-slate-900 text-base">All Overdue Department Issues</h3>
              </div>
              <button onClick={() => setActiveModal(null)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <div className="space-y-2 text-xs">
              {overdueDepartments.map((dept) => (
                <div key={dept.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: dept.color }}
                    >
                      {renderDeptIcon(dept.iconName, "w-4 h-4 text-white")}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{dept.name}</h4>
                      <p className="text-[11px] text-slate-500">Supervisor: {dept.head}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-rose-100 text-rose-700 font-bold rounded-lg text-xs">
                    {dept.overdue} Overdue
                  </span>
                </div>
              ))}
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

export default Departments;