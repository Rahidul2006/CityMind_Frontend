import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, RefreshCw, Eye, Building2 } from 'lucide-react';
import { getDepartmentMapTasks } from '../../services/departmentTaskService';

export const DepartmentMap: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMapTasks = async () => {
    setLoading(true);
    try {
      const list = await getDepartmentMapTasks();
      setTasks(list || []);
    } catch (err) {
      console.error('Failed to load map tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMapTasks();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-red-600" />
            <span>Department Operations Map</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Geo-location overview of active civic complaints assigned to your department.
          </p>
        </div>
        <button
          onClick={loadMapTasks}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* MAP EMBED PREVIEW */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl relative min-h-[420px] flex items-center justify-center p-4">
        {/* Decorative Map Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

        <div className="relative z-10 text-center space-y-4 max-w-md bg-slate-950/90 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/30 shadow-lg">
            <MapPin className="w-6 h-6 text-red-500 animate-bounce" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Department Task Locations ({tasks.length})</h3>
            <p className="text-xs text-slate-400 mt-1">
              Field locations for assigned tasks are mapped below for rapid officer dispatch.
            </p>
          </div>
        </div>
      </div>

      {/* LOCATION MARKERS LIST */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-3">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Task Location Directory ({tasks.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {tasks.map((t) => {
            const idStr = t.complaintId || t._id;
            return (
              <div key={t._id || t.complaintId} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-700">{idStr}</span>
                    <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px]">{t.category}</span>
                  </div>
                  <p className="text-slate-600 flex items-center gap-1 font-medium">
                    <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                    <span className="truncate">{t.address || 'Captured GPS Coordinates'}</span>
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/department/tasks/${idStr}`)}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-blue-50 text-blue-700 font-bold rounded-lg text-xs shrink-0 flex items-center gap-1 shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DepartmentMap;
