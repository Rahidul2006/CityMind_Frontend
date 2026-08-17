import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Building2,
  ShieldCheck,
  Eye,
  MapPin,
  Sparkles
} from 'lucide-react';
import { getDepartmentDashboard } from '../../services/departmentTaskService';

export const DepartmentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDepartmentDashboard();
      setData(res);
    } catch (err: any) {
      console.error('Failed to load department dashboard:', err);
      setError(err.message || 'Unable to connect to department operations center.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = data?.stats || {
    totalAssigned: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    reopened: 0,
    urgent: 0,
    highPriority: 0,
  };

  const department = data?.department || {};
  const officer = data?.officer || {};
  const recentTasks = data?.recentTasks || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. WELCOME HEADER BANNER */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white font-mono font-bold text-[10px] px-2.5 py-0.5 rounded-md">
              {department.code || 'DEPT'}
            </span>
            <span className="text-blue-300 font-bold text-xs">Field Operations Center</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            {department.name || 'Department Operations'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Welcome back, <span className="font-bold text-white">{officer.name || 'Officer'}</span>. Monitoring real-time civic issues across assigned wards.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={loadData}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => navigate('/department/tasks')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <span>View All Tasks</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-64 h-64 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 2. URGENT TASKS ALERT BANNER */}
      {stats.urgent > 0 && (
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold">URGENT TASKS REQUIRE ATTENTION ({stats.urgent})</h3>
              <p className="text-xs text-rose-100">
                {stats.urgent} urgent civic issue{stats.urgent > 1 ? 's are' : ' is'} pending dispatch or field resolution in your department.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/department/priority')}
            className="px-4 py-2 bg-white text-red-900 font-bold text-xs rounded-xl shadow-sm hover:bg-rose-50 transition-colors shrink-0"
          >
            View Priority Issues ({stats.urgent})
          </button>
        </div>
      )}

      {/* 3. TOP SUMMARY CARDS (4 CARDS) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL ASSIGNED */}
        <div 
          onClick={() => navigate('/department/tasks')}
          className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5 hover:shadow-md cursor-pointer transition-all"
        >
          <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <ClipboardList className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Total Assigned</span>
            <span className="text-2xl font-black text-slate-900">{stats.totalAssigned}</span>
          </div>
        </div>

        {/* PENDING */}
        <div 
          onClick={() => navigate('/department/tasks?status=ASSIGNED')}
          className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5 hover:shadow-md cursor-pointer transition-all"
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Pending</span>
            <span className="text-2xl font-black text-amber-700">{stats.pending}</span>
          </div>
        </div>

        {/* IN PROGRESS */}
        <div 
          onClick={() => navigate('/department/tasks?status=IN_PROGRESS')}
          className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5 hover:shadow-md cursor-pointer transition-all"
        >
          <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">In Progress</span>
            <span className="text-2xl font-black text-purple-700">{stats.inProgress}</span>
          </div>
        </div>

        {/* RESOLVED */}
        <div 
          onClick={() => navigate('/department/resolved')}
          className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5 hover:shadow-md cursor-pointer transition-all"
        >
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Resolved</span>
            <span className="text-2xl font-black text-emerald-700">{stats.resolved}</span>
          </div>
        </div>
      </section>

      {/* 4. RECENT ASSIGNED TASKS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Recent Assigned Tasks ({recentTasks.length})
          </h2>
          <button
            onClick={() => navigate('/department/tasks')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Complaint ID</th>
                <th className="py-3.5 px-4">Issue Category</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                    Loading department tasks...
                  </td>
                </tr>
              ) : recentTasks.length > 0 ? (
                recentTasks.map((t: any) => {
                  const idStr = t.complaintId || t._id;
                  const priorityStr = (t.aiAnalysis?.severity || t.priority || t.severity || 'MEDIUM').toUpperCase();
                  return (
                    <tr key={t._id || t.complaintId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-blue-700">
                        {idStr}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{t.category}</span>
                        {t.title && <span className="text-[11px] text-slate-500 truncate max-w-[180px] block">{t.title}</span>}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                          priorityStr === 'URGENT' || priorityStr === 'CRITICAL' ? 'bg-red-100 text-red-700 border border-red-200' :
                          priorityStr === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {priorityStr}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 truncate max-w-[180px]">
                        <span className="flex items-center gap-1 text-[11px]">
                          <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                          {t.address || 'Captured GPS Location'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          t.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                          t.status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-800' :
                          t.status === 'ASSIGNED' ? 'bg-amber-100 text-amber-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => navigate(`/department/tasks/${idStr}`)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-blue-700 font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Task</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    No assigned tasks found for your department.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDashboard;
