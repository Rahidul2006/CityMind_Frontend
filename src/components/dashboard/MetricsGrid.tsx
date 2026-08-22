import React from 'react';
import { METRICS_DATA } from '../../data/dashboardData';
import { MetricCard } from './MetricCard';
import type { MetricData } from '../../types/dashboard';

interface MetricsGridProps {
  metrics?: MetricData[];
  onSelectMetric?: (metricId: string) => void;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics, onSelectMetric }) => {
  const displayMetrics = metrics || METRICS_DATA;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {displayMetrics.map((metric) => (
        <MetricCard 
          key={metric.id} 
          data={metric} 
          onClick={() => onSelectMetric?.(metric.id)}
        />
      ))}
    </div>
  );
};
