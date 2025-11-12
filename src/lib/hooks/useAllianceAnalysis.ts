import { useQuery } from '@tanstack/react-query';
import { allianceService } from './admin/allianceService';
import { supabase } from '@/utils/supabase/client';

// ===============================
// Interfaces
// ===============================


export interface AllianceMetrics {
    totalAlliances: number;
    activeAlliances: number;
    totalMembers: number;
    totalPower: number;
    avgWinRate: number;
    totalVictoryPoints: number;
    avgMembersPerAlliance: number;
    avgPowerPerAlliance: number;
    growthRate: number;
}

export interface AllianceTrend {
    date: string;
    totalAlliances: number;
    totalMembers: number;
    totalPower: number;
    avgWinRate: number;
}

export interface PowerDistribution {
    range: string;
    count: number;
    percentage: number;
}

export interface LevelDistribution {
    level: number;
    count: number;
    percentage: number;
}

// ===============================
// Hooks
// ===============================

export interface AllianceMetricsData {
    totalAlliances: number;
    activeAlliances: number;
    totalMembers: number;
    totalPower: number;
    avgWinRate: number; // percent, e.g., 74
}


export const useAllianceMetrics = () => {
    return useQuery<AllianceMetricsData, Error>({
        queryKey: ['alliance-metrics'],
        queryFn: async () => {
            const { data, error } = await supabase.rpc('get_alliance_metrics');
            if (error) throw error;

            if (!data || data.length === 0) {
                throw new Error('No metrics data returned');
            }

            // Convert avgWinRate to percentage if needed
            const metrics = data[0] as any;
            return {
                totalAlliances: metrics.totalalliances,
                activeAlliances: metrics.activealliances,
                totalMembers: metrics.totalmembers,
                totalPower: metrics.totalpower,
                avgWinRate: metrics.avgwinrate * 100, // convert 0.74 -> 74
            };
        },
        refetchInterval: 30000, // refresh every 30 seconds
    });
};
//export const useAllianceTrends = (timeRange: '7d' | '30d' | '90d' = '30d') => {
//    return useQuery({
//        queryKey: ['alliance-trends', timeRange],
//        queryFn: async (): Promise<AllianceTrend[]> => {
//            return generateTrendData(timeRange);
//        },
//    });
//};
//
//export const usePowerDistribution = () => {
//    return useQuery({
//        queryKey: ['power-distribution'],
//        queryFn: async (): Promise<PowerDistribution[]> => {
//            const { data } = await allianceService.getAlliances(0, 1000);
//            const alliances: Alliance[] = data?.data || [];
//
//            const ranges = [
//                { min: 0, max: 100000, label: '0-100K' },
//                { min: 100000, max: 500000, label: '100K-500K' },
//                { min: 500000, max: 1000000, label: '500K-1M' },
//                { min: 1000000, max: 5000000, label: '1M-5M' },
//                { min: 5000000, max: Infinity, label: '5M+' },
//            ];
//
//            return ranges.map(range => {
//                const count = alliances.filter(
//                    a => a.total_power >= range.min && a.total_power < range.max
//                ).length;
//                return {
//                    range: range.label,
//                    count,
//                    percentage: alliances.length ? (count / alliances.length) * 100 : 0,
//                };
//            });
//        },
//    });
//};
//
//export const useLevelDistribution = () => {
//    return useQuery({
//        queryKey: ['level-distribution'],
//        queryFn: async (): Promise<LevelDistribution[]> => {
//            const { data } = await allianceService.getAlliances(0, 1000);
//            const alliances: Alliance[] = data?.data || [];
//
//            const levelCounts: Record<number, number> = {};
//            alliances.forEach(a => {
//                levelCounts[a.level] = (levelCounts[a.level] || 0) + 1;
//            });
//
//            return Object.entries(levelCounts)
//                .map(([level, count]) => ({
//                    level: parseInt(level, 10),
//                    count,
//                    percentage: alliances.length ? (count / alliances.length) * 100 : 0,
//                }))
//                .sort((a, b) => a.level - b.level);
//        },
//    });
//};
//
//export const useWinRateAnalysis = () => {
//    return useQuery({
//        queryKey: ['winrate-analysis'],
//        queryFn: async () => {
//            const { data } = await allianceService.getAlliances(0, 1000);
//            const alliances: Alliance[] = data?.data || [];
//
//            const winRateRanges = [
//                { min: 0, max: 20, label: '0-20%' },
//                { min: 20, max: 40, label: '20-40%' },
//                { min: 40, max: 60, label: '40-60%' },
//                { min: 60, max: 80, label: '60-80%' },
//                { min: 80, max: 100, label: '80-100%' },
//            ];
//
//            return winRateRanges.map(range => {
//                const count = alliances.filter(
//                    a => a.win_rate >= range.min && a.win_rate < range.max
//                ).length;
//                return {
//                    range: range.label,
//                    count,
//                    percentage: alliances.length ? (count / alliances.length) * 100 : 0,
//                };
//            });
//        },
//    });
//};
//
//export const useTopPerformingAlliances = (limit = 10) => {
//    return useQuery({
//        queryKey: ['top-performing-alliances', limit],
//        queryFn: async () => {
//            const { data } = await allianceService.getAlliances(0, 1000);
//            const alliances: Alliance[] = data?.data || [];
//
//            return alliances
//                .sort((a, b) => calculatePerformanceScore(b) - calculatePerformanceScore(a))
//                .slice(0, limit);
//        },
//    });
//};
//
//export const useAllianceComparison = (allianceId1: string, allianceId2: string) => {
//    return useQuery({
//        queryKey: ['alliance-comparison', allianceId1, allianceId2],
//        queryFn: async () => {
//            const [res1, res2] = await Promise.all([
//                allianceService.getAllianceById(allianceId1),
//                allianceService.getAllianceById(allianceId2),
//            ]);
//
//            const alliance1: Alliance = res1.data;
//            const alliance2: Alliance = res2.data;
//
//            return {
//                alliance1,
//                alliance2,
//                comparison: {
//                    powerDifference: alliance1.total_power - alliance2.total_power,
//                    memberDifference: alliance1.members - alliance2.members,
//                    winRateDifference: alliance1.win_rate - alliance2.win_rate,
//                    levelDifference: alliance1.level - alliance2.level,
//                },
//            };
//        },
//        enabled: !!allianceId1 && !!allianceId2,
//    });
//};
//
//// ===============================
//// Utility functions
//// ===============================
//
//const calculateGrowthRate = (alliances: Alliance[], timeRange: string): number => {
//    const baseRates = {
//        '7d': 2.5,
//        '30d': 8.7,
//        '90d': 15.2,
//    };
//    return baseRates[timeRange as keyof typeof baseRates] || 5.0;
//};
//
//const calculatePerformanceScore = (alliance: Alliance): number => {
//    const weights = {
//        winRate: 0.4,
//        powerPerMember: 0.3,
//        victoryPoints: 0.2,
//        level: 0.1,
//    };
//
//    const powerPerMember = alliance.members > 0 ? alliance.total_power / alliance.members : 0;
//
//    return (
//        alliance.win_rate * weights.winRate +
//        (powerPerMember / 10000) * weights.powerPerMember +
//        alliance.victory_points * weights.victoryPoints +
//        alliance.level * weights.level
//    );
//};
//
//const generateTrendData = (timeRange: string): AllianceTrend[] => {
//    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
//    const data: AllianceTrend[] = [];
//
//    const baseAlliances = 150;
//    const baseMembers = 4500;
//    const basePower = 250_000_000;
//    const baseWinRate = 45.5;
//
//    for (let i = days; i >= 0; i--) {
//        const date = new Date();
//        date.setDate(date.getDate() - i);
//
//        const growthFactor = 1 + i * 0.01;
//        const fluctuation = Math.sin(i * 0.5) * 0.1;
//
//        data.push({
//            date: date.toISOString().split('T')[0],
//            totalAlliances: Math.round(baseAlliances * growthFactor + Math.random() * 10),
//            totalMembers: Math.round(baseMembers * growthFactor + Math.random() * 100),
//            totalPower: Math.round(basePower * growthFactor + Math.random() * 10_000_000),
//            avgWinRate: baseWinRate + fluctuation + Math.random() * 2,
//        });
//    }
//
//    return data;
//};
//
