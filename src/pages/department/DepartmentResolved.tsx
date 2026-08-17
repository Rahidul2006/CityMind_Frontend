import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Eye, RefreshCw, MapPin } from 'lucide-react';
import { getResolvedTasks } from '../../services/departmentTaskService';

export const DepartmentResolved: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadResolvedTasks = async () => {
    setLoading(true);
    try {
      const list = await getResolvedTasks();
      setTasks(list || []);
    } catch (err) {
      console.error('Failed to load resolved tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResolvedTasks();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-bold">Resolved Civic Tasks ({tasks.length})</h1>
          </div>
          <p className="text-xs text-emerald-200 mt-1">
            Completed tasks and verified resolutions for your department.
          </p>
        </div>
        <button
          onClick={loadResolvedTasks}
          className="p-2.5 bg-emerald-800/80 hover:bg-emerald-700 text-white rounded-xl transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400 font-semibold">
            Loading resolved tasks...
          </div>
        ) : tasks.length > 0 ? (
          tasks.map((t) => {
            const idStr = t.complaintId || t._id;
            const resImg = t.resolution?.imageUrl;

            return (
              <div key={t._id || t.complaintId} className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 flex flex-col justify-between space-y-3 hover:shadow-md transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-blue-700">{idStr}</span>
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                      RESOLVED
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{t.title || t.category}</h3>

                  <p className="text-slate-500 text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                    <span className="truncate">{t.address || 'Captured Location'}</span>
                  </p>

                  {resImg ? (
                    <div className="rounded-xl overflow-hidden border border-slate-200 max-h-36 bg-slate-950 flex items-center justify-center">
                      <img src={resImg} alt="Resolution Evidence" className="max-h-36 w-auto object-contain" />
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-500 italic">
                      "{t.resolution?.verificationMessage || 'Marked resolved by officer'}"
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-400">
                    {t.resolution?.resolvedAt ? new Date(t.resolution.resolvedAt).toLocaleDateString() : ''}
                  </span>
                  <button
                    onClick={() => navigate(`/department/tasks/${idStr}`)}
                    className="px-3 py-1 bg-slate-100 hover:bg-blue-50 text-blue-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Report</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-slate-400 font-medium bg-white rounded-2xl border border-slate-200/80">
            No resolved tasks recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentResolved;
