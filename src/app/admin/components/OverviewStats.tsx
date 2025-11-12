import React from 'react';
import StatsCard from '@/components/admin/ui/StatsCard';

interface OverviewStatsProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export default function OverviewStats(props: OverviewStatsProps) {
    return <StatsCard {...props} />;
}
