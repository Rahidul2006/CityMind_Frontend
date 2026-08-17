import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Clock, 
  ChevronRight,
  SlidersHorizontal,
  MapPin,
  Trash2
} from 'lucide-react';
import type { PriorityIssueItem, MapMarker, AlertItem } from '../types/dashboard';
import { subscribeToStatusUpdates } from '../services/socketService';
import { deleteComplaint } from '../services/departmentService';

interface OutletContextType {
  setActiveModalIssue: (issue: PriorityIssueItem | MapMarker | AlertItem | null) => void;
}

export const Complaints: React.FC = () => {
  const { setActiveModalIssue } = useOutletContext<OutletContextType>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');

  const [complaintsList, setComplaintsList] = useState<any[]>([]);
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/complaints`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const json = await res.json();
        if (json.success) {
          const rawComplaints = json.data || json.complaints || [];
          const mappedData = rawComplaints.map((c: any) => ({
            id: c._id || c.complaintId || String(Math.random()),
            complaintId: c.complaintId || c._id,
            title: c.title || c.category || c.description?.substring(0, 35) || 'Civic Issue Report',
            category: c.category || 'General',
            location: c.address || (typeof c.location === 'string' ? c.location : c.location?.address) || 'Captured GPS Location',
            ward: c.location?.ward || 'Municipal Ward',
            reportedTime: new Date(c.reportedAt || c.createdAt || Date.now()).toLocaleDateString(),
            estRepairTime: c.estimatedRepairHours ? `${c.estimatedRepairHours} hrs` : '24 hrs',
            severity: c.severity || c.aiAnalysis?.severity || 'Medium',
            status: c.status || 'SUBMITTED',
            statusHistory: c.statusHistory || [],
            score: c.score || 0,
            description: c.description || '',
            imageUrl: c.image?.url || c.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=300&q=80'
          }));
          setComplaintsList(mappedData);
        }
      } catch (err) {
        console.error("Failed to fetch complaints", err);
      }
    };
    fetchComplaints();

    // Real-time status update subscription
    const unsubscribe = subscribeToStatusUpdates((data) => {
      if (data && (data.complaintId || data.mongoId)) {
        const targetId = data.complaintId || data.mongoId;
        console.log('[SOCKET] Complaints Page live update for:', targetId, data.status);
        setComplaintsList((prevList) =>
          prevList.map((item) => {
            if (item.id === targetId || item.complaintId === targetId || item.id === data.mongoId) {
              return {
                ...item,
                status: data.status,
                statusHistory: data.complaint?.statusHistory || [
                  ...(item.statusHistory || []),
                  data.statusHistoryEntry
                ].filter(Boolean),
              };
            }
            return item;
          })
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleDeleteComplaint = async (item: any) => {
    const targetId = item.id || item.complaintId;
    if (!targetId) return;

    const statusUpper = (item.status || '').toUpperCase();
    if (statusUpper !== 'RESOLVED') {
      alert(`Cannot delete complaint. Only resolved issues can be deleted (Current status: ${item.status}).`);
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete complaint "${item.title || targetId}"?\n\nThis will permanently delete the complaint record from the database.`
    );
    if (!confirmDelete) return;

    try {
      await deleteComplaint(targetId);
      setComplaintsList((prevList) => prevList.filter((c) => c.id !== item.id && c.complaintId !== targetId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete complaint');
    }
  };

  const filteredComplaints = complaintsList.filter(item => {
    const title = (item.title || '').toLowerCase();
    const location = (item.location || '').toLowerCase();
    const category = (item.category || '').toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch = title.includes(search) || location.includes(search) || category.includes(search);
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    const matchesSeverity = selectedSeverity === 'All' || item.severity === selectedSeverity;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Top Title & Quick Stats Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Complaints Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Track, filter, and assign citizen complaints across all municipal wards.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-xl text-center">
            <span className="text-xs font-semibold text-blue-600 block">Total Listed</span>
            <span className="text-lg font-bold text-blue-900">{complaintsList.length}</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl text-center">
            <span className="text-xs font-semibold text-amber-600 block">Active Critical</span>
            <span className="text-lg font-bold text-amber-900">
              {complaintsList.filter(c => (c.severity || '').toLowerCase() === 'critical' || (c.severity || '').toLowerCase() === 'high').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Action Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, category, ward..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent focus:outline-none font-bold text-blue-600 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="VERIFIED">Verified</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="REOPENED">Reopened</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Severity:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-transparent focus:outline-none font-bold text-rose-600 cursor-pointer"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints List Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Complaint Detail</th>
                <th className="py-3.5 px-4">Ward / Location</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Reported</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((item) => (
                  <tr 
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    onClick={() => setActiveModalIssue(item as any)}
                  >
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors">
                            {item.title}
                          </p>
                          <span className="inline-block mt-0.5 text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[160px]">{item.location}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] ${
                        item.status === 'RESOLVED' || item.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        item.status === 'IN_PROGRESS' || item.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        item.status === 'REOPENED' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                        item.severity === 'Critical' || item.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                        item.severity === 'High' || item.severity === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {item.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.reportedTime}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveModalIssue(item as any);
                          }}
                          className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors font-bold inline-flex items-center gap-1 text-xs"
                        >
                          <span>View</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteComplaint(item);
                          }}
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                          title="Delete Complaint"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-semibold">
                    No complaints matched your search filters.
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

export default Complaints;