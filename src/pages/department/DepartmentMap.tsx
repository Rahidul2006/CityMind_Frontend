import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import {
  MapPin,
  RefreshCw,
  Eye,
  ExternalLink,
  Filter,
  ShieldCheck,
  CheckCircle2,
  Info,
  AlertCircle,
  Radio
} from 'lucide-react';
import { getDepartmentMapTasks } from '../../services/departmentTaskService';

interface TaskLocation {
  latitude: number | null;
  longitude: number | null;
  accuracy?: number;
}

interface DepartmentTask {
  _id: string;
  complaintId: string;
  category: string;
  priority: string;
  status: string;
  description: string;
  title: string;
  location: TaskLocation;
  locationSource?: string;
  address: string;
  imageUrl?: string;
  createdAt?: string;
  assignedAt?: string;
}

// Validate GPS coordinates strictly (-90 to 90 lat, -180 to 180 lng, non-zero)
const isValidCoordinate = (lat: any, lng: any): boolean => {
  if (lat === null || lat === undefined || lng === null || lng === undefined) return false;
  const nLat = Number(lat);
  const nLng = Number(lng);
  if (isNaN(nLat) || isNaN(nLng)) return false;
  if (nLat < -90 || nLat > 90 || nLng < -180 || nLng > 180) return false;
  if (nLat === 0 && nLng === 0) return false;
  return true;
};

const getPriorityColor = (priority: string) => {
  const p = (priority || '').toUpperCase();
  if (p === 'URGENT' || p === 'CRITICAL') {
    return {
      bg: '#ef4444',
      badge: 'bg-red-100 text-red-800 border-red-300',
      dot: 'bg-red-500',
      border: '#dc2626',
      label: 'URGENT',
    };
  }
  if (p === 'HIGH') {
    return {
      bg: '#f97316',
      badge: 'bg-orange-100 text-orange-800 border-orange-300',
      dot: 'bg-orange-500',
      border: '#ea580c',
      label: 'HIGH',
    };
  }
  if (p === 'MEDIUM') {
    return {
      bg: '#3b82f6',
      badge: 'bg-blue-100 text-blue-800 border-blue-300',
      dot: 'bg-blue-500',
      border: '#2563eb',
      label: 'MEDIUM',
    };
  }
  return {
    bg: '#64748b',
    badge: 'bg-slate-100 text-slate-700 border-slate-300',
    dot: 'bg-slate-500',
    border: '#475569',
    label: p || 'LOW',
  };
};

const getStatusBadgeClass = (status: string) => {
  const s = (status || '').toUpperCase();
  if (s === 'IN_PROGRESS') return 'bg-amber-100 text-amber-800 border-amber-300';
  if (s === 'REOPENED') return 'bg-purple-100 text-purple-800 border-purple-300';
  return 'bg-blue-100 text-blue-800 border-blue-300';
};

