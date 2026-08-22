import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Download, 
  RefreshCw, 
  Zap, 
  Building2, 
  PieChart, 
  MapPin
} from 'lucide-react';
import { 
  fetchAnalyticsOverview, 
  downloadAnalyticsReport, 
  type AnalyticsOverviewData 
} from '../services/analyticsService';
import { subscribeToStatusUpdates } from '../services/socketService';

export const Analytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [data, setData] = useState<AnalyticsOverviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [realtimeNotice, setRealtimeNotice] = useState<string | null>(null);
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);

  const loadAnalytics = useCallback(async (isSilent: boolean = false) => {
    if (!isSilent) setLoading(true);
    try {
      const result = await fetchAnalyticsOverview(timeframe);
      setData(result);
    } catch (err) {
      console.error('Failed to load analytics data:', err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [timeframe]);

  // Initial load and refetch on timeframe change
  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // Real-time Socket.io listener integration
  useEffect(() => {
    const unsubscribe = subscribeToStatusUpdates((eventData) => {
      setRealtimeNotice(`Realtime Update: Complaint #${eventData?.complaintId || ''} updated`);
      loadAnalytics(true);

      const timer = setTimeout(() => {
        setRealtimeNotice(null);
      }, 4000);

      return () => clearTimeout(timer);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [loadAnalytics]);

  const kpis = data?.kpis || {
    totalIssues: 0,
    resolvedIssues: 0,
    inProgressIssues: 0,
    pendingIssues: 0,
    resolutionRate: 0,
    avgResolutionTimeHours: 0,
    slaCompliance: 0,
  };

  const volumeTrends = data?.volumeTrends || [];
  const deptPerformance = data?.departmentPerformance || [];
  const catDistribution = data?.categoryDistribution || [];
  const wardHotspots = data?.wardHotspots || [];

  const maxReported = Math.max(...volumeTrends.map(t => t.reported), 1);

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-300">
      {/* Realtime Notification Toast Banner */}
      {realtimeNotice && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900/90 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500/40 animate-bounce">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div className="text-xs font-semibold">
            <span className="text-emerald-400 block font-bold">Live Data Sync</span>
            <span className="text-slate-300 font-normal">{realtimeNotice}</span>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">City Analytics</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live Realtime
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Real-time performance metrics, resolution velocity & department analytics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          {/* Timeframe selector pills */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(['7d', '30d', '90d', '1y'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  timeframe === t
                    ? 'bg-white text-blue-600 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t === '7d' ? '7 Days' : t === '30d' ? '30 Days' : t === '90d' ? '90 Days' : '1 Year'}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => loadAnalytics()}
            disabled={loading}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer"
            title="Refresh analytics data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          {/* Export CSV Report Button */}
          <button
            onClick={downloadAnalyticsReport}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 4 Clean Key Performance Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Issues */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Complaints</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-900">{kpis.totalIssues.toLocaleString()}</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                {kpis.inProgressIssues} Active
              </span>
              <span className="text-xs font-medium text-slate-500">
                {kpis.pendingIssues} Pending
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Resolution Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Resolution Rate</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-slate-900">{kpis.resolutionRate}%</span>
              {kpis.resolutionRate > 0 && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Live DB
                </span>
              )}
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(kpis.resolutionRate, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Avg Resolution Time */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Turnaround</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-900">{kpis.avgResolutionTimeHours} hrs</span>
            <p className="text-xs font-medium text-slate-500 mt-2">
              Turnaround velocity
            </p>
          </div>
        </div>

        {/* Card 4: SLA Compliance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-sky-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">SLA Compliance</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-900">{kpis.slaCompliance}%</span>
            <p className="text-xs font-semibold text-sky-600 mt-2">
              Resolved within target
            </p>
          </div>
        </div>
      </div>

      {/* Main Visuals Section: Complaint Volume & Resolution Trends */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Complaint Volume & Resolution Trend</h2>
            <p className="text-xs text-slate-500 font-medium">Daily intake vs resolved issue turnaround velocity</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-slate-600">Reported Issues</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-600">Resolved Issues</span>
            </div>
          </div>
        </div>

        {/* Clean Interactive SVG Area Chart */}
        <div className="h-64 relative w-full pt-4">
          {volumeTrends.length > 0 ? (
            <div className="h-full w-full flex items-end justify-between gap-2 sm:gap-6 px-2 border-b border-slate-100 pb-2">
              {volumeTrends.map((point, index) => {
                const repHeight = Math.max((point.reported / maxReported) * 100, 10);
                const resHeight = Math.max((point.resolved / maxReported) * 100, 8);
                const isHovered = hoveredTrendIndex === index;

                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                    onMouseEnter={() => setHoveredTrendIndex(index)}
                    onMouseLeave={() => setHoveredTrendIndex(null)}
                  >
                    {/* Tooltip on hover */}
                    {isHovered && (
                      <div className="absolute -top-14 bg-slate-900 text-white text-[11px] px-3 py-2 rounded-xl shadow-xl z-20 flex flex-col gap-0.5 whitespace-nowrap animate-in fade-in zoom-in-95">
                        <span className="font-bold text-slate-300">{point.date}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-blue-400">Reported: {point.reported}</span>
                          <span className="text-emerald-400">Resolved: {point.resolved}</span>
                        </div>
                      </div>
                    )}

                    {/* Dual Bars */}
                    <div className="w-full max-w-[40px] flex items-end justify-center gap-1.5 h-full">
                      <div
                        className={`w-3.5 sm:w-4 rounded-t-lg transition-all duration-300 ${
                          isHovered ? 'bg-blue-600 scale-105' : 'bg-blue-500'
                        }`}
                        style={{ height: `${repHeight}%` }}
                      />
                      <div
                        className={`w-3.5 sm:w-4 rounded-t-lg transition-all duration-300 ${
                          isHovered ? 'bg-emerald-600 scale-105' : 'bg-emerald-500'
                        }`}
                        style={{ height: `${resHeight}%` }}
                      />
                    </div>

                    {/* Date label */}
                    <span className="text-[11px] font-semibold text-slate-400 mt-2">
                      {point.date}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm font-medium">
              Loading trend chart...
            </div>
          )}
        </div>
      </div>

      {/* 2-Column Grid: Department Performance & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Department Performance */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Department Performance</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">Resolution %</span>
          </div>

          <div className="space-y-4 mt-2">
            {deptPerformance.map((dept) => (
              <div key={dept.id} className="p-3.5 bg-slate-50/70 hover:bg-slate-100/80 rounded-xl transition-colors">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] rounded-md uppercase">
                      {dept.code}
                    </span>
                    <span>{dept.name}</span>
                  </div>
                  <span className="text-blue-600 font-bold">{dept.resolutionRate}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${dept.resolutionRate}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mt-2">
                  <span>{dept.activeTasks} Active Tasks</span>
                  <span>{dept.completedTasks} Resolved</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Issue Category Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <PieChart className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Issue Category Breakdown</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">Distribution</span>
          </div>

          <div className="space-y-4 mt-2">
            {catDistribution.map((cat, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50/70 rounded-xl">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color || '#3b82f6' }}
                    />
                    <span>{cat.category}</span>
                  </div>
                  <span className="text-slate-700">{cat.count} issues ({cat.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color || '#3b82f6',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Top Municipal Ward Hotspots */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Top Ward Issue Hotspots</h3>
              <p className="text-xs text-slate-500 font-medium">Areas requiring immediate municipal attention</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {wardHotspots.map((ward) => (
            <div key={ward.id} className="p-4 bg-slate-50 border border-slate-200/70 rounded-xl hover:border-blue-300 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-slate-900">{ward.name}</span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  ward.severity === 'Critical' 
                    ? 'bg-rose-100 text-rose-700' 
                    : ward.severity === 'High' 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {ward.severity}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900">{ward.issues} <span className="text-xs font-normal text-slate-500">issues</span></div>
              <div className="text-xs font-medium text-slate-500 mt-2 space-y-1">
                <div>Top Issue: <span className="font-semibold text-slate-700">{ward.topCategory}</span></div>
                <div>Resolved: <span className="font-semibold text-emerald-600">{ward.resolutionRate}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;