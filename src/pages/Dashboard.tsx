import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { MetricsGrid } from '../components/dashboard/MetricsGrid';
import { LiveCityMap } from '../components/dashboard/LiveCityMap';
import { PriorityIssues } from '../components/dashboard/PriorityIssues';
import { CategoryChart } from '../components/dashboard/CategoryChart';
import { StatusChart } from '../components/dashboard/StatusChart';
import { DepartmentPerformance } from '../components/dashboard/DepartmentPerformance';
import { InfrastructureHealth } from '../components/dashboard/InfrastructureHealth';

import { MAP_MARKERS, PRIORITY_ISSUES } from '../data/dashboardData';
import type { PriorityIssueItem, MapMarker, AlertItem } from '../types/dashboard';

interface OutletContextType {
  setActiveModalIssue: (issue: PriorityIssueItem | MapMarker | AlertItem | null) => void;
}

export function Dashboard() {
  const { setActiveModalIssue } = useOutletContext<OutletContextType>();

  return (
    <div className="space-y-6">
      {/* 1. Top Key Performance Indicators Grid */}
      <section aria-label="Key Performance Indicators">
        <MetricsGrid 
          onSelectMetric={(id) => {
            console.log('Selected metric:', id);
          }}
        />
      </section>

      {/* 2. Middle Row 1: Live City Map & Priority Issues */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Live City Map (2 Columns wide on desktop) */}
        <div className="lg:col-span-2 min-h-[440px]">
          <LiveCityMap
            markers={MAP_MARKERS}
            onSelectMarker={(marker) => setActiveModalIssue(marker)}
          />
        </div>

        {/* Priority Issues List (1 Column on desktop) */}
        <div className="lg:col-span-1 min-h-[440px]">
          <PriorityIssues
            issues={PRIORITY_ISSUES}
            onSelectIssue={(issue) => setActiveModalIssue(issue)}
          />
        </div>
      </section>

      {/* 3. Middle Row 2: 4 Data Cards (Categories, Statuses, Depts, Health Index) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        <CategoryChart />
        <StatusChart />
        <DepartmentPerformance />
        <InfrastructureHealth />
      </section>
    </div>
  );
}

export default Dashboard;
