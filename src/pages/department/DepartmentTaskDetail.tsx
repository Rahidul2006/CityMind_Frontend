import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
  RefreshCw,
  MessageSquare,
  Check
} from 'lucide-react';
import {
  getTaskById,
  updateTaskStatus,
  addTaskRemark,
  resolveTask
} from '../../services/departmentTaskService';

export const DepartmentTaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Status Change State
  const [newStatus, setNewStatus] = useState<string>('IN_PROGRESS');
  const [statusNote, setStatusNote] = useState<string>('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Remarks State
  const [remarkText, setRemarkText] = useState<string>('');
  const [addingRemark, setAddingRemark] = useState(false);

  // Resolution Modal / Form State
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [resolveNote, setResolveNote] = useState<string>('');
  const [resolveImageFile, setResolveImageFile] = useState<File | null>(null);
  const [resolveImagePreview, setResolveImagePreview] = useState<string | null>(null);
  const [resolvingTask, setResolvingTask] = useState(false);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const loadTaskData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getTaskById(id);
      setTask(data);
      setNewStatus(data.status || 'IN_PROGRESS');
    } catch (err: any) {
      console.error('Failed to load task:', err);
      setError(err.message || 'Task not found or access denied.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTaskData();
  }, [id]);

  // Handle Status Update
  const handleUpdateStatus = async () => {
    if (!id || !newStatus) return;
    setUpdatingStatus(true);
    try {
      const updated = await updateTaskStatus(id, newStatus, statusNote);
      setTask(updated);
      setStatusNote('');
      showToast(`Task status updated to ${newStatus}!`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update status.', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Handle Add Remark
  const handleAddRemark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !remarkText.trim()) return;
    setAddingRemark(true);
    try {
      const updated = await addTaskRemark(id, remarkText);
      setTask(updated);
      setRemarkText('');
      showToast('Internal department remark logged!');
    } catch (err: any) {
      showToast(err.message || 'Failed to log remark.', 'error');
    } finally {
      setAddingRemark(false);
    }
  };

  // Image File Select
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResolveImageFile(file);
      setResolveImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit Resolution
  const handleConfirmResolve = async () => {
    if (!id) return;
    setResolvingTask(true);
    try {
      const updated = await resolveTask(id, resolveNote, resolveImageFile);
      setTask(updated);
      setResolveModalOpen(false);
      setResolveNote('');
      setResolveImageFile(null);
      setResolveImagePreview(null);
      showToast('Task marked as RESOLVED and evidence uploaded!');
    } catch (err: any) {
      showToast(err.message || 'Failed to resolve task.', 'error');
    } finally {
      setResolvingTask(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 font-semibold">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-3" />
        Fetching task details...
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-2xl max-w-xl mx-auto my-12 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-red-600 mx-auto" />
        <h2 className="text-lg font-bold">Task Access Restricted</h2>
        <p className="text-xs text-red-700 font-medium">{error}</p>
        <button
          onClick={() => navigate('/department/tasks')}
          className="px-4 py-2 bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs"
        >
          Back to Assigned Tasks
        </button>
      </div>
    );
  }

  const complaintIdStr = task.complaintId || task._id;
  const priorityStr = (task.aiAnalysis?.severity || task.priority || task.severity || 'MEDIUM').toUpperCase();
  const imageUrl = task.image?.url || task.image?.cloudinaryUrl || task.imageUrl || '';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Alert */}
      {toastMsg && (
        <div className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border transition-all ${
          toastMsg.type === 'success' ? 'bg-slate-900 text-white border-slate-700' : 'bg-red-950 text-red-200 border-red-800'
        }`}>
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium">{toastMsg.text}</span>
        </div>
      )}

      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/department/tasks')}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-blue-700 text-sm">{complaintIdStr}</span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                task.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                task.status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {task.status}
              </span>
              <span className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                priorityStr === 'URGENT' || priorityStr === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
              }`}>
                {priorityStr}
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 mt-1">{task.title || task.category}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {task.status !== 'RESOLVED' && (
            <button
              onClick={() => setResolveModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark as Resolved</span>
            </button>
          )}
        </div>
      </div>

      {/* GRID LAYOUT: LEFT CONTENT & RIGHT CONTROL PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* LEFT COLUMN (2 COLS): COMPLAINT DETAILS, IMAGE, MAP, AI */}
        <div className="lg:col-span-2 space-y-6">
          {/* Citizen Photo & Details */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <h2 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Citizen Reported Evidence</h2>

            {imageUrl ? (
              <div className="rounded-xl overflow-hidden border border-slate-200 max-h-96 bg-slate-950 flex items-center justify-center">
                <img src={imageUrl} alt="Citizen Issue" className="max-h-96 w-auto object-contain" />
              </div>
            ) : (
              <div className="bg-slate-100 p-8 rounded-xl text-center text-slate-400 font-medium">
                No original photo uploaded for this report.
              </div>
            )}

            <div>
              <h3 className="font-bold text-slate-700 text-xs mb-1">Issue Description</h3>
              <p className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-800 font-medium leading-relaxed">
                {task.description || 'No additional description provided.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Reported Address</span>
                  <span className="font-bold text-slate-800 truncate block">{task.address || 'GPS Location'}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Report Date</span>
                  <span className="font-bold text-slate-800">
                    {task.createdAt ? new Date(task.createdAt).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis Card */}
          {task.aiAnalysis && (
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-2xl shadow-md border border-blue-800 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-300" />
                <h3 className="font-bold text-sm text-white">CityMind AI Diagnostic Analysis</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-blue-950/60 p-3.5 rounded-xl border border-blue-800/80">
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-300 block">Detected Issue</span>
                  <span className="font-extrabold text-white">{task.aiAnalysis.detectedCategory || task.category}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-300 block">AI Confidence</span>
                  <span className="font-extrabold text-emerald-400">
                    {task.aiAnalysis.confidence ? `${Math.round(task.aiAnalysis.confidence * 100)}%` : '94%'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-300 block">Assessed Severity</span>
                  <span className="font-extrabold text-amber-300">{task.aiAnalysis.severity || priorityStr}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-300 block">Estimated SLA</span>
                  <span className="font-extrabold text-white">{task.slaHours || 48} Hours</span>
                </div>
              </div>
            </div>
          )}

          {/* Resolution Evidence Card (If Resolved) */}
          {task.status === 'RESOLVED' && task.resolution && (
            <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-3 text-emerald-950">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-emerald-900">Task Resolution Evidence</h3>
              </div>
              <p className="text-xs font-semibold text-emerald-800">
                Resolved by <span className="font-extrabold">{task.resolution.resolvedBy || 'Department Officer'}</span> on{' '}
                {task.resolution.resolvedAt ? new Date(task.resolution.resolvedAt).toLocaleString() : 'Recently'}
              </p>

              {task.resolution.verificationMessage && (
                <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs font-medium text-slate-800">
                  "{task.resolution.verificationMessage}"
                </div>
              )}

              {task.resolution.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-emerald-300 max-h-72 bg-slate-900 flex items-center justify-center">
                  <img src={task.resolution.imageUrl} alt="Resolution Evidence" className="max-h-72 w-auto object-contain" />
                </div>
              )}
            </div>
          )}

          {/* Internal Department Remarks Section */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <h2 className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Internal Department Operations Remarks ({task.departmentRemarks?.length || 0})</span>
            </h2>

            <form onSubmit={handleAddRemark} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Log field inspection update or material dispatch note..."
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="submit"
                disabled={addingRemark}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Log Note</span>
              </button>
            </form>

            <div className="space-y-2 max-h-60 overflow-y-auto pt-1">
              {task.departmentRemarks && task.departmentRemarks.length > 0 ? (
                task.departmentRemarks.map((rem: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="font-bold text-slate-900">{rem.createdBy || 'Officer'}</span>
                      <span>{rem.createdAt ? new Date(rem.createdAt).toLocaleString() : ''}</span>
                    </div>
                    <p className="text-slate-800 font-medium">{rem.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic text-[11px] py-2">No internal remarks logged yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (1 COL): WORKFLOW STATUS CONTROLLER & TIMELINE */}
        <div className="space-y-6">
          {/* Status Workflow Updater */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <h2 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Work Status Transition</h2>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Workflow Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="ASSIGNED">PENDING / ASSIGNED</option>
                <option value="IN_PROGRESS">IN PROGRESS (Dispatched)</option>
                <option value="RESOLVED">RESOLVED (Completed)</option>
                <option value="REOPENED">REOPENED (Requires Re-inspection)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status Transition Note</label>
              <textarea
                rows={2}
                placeholder="Brief update note for citizen and municipal log..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button
              onClick={handleUpdateStatus}
              disabled={updatingStatus}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
            >
              {updatingStatus ? 'Updating Status...' : 'Apply Status Transition'}
            </button>
          </div>

          {/* Status Timeline History */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <h2 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Status Audit History</h2>

            <div className="relative border-l-2 border-slate-200 ml-3 space-y-4 pl-4 pt-1">
              {task.statusHistory && task.statusHistory.length > 0 ? (
                task.statusHistory.map((hist: any, idx: number) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                    <div>
                      <span className="font-bold text-slate-900 text-xs uppercase">{hist.status}</span>
                      <p className="text-[10px] text-slate-500">
                        {hist.timestamp ? new Date(hist.timestamp).toLocaleString() : ''}
                      </p>
                      {hist.message && (
                        <p className="text-slate-700 font-medium text-[11px] mt-0.5">{hist.message}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic text-[11px]">No status history entries recorded.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RESOLUTION EVIDENCE MODAL */}
      {resolveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in zoom-in-95">
            <div className="bg-emerald-700 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <h3 className="text-base font-bold text-white">Mark Task as RESOLVED</h3>
              </div>
              <button 
                onClick={() => setResolveModalOpen(false)}
                className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-600"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-600 font-medium">
                Provide field resolution details and upload completion evidence photo for citizen verification.
              </p>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Resolution Summary Note *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Pothole repaired, asphalt surface restored and leveled."
                  value={resolveNote}
                  onChange={(e) => setResolveNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Resolution Photo Evidence (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-medium text-slate-700 cursor-pointer"
                />
                {resolveImagePreview && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 max-h-40 bg-slate-950 flex items-center justify-center">
                    <img src={resolveImagePreview} alt="Preview" className="max-h-40 w-auto object-contain" />
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResolveModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmResolve}
                  disabled={resolvingTask}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
                >
                  {resolvingTask ? 'Submitting Resolution...' : 'Confirm Resolution'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentTaskDetail;
