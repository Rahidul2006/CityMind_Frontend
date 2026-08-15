import React from 'react';
import { METRICS_DATA } from '../../data/dashboardData';
import { MetricCard } from './MetricCard';

interface MetricsGridProps {
  onSelectMetric?: (metricId: string) => void;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ onSelectMetric }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
      {METRICS_DATA.map((metric) => (
        <MetricCard 
          key={metric.id} 
          data={metric} 
          onClick={() => onSelectMetric?.(metric.id)}
        />
      ))}
    </div>
  );
};
