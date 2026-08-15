import React, { useState } from 'react';
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

export const LiveCityMap: React.FC<LiveCityMapProps> = ({ markers, onSelectMarker }) => {
  const [selectedWard, setSelectedWard] = useState('All Wards');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredMarker, setHoveredMarker] = useState<MapMarker | null>(null);

  // Active filter states for category checkboxes
  const [activeCategories, setActiveCategories] = useState<Record<IssueCategory, boolean>>({
    'Potholes': true,
    'Garbage Overflow': true,
    'Broken Streetlights': true,
    'Water Leakage': true,
    'Drain Blockage': true,
    'Road Cracks': true,
    'Others': true,
  });

  const categoryConfigs: { 
    id: IssueCategory; 
    label: string; 
    color: string; 
    bg: string; 
    border: string; 
    icon: React.ElementType; 
  }[] = [
    { id: 'Potholes', label: 'Potholes', color: '#ef4444', bg: 'bg-red-500', border: 'border-red-600', icon: AlertCircle },
    { id: 'Garbage Overflow', label: 'Garbage Overflow', color: '#f97316', bg: 'bg-orange-500', border: 'border-orange-600', icon: Trash2 },
    { id: 'Broken Streetlights', label: 'Broken Streetlights', color: '#eab308', bg: 'bg-amber-400', border: 'border-amber-500', icon: Lightbulb },
    { id: 'Water Leakage', label: 'Water Leakage', color: '#3b82f6', bg: 'bg-blue-500', border: 'border-blue-600', icon: Droplet },
    { id: 'Drain Blockage', label: 'Drain Blockage', color: '#a855f7', bg: 'bg-purple-500', border: 'border-purple-600', icon: GitCommit },
    { id: 'Road Cracks', label: 'Road Cracks', color: '#14b8a6', bg: 'bg-teal-500', border: 'border-teal-600', icon: Layers },
    { id: 'Others', label: 'Others', color: '#64748b', bg: 'bg-slate-500', border: 'border-slate-600', icon: MapPin },
  ];

  const toggleCategory = (cat: IssueCategory) => {
    setActiveCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const filteredMarkers = markers.filter(m => {
    const matchesCategory = activeCategories[m.category];
    const matchesWard = selectedWard === 'All Wards' || m.ward === selectedWard;
    return matchesCategory && matchesWard;
  });

  const getMarkerIcon = (category: IssueCategory) => {
    const config = categoryConfigs.find(c => c.id === category);
    return config ? config.icon : MapPin;
  };

  const getMarkerBg = (category: IssueCategory) => {
    const config = categoryConfigs.find(c => c.id === category);
    return config ? config.bg : 'bg-slate-500';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-5 flex flex-col h-full">
      {/* Map Top Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Live City Map</h2>
          <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-200">
            {filteredMarkers.length} Active Pins
          </span>
        </div>

        {/* Ward Selector Dropdown */}
        <div className="relative">
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-slate-700 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="All Wards">All Wards</option>
            <option value="Ward 14">Ward 14 (MG Road)</option>
            <option value="Ward 8">Ward 8 (Park St)</option>
            <option value="Ward 5">Ward 5 (Market Area)</option>
            <option value="Ward 12">Ward 12 (Varma St)</option>
            <option value="Ward 3">Ward 3 (Lake View)</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Map Viewport Container */}
      <div className="relative flex-1 min-h-[380px] bg-[#eef3f7] rounded-xl border border-slate-200 overflow-hidden select-none">
        {/* Vector Map Canvas Background */}
        <div 
          className="absolute inset-0 transition-transform duration-300 ease-out origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Map Base Vector Grid & Features */}
          <svg className="w-full h-full text-slate-300" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="#f1f5f9" />
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Green Parks & Land Blocks */}
            <path d="M 80 40 Q 200 60 260 140 T 320 220 L 100 220 Z" fill="#dcfce7" opacity="0.7" />
            <path d="M 380 120 Q 500 130 550 200 L 400 280 Z" fill="#dcfce7" opacity="0.7" />
            <path d="M 120 280 Q 220 320 300 360 L 150 390 Z" fill="#dcfce7" opacity="0.7" />

            {/* River / Waterbody */}
            <path d="M -10 320 Q 250 290 400 340 T 800 320 L 800 420 L -10 420 Z" fill="#bae6fd" opacity="0.8" />
            <path d="M 0 320 Q 250 290 400 340 T 800 320" fill="none" stroke="#38bdf8" strokeWidth="6" opacity="0.6" />

            {/* Road Networks */}
            {/* Major Arterial Roads */}
            <path d="M 50 -10 L 450 420" stroke="#ffffff" strokeWidth="12" fill="none" />
            <path d="M 50 -10 L 450 420" stroke="#cbd5e1" strokeWidth="8" fill="none" />

            <path d="M -10 180 Q 300 120 750 180" stroke="#ffffff" strokeWidth="10" fill="none" />
            <path d="M -10 180 Q 300 120 750 180" stroke="#cbd5e1" strokeWidth="6" fill="none" />

            <path d="M 280 -10 L 280 420" stroke="#ffffff" strokeWidth="8" fill="none" />
            <path d="M 280 -10 L 280 420" stroke="#e2e8f0" strokeWidth="5" fill="none" />

            <path d="M 580 -10 L 580 420" stroke="#ffffff" strokeWidth="8" fill="none" />
            <path d="M 580 -10 L 580 420" stroke="#e2e8f0" strokeWidth="5" fill="none" />

            {/* Secondary Roads */}
            <path d="M 100 80 L 650 80" stroke="#ffffff" strokeWidth="6" strokeDasharray="6,4" />
            <path d="M 100 240 L 650 240" stroke="#ffffff" strokeWidth="6" strokeDasharray="6,4" />
          </svg>

          {/* Map Location Labels */}
          <span className="absolute top-12 left-1/3 text-[11px] font-bold text-slate-400 tracking-wider uppercase pointer-events-none">North City</span>
          <span className="absolute top-20 left-1/2 text-[11px] font-bold text-emerald-700/60 bg-emerald-100/50 px-2 py-0.5 rounded pointer-events-none">Central Park</span>
          <span className="absolute top-28 left-2/3 text-[11px] font-bold text-emerald-700/60 bg-emerald-100/50 px-2 py-0.5 rounded pointer-events-none">Green Hills</span>
          <span className="absolute top-24 left-1/4 text-[10px] font-semibold text-slate-400 pointer-events-none">Lake End</span>
          <span className="absolute top-1/2 left-8 text-[10px] font-semibold text-slate-400 pointer-events-none">West End</span>
          <span className="absolute top-1/2 left-24 text-[10px] font-semibold text-slate-400 pointer-events-none">West Park</span>
          <span className="absolute bottom-24 left-1/3 text-[11px] font-bold text-emerald-700/60 bg-emerald-100/50 px-2 py-0.5 rounded pointer-events-none">Baker Park</span>
          <span className="absolute bottom-20 left-1/2 text-[11px] font-bold text-slate-500 bg-white/70 px-2 py-0.5 rounded pointer-events-none">Tech Park</span>
          <span className="absolute bottom-12 right-1/3 text-[11px] font-bold text-slate-500 pointer-events-none">South Point</span>
          <span className="absolute top-1/2 right-1/4 text-[11px] font-bold text-slate-500 pointer-events-none">Tower Side</span>

          {/* Interactive Pin Markers */}
          {filteredMarkers.map((marker) => {
            const Icon = getMarkerIcon(marker.category);
            const bgClass = getMarkerBg(marker.category);
            const isCritical = marker.severity === 'Critical';

            return (
              <div
                key={marker.id}
                style={{ top: `${marker.lat}%`, left: `${marker.lng}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10 hover:z-30 transition-transform duration-150 hover:scale-125"
                onClick={() => onSelectMarker(marker)}
                onMouseEnter={() => setHoveredMarker(marker)}
                onMouseLeave={() => setHoveredMarker(null)}
              >
                <div className={`relative flex items-center justify-center w-7 h-7 rounded-full text-white shadow-md ${bgClass} border-2 border-white ${isCritical ? 'marker-pulse' : ''}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>

                {/* Tooltip on Hover */}
                {hoveredMarker?.id === marker.id && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 text-white rounded-xl p-2.5 shadow-xl text-xs z-40 pointer-events-none animate-in fade-in zoom-in-95">
                    <p className="font-bold truncate">{marker.title}</p>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-slate-300">
                      <span>{marker.ward}</span>
                      <span className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                        marker.severity === 'Critical' ? 'bg-red-500/30 text-red-300' :
                        marker.severity === 'High' ? 'bg-orange-500/30 text-orange-300' : 'bg-yellow-500/30 text-yellow-300'
                      }`}>
                        {marker.severity}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Filter Overlay Drawer on Left Side of Map */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl p-3 shadow-lg w-48 z-20">
          <h3 className="text-xs font-bold text-slate-900 mb-2.5 pb-1 border-b border-slate-100 flex items-center justify-between">
            <span>Filter Issues</span>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </h3>
          <div className="space-y-1.5">
            {categoryConfigs.map((cat) => {
              const Icon = cat.icon;
              const isChecked = activeCategories[cat.id];
              return (
                <label
                  key={cat.id}
                  className="flex items-center gap-2 text-[11px] font-semibold text-slate-700 cursor-pointer hover:text-slate-900 select-none"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCategory(cat.id)}
                    className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
                  />
                  <div className={`w-4 h-4 rounded-full ${cat.bg} text-white flex items-center justify-center shrink-0`}>
                    <Icon className="w-2.5 h-2.5" />
                  </div>
                  <span className="truncate">{cat.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Zoom Controls on Top Right of Map */}
        <div className="absolute top-3 right-3 flex flex-col bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden z-20">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2))}
            className="p-2 hover:bg-slate-100 text-slate-700 transition-colors border-b border-slate-100"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
            className="p-2 hover:bg-slate-100 text-slate-700 transition-colors border-b border-slate-100"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
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
