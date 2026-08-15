import React, { useState } from 'react';
import type { PriorityIssueItem, MapMarker, AlertItem, IssueStatus } from '../../types/dashboard';
import { X, MapPin, Clock, ShieldAlert, CheckCircle2, UserPlus, AlertCircle } from 'lucide-react';

interface IssueDetailModalProps {
  issue: PriorityIssueItem | MapMarker | AlertItem | null;
  onClose: () => void;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({ issue, onClose }) => {
  const [currentStatus, setCurrentStatus] = useState<IssueStatus>(
    (issue as MapMarker)?.status || 'In Progress'
  );
  const [assigned, setAssigned] = useState(false);

  if (!issue) return null;

  const title = (issue as PriorityIssueItem).title || (issue as MapMarker).title || (issue as AlertItem).title;
  const ward = (issue as PriorityIssueItem).ward || (issue as MapMarker).ward || 'Ward 14';
  const category = (issue as PriorityIssueItem).category || (issue as MapMarker).category || 'Pothole';
  const description = (issue as PriorityIssueItem).description || (issue as AlertItem).description || 'Issue detected by AI Municipal surveillance camera requiring field officer verification.';
  const severity = (issue as PriorityIssueItem).severity || (issue as MapMarker).severity || 'Critical';
  const imageUrl = (issue as PriorityIssueItem).imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Municipal Work Order</span>
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
                {currentStatus}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Issue Description</h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">
              {description}
            </p>
          </div>

          {/* Status Progression Controls */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Update Workflow Status</h4>
            <div className="grid grid-cols-3 gap-2">
              {(['Assigned', 'In Progress', 'Resolved'] as IssueStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setCurrentStatus(status)}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all text-center ${
                    currentStatus === status
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
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
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
