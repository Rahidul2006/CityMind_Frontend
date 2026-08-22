import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Plus, 
  Minus, 
  Target, 
  AlertCircle, 
  Trash2, 
  Lightbulb, 
  Droplet, 
  GitCommit, 
  MapPin, 
  ChevronDown,
  Layers,
  Info
} from 'lucide-react';
import type { IssueCategory, MapMarker } from '../../types/dashboard';

interface LiveCityMapProps {
  markers: MapMarker[];
  onSelectMarker: (marker: MapMarker) => void;
}

const categoryConfigs: { 
  id: IssueCategory; 
  label: string; 
  color: string; 
  bg: string; 
  icon: React.ElementType; 
}[] = [
  { id: 'Potholes', label: 'Potholes', color: '#ef4444', bg: 'bg-red-500', icon: AlertCircle },
  { id: 'Garbage Overflow', label: 'Garbage Overflow', color: '#f97316', bg: 'bg-orange-500', icon: Trash2 },
  { id: 'Broken Streetlights', label: 'Broken Streetlights', color: '#eab308', bg: 'bg-amber-400', icon: Lightbulb },
  { id: 'Water Leakage', label: 'Water Leakage', color: '#3b82f6', bg: 'bg-blue-500', icon: Droplet },
  { id: 'Drain Blockage', label: 'Drain Blockage', color: '#a855f7', bg: 'bg-purple-500', icon: GitCommit },
  { id: 'Road Cracks', label: 'Road Cracks', color: '#14b8a6', bg: 'bg-teal-500', icon: Layers },
  { id: 'Others', label: 'Others', color: '#64748b', bg: 'bg-slate-500', icon: MapPin },
];

