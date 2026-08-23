import { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MetricsGrid } from '../components/dashboard/MetricsGrid';
import { LiveCityMap } from '../components/dashboard/LiveCityMap';
import { PriorityIssues } from '../components/dashboard/PriorityIssues';
import { CategoryChart } from '../components/dashboard/CategoryChart';
import { StatusChart } from '../components/dashboard/StatusChart';
import { DepartmentPerformance } from '../components/dashboard/DepartmentPerformance';
import { InfrastructureHealth } from '../components/dashboard/InfrastructureHealth';

import { API_BASE_URL } from '../config/api';
import { subscribeToStatusUpdates } from '../services/socketService';

import type { 
  PriorityIssueItem, 
  MapMarker, 
  AlertItem, 
  MetricData, 
  CategoryData, 
  StatusData, 
  IssueCategory, 
  IssueStatus, 
  SeverityLevel 
} from '../types/dashboard';

interface OutletContextType {
  setActiveModalIssue: (issue: PriorityIssueItem | MapMarker | AlertItem | null) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Potholes': '#ef4444',
  'Garbage Overflow': '#f97316',
  'Broken Streetlights': '#eab308',
  'Water Leakage': '#3b82f6',
  'Drain Blockage': '#a855f7',
  'Road Cracks': '#14b8a6',
  'Others': '#64748b',
};

const STATUS_COLORS: Record<string, string> = {
  'Reported': '#06b6d4',
  'AI Verified': '#10b981',
  'Assigned': '#3b82f6',
  'In Progress': '#eab308',
  'Resolved': '#22c55e',
  'Closed': '#0d9488',
};

const normalizeCategory = (cat?: string): IssueCategory => {
  if (!cat) return 'Others';
  const c = cat.toLowerCase().trim();
  if (c.includes('pothole')) return 'Potholes';
  if (c.includes('garbage') || c.includes('waste') || c.includes('sanitation')) return 'Garbage Overflow';
  if (c.includes('light') || c.includes('electric') || c.includes('lamp')) return 'Broken Streetlights';
  if (c.includes('water') || c.includes('leak') || c.includes('pipe')) return 'Water Leakage';
  if (c.includes('drain') || c.includes('sewer') || c.includes('flood')) return 'Drain Blockage';
  if (c.includes('crack') || c.includes('road') || c.includes('transport')) return 'Road Cracks';
  return 'Others';
};

