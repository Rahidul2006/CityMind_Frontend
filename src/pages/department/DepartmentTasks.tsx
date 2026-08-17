import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ClipboardList,
  Search,
  RefreshCw,
  MapPin,
  Eye
} from 'lucide-react';
import { getDepartmentTasks } from '../../services/departmentTaskService';

export const DepartmentTasks: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter] = useState('All');

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDepartmentTasks({
        search: searchTerm,
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter,
      });
      setTasks(res.complaints || res.data || []);
    } catch (err: any) {
      console.error('Failed to load department tasks:', err);
      setError(err.message || 'Failed to fetch department tasks.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, priorityFilter, categoryFilter]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <ClipboardList className="w-6 h-6 text-blue-600" />
            <span>Assigned Tasks</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Tasks and complaints routed to your municipal department for field inspection and repair.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, issue, address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="ASSIGNED">Pending / Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REOPENED">Reopened</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 cursor-pointer"
          >
            <option value="All">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <button
            onClick={loadTasks}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors shrink-0"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* TASKS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Complaint ID</th>
                <th className="py-3.5 px-4">Issue & Description</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Reported Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                    Loading assigned tasks...
                  </td>
                </tr>
              ) : tasks.length > 0 ? (
                tasks.map((t: any) => {
                  const idStr = t.complaintId || t._id;
                  const priorityStr = (t.aiAnalysis?.severity || t.priority || t.severity || 'MEDIUM').toUpperCase();
                  const dateStr = t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A';

                  return (
                    <tr key={t._id || t.complaintId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-blue-700">
                        {idStr}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{t.category}</span>
                        <p className="text-[11px] text-slate-500 truncate max-w-[220px]">
                          {t.title || t.description}
                        </p>
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
                          {t.address || 'Captured Location'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {dateStr}
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
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors inline-flex items-center gap-1 shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    No assigned tasks matching your filters.
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

export default DepartmentTasks;