export const LiveCityMap: React.FC<LiveCityMapProps> = ({ markers, onSelectMarker }) => {
  const [selectedWard, setSelectedWard] = useState('All Wards');
  const [assignmentFilter, setAssignmentFilter] = useState<'All' | 'Unassigned' | 'Assigned'>('All');

  const [activeCategories, setActiveCategories] = useState<Record<IssueCategory, boolean>>({
    'Potholes': true,
    'Garbage Overflow': true,
    'Broken Streetlights': true,
    'Water Leakage': true,
    'Drain Blockage': true,
    'Road Cracks': true,
    'Others': true,
  });

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  // Extract unique wards dynamically from markers
  const availableWards = useMemo(() => {
    const wardsSet = new Set<string>();
    markers.forEach((m) => {
      if (m.ward) wardsSet.add(m.ward);
    });
    return Array.from(wardsSet);
  }, [markers]);

  const toggleCategory = (cat: IssueCategory) => {
    setActiveCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleSelectAllCategories = (selectAll: boolean) => {
    const updated: Record<IssueCategory, boolean> = {
      'Potholes': selectAll,
      'Garbage Overflow': selectAll,
      'Broken Streetlights': selectAll,
      'Water Leakage': selectAll,
      'Drain Blockage': selectAll,
      'Road Cracks': selectAll,
      'Others': selectAll,
    };
    setActiveCategories(updated);
  };

  const filteredMarkers = useMemo(() => {
    return markers.filter(m => {
      const matchesCategory = activeCategories[m.category] === true;
      const matchesWard = selectedWard === 'All Wards' || m.ward === selectedWard;
      const matchesAssignment = 
        assignmentFilter === 'All' ? true :
        assignmentFilter === 'Unassigned' ? !m.isAssigned :
        Boolean(m.isAssigned);

      return matchesCategory && matchesWard && matchesAssignment;
    });
  }, [markers, activeCategories, selectedWard, assignmentFilter]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [19.0760, 72.8777],
        zoom: 12,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Leaflet Markers whenever filteredMarkers change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    const bounds: L.LatLngExpression[] = [];

    filteredMarkers.forEach((marker) => {
      if (typeof marker.lat !== 'number' || typeof marker.lng !== 'number') return;
      if (isNaN(marker.lat) || isNaN(marker.lng)) return;

      const isResolved = marker.status === 'Resolved' || (marker.status as string) === 'RESOLVED';
      const isUnassigned = !marker.isAssigned && !isResolved;

      // Color coding:
      // RED (#dc2626) for Unassigned issue
      // BLUE (#2563eb) for Assigned / In Progress issue
      // GREEN (#16a34a) for Resolved issue
      const pinColor = isUnassigned ? '#dc2626' : isResolved ? '#16a34a' : '#2563eb';
      const isCritical = marker.severity === 'Critical' || (marker.severity as string) === 'HIGH';

      // SVG teardrop pin marker
      const iconHtml = `
        <div class="relative ${isUnassigned ? 'marker-pulse' : ''}" style="cursor: pointer;">
          <svg width="32" height="38" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 3px 6px rgba(0,0,0,0.35));">
            <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 30 12 30C12 30 24 21 24 12C24 5.37 18.63 0 12 0Z" fill="${pinColor}" stroke="#FFFFFF" stroke-width="1.8"/>
            <circle cx="12" cy="11" r="5" fill="#FFFFFF"/>
            <circle cx="12" cy="11" r="3" fill="${pinColor}"/>
          </svg>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-leaflet-pin',
        iconSize: [32, 38],
        iconAnchor: [16, 38],
        popupAnchor: [0, -36],
      });

      const leafletMarker = L.marker([marker.lat, marker.lng], { icon: customIcon });

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 cursor-pointer';
      popupContent.innerHTML = `
        <div style="font-family: Inter, system-ui, sans-serif; min-width: 160px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; color: #ffffff; background: ${pinColor}; text-transform: uppercase;">
              ${isUnassigned ? '🔴 Unassigned' : isResolved ? '🟢 Resolved' : '🔵 Assigned'}
            </span>
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; background: ${isCritical ? '#fee2e2' : '#fef3c7'}; color: ${isCritical ? '#991b1b' : '#92400e'}; padding: 2px 6px; border-radius: 4px;">${marker.severity}</span>
          </div>
          <h4 style="margin: 4px 0 2px 0; font-weight: 700; font-size: 13px; color: #0f172a;">${marker.title}</h4>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748b;">${marker.ward || 'Municipal Ward'}</p>
          <span style="display: inline-block; font-size: 10px; font-weight: 700; background: #eff6ff; color: #1d4ed8; padding: 2px 6px; border-radius: 4px;">${marker.category}</span>
        </div>
      `;

      popupContent.addEventListener('click', () => {
        onSelectMarker(marker);
      });

      leafletMarker.bindPopup(popupContent);

      leafletMarker.on('click', () => {
        onSelectMarker(marker);
      });

      markersGroup.addLayer(leafletMarker);
      bounds.push([marker.lat, marker.lng]);
    });

    if (bounds.length > 0) {
      map.fitBounds(L.latLngBounds(bounds), { padding: [50, 50], maxZoom: 15 });
    }
  }, [filteredMarkers, onSelectMarker]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleRecenter = () => {
    if (!mapInstanceRef.current || filteredMarkers.length === 0) return;
    const bounds: L.LatLngExpression[] = filteredMarkers
      .filter(m => typeof m.lat === 'number' && typeof m.lng === 'number')
      .map(m => [m.lat, m.lng]);
    if (bounds.length > 0) {
      mapInstanceRef.current.fitBounds(L.latLngBounds(bounds), { padding: [50, 50] });
    }
  };

  const isAllSelected = Object.values(activeCategories).every(Boolean);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-5 flex flex-col h-full">
      {/* Map Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Live City Map (OpenStreetMap)</h2>
          <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
            {filteredMarkers.length} Active Pins
          </span>
        </div>

        {/* Assignment Filter Tabs & Ward Dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Assignment Filter Tabs */}
          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setAssignmentFilter('All')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${assignmentFilter === 'All' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All
            </button>
            <button
              onClick={() => setAssignmentFilter('Unassigned')}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${assignmentFilter === 'Unassigned' ? 'bg-red-600 text-white shadow-2xs' : 'text-red-600 hover:bg-red-50'}`}
            >
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              Unassigned
            </button>
            <button
              onClick={() => setAssignmentFilter('Assigned')}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${assignmentFilter === 'Assigned' ? 'bg-blue-600 text-white shadow-2xs' : 'text-blue-600 hover:bg-blue-50'}`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Assigned
            </button>
          </div>

          {/* Ward Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-slate-700 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All Wards">All Wards</option>
              {availableWards.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Map Viewport Container */}
      <div className="relative flex-1 min-h-[380px] rounded-xl border border-slate-200 overflow-hidden select-none">
        <div ref={mapContainerRef} className="w-full h-full min-h-[380px] z-0" />

        {/* Filter Overlay Drawer on Left Side */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl p-3 shadow-lg w-52 z-10">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Filter Issues</span>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </h3>

            {/* Select All / Clear Toggle */}
            <button
              onClick={() => handleSelectAllCategories(!isAllSelected)}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              {isAllSelected ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          {/* Category Checkboxes */}
          <div className="space-y-1.5">
            {categoryConfigs.map((cat) => {
              const Icon = cat.icon;
              const isChecked = activeCategories[cat.id] === true;
              return (
                <label
                  key={cat.id}
                  className="flex items-center gap-2 text-[11px] font-semibold text-slate-700 cursor-pointer hover:text-slate-900 select-none p-0.5 rounded hover:bg-slate-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCategory(cat.id)}
                    className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                  />
                  <div className={`w-4 h-4 rounded-full ${cat.bg} text-white flex items-center justify-center shrink-0`}>
                    <Icon className="w-2.5 h-2.5" />
                  </div>
                  <span className="truncate">{cat.label}</span>
                </label>
              );
            })}
          </div>

          {/* Marker Color Legend Box */}
          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] space-y-1 font-bold">
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block shadow-2xs"></span>
              <span>🔴 Unassigned Issue (Red)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block shadow-2xs"></span>
              <span>🔵 Assigned Issue (Blue)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block shadow-2xs"></span>
              <span>🟢 Resolved Issue (Green)</span>
            </div>
          </div>
        </div>

        {/* Zoom Controls on Top Right */}
        <div className="absolute top-3 right-3 flex flex-col bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden z-10">
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-slate-100 text-slate-700 transition-colors border-b border-slate-100"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-slate-100 text-slate-700 transition-colors border-b border-slate-100"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={handleRecenter}
            className="p-2 hover:bg-slate-100 text-slate-700 transition-colors"
            title="Recenter Map"
          >
            <Target className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