export const DepartmentMap: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<DepartmentTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Leaflet map refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const markerMapRef = useRef<Map<string, L.Marker>>(new Map());

  // Load active department tasks
  const fetchMapTasks = async (showLoadingSpinner = true) => {
    if (showLoadingSpinner) setLoading(true);
    try {
      const data = await getDepartmentMapTasks();
      setTasks(data || []);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed to fetch department map tasks:', err);
    } finally {
      if (showLoadingSpinner) setLoading(false);
    }
  };

  // Initial load + 30-second auto-refresh polling
  useEffect(() => {
    fetchMapTasks(true);

    const intervalId = setInterval(() => {
      fetchMapTasks(false);
    }, 30000); // Poll every 30 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Filter tasks locally
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (statusFilter !== 'All' && t.status !== statusFilter) return false;
      if (priorityFilter !== 'All' && (t.priority || '').toUpperCase() !== priorityFilter) return false;
      if (categoryFilter !== 'All' && t.category !== categoryFilter) return false;
      return true;
    });
  }, [tasks, statusFilter, priorityFilter, categoryFilter]);

  // Unique categories list for dropdown
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set);
  }, [tasks]);

  // Count active tasks with valid GPS
  const validGpsCount = useMemo(() => {
    return filteredTasks.filter((t) => isValidCoordinate(t.location?.latitude, t.location?.longitude)).length;
  }, [filteredTasks]);

  // Initialize Leaflet Map instance
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (leafletMapRef.current) return; // Prevent double init

    // Default center (Kolkata / India default or standard city coordinate)
    const defaultLat = 22.572645;
    const defaultLng = 88.363892;

    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: 12,
      zoomControl: true,
    });

    // OpenStreetMap tile layer (Free, OpenSource, Attribution required)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);

    leafletMapRef.current = map;
    markersGroupRef.current = markersGroup;

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        markersGroupRef.current = null;
      }
    };
  }, []);

  // Update Leaflet markers whenever filteredTasks or selectedTaskId changes
  useEffect(() => {
    const map = leafletMapRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();
    markerMapRef.current.clear();

    const bounds: L.LatLngBounds = L.latLngBounds([]);
    let validMarkerCount = 0;

    filteredTasks.forEach((task) => {
      const lat = task.location?.latitude;
      const lng = task.location?.longitude;

      if (!isValidCoordinate(lat, lng)) {
        // Skip placing marker for invalid or missing coordinates
        return;
      }

      const nLat = Number(lat);
      const nLng = Number(lng);
      const isSelected = selectedTaskId === task.complaintId;
      const pColors = getPriorityColor(task.priority);

      // Create Leaflet divIcon marker
      const isUrgent = (task.priority || '').toUpperCase() === 'URGENT';
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="position: relative; width: 34px; height: 34px; cursor: pointer; ${
            isSelected
              ? 'transform: scale(1.3); z-index: 1000;'
              : 'transform: scale(1.0); z-index: 10;'
          } transition: transform 0.2s ease;">
            ${
              isUrgent
                ? '<div class="marker-pulse" style="position: absolute; inset: -4px; border-radius: 50%; pointer-events: none;"></div>'
                : ''
            }
            <div style="
              width: 34px;
              height: 34px;
              background-color: ${pColors.bg};
              border: 2.5px solid #ffffff;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 4px 12px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                width: 12px;
                height: 12px;
                background-color: #ffffff;
                border-radius: 50%;
                transform: rotate(45deg);
              "></div>
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -34],
      });

      const marker = L.marker([nLat, nLng], { icon: customIcon });

      // Build marker popup content
      const accuracyStr = task.location?.accuracy ? `±${task.location.accuracy}m` : 'GPS Standard';
      const imgHtml = task.imageUrl
        ? `<img src="${task.imageUrl}" alt="Complaint" style="width: 100%; height: 95px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />`
        : '';

      const popupHtml = `
        <div style="font-family: inherit; width: 230px; padding: 2px;">
          ${imgHtml}
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 6px;">
            <span style="font-family: monospace; font-weight: 800; color: #1e3a8a; font-size: 13px;">${task.complaintId}</span>
            <span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background-color: ${pColors.bg}; color: #ffffff;">${pColors.label}</span>
          </div>
          <div style="font-size: 12px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">${task.category}</div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 6px; line-clamp: 2; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
            ${task.description || task.address}
          </div>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px; margin-bottom: 8px; font-size: 10px; color: #334155;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">
              <span style="font-weight: 700; color: #0284c7;">📍 Citizen GPS</span>
              <span style="font-weight: 600;">${accuracyStr}</span>
            </div>
            <div style="font-family: monospace; font-size: 10px; color: #64748b;">${nLat.toFixed(6)}, ${nLng.toFixed(6)}</div>
          </div>
          <button 
            id="btn-view-task-${task.complaintId}"
            style="
              width: 100%;
              background-color: #2563eb;
              color: #ffffff;
              border: none;
              padding: 7px 12px;
              border-radius: 8px;
              font-weight: 700;
              font-size: 12px;
              cursor: pointer;
            "
          >
            View Task →
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      // Handle marker click
      marker.on('click', () => {
        setSelectedTaskId(task.complaintId);
      });

      // Handle popup view task button click
      marker.on('popupopen', () => {
        setTimeout(() => {
          const btn = document.getElementById(`btn-view-task-${task.complaintId}`);
          if (btn) {
            btn.onclick = () => {
              navigate(`/department/tasks/${task.complaintId}`);
            };
          }
        }, 50);
      });

      marker.addTo(markersGroup);
      markerMapRef.current.set(task.complaintId, marker);

      bounds.extend([nLat, nLng]);
      validMarkerCount++;
    });

    // Auto fit bounds or set view based on marker count
    if (validMarkerCount === 1) {
      const singleTask = filteredTasks.find((t) => isValidCoordinate(t.location?.latitude, t.location?.longitude));
      if (singleTask) {
        map.setView([Number(singleTask.location.latitude), Number(singleTask.location.longitude)], 15);
      }
    } else if (validMarkerCount > 1) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [filteredTasks, selectedTaskId, navigate]);

  // Focus marker when task card in task list is clicked
  const handleSelectTaskCard = (task: DepartmentTask) => {
    setSelectedTaskId(task.complaintId);

    const lat = task.location?.latitude;
    const lng = task.location?.longitude;

    if (isValidCoordinate(lat, lng) && leafletMapRef.current) {
      const nLat = Number(lat);
      const nLng = Number(lng);
      const map = leafletMapRef.current;
      map.setView([nLat, nLng], 16, { animate: true });

      const marker = markerMapRef.current.get(task.complaintId);
      if (marker) {
        marker.openPopup();
      }
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* HEADER SECTION */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>LIVE TASK MAP</span>
                <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Leaflet + OpenStreetMap
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-2">
                <span>Exact Citizen-Reported Civic Complaint Locations</span>
                <span className="inline-block w-1 h-1 bg-slate-300 rounded-full" />
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Read-Only Coordinates
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* TOP METRICS & REFRESH */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Current Active Tasks
            </span>
            <span className="text-lg font-extrabold text-blue-700 leading-none">
              {filteredTasks.length}
            </span>
          </div>

          <button
            onClick={() => fetchMapTasks(true)}
            disabled={loading}
            className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* FILTER BAR & MAP CONTROLS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-slate-400 font-bold text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All Active Statuses</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="REOPENED">REOPENED</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-slate-400 font-bold text-[11px]">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="URGENT">URGENT (Red)</option>
              <option value="HIGH">HIGH (Orange)</option>
              <option value="MEDIUM">MEDIUM (Blue)</option>
              <option value="LOW">LOW (Neutral)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-slate-400 font-bold text-[11px]">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* MAP LEGEND SUMMARY */}
        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> URGENT
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> HIGH
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> MEDIUM
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> LOW
          </span>
        </div>
      </div>

      {/* MAIN CONTENT: MAP + TASK LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEAFLET MAP VIEW CONTAINER (7 COLS ON LARGE) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col min-h-[500px]">
          {/* Map Top Indicator */}
          <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="font-bold">OpenStreetMap Field Map</span>
              <span className="text-slate-400">({validGpsCount} Active Pins)</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Auto-Refresh: 30s | Last: {lastRefreshed.toLocaleTimeString()}
            </div>
          </div>

          {/* Leaflet DOM Container */}
          <div className="relative flex-1 min-h-[460px] w-full">
            <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-10" />

            {/* Empty Tasks Overlay */}
            {filteredTasks.length === 0 && !loading && (
              <div className="absolute inset-0 z-20 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 text-white">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-base font-bold">No Active Tasks</h3>
                <p className="text-xs text-slate-300 max-w-xs mt-1">
                  There are no active assigned complaints matching the selected filters.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ASSIGNED TASK DIRECTORY LIST (5 COLS ON LARGE) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 flex flex-col h-[550px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Assigned Tasks Directory</span>
                <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full font-bold">
                  {filteredTasks.length}
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Click task card to focus marker on OpenStreetMap.
              </p>
            </div>
          </div>

          {/* TASK SCROLLABLE CARDS */}
          <div className="flex-1 overflow-y-auto mt-3 space-y-3 pr-1">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <Info className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-semibold">No assigned tasks found.</p>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isSelected = selectedTaskId === task.complaintId;
                const hasValidGps = isValidCoordinate(task.location?.latitude, task.location?.longitude);
                const pColors = getPriorityColor(task.priority);
                const statusBadge = getStatusBadgeClass(task.status);
                const lat = task.location?.latitude;
                const lng = task.location?.longitude;
                const accuracy = task.location?.accuracy;

                return (
                  <div
                    key={task.complaintId || task._id}
                    onClick={() => handleSelectTaskCard(task)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-400 shadow-xs ring-2 ring-blue-500/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    {/* Top Row: ID, Category & Priority */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-xs text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
                          {task.complaintId}
                        </span>
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {task.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${pColors.badge}`}>
                          {pColors.label}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusBadge}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>

                    {/* Description / Address */}
                    <p className="text-xs text-slate-600 line-clamp-2 font-medium">
                      {task.description || task.address}
                    </p>

                    {/* LOCATION INFORMATION BOX (READ-ONLY) */}
                    <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span>Reported Location</span>
                        </span>

                        {hasValidGps ? (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Citizen GPS
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-amber-600" /> Location unavailable
                          </span>
                        )}
                      </div>

                      {hasValidGps ? (
                        <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-slate-600 pt-1">
                          <div>
                            <span className="text-[10px] font-sans font-semibold text-slate-400 block">Lat</span>
                            <span>{Number(lat).toFixed(6)}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-sans font-semibold text-slate-400 block">Lng</span>
                            <span>{Number(lng).toFixed(6)}</span>
                          </div>
                          {accuracy ? (
                            <div className="col-span-2 text-[10px] font-sans text-slate-500 pt-0.5">
                              GPS Accuracy: <span className="font-semibold text-slate-700">±{accuracy}m</span>
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500 italic pt-0.5">
                          GPS coordinates were missing or invalid in submission.
                        </p>
                      )}
                    </div>

                    {/* CARD FOOTER ACTIONS */}
                    <div className="flex items-center justify-between pt-1 gap-2">
                      {hasValidGps ? (
                        <a
                          href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Open in OpenStreetMap</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">No Map Link</span>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/department/tasks/${task.complaintId}`);
                        }}
                        className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700 font-bold rounded-lg text-xs flex items-center gap-1 shadow-2xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Task</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentMap;
