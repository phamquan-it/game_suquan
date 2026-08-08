// src/app/admin/hooks/useDashboardStats.ts
import { useEffect, useState, useCallback } from 'react';
import { message } from 'antd';
import { supabase } from '@/utils/supabase/client';

// Types
export interface DashboardStats {
  // Player stats
  totalPlayers: number;
  newPlayersToday: number;
  newPlayersThisWeek: number;
  activePlayersToday: number;
  activePlayersThisWeek: number;
  
  // Alliance stats
  totalAlliances: number;
  newAlliancesToday: number;
  totalAllianceMembers: number;
  avgAllianceSize: number;
  
  // Battle stats
  totalBattles: number;
  battlesToday: number;
  battlesThisWeek: number;
  battlesByStatus: {
    status: string;
    count: number;
  }[];
  battleCompletionRate: number;
  
  // Revenue stats (fake data)
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
  
  // Trend data
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

// Helper để tạo fake revenue data
const generateFakeRevenue = (baseAmount: number = 1000): number => {
  const variance = 0.3; // 30% variance
  const randomFactor = 1 + (Math.random() - 0.5) * 2 * variance;
  return Math.round(baseAmount * randomFactor);
};

// Helper để tạo fake revenue data theo ngày
const generateDailyRevenue = (days: number): { date: string; revenue: number }[] => {
  const result = [];
  const now = new Date();
  const baseRevenue = 50000;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    // Doanh thu thay đổi theo ngày trong tuần (cuối tuần cao hơn)
    const dayOfWeek = date.getDay();
    const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 1.5 : 1;
    const revenue = Math.round(baseRevenue * weekendMultiplier * (0.7 + Math.random() * 0.6));
    result.push({ date: dateStr, revenue });
  }
  return result;
};

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString();
      
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString();

      // ============================================================
      // 1. PLAYER STATS
      // ============================================================
      
      // Tổng số người chơi
      const { count: totalPlayers } = await supabase
        .from('players')
        .select('*', { count: 'exact', head: true });

      // Người chơi mới hôm nay
      const { count: newPlayersToday } = await supabase
        .from('players')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayStr);

      // Người chơi mới trong tuần
      const { count: newPlayersThisWeek } = await supabase
        .from('players')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgoStr);

      // Người chơi active hôm nay (có battle hôm nay)
      const { data: activePlayersTodayData } = await supabase
        .from('battles')
        .select('player1_id, player2_id')
        .gte('created_at', todayStr);

      const activePlayerIds = new Set<string>();
      activePlayersTodayData?.forEach(battle => {
        if (battle.player1_id) activePlayerIds.add(battle.player1_id);
        if (battle.player2_id) activePlayerIds.add(battle.player2_id);
      });
      const activePlayersToday = activePlayerIds.size;

      // Người chơi active trong tuần
      const { data: activePlayersWeekData } = await supabase
        .from('battles')
        .select('player1_id, player2_id')
        .gte('created_at', weekAgoStr);

      const activePlayerIdsWeek = new Set<string>();
      activePlayersWeekData?.forEach(battle => {
        if (battle.player1_id) activePlayerIdsWeek.add(battle.player1_id);
        if (battle.player2_id) activePlayerIdsWeek.add(battle.player2_id);
      });
      const activePlayersThisWeek = activePlayerIdsWeek.size;

      // ============================================================
      // 2. ALLIANCE STATS
      // ============================================================
      
      // Tổng số liên minh
      const { count: totalAlliances } = await supabase
        .from('alliances')
        .select('*', { count: 'exact', head: true });

      // Liên minh mới hôm nay
      const { count: newAlliancesToday } = await supabase
        .from('alliances')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayStr);

      // Tổng số thành viên liên minh
      const { data: allianceMembers } = await supabase
        .from('alliance_members')
        .select('alliance_id', { count: 'exact' });

      const totalAllianceMembers = allianceMembers?.length || 0;

      // Số liên minh có thành viên
      const allianceIds = new Set(allianceMembers?.map(m => m.alliance_id) || []);
      const avgAllianceSize = allianceIds.size > 0 
        ? Math.round(totalAllianceMembers / allianceIds.size) 
        : 0;

      // ============================================================
      // 3. BATTLE STATS
      // ============================================================
      
      // Tổng số trận đấu
      const { count: totalBattles } = await supabase
        .from('battles')
        .select('*', { count: 'exact', head: true });

      // Trận đấu hôm nay
      const { count: battlesToday } = await supabase
        .from('battles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayStr);

      // Trận đấu trong tuần
      const { count: battlesThisWeek } = await supabase
        .from('battles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgoStr);

      // Trận đấu theo status
      const { data: battlesByStatusData } = await supabase
        .from('battles')
        .select('status');

      const statusMap: Record<string, number> = {};
      battlesByStatusData?.forEach(battle => {
        statusMap[battle.status] = (statusMap[battle.status] || 0) + 1;
      });

      const battlesByStatus = Object.entries(statusMap).map(([status, count]) => ({
        status,
        count,
      }));

      // Tỷ lệ hoàn thành trận đấu
      const completed = statusMap['completed'] || 0;
      const total = totalBattles || 1;
      const battleCompletionRate = Math.round((completed / total) * 100);

      // ============================================================
      // 4. REVENUE STATS (FAKE DATA)
      // ============================================================
      
      // Tạo fake revenue data
      const dailyRevenueData = generateDailyRevenue(30);
      
      const totalRevenue = dailyRevenueData.reduce((sum, d) => sum + d.revenue, 0);
      
      // Revenue hôm nay
      const todayRevenue = dailyRevenueData[dailyRevenueData.length - 1]?.revenue || 0;
      
      // Revenue tuần này (7 ngày gần nhất)
      const weekRevenue = dailyRevenueData.slice(-7).reduce((sum, d) => sum + d.revenue, 0);
      
      // Revenue tháng này
      const monthRevenue = dailyRevenueData.reduce((sum, d) => sum + d.revenue, 0);
      
      // Revenue growth (so với tuần trước)
      const lastWeekRevenue = dailyRevenueData.slice(-14, -7).reduce((sum, d) => sum + d.revenue, 0);
      const revenueGrowth = lastWeekRevenue > 0 
        ? Math.round(((weekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100) 
        : 0;

      // Revenue by type (fake)
      const revenueByType = [
        { type: 'In-app Purchase', amount: Math.round(totalRevenue * 0.45), percentage: 45 },
        { type: 'Subscription', amount: Math.round(totalRevenue * 0.30), percentage: 30 },
        { type: 'Advertising', amount: Math.round(totalRevenue * 0.15), percentage: 15 },
        { type: 'Other', amount: Math.round(totalRevenue * 0.10), percentage: 10 },
      ];

      // ============================================================
      // 5. DAILY STATS (Combine data)
      // ============================================================
      
      // Lấy daily stats từ battles và players
      const dailyStats = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dateStart = date.toISOString();
        const dateEnd = new Date(date);
        dateEnd.setDate(dateEnd.getDate() + 1);
        const dateEndStr = dateEnd.toISOString();

        // Số players mới trong ngày
        const { count: dailyPlayers } = await supabase
          .from('players')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', dateStart)
          .lt('created_at', dateEndStr);

        // Số battles trong ngày
        const { count: dailyBattles } = await supabase
          .from('battles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', dateStart)
          .lt('created_at', dateEndStr);

        const dailyRevenue = dailyRevenueData.find(d => d.date === dateStr)?.revenue || 0;

        dailyStats.push({
          date: dateStr,
          players: dailyPlayers || 0,
          battles: dailyBattles || 0,
          revenue: dailyRevenue,
        });
      }

      // ============================================================
      // 6. WEEKLY STATS
      // ============================================================
      
      const weeklyStats = [];
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - (i * 7 + 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        
        const weekStartStr = weekStart.toISOString();
        const weekEndStr = weekEnd.toISOString();
        const weekLabel = `Tuần ${4 - i}`;

        const { count: weeklyPlayers } = await supabase
          .from('players')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', weekStartStr)
          .lt('created_at', weekEndStr);

        const { count: weeklyBattles } = await supabase
          .from('battles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', weekStartStr)
          .lt('created_at', weekEndStr);

        const weekRevenue = dailyRevenueData
          .filter(d => {
            const dDate = new Date(d.date);
            return dDate >= weekStart && dDate < weekEnd;
          })
          .reduce((sum, d) => sum + d.revenue, 0);

        weeklyStats.push({
          week: weekLabel,
          players: weeklyPlayers || 0,
          battles: weeklyBattles || 0,
          revenue: weekRevenue,
        });
      }

      // ============================================================
      // 7. SET STATS
      // ============================================================
      
      setStats({
        // Player stats
        totalPlayers: totalPlayers || 0,
        newPlayersToday: newPlayersToday || 0,
        newPlayersThisWeek: newPlayersThisWeek || 0,
        activePlayersToday: activePlayersToday || 0,
        activePlayersThisWeek: activePlayersThisWeek || 0,
        
        // Alliance stats
        totalAlliances: totalAlliances || 0,
        newAlliancesToday: newAlliancesToday || 0,
        totalAllianceMembers: totalAllianceMembers || 0,
        avgAllianceSize: avgAllianceSize || 0,
        
        // Battle stats
        totalBattles: totalBattles || 0,
        battlesToday: battlesToday || 0,
        battlesThisWeek: battlesThisWeek || 0,
        battlesByStatus: battlesByStatus || [],
        battleCompletionRate: battleCompletionRate || 0,
        
        // Revenue stats
        totalRevenue: totalRevenue || 0,
        revenueToday: todayRevenue || 0,
        revenueThisWeek: weekRevenue || 0,
        revenueThisMonth: monthRevenue || 0,
        revenueGrowth: revenueGrowth || 0,
        revenueByType: revenueByType || [],
        
        // Trend data
        dailyStats: dailyStats || [],
        weeklyStats: weeklyStats || [],
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Không thể tải dữ liệu thống kê');
      message.error('Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Refresh function
  const refresh = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh,
  };
};

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function to format number
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};