export function Dashboard() {
  const { setActiveModalIssue } = useOutletContext<OutletContextType>();
  const [complaints, setComplaints] = useState<any[]>([]);

  // Fetch real complaints data from backend API
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
          const raw = json.data || json.complaints || [];
          setComplaints(raw);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard complaints from database:', err);
      }
    };

    fetchComplaints();

    // Real-time updates via Socket.IO
    const unsubscribe = subscribeToStatusUpdates((data) => {
      if (data && (data.complaintId || data.mongoId)) {
        const targetId = data.complaintId || data.mongoId;
        setComplaints((prevList) => {
          const exists = prevList.some(item => item._id === targetId || item.complaintId === targetId || item._id === data.mongoId);
          if (exists) {
            return prevList.map((item) => {
              if (item._id === targetId || item.complaintId === targetId || item._id === data.mongoId) {
                return {
                  ...item,
                  status: data.status,
                  statusHistory: data.complaint?.statusHistory || item.statusHistory,
                };
              }
              return item;
            });
          } else if (data.complaint) {
            // New complaint arrived via Socket.IO
            return [data.complaint, ...prevList];
          }
          return prevList;
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Compute 6 dynamic Metric Cards based on real database complaints
  const metricsData = useMemo<MetricData[]>(() => {
    const totalCount = complaints.length;
    const resolvedCount = complaints.filter(c => (c.status || '').toUpperCase() === 'RESOLVED').length;
    const activeCount = complaints.filter(c => {
      const s = (c.status || '').toUpperCase();
      return s !== 'RESOLVED' && s !== 'REJECTED' && s !== 'CLOSED';
    }).length;

    const criticalCount = complaints.filter(c => {
      const sev = (c.severity || c.aiAnalysis?.severity || '').toUpperCase();
      return sev === 'CRITICAL' || sev === 'HIGH';
    }).length;

    const todayStr = new Date().toDateString();
    const todayCount = complaints.filter(c => {
      if (!c.createdAt) return false;
      return new Date(c.createdAt).toDateString() === todayStr;
    }).length;

    const pendingCount = complaints.filter(c => {
      const s = (c.status || '').toUpperCase();
      return s === 'SUBMITTED' || s === 'VERIFIED' || s === 'ASSIGNED' || s === 'IN_PROGRESS';
    }).length;

    const overdueCount = complaints.filter(c => {
      const s = (c.status || '').toUpperCase();
      return s === 'REOPENED' || (c.createdAt && (Date.now() - new Date(c.createdAt).getTime()) > 48 * 3600 * 1000 && s !== 'RESOLVED');
    }).length;

    return [
      {
        id: 'active-issues',
        title: 'Total Active Issues',
        value: activeCount.toLocaleString(),
        change: totalCount > 0 ? `${Math.round((activeCount / totalCount) * 100)}% of total` : 'Live DB data',
        isPositive: true,
        type: 'increase',
        icon: 'clipboard-list',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
      },
      {
        id: 'critical-issues',
        title: 'Critical Issues',
        value: criticalCount.toLocaleString(),
        change: totalCount > 0 ? `${Math.round((criticalCount / totalCount) * 100)}% of total` : 'Live DB data',
        isPositive: false,
        type: 'increase',
        icon: 'alert-circle',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-500',
      },
      {
        id: 'reported-today',
        title: 'Issues Reported Today',
        value: todayCount.toLocaleString(),
        change: 'Real-time count',
        isPositive: false,
        type: 'increase',
        icon: 'file-text',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
      },
      {
        id: 'resolved-issues',
        title: 'Issues Resolved',
        value: resolvedCount.toLocaleString(),
        change: totalCount > 0 ? `${Math.round((resolvedCount / totalCount) * 100)}% completion` : 'Live DB data',
        isPositive: true,
        type: 'increase',
        icon: 'check-circle-2',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
      },
      {
        id: 'pending-issues',
        title: 'Pending Issues',
        value: pendingCount.toLocaleString(),
        change: 'Awaiting completion',
        isPositive: true,
        type: 'decrease',
        icon: 'hourglass',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
      },
      {
        id: 'overdue-issues',
        title: 'Overdue Issues',
        value: overdueCount.toLocaleString(),
        change: 'Requires attention',
        isPositive: false,
        type: 'increase',
        icon: 'clock',
        iconBg: 'bg-rose-100',
        iconColor: 'text-rose-500',
      },
    ];
  }, [complaints]);

  // Compute Category Chart Data from DB
  const categoryChartData = useMemo<CategoryData[]>(() => {
    if (complaints.length === 0) return [];
    const counts: Record<string, number> = {};

    complaints.forEach((c) => {
      const cat = normalizeCategory(c.category);
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const total = complaints.length;
    return Object.entries(counts).map(([name, count]) => ({
      name: name as IssueCategory,
      count,
      percentage: Math.round((count / total) * 100),
      color: CATEGORY_COLORS[name] || '#64748b'
    })).sort((a, b) => b.count - a.count);
  }, [complaints]);

  // Compute Status Chart Data from DB
  const statusChartData = useMemo<StatusData[]>(() => {
    if (complaints.length === 0) return [];
    const statusMap: Record<string, string> = {
      'SUBMITTED': 'Reported',
      'VERIFIED': 'AI Verified',
      'ASSIGNED': 'Assigned',
      'IN_PROGRESS': 'In Progress',
      'RESOLVED': 'Resolved',
      'REOPENED': 'In Progress',
      'REJECTED': 'Closed',
      'CLOSED': 'Closed',
    };

    const counts: Record<string, number> = {};

    complaints.forEach((c) => {
      const rawStatus = (c.status || 'SUBMITTED').toUpperCase();
      const mapped = statusMap[rawStatus] || 'Reported';
      counts[mapped] = (counts[mapped] || 0) + 1;
    });

    const total = complaints.length;
    return Object.entries(counts).map(([name, count]) => ({
      name: name as IssueStatus,
      count,
      percentage: Math.round((count / total) * 100),
      color: STATUS_COLORS[name] || '#64748b'
    })).sort((a, b) => b.count - a.count);
  }, [complaints]);

  // Map real complaints to OpenStreetMap MapMarker objects
  const mapMarkers = useMemo<MapMarker[]>(() => {
    return complaints.map((c, index) => {
      // Determine real lat/lng from database
      let lat = c.reportedLocation?.latitude || c.capturedLocation?.latitude || c.image?.latitude || (c.location?.coordinates ? c.location.coordinates[1] : null);
      let lng = c.reportedLocation?.longitude || c.capturedLocation?.longitude || c.image?.longitude || (c.location?.coordinates ? c.location.coordinates[0] : null);

      // If lat/lng missing or zero, spread deterministically around Mumbai city center
      if (!lat || !lng || isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) {
        lat = 19.0760 + (((index % 5) - 2) * 0.015) + (index * 0.002);
        lng = 72.8777 + ((((index * 3) % 5) - 2) * 0.015) + (index * 0.0015);
      }

      const rawSev = (c.severity || c.aiAnalysis?.severity || 'Medium').toString().toUpperCase();
      const severity: SeverityLevel = 
        rawSev === 'CRITICAL' ? 'Critical' :
        rawSev === 'HIGH' ? 'High' :
        rawSev === 'LOW' ? 'Low' : 'Medium';

      const isAssigned = Boolean(
        c.assignedDepartment || 
        (c.department && c.department.name && c.department.name !== 'Municipal Works Department' && c.department.id !== 'DEPT-CIVIC') ||
        (c.status || '').toUpperCase() === 'ASSIGNED' || 
        (c.status || '').toUpperCase() === 'IN_PROGRESS' || 
        (c.status || '').toUpperCase() === 'RESOLVED'
      );

      const category = normalizeCategory(c.category);
      const realImageUrl = c.image?.url || c.imageUrl || (typeof c.image === 'string' ? c.image : undefined);

      return {
        id: c._id || c.complaintId || `m-${index}`,
        complaintId: c.complaintId || c._id,
        title: c.title || c.category || 'Civic Issue Report',
        category,
        lat,
        lng,
        ward: c.address || c.location?.ward || c.ward || 'Municipal Ward',
        status: (c.status || 'Reported') as IssueStatus,
        severity,
        isAssigned,
        assignedDepartmentName: c.department?.name || null,
        imageUrl: realImageUrl,
        description: c.description || undefined
      };
    });
  }, [complaints]);

  // Map real complaints to PriorityIssues list
  const priorityIssuesList = useMemo<PriorityIssueItem[]>(() => {
    return complaints
      .filter(c => (c.status || '').toUpperCase() !== 'RESOLVED')
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 4)
      .map((c, index) => {
        const rawSev = (c.severity || c.aiAnalysis?.severity || 'Medium').toString().toUpperCase();
        const severity: SeverityLevel = 
          rawSev === 'CRITICAL' ? 'Critical' :
          rawSev === 'HIGH' ? 'High' :
          rawSev === 'LOW' ? 'Low' : 'Medium';

        return {
          id: c._id || c.complaintId || `p-${index}`,
          title: c.title || c.category || 'Civic Issue Report',
          category: normalizeCategory(c.category),
          location: c.address || (typeof c.location === 'string' ? c.location : c.location?.address) || 'Captured GPS Location',
          ward: c.location?.ward || c.ward || 'Municipal Ward',
          reportedTime: new Date(c.createdAt || Date.now()).toLocaleDateString(),
          estRepairTime: c.estimatedRepairHours ? `${c.estimatedRepairHours} hrs` : '24 hrs',
          severity,
          score: c.aiAnalysis?.priorityScore || (severity === 'Critical' ? 94 : severity === 'High' ? 84 : 68),
          imageUrl: c.image?.url || c.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=300&q=80',
          description: c.description || ''
        };
      });
  }, [complaints]);

  return (
    <div className="space-y-6">
      {/* 1. Top Key Performance Indicators Grid (6 Metrics) */}
      <section aria-label="Key Performance Indicators">
        <MetricsGrid 
          metrics={metricsData}
          onSelectMetric={(id) => {
            console.log('Selected metric:', id);
          }}
        />
      </section>

      {/* 2. Middle Row 1: Live City Map (OpenStreetMap) & Priority Issues */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Live City Map (2 Columns wide on desktop) */}
        <div className="lg:col-span-2 h-[480px] w-full">
          <LiveCityMap
            markers={mapMarkers}
            onSelectMarker={(marker) => setActiveModalIssue(marker)}
          />
        </div>

        {/* Priority Issues List (1 Column on desktop) */}
        <div className="lg:col-span-1 h-[480px] w-full">
          <PriorityIssues
            issues={priorityIssuesList}
            onSelectIssue={(issue) => setActiveModalIssue(issue)}
          />
        </div>
      </section>

      {/* 3. Middle Row 2: 4 Data Cards (Categories, Statuses, Depts, Health Index) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        <CategoryChart data={categoryChartData} />
        <StatusChart data={statusChartData} />
        <DepartmentPerformance />
        <InfrastructureHealth />
      </section>
    </div>
  );
}

export default Dashboard;
