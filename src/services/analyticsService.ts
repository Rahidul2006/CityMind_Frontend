import { API_BASE_URL } from '../config/api';

export interface AnalyticsKPIs {
  totalIssues: number;
  resolvedIssues: number;
  inProgressIssues: number;
  pendingIssues: number;
  resolutionRate: number;
  avgResolutionTimeHours: number;
  slaCompliance: number;
}

export interface VolumeTrendPoint {
  date: string;
  reported: number;
  resolved: number;
}

export interface DepartmentPerformanceItem {
  id: string;
  name: string;
  code: string;
  activeTasks: number;
  completedTasks: number;
  resolutionRate: number;
  satisfaction: number;
}

export interface CategoryDistributionItem {
  category: string;
  count: number;
  percentage: number;
  color?: string;
}

export interface WardHotspotItem {
  id: string;
  name: string;
  issues: number;
  severity: string;
  topCategory: string;
  resolutionRate: string;
}

export interface AnalyticsOverviewData {
  timeframe: string;
  lastUpdated: string;
  kpis: AnalyticsKPIs;
  volumeTrends: VolumeTrendPoint[];
  departmentPerformance: DepartmentPerformanceItem[];
  categoryDistribution: CategoryDistributionItem[];
  wardHotspots: WardHotspotItem[];
}

export const fetchAnalyticsOverview = async (
  timeframe: string = '30d',
  department: string = 'All',
  ward: string = 'All'
): Promise<AnalyticsOverviewData> => {
  try {
    const query = new URLSearchParams({
      timeframe,
      department,
      ward,
    }).toString();

    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/analytics/overview?${query}`, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch analytics: ${response.statusText}`);
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('[Analytics API] Error fetching overview data:', error);
    // Return clean zero/empty structure on error
    return {
      timeframe,
      lastUpdated: new Date().toISOString(),
      kpis: {
        totalIssues: 0,
        resolvedIssues: 0,
        inProgressIssues: 0,
        pendingIssues: 0,
        resolutionRate: 0,
        avgResolutionTimeHours: 0,
        slaCompliance: 0,
      },
      volumeTrends: [],
      departmentPerformance: [],
      categoryDistribution: [],
      wardHotspots: [],
    };
  }
};

export const downloadAnalyticsReport = () => {
  const token = localStorage.getItem('token');
  const query = token ? `?token=${encodeURIComponent(token)}` : '';
  window.open(`${API_BASE_URL}/api/analytics/export${query}`, '_blank');
};
