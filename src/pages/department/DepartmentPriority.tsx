import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, MapPin, Eye, RefreshCw } from 'lucide-react';
import { getPriorityTasks } from '../../services/departmentTaskService';

export const DepartmentPriority: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPriorityTasks = async () => {
    setLoading(true);
    try {
      const list = await getPriorityTasks();
      setTasks(list || []);
    } catch (err) {
      console.error('Failed to load priority tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPriorityTasks();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-gradient-to-r from-red-900 to-rose-900 text-white p-6 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-300" />
            <h1 className="text-xl font-bold">Priority & Critical Issues</h1>
          </div>
          <p className="text-xs text-rose-200 mt-1">
            Urgent and high-priority civic issues assigned to your department requiring immediate field response.
          </p>
        </div>
        <button
          onClick={loadPriorityTasks}
          className="p-2.5 bg-rose-800/80 hover:bg-rose-700 text-white rounded-xl transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Complaint ID</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Priority Level</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                    Loading priority tasks...
                  </td>
                </tr>
              ) : tasks.length > 0 ? (
                tasks.map((t) => {
                  const idStr = t.complaintId || t._id;
                  const priorityStr = (t.aiAnalysis?.severity || t.priority || t.severity || 'HIGH').toUpperCase();
                  return (
                    <tr key={t._id || t.complaintId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-red-700">{idStr}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{t.category}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                          priorityStr === 'URGENT' ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
                        }`}>
                          {priorityStr}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 truncate max-w-[200px]">
                        <span className="flex items-center gap-1 text-[11px]">
                          <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                          {t.address || 'Captured Location'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => navigate(`/department/tasks/${idStr}`)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1 shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Dispatch / Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    No urgent or high priority tasks pending at this time!
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

export default DepartmentPriority;
