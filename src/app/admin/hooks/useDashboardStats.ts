// hooks/useDashboardStats.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase/client';

// Types
export interface DashboardStats {
  totalPlayers: number;
  newPlayersToday: number;
  newPlayersThisWeek: number;
  activePlayersToday: number;
  activePlayersThisWeek: number;

  totalAlliances: number;
  newAlliancesToday: number;
  totalAllianceMembers: number;
  avgAllianceSize: number;

  totalBattles: number;
  battlesToday: number;
  battlesThisWeek: number;
  battlesByStatus: {
    status: string;
    count: number;
  }[];
  battleCompletionRate: number;

  totalRevenue: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  revenueGrowth: number;
  revenueByType: {
    type: string;
    amount: number;
    percentage: number;
  }[];

  dailyStats: {
    date: string;
    players: number;
    battles: number;
    revenue: number;
  }[];
  weeklyStats: {
    week: string;
    players: number;
    battles: number;
    revenue: number;
  }[];
}

// Shape trả về từ RPC get_dashboard_stats() (chưa có phần revenue).
interface RawDashboardStats {
  totalPlayers: number;
  newPlayersToday: number;
  newPlayersThisWeek: number;
  activePlayersToday: number;
  activePlayersThisWeek: number;
  totalAlliances: number;
  newAlliancesToday: number;
  totalAllianceMembers: number;
  avgAllianceSize: number;
  totalBattles: number;
  battlesToday: number;
  battlesThisWeek: number;
  battleCompletionRate: number;
  battlesByStatus: { status: string; count: number }[];
  dailyStats: { date: string; players: number; battles: number; revenue: number }[];
  weeklyStats: { week: string; players: number; battles: number; revenue: number }[];
}

// ---------------------------------------------------------------------------
// Revenue (fake data — chưa có bảng lưu doanh thu trong DB, giữ logic ở client)
// ---------------------------------------------------------------------------
const BASE_REVENUE = 50000;

const generateDailyRevenue = (days: number): { date: string; revenue: number }[] => {
  const result: { date: string; revenue: number }[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const weekendMultiplier = date.getDay() === 0 || date.getDay() === 6 ? 1.5 : 1;
    const revenue = Math.round(BASE_REVENUE * weekendMultiplier * (0.7 + Math.random() * 0.6));
    result.push({ date: dateStr, revenue });
  }
  return result;
};

const formatDateKey = (isoLike: string): string => isoLike.slice(0, 10);

// ---------------------------------------------------------------------------
// Fetch function — gọi RPC duy nhất (SECURITY DEFINER, bypass RLS)
// ---------------------------------------------------------------------------
const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const { data, error } = await supabase.rpc('get_dashboard_stats');

  if (error) {
    throw error;
  }

  const raw = (data ?? {}) as RawDashboardStats;

  // --- Revenue (fake) ---
  const dailyRevenueData = generateDailyRevenue(30);
  const totalRevenue = dailyRevenueData.reduce((s, d) => s + d.revenue, 0);
  const revenueToday = dailyRevenueData[dailyRevenueData.length - 1]?.revenue || 0;
  const revenueThisWeek = dailyRevenueData.slice(-7).reduce((s, d) => s + d.revenue, 0);
  const revenueThisMonth = totalRevenue;
  const lastWeekRevenue = dailyRevenueData.slice(-14, -7).reduce((s, d) => s + d.revenue, 0);
  const revenueGrowth = lastWeekRevenue > 0
    ? Math.round(((revenueThisWeek - lastWeekRevenue) / lastWeekRevenue) * 100)
    : 0;

  const revenueByType = [
    { type: 'In-app Purchase', amount: Math.round(totalRevenue * 0.45), percentage: 45 },
    { type: 'Subscription', amount: Math.round(totalRevenue * 0.30), percentage: 30 },
    { type: 'Advertising', amount: Math.round(totalRevenue * 0.15), percentage: 15 },
    { type: 'Other', amount: Math.round(totalRevenue * 0.10), percentage: 10 },
  ];

  // merge revenue theo ngày vào dailyStats (khớp theo date)
  const revByDate = new Map(dailyRevenueData.map(d => [d.date, d.revenue]));
  const dailyStats = (raw.dailyStats || []).map(d => ({
    date: d.date,
    players: d.players || 0,
    battles: d.battles || 0,
    revenue: revByDate.get(formatDateKey(d.date)) || 0,
  }));

  const weeklyStats = (raw.weeklyStats || []).map(w => ({
    week: w.week,
    players: w.players || 0,
    battles: w.battles || 0,
    revenue: 0,
  }));

  return {
    totalPlayers: raw.totalPlayers || 0,
    newPlayersToday: raw.newPlayersToday || 0,
    newPlayersThisWeek: raw.newPlayersThisWeek || 0,
    activePlayersToday: raw.activePlayersToday || 0,
    activePlayersThisWeek: raw.activePlayersThisWeek || 0,

    totalAlliances: raw.totalAlliances || 0,
    newAlliancesToday: raw.newAlliancesToday || 0,
    totalAllianceMembers: raw.totalAllianceMembers || 0,
    avgAllianceSize: Math.round(raw.avgAllianceSize || 0),

    totalBattles: raw.totalBattles || 0,
    battlesToday: raw.battlesToday || 0,
    battlesThisWeek: raw.battlesThisWeek || 0,
    battlesByStatus: raw.battlesByStatus || [],
    battleCompletionRate: raw.battleCompletionRate || 0,

    totalRevenue,
    revenueToday,
    revenueThisWeek,
    revenueThisMonth,
    revenueGrowth,
    revenueByType,

    dailyStats,
    weeklyStats,
  };
};

// Custom hook với React Query
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook để refresh data
export const useRefreshDashboardStats = () => {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      return queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
    refreshAndRefetch: async () => {
      await queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      return queryClient.refetchQueries({ queryKey: ['dashboardStats'] });
    }
  };
};

// Helper functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};
