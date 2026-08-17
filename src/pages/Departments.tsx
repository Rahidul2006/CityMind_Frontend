import React, { useState, useEffect, useCallback } from 'react';
import { 
  Building2, 
  Trash2, 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  Plus, 
  X, 
  Zap, 
  Droplet, 
  Waves, 
  Recycle, 
  Wrench, 
  Car, 
  AlertTriangle,
  Check,
  Search,
  RefreshCw,
  Edit3,
  Eye,
  Power,
  Sparkles,
  ArrowRight,
  MapPin
} from 'lucide-react';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  toggleDepartmentStatus,
  deleteDepartment,
  getDepartmentById,
  getDepartmentComplaints,
  getUnassignedComplaints,
  assignComplaintToDepartment,
} from '../services/departmentService';
import type {
  DepartmentData,
  DepartmentSummary,
} from '../services/departmentService';

// Available complaint categories for department specialization
const ALL_CATEGORIES = [
  'Pothole',
  'Road Damage',
  'Garbage Overflow',
  'Broken Streetlight',
  'Water Leakage',
  'Blocked Drain',
  'Fallen Tree',
  'Traffic Signal Issue',
  'Others'
];

const PRESET_COLORS = [
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Green', value: '#10b981' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Red', value: '#ef4444' },
  { label: 'Purple', value: '#8b5cf6' },
  { label: 'Teal', value: '#14b8a6' },
];

