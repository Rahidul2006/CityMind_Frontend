import type { 
  MetricData, 
  MapMarker, 
  PriorityIssueItem, 
  CategoryData, 
  StatusData, 
  DepartmentMetric, 
  AlertItem,
  NotificationItem 
} from '../types/dashboard';

export const METRICS_DATA: MetricData[] = [
  {
    id: 'active-issues',
    title: 'Total Active Issues',
    value: '1,284',
    change: '12% from last week',
    isPositive: true, // positive upward activity
    type: 'increase',
    icon: 'clipboard-list',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 'critical-issues',
    title: 'Critical Issues',
    value: '47',
    change: '8% from last week',
    isPositive: false, // critical issues increase is bad
    type: 'increase',
    icon: 'alert-circle',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-500',
  },
  {
    id: 'reported-today',
    title: 'Issues Reported Today',
    value: '126',
    change: '15% from yesterday',
    isPositive: false,
    type: 'increase',
    icon: 'file-text',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: 'resolved-issues',
    title: 'Issues Resolved',
    value: '842',
    change: '10% from last week',
    isPositive: true,
    type: 'increase',
    icon: 'check-circle-2',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    id: 'pending-issues',
    title: 'Pending Issues',
    value: '442',
    change: '5% from last week',
    isPositive: true, // decrease in pending is good
    type: 'decrease',
    icon: 'hourglass',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    id: 'overdue-issues',
    title: 'Overdue Issues',
    value: '38',
    change: '3% from last week',
    isPositive: false,
    type: 'increase',
    icon: 'clock',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-500',
  },
  {
    id: 'avg-resolution',
    title: 'Avg. Resolution Time',
    value: '2.4 days',
    change: '0.4 days from last week',
    isPositive: true, // decrease in resolution time is good
    type: 'decrease',
    icon: 'timer',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
];

export const MAP_MARKERS: MapMarker[] = [
  // Potholes (Red)
  { id: 'm1', title: 'Severe Pothole on MG Road', category: 'Potholes', lat: 32, lng: 48, ward: 'Ward 14', status: 'In Progress', severity: 'Critical' },
  { id: 'm2', title: 'Road Crack & Pothole', category: 'Potholes', lat: 56, lng: 70, ward: 'Ward 14', status: 'Reported', severity: 'Critical' },
  { id: 'm3', title: 'Deep Crater Near School', category: 'Potholes', lat: 46, lng: 33, ward: 'Ward 2', status: 'AI Verified', severity: 'High' },
  { id: 'm4', title: 'Asphalt Damage', category: 'Potholes', lat: 28, lng: 61, ward: 'Ward 8', status: 'Assigned', severity: 'Critical' },
  { id: 'm5', title: 'Pothole Junction', category: 'Potholes', lat: 51, lng: 35, ward: 'Ward 5', status: 'In Progress', severity: 'High' },

  // Garbage Overflow (Orange)
  { id: 'm6', title: 'Overflowing Bin Market', category: 'Garbage Overflow', lat: 40, lng: 45, ward: 'Ward 5', status: 'Reported', severity: 'High' },
  { id: 'm7', title: 'Illegal Waste Dump', category: 'Garbage Overflow', lat: 20, lng: 55, ward: 'Ward 7', status: 'In Progress', severity: 'High' },
  { id: 'm8', title: 'Commercial Waste Heap', category: 'Garbage Overflow', lat: 60, lng: 52, ward: 'Ward 9', status: 'Assigned', severity: 'Medium' },

  // Broken Streetlights (Yellow)
  { id: 'm9', title: 'Main Highway Dark Zone', category: 'Broken Streetlights', lat: 35, lng: 50, ward: 'Ward 12', status: 'Assigned', severity: 'High' },
  { id: 'm10', title: 'Park Avenue Lights Out', category: 'Broken Streetlights', lat: 46, lng: 42, ward: 'Ward 12', status: 'Reported', severity: 'Medium' },

  // Water Leakage (Blue)
  { id: 'm11', title: 'Main Pipeline Burst', category: 'Water Leakage', lat: 52, lng: 39, ward: 'Ward 3', status: 'In Progress', severity: 'Critical' },
  { id: 'm12', title: 'Hydrant Leakage', category: 'Water Leakage', lat: 30, lng: 39, ward: 'Ward 3', status: 'AI Verified', severity: 'Medium' },

  // Drain Blockage (Purple)
  { id: 'm13', title: 'Park Street Main Drain Blocked', category: 'Drain Blockage', lat: 35, lng: 48, ward: 'Ward 8', status: 'In Progress', severity: 'Critical' },
  { id: 'm14', title: 'Storm Drain Clogged', category: 'Drain Blockage', lat: 46, lng: 48, ward: 'Ward 8', status: 'Assigned', severity: 'High' },

  // Road Cracks (Teal) / Green pins
  { id: 'm15', title: 'Subway Fissure', category: 'Road Cracks', lat: 47, lng: 61, ward: 'Ward 11', status: 'Reported', severity: 'Medium' },
  { id: 'm16', title: 'Bridge Expansion Gap', category: 'Road Cracks', lat: 58, lng: 32, ward: 'Ward 11', status: 'AI Verified', severity: 'Low' },

  // Others
  { id: 'm17', title: 'Fallen Tree Branch', category: 'Others', lat: 38, lng: 31, ward: 'Ward 1', status: 'Resolved', severity: 'Low' },
];

export const PRIORITY_ISSUES: PriorityIssueItem[] = [
  {
    id: 'p1',
    title: 'Pothole',
    category: 'Potholes',
    location: 'MG Road, Ward 14',
    ward: 'Ward 14',
    reportedTime: '1 hr ago',
    estRepairTime: '24 hrs',
    severity: 'Critical',
    score: 94,
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=300&q=80',
    description: 'Deep road crater causing severe traffic slowdown and hazard for two-wheelers.'
  },
  {
    id: 'p2',
    title: 'Drain Blockage',
    category: 'Drain Blockage',
    location: 'Park Street, Ward 8',
    ward: 'Ward 8',
    reportedTime: '2 hrs ago',
    estRepairTime: '12 hrs',
    severity: 'Critical',
    score: 89,
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?auto=format&fit=crop&w=300&q=80',
    description: 'Overflowing storm drain causing waterlogging on main arterial road.'
  },
  {
    id: 'p3',
    title: 'Garbage Overflow',
    category: 'Garbage Overflow',
    location: 'Market Area, Ward 5',
    ward: 'Ward 5',
    reportedTime: '3 hrs ago',
    estRepairTime: '24 hrs',
    severity: 'High',
    score: 76,
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=300&q=80',
    description: 'Waste container completely filled and overflowing onto public walkway.'
  },
  {
    id: 'p4',
    title: 'Broken Streetlight',
    category: 'Broken Streetlights',
    location: 'Varma Street, Ward 12',
    ward: 'Ward 12',
    reportedTime: '4 hrs ago',
    estRepairTime: '48 hrs',
    severity: 'High',
    score: 72,
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=300&q=80',
    description: 'Four consecutive street lamps unpowered creating safety risks at night.'
  },
  {
    id: 'p5',
    title: 'Water Leakage',
    category: 'Water Leakage',
    location: 'Lake View Road, Ward 3',
    ward: 'Ward 3',
    reportedTime: '5 hrs ago',
    estRepairTime: '48 hrs',
    severity: 'Medium',
    score: 61,
    imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=300&q=80',
    description: 'Pressurized water pipe leaking clean municipal water onto residential street.'
  }
];

export const CATEGORY_DATA: CategoryData[] = [
  { name: 'Potholes', percentage: 35, count: 449, color: '#ef4444' },
  { name: 'Garbage Overflow', percentage: 20, count: 256, color: '#f97316' },
  { name: 'Broken Streetlights', percentage: 15, count: 192, color: '#eab308' },
  { name: 'Water Leakage', percentage: 10, count: 128, color: '#3b82f6' },
  { name: 'Drain Blockage', percentage: 10, count: 128, color: '#a855f7' },
  { name: 'Others', percentage: 10, count: 131, color: '#64748b' },
];

export const STATUS_DATA: StatusData[] = [
  { name: 'Reported', percentage: 20, count: 257, color: '#06b6d4' },
  { name: 'AI Verified', percentage: 15, count: 193, color: '#10b981' },
  { name: 'Assigned', percentage: 20, count: 257, color: '#3b82f6' },
  { name: 'In Progress', percentage: 25, count: 321, color: '#eab308' },
  { name: 'Resolved', percentage: 15, count: 193, color: '#22c55e' },
  { name: 'Closed', percentage: 5, count: 63, color: '#0d9488' },
];

export const DEPARTMENT_DATA: DepartmentMetric[] = [
  { name: 'Roads & Transport', percentage: 87, color: '#22c55e' },
  { name: 'Sanitation', percentage: 76, color: '#22c55e' },
  { name: 'Electrical', percentage: 82, color: '#22c55e' },
  { name: 'Water Supply', percentage: 74, color: '#eab308' },
  { name: 'Drainage', percentage: 71, color: '#eab308' },
  { name: 'Waste Management', percentage: 88, color: '#22c55e' },
];

export const ALERTS_DATA: AlertItem[] = [
  {
    id: 'a1',
    title: 'Critical Pothole Detected',
    time: '1 hr ago',
    description: 'High severity pothole detected on MG Road, Ward 14',
    severity: 'critical',
    type: 'Pothole',
    icon: 'alert-triangle'
  },
  {
    id: 'a2',
    title: 'SLA Warning',
    time: '2 hrs ago',
    description: 'Work Order #WO-4521 will breach SLA in 4 hours',
    severity: 'warning',
    type: 'SLA',
    icon: 'alert-triangle'
  },
  {
    id: 'a3',
    title: 'High Flood Risk Prediction',
    time: '3 hrs ago',
    description: 'AI predicts high flood risk in Ward 8 in next 48 hrs',
    severity: 'purple',
    type: 'Prediction',
    icon: 'sparkles'
  },
  {
    id: 'a4',
    title: 'Unresolved Complaint',
    time: '4 hrs ago',
    description: 'Complaint #CM-1024 is unresolved for 72 hours',
    severity: 'info',
    type: 'Complaint',
    icon: 'info'
  }
];

export const NOTIFICATIONS_DATA: NotificationItem[] = [
  { id: 'n1', title: 'Critical Pothole Alert', message: 'High severity pothole detected on MG Road, Ward 14 by AI camera.', time: '10 mins ago', unread: true, type: 'alert' },
  { id: 'n2', title: 'Work Order Updated', message: 'WO-4521 assigned to Electrical Department Team B.', time: '25 mins ago', unread: true, type: 'update' },
  { id: 'n3', title: 'Drainage Clearance', message: 'Park Street main drain clearing in progress by Sanitation team.', time: '1 hr ago', unread: true, type: 'update' },
  { id: 'n4', title: 'AI Risk Prediction', message: 'High waterlogging forecast for Ward 8 over next 48 hrs.', time: '2 hrs ago', unread: true, type: 'alert' },
  { id: 'n5', title: 'System Backup Complete', message: 'Municipal database daily sync completed successfully.', time: '5 hrs ago', unread: false, type: 'system' }
];
