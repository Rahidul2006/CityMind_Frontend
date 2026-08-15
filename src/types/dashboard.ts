export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type IssueCategory = 
  | 'Potholes'
  | 'Garbage Overflow'
  | 'Broken Streetlights'
  | 'Water Leakage'
  | 'Drain Blockage'
  | 'Road Cracks'
  | 'Others';

export type IssueStatus = 
  | 'Reported'
  | 'AI Verified'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Closed';

export interface MetricData {
  id: string;
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  type: 'increase' | 'decrease';
  icon: string;
  iconBg: string;
  iconColor: string;
}

export interface MapMarker {
  id: string;
  title: string;
  category: IssueCategory;
  lat: number; // percentage offset X for vector map
  lng: number; // percentage offset Y for vector map
  ward: string;
  status: IssueStatus;
  severity: SeverityLevel;
}

export interface PriorityIssueItem {
  id: string;
  title: string;
  category: IssueCategory;
  location: string;
  ward: string;
  reportedTime: string;
  estRepairTime: string;
  severity: SeverityLevel;
  score: number;
  imageUrl: string;
  description: string;
}

export interface CategoryData {
  name: IssueCategory;
  percentage: number;
  count: number;
  color: string;
}

export interface StatusData {
  name: IssueStatus;
  percentage: number;
  count: number;
  color: string;
}

export interface DepartmentMetric {
  name: string;
  percentage: number;
  color: string;
}

export interface AlertItem {
  id: string;
  title: string;
  time: string;
  description: string;
  severity: 'critical' | 'warning' | 'purple' | 'info';
  type: 'Pothole' | 'SLA' | 'Prediction' | 'Complaint';
  icon: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'alert' | 'update' | 'system';
}