export const Departments: React.FC = () => {
  // Main Data States
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [summary, setSummary] = useState<DepartmentSummary>({
    totalDepartments: 0,
    activeDepartments: 0,
    totalAssignedComplaints: 0,
    totalUnassignedComplaints: 0,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal States
  const [activeModal, setActiveModal] = useState<'create' | 'edit' | 'details' | 'unassigned' | 'assign' | null>(null);
  
  // Selected Department for Details/Edit
  const [selectedDept, setSelectedDept] = useState<DepartmentData | null>(null);
  const [selectedDeptStats, setSelectedDeptStats] = useState<any | null>(null);
  const [selectedDeptComplaints, setSelectedDeptComplaints] = useState<any[]>([]);
  const [deptComplaintsLoading, setDeptComplaintsLoading] = useState<boolean>(false);

  // Unassigned Complaints State
  const [unassignedComplaints, setUnassignedComplaints] = useState<any[]>([]);
  const [unassignedLoading, setUnassignedLoading] = useState<boolean>(false);

  // Selected Complaint for Assignment Modal
  const [assigningComplaint, setAssigningComplaint] = useState<any | null>(null);
  const [targetDepartmentId, setTargetDepartmentId] = useState<string>('');
  const [reassignReason, setReassignReason] = useState<string>('');
  const [isSubmittingAssign, setIsSubmittingAssign] = useState<boolean>(false);

  // Create / Edit Form State
  const [deptForm, setDeptForm] = useState({
    id: '',
    name: '',
    code: '',
    description: '',
    categories: [] as string[],
    contactEmail: '',
    contactPhone: '',
    address: '',
    icon: 'building',
    color: '#3b82f6',
    isActive: true,
    createOfficerLogin: false,
    officerName: '',
    officerEmail: '',
    officerPassword: '',
    confirmPassword: '',
  });
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch Departments from Backend
  const loadDepartmentsData = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await getDepartments({
        search: searchTerm,
        isActive: statusFilter === 'All' ? 'all' : statusFilter === 'Active' ? 'true' : 'false',
      });
      setDepartments(res.data || []);
      setSummary(res.summary || {
        totalDepartments: res.data?.length || 0,
        activeDepartments: res.data?.filter((d) => d.isActive).length || 0,
        totalAssignedComplaints: 0,
        totalUnassignedComplaints: 0,
      });
    } catch (err: any) {
      console.error('Failed to load departments:', err);
      setErrorMsg(err.message || 'Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  // Fetch Unassigned Complaints
  const loadUnassignedComplaintsData = useCallback(async () => {
    setUnassignedLoading(true);
    try {
      const list = await getUnassignedComplaints();
      setUnassignedComplaints(list || []);
    } catch (err: any) {
      console.error('Failed to fetch unassigned complaints:', err);
    } finally {
      setUnassignedLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDepartmentsData();
    loadUnassignedComplaintsData();
  }, [loadDepartmentsData, loadUnassignedComplaintsData]);

  // Helper Icon Renderer
  const renderDeptIcon = (iconName: string = 'building', className = "w-4 h-4 text-white") => {
    switch (iconName) {
      case 'car': return <Car className={className} />;
      case 'trash': return <Trash2 className={className} />;
      case 'zap': return <Zap className={className} />;
      case 'droplet': return <Droplet className={className} />;
      case 'waves': return <Waves className={className} />;
      case 'recycle': return <Recycle className={className} />;
      case 'wrench': return <Wrench className={className} />;
      default: return <Building2 className={className} />;
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setDeptForm({
      id: '',
      name: '',
      code: '',
      description: '',
      categories: ['Pothole'],
      contactEmail: '',
      contactPhone: '',
      address: '',
      icon: 'building',
      color: '#3b82f6',
      isActive: true,
      createOfficerLogin: true,
      officerName: '',
      officerEmail: '',
      officerPassword: '',
      confirmPassword: '',
    });
    setActiveModal('create');
  };

  // Open Edit Modal
  const handleOpenEditModal = (dept: DepartmentData) => {
    setDeptForm({
      id: dept._id || dept.id || '',
      name: dept.name,
      code: dept.code,
      description: dept.description || '',
      categories: dept.categories || [],
      contactEmail: dept.contactEmail || '',
      contactPhone: dept.contactPhone || '',
      address: dept.address || '',
      icon: dept.icon || 'building',
      color: dept.color || '#3b82f6',
      isActive: dept.isActive,
      createOfficerLogin: false,
      officerName: (dept as any).officer?.name || '',
      officerEmail: (dept as any).officer?.email || '',
      officerPassword: '',
      confirmPassword: '',
    });
    setActiveModal('edit');
  };

  // Open Details Modal
  const handleOpenDetailsModal = async (dept: DepartmentData) => {
    setSelectedDept(dept);
    setActiveModal('details');
    setDeptComplaintsLoading(true);

    try {
      const targetId = dept._id || dept.id || '';
      const fullData = await getDepartmentById(targetId);
      setSelectedDeptStats(fullData.stats || null);
      const complaintsList = await getDepartmentComplaints(targetId);
      setSelectedDeptComplaints(complaintsList || []);
    } catch (err: any) {
      console.error('Failed to load department details:', err);
    } finally {
      setDeptComplaintsLoading(false);
    }
  };

  // Submit Create or Edit Department
  const handleSaveDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptForm.name.trim() || !deptForm.code.trim()) {
      showToast('Department Name and Code are required.', 'error');
      return;
    }

    if (deptForm.categories.length === 0) {
      showToast('Select at least one complaint category for the department.', 'error');
      return;
    }

    if (deptForm.createOfficerLogin) {
      const cleanCode = deptForm.code.trim().toLowerCase();
      if (!deptForm.officerEmail.trim()) {
        deptForm.officerEmail = `${cleanCode}@citymind.com`;
      }
      if (!deptForm.officerPassword) {
        deptForm.officerPassword = `${cleanCode}123`;
        deptForm.confirmPassword = `${cleanCode}123`;
      }
      if (!deptForm.officerName.trim()) {
        deptForm.officerName = `${deptForm.name.trim()} Officer`;
      }

      if (deptForm.officerPassword !== deptForm.confirmPassword) {
        showToast('Officer passwords do not match.', 'error');
        return;
      }
    }

    setIsSubmittingForm(true);
    try {
      if (activeModal === 'create') {
        await createDepartment(deptForm);
        showToast(
          deptForm.createOfficerLogin
            ? `Department & Officer Login (${deptForm.officerEmail}) created successfully!`
            : `Department "${deptForm.name}" created successfully!`
        );
      } else if (activeModal === 'edit' && deptForm.id) {
        await updateDepartment(deptForm.id, deptForm);
        showToast(`Department "${deptForm.name}" updated successfully!`);
      }
      setActiveModal(null);
      loadDepartmentsData();
    } catch (err: any) {
      console.error('Department save error:', err);
      showToast(err.message || 'Unable to save department.', 'error');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Toggle Active / Deactive
  const handleToggleStatus = async (dept: DepartmentData) => {
    const targetId = dept._id || dept.id || '';
    const newStatus = !dept.isActive;
    try {
      await toggleDepartmentStatus(targetId, newStatus);
      showToast(`Department "${dept.name}" ${newStatus ? 'activated' : 'deactivated'}.`);
      loadDepartmentsData();
    } catch (err: any) {
      showToast(err.message || 'Unable to update department status.', 'error');
    }
  };

  // Delete Department Handler
  const handleDeleteDepartment = async (dept: DepartmentData) => {
    const deptId = dept.id || dept._id;
    if (!deptId) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete department "${dept.name}"?\n\nThis will permanently remove the department, its officer user accounts, and unassign any related complaints in the database.`
    );
    if (!confirmDelete) return;

    try {
      await deleteDepartment(deptId);
      showToast(`Department "${dept.name}" deleted successfully.`);
      loadDepartmentsData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete department.', 'error');
    }
  };

  // Open Assign Modal for a complaint
  const handleOpenAssignModal = (complaint: any) => {
    setAssigningComplaint(complaint);
    setReassignReason('');

    // Category-based recommendation algorithm
    const recommendedDept = departments.find(
      (d) => d.isActive && d.categories?.includes(complaint.category)
    );
    
    // Default selection to recommended or first active department
    if (recommendedDept) {
      setTargetDepartmentId(recommendedDept._id || recommendedDept.id || '');
    } else {
      const firstActive = departments.find((d) => d.isActive);
      setTargetDepartmentId(firstActive ? (firstActive._id || firstActive.id || '') : '');
    }

    setActiveModal('assign');
  };

  // Submit Complaint Assignment / Reassignment
  const handleConfirmAssignment = async () => {
    if (!assigningComplaint || !targetDepartmentId) {
      showToast('Please select a target department.', 'error');
      return;
    }

    const complaintId = assigningComplaint.complaintId || assigningComplaint._id || assigningComplaint.id;
    setIsSubmittingAssign(true);

    try {
      await assignComplaintToDepartment(complaintId, targetDepartmentId, reassignReason);
      showToast(`Complaint ${complaintId} assigned successfully!`);
      setActiveModal(null);
      setAssigningComplaint(null);
      loadDepartmentsData();
      loadUnassignedComplaintsData();

      // Refresh department details if open
      if (selectedDept) {
        handleOpenDetailsModal(selectedDept);
      }
    } catch (err: any) {
      console.error('Assignment error:', err);
      showToast(err.message || 'Failed to assign complaint.', 'error');
    } finally {
      setIsSubmittingAssign(false);
    }
  };

  // Toggle category check in form
  const handleToggleCategoryCheck = (cat: string) => {
    setDeptForm((prev) => {
      const exists = prev.categories.includes(cat);
      if (exists) {
        return { ...prev, categories: prev.categories.filter((c) => c !== cat) };
      } else {
        return { ...prev, categories: [...prev.categories, cat] };
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border transition-all animate-in slide-in-from-top-2 ${
          toastMessage.type === 'success' ? 'bg-slate-900 text-white border-slate-700' : 'bg-red-950 text-red-200 border-red-800'
        }`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            toastMessage.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
          }`}>
            <Check className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* 1. TOP HEADER & PRIMARY ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-blue-600" />
            <span>Departments</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Manage municipal departments and assign civic complaints across all city wards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>

          <button
            onClick={() => { loadDepartmentsData(); loadUnassignedComplaintsData(); }}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors shrink-0"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Department</span>
          </button>
        </div>
      </div>

      {/* 2. TOP SUMMARY CARDS (4 CARDS) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Departments */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Building2 className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Total Departments</span>
            <span className="text-2xl font-extrabold text-slate-900">{summary.totalDepartments}</span>
          </div>
        </div>

        {/* Active Departments */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Active Departments</span>
            <span className="text-2xl font-extrabold text-emerald-700">{summary.activeDepartments}</span>
          </div>
        </div>

        {/* Assigned Complaints */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <ClipboardList className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Assigned Complaints</span>
            <span className="text-2xl font-extrabold text-slate-900">{summary.totalAssignedComplaints}</span>
          </div>
        </div>

        {/* Unassigned Complaints */}
        <div 
          onClick={() => setActiveModal('unassigned')}
          className="bg-amber-50/70 hover:bg-amber-100/60 p-4.5 rounded-2xl border border-amber-200/90 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:shadow-md group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Clock className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">Unassigned Complaints</span>
              <span className="text-2xl font-extrabold text-amber-900">{unassignedComplaints.length}</span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-amber-700 group-hover:translate-x-1 transition-transform" />
        </div>
      </section>

      {/* 3. UNASSIGNED COMPLAINTS ALERT BANNER IF UNASSIGNED > 0 */}
      {unassignedComplaints.length > 0 && (
        <div className="bg-amber-500 text-white p-4 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-100 shrink-0" />
            <div>
              <h4 className="text-sm font-bold">Action Required: {unassignedComplaints.length} Unassigned Complaints</h4>
              <p className="text-xs text-amber-100">Review unassigned citizen complaints and route them to appropriate municipal departments.</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('unassigned')}
            className="px-4 py-2 bg-white text-amber-900 font-bold text-xs rounded-xl shadow-xs hover:bg-amber-50 transition-colors shrink-0"
          >
            Review & Assign ({unassignedComplaints.length})
          </button>
        </div>
      )}

      {/* 4. MAIN DEPARTMENTS LIST TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Municipal Department Roster ({departments.length})
          </h2>
          {errorMsg && (
            <span className="text-xs text-red-600 font-semibold">{errorMsg}</span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Department</th>
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Categories Handled</th>
                <th className="py-3.5 px-4 text-center">Total Complaints</th>
                <th className="py-3.5 px-4 text-center">In Progress</th>
                <th className="py-3.5 px-4 text-center">Resolved</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-semibold">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                    Loading municipal departments...
                  </td>
                </tr>
              ) : departments.length > 0 ? (
                departments.map((dept) => (
                  <tr key={dept._id || dept.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                          style={{ backgroundColor: dept.color || '#3b82f6' }}
                        >
                          {renderDeptIcon(dept.icon, "w-4.5 h-4.5 text-white")}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors">
                            {dept.name}
                          </p>
                          {dept.description && (
                            <p className="text-[11px] text-slate-500 truncate max-w-[200px]">{dept.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span className="bg-slate-100 border border-slate-200 text-slate-800 px-2 py-0.5 rounded-md text-[11px]">
                        {dept.code}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {dept.categories && dept.categories.length > 0 ? (
                          dept.categories.slice(0, 2).map((cat, idx) => (
                            <span key={idx} className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded text-[10px]">
                              {cat}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">General</span>
                        )}
                        {dept.categories && dept.categories.length > 2 && (
                          <span className="bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded text-[10px]">
                            +{dept.categories.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900 text-sm">
                      {dept.complaintCount ?? dept.assigned ?? 0}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-amber-600">
                      {dept.inProgress ?? 0}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-600">
                      {dept.resolved ?? 0}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        dept.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dept.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {dept.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenDetailsModal(dept)}
                          className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors font-bold flex items-center gap-1 text-xs"
                          title="View Department Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(dept)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
                          title="Edit Department"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(dept)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            dept.isActive ? 'hover:bg-amber-50 text-amber-600' : 'hover:bg-emerald-50 text-emerald-600'
                          }`}
                          title={dept.isActive ? 'Deactivate Department' : 'Activate Department'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDepartment(dept)}
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                          title="Delete Department"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                    No departments created yet. Create your first municipal department to start assigning complaints.
                    <div className="mt-3">
                      <button
                        onClick={handleOpenCreateModal}
                        className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs shadow-sm hover:bg-blue-700"
                      >
                        + Create Department
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE / EDIT DEPARTMENT MODAL */}
      {/* ========================================================================= */}
      {(activeModal === 'create' || activeModal === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in zoom-in-95">
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-bold text-white leading-tight">
                  {activeModal === 'create' ? 'Create Municipal Department' : `Edit Department: ${deptForm.name}`}
                </h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDepartment} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Road Maintenance"
                    value={deptForm.name}
                    onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ROAD"
                    value={deptForm.code}
                    onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Responsibility overview for civic issue handling..."
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Handled Complaint Categories *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {ALL_CATEGORIES.map((cat) => {
                    const checked = deptForm.categories.includes(cat);
                    return (
                      <label 
                        key={cat} 
                        className={`flex items-center gap-2 p-1.5 rounded-lg border cursor-pointer transition-all ${
                          checked ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold' : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleCategoryCheck(cat)}
                          className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                        />
                        <span className="text-[11px]">{cat}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    placeholder="dept@municipality.gov"
                    value={deptForm.contactEmail}
                    onChange={(e) => setDeptForm({ ...deptForm, contactEmail: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+1 800 555-0199"
                    value={deptForm.contactPhone}
                    onChange={(e) => setDeptForm({ ...deptForm, contactPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Office Address</label>
                <input
                  type="text"
                  placeholder="Municipal Headquarters, Wing B"
                  value={deptForm.address}
                  onChange={(e) => setDeptForm({ ...deptForm, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Icon Style</label>
                  <select
                    value={deptForm.icon}
                    onChange={(e) => setDeptForm({ ...deptForm, icon: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-800"
                  >
                    <option value="building">Building</option>
                    <option value="wrench">Road Work / Wrench</option>
                    <option value="trash">Sanitation / Trash</option>
                    <option value="zap">Electrical / Zap</option>
                    <option value="droplet">Water / Droplet</option>
                    <option value="waves">Drainage / Waves</option>
                    <option value="recycle">Recycle / Environment</option>
                    <option value="car">Traffic / Vehicles</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Badge Theme Color</label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setDeptForm({ ...deptForm, color: c.value })}
                        className={`w-6 h-6 rounded-full transition-transform ${
                          deptForm.color === c.value ? 'scale-125 ring-2 ring-slate-900 shadow-sm' : ''
                        }`}
                        style={{ backgroundColor: c.value }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* DEPARTMENT OFFICER LOGIN SECTION (ONLY IN CREATE MODAL OR FOR PROVISIONING) */}
              {activeModal === 'create' && (
                <div className="pt-3 border-t border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">Department Login Credentials</span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={deptForm.createOfficerLogin}
                        onChange={(e) => setDeptForm({ ...deptForm, createOfficerLogin: e.target.checked })}
                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="text-xs font-bold text-blue-700">Create Department Login</span>
                    </label>
                  </div>

                  {deptForm.createOfficerLogin && (
                    <div className="bg-blue-50/80 border border-blue-200 p-3.5 rounded-xl space-y-3 animate-in fade-in">
                      <p className="text-[11px] text-blue-900 font-medium">
                        Provision login credentials for the officer responsible for this department.
                      </p>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Officer Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Road Maintenance Officer"
                          value={deptForm.officerName}
                          onChange={(e) => setDeptForm({ ...deptForm, officerName: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Officer Email *</label>
                          <input
                            type="email"
                            placeholder="road@citymind.com"
                            value={deptForm.officerEmail}
                            onChange={(e) => setDeptForm({ ...deptForm, officerEmail: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Password *</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={deptForm.officerPassword}
                            onChange={(e) => setDeptForm({ ...deptForm, officerPassword: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Confirm Password *</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={deptForm.confirmPassword}
                            onChange={(e) => setDeptForm({ ...deptForm, confirmPassword: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingForm}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
                >
                  {isSubmittingForm ? 'Saving...' : activeModal === 'create' ? 'Create Department' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: DEPARTMENT DETAILS MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'details' && selectedDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                  style={{ backgroundColor: selectedDept.color || '#3b82f6' }}
                >
                  {renderDeptIcon(selectedDept.icon, "w-5 h-5 text-white")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                      {selectedDept.code}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedDept.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {selectedDept.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">{selectedDept.name}</h3>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              {/* Department Overview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-center">
                  <span className="text-[11px] font-semibold text-slate-500 block">Total Tasks</span>
                  <span className="text-xl font-black text-slate-900">
                    {selectedDeptStats?.totalComplaints ?? selectedDept.complaintCount ?? 0}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[11px] font-semibold text-slate-500 block">In Progress</span>
                  <span className="text-xl font-black text-amber-600">
                    {selectedDeptStats?.inProgress ?? selectedDept.inProgress ?? 0}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[11px] font-semibold text-slate-500 block">Resolved</span>
                  <span className="text-xl font-black text-emerald-600">
                    {selectedDeptStats?.resolved ?? selectedDept.resolved ?? 0}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[11px] font-semibold text-slate-500 block">High Priority</span>
                  <span className="text-xl font-black text-rose-600">
                    {selectedDeptStats?.highPriority ?? 0}
                  </span>
                </div>
              </div>

              {/* Department Details & Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Specialized Categories</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDept.categories && selectedDept.categories.length > 0 ? (
                      selectedDept.categories.map((cat, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-md text-[11px]">
                          {cat}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">All Categories</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Contact & Location</h4>
                  <p className="text-slate-700 font-medium">Email: {selectedDept.contactEmail || 'Not specified'}</p>
                  <p className="text-slate-700 font-medium">Phone: {selectedDept.contactPhone || 'Not specified'}</p>
                  <p className="text-slate-700 font-medium">Office: {selectedDept.address || 'Headquarters'}</p>
                </div>
              </div>

              {/* Assigned Complaints Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Assigned Complaints ({selectedDeptComplaints.length})
                  </h4>
                  {unassignedComplaints.length > 0 && (
                    <button
                      onClick={() => setActiveModal('unassigned')}
                      className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-lg text-[11px]"
                    >
                      + Assign Unassigned Complaint
                    </button>
                  )}
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                      <tr>
                        <th className="py-2.5 px-3">Complaint ID</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Location</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {deptComplaintsLoading ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-slate-400">
                            Loading assigned complaints...
                          </td>
                        </tr>
                      ) : selectedDeptComplaints.length > 0 ? (
                        selectedDeptComplaints.map((c) => (
                          <tr key={c._id || c.complaintId} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                              {c.complaintId || c._id}
                            </td>
                            <td className="py-2.5 px-3">{c.category}</td>
                            <td className="py-2.5 px-3 text-slate-600 truncate max-w-[150px]">
                              {c.address || 'Captured Location'}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                c.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                                c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED' ? 'bg-amber-100 text-amber-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {c.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => handleOpenAssignModal(c)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-blue-700 font-bold rounded-lg text-[10px]"
                              >
                                Reassign
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-slate-400 italic">
                            No complaints assigned to this department yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleOpenEditModal(selectedDept)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs"
              >
                Edit Department
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: UNASSIGNED COMPLAINTS LIST DRAWER / MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'unassigned' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in zoom-in-95">
            <div className="bg-amber-500 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-white" />
                <h3 className="text-base font-bold text-white">
                  Unassigned Citizen Complaints ({unassignedComplaints.length})
                </h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-amber-100 hover:text-white p-1 rounded-lg hover:bg-amber-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 max-h-[70vh] overflow-y-auto space-y-3 text-xs">
              {unassignedLoading ? (
                <div className="py-8 text-center text-slate-400">Loading unassigned complaints...</div>
              ) : unassignedComplaints.length > 0 ? (
                unassignedComplaints.map((c) => (
                  <div key={c._id || c.complaintId} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4 hover:border-amber-300 transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                          {c.complaintId || c._id}
                        </span>
                        <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">
                          {c.category}
                        </span>
                        <span className="bg-red-100 text-red-700 uppercase font-bold px-2 py-0.5 rounded text-[10px]">
                          {c.aiAnalysis?.severity || c.severity || 'HIGH'}
                        </span>
                      </div>
                      <p className="font-bold text-slate-900 text-sm">{c.title || c.description}</p>
                      <p className="text-slate-500 flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-red-500" />
                        {c.address || 'Captured GPS Location'}
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenAssignModal(c)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
                    >
                      <span>Assign</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 font-semibold">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  All citizen complaints are currently assigned to municipal departments!
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ASSIGN / REASSIGN COMPLAINT TO DEPARTMENT */}
      {/* ========================================================================= */}
      {activeModal === 'assign' && assigningComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in zoom-in-95">
            <div className="bg-blue-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-blue-300" />
                <h3 className="text-base font-bold text-white">
                  Assign Complaint to Department
                </h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-blue-300 hover:text-white p-1 rounded-lg hover:bg-blue-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Complaint Summary Card */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-blue-700">{assigningComplaint.complaintId || assigningComplaint._id}</span>
                  <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    {assigningComplaint.category}
                  </span>
                </div>
                <p className="font-bold text-slate-900 text-sm">{assigningComplaint.title || assigningComplaint.description}</p>
                <p className="text-slate-500 text-[11px]">{assigningComplaint.address}</p>
              </div>

              {/* Category-Based Recommendation Banner */}
              {(() => {
                const recommendedDept = departments.find(
                  (d) => d.isActive && d.categories?.includes(assigningComplaint.category)
                );
                if (recommendedDept) {
                  return (
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-center gap-2 text-blue-900">
                      <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <span className="font-bold block">Recommended Department:</span>
                        <span>{recommendedDept.name} (specializes in {assigningComplaint.category})</span>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Select Department */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Department *</label>
                <select
                  value={targetDepartmentId}
                  onChange={(e) => setTargetDepartmentId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">-- Choose Department --</option>
                  {departments
                    .filter((d) => d.isActive)
                    .map((d) => (
                      <option key={d._id || d.id} value={d._id || d.id}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                </select>
              </div>

              {/* Reason / Notes */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assignment Note / Reason (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Provide routing reason or instructions for the department team..."
                  value={reassignReason}
                  onChange={(e) => setReassignReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAssignment}
                  disabled={isSubmittingAssign || !targetDepartmentId}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
                >
                  {isSubmittingAssign ? 'Assigning...' : 'Assign Complaint'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;