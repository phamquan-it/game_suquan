// src/components/admin/ui/OverviewStats.tsx
'use client';

import StatsCard from '@/components/admin/ui/StatsCard';
import React from 'react';

interface OverviewStatsProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  extra?: React.ReactNode;
  loading?: boolean;
  subtitle?: string;
  progress?: {
    percent: number;
    status?: 'success' | 'exception' | 'normal' | 'active';
  };
  tooltip?: string;
  formatValue?: (value: string | number) => string;
}

export default function OverviewStats(props: OverviewStatsProps) {
  return <StatsCard {...props} />;
}
