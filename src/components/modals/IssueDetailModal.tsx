import React, { useState, useEffect } from 'react';
import type { PriorityIssueItem, MapMarker, AlertItem } from '../../types/dashboard';
import { X, MapPin, Clock, ShieldAlert, CheckCircle2, UserPlus, AlertTriangle, Trash2 } from 'lucide-react';
import { joinComplaintRoom, leaveComplaintRoom, subscribeToStatusUpdates } from '../../services/socketService';
import { deleteComplaint } from '../../services/departmentService';
import { API_BASE_URL } from '../../config/api';


interface IssueDetailModalProps {
  issue: PriorityIssueItem | MapMarker | AlertItem | null;
  onClose: () => void;
}

const VALID_STATUSES = [
  'SUBMITTED',
  'VERIFIED',
  'ASSIGNED',
  'IN_PROGRESS',
  'RESOLVED',
  'REOPENED',
  'REJECTED',
];

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({ issue, onClose }) => {
  const [currentStatus, setCurrentStatus] = useState<string>('SUBMITTED');
  const [selectedStatus, setSelectedStatus] = useState<string>('SUBMITTED');
  const [adminMessage, setAdminMessage] = useState<string>('');
  const [assigned, setAssigned] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusHistory, setStatusHistory] = useState<any[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const complaintId = issue ? (issue as any).id || (issue as any).complaintId || (issue as any)._id : null;

  useEffect(() => {
    if (!issue) return;

    const initialStatus = (issue as any).status || 'SUBMITTED';
    setCurrentStatus(initialStatus);
    setSelectedStatus(initialStatus);
    setStatusHistory((issue as any).statusHistory || []);

    if (complaintId) {
      joinComplaintRoom(complaintId);

      const unsubscribe = subscribeToStatusUpdates((data) => {
        if (data && (data.complaintId === complaintId || data.mongoId === complaintId)) {
          console.log('[SOCKET] Admin Modal received status update:', data);
          setCurrentStatus(data.status);
          setSelectedStatus(data.status);
          if (data.statusHistoryEntry) {
            setStatusHistory((prev) => [...prev, data.statusHistoryEntry]);
          } else if (data.complaint?.statusHistory) {
            setStatusHistory(data.complaint.statusHistory);
          }
        }
      });

      return () => {
        leaveComplaintRoom(complaintId);
        unsubscribe();
      };
    }
  }, [issue, complaintId]);

  if (!issue) return null;

  const title = (issue as PriorityIssueItem).title || (issue as MapMarker).title || (issue as AlertItem).title;
  const ward = (issue as PriorityIssueItem).ward || (issue as MapMarker).ward || 'Ward 14';
  const category = (issue as PriorityIssueItem).category || (issue as MapMarker).category || 'Pothole';
  const description = (issue as PriorityIssueItem).description || (issue as AlertItem).description || 'Civic issue report requiring municipal action.';
  const severity = (issue as PriorityIssueItem).severity || (issue as MapMarker).severity || 'Critical';
  const imageUrl = (issue as PriorityIssueItem).imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80';

  const handleApplyStatusChange = async () => {
    setShowConfirm(false);
    setIsUpdating(true);
    setFeedbackMsg(null);

    try {
      const token = localStorage.getItem('token');
      const targetId = (issue as any).complaintId || (issue as any).id || (issue as any)._id;
      const res = await fetch(`${API_BASE_URL}/api/complaints/${targetId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: selectedStatus,
          message: adminMessage.trim() || `Status changed to ${selectedStatus} by admin`
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setCurrentStatus(selectedStatus);
        setFeedbackMsg({ type: 'success', text: 'Status updated successfully' });
        setAdminMessage('');
      } else {
        setSelectedStatus(currentStatus);
        setFeedbackMsg({ type: 'error', text: json.message || 'Unable to update complaint status.' });
      }
    } catch (err: any) {
      console.error('Status update failed:', err);
      setSelectedStatus(currentStatus);
      setFeedbackMsg({ type: 'error', text: 'Unable to update complaint status. Server connection error.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteComplaint = async () => {
    if (!complaintId) return;

    const statusUpper = (currentStatus || (issue as any)?.status || '').toUpperCase();
    if (statusUpper !== 'RESOLVED') {
      alert(`Cannot delete complaint. Only resolved issues can be deleted (Current status: ${currentStatus || (issue as any)?.status}).`);
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete complaint "${title || complaintId}"?\n\nThis will permanently delete the complaint record from the database.`
    );
    if (!confirmDelete) return;

    try {
      const targetId = (issue as any).complaintId || (issue as any).id || (issue as any)._id;
      await deleteComplaint(targetId);
      onClose();
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Failed to delete complaint');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 relative">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Municipal Work Order ({complaintId})</span>
              <h3 className="text-base font-bold text-white leading-tight">{title}</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {feedbackMsg && (
            <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              feedbackMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {feedbackMsg.text}
            </div>
          )}

          {/* Image & Quick Info */}
          <div className="relative h-44 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-md">
              {category}
            </div>
            <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
              {severity}
            </div>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Location</span>
              <p className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                {ward}
              </p>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Current Status</span>
              <p className="font-bold text-blue-600 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                {isUpdating ? 'Updating...' : currentStatus}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Issue Description</h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">
              {description}
            </p>
          </div>

          {/* Status Workflow Controls */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Update Complaint Status</h4>
            
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Select Status:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                disabled={isUpdating}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {VALID_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Status Update Message / Note:</label>
              <textarea
                value={adminMessage}
                onChange={(e) => setAdminMessage(e.target.value)}
                placeholder="Provide details about repair progress, officer assignment, or resolution..."
                rows={2}
                disabled={isUpdating}
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <button
              onClick={() => setShowConfirm(true)}
              disabled={isUpdating || selectedStatus === currentStatus && !adminMessage}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              {isUpdating ? (
                <span>Updating...</span>
              ) : (
                <span>Change Status to {selectedStatus.replace('_', ' ')}</span>
              )}
            </button>
          </div>

          {/* Timeline History */}
          {statusHistory.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Status Timeline</h4>
              <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {statusHistory.map((h: any, idx: number) => (
                  <div key={idx} className="text-xs border-b border-slate-200/60 pb-2 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span className="text-blue-700">{h.status?.replace('_', ' ')}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {h.timestamp ? new Date(h.timestamp).toLocaleString() : ''}
                      </span>
                    </div>
                    {h.message && <p className="text-slate-600 text-[11px] mt-0.5">{h.message}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAssigned(!assigned)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                assigned 
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
              }`}
            >
              {assigned ? <CheckCircle2 className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              {assigned ? 'Assigned to Unit A' : 'Assign Officer'}
            </button>

            <button
              onClick={handleDeleteComplaint}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-xl transition-colors"
              title="Delete Complaint from Database"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            Close
          </button>
        </div>

        {/* Confirmation Dialog Overlay */}
        {showConfirm && (
          <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-5 max-w-xs w-full text-center space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Confirm Status Change</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Change complaint status to <strong className="text-blue-600">{selectedStatus.replace('_', ' ')}</strong>?
                </p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyStatusChange}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
