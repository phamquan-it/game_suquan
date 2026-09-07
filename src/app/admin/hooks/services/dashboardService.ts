// hooks/services/dashboardService.ts
import { DashboardStats, DailyData } from '../types/dashboard.types';
import { playerService } from './playerService';
import { allianceService } from './allianceService';
import { battleService } from './battleService';
import { revenueService } from './revenueService';

/**
 * Helper để tạo date range
 */
const getDateRange = (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return {
    start: start.toISOString(),
    end: end.toISOString()
  };
};

/**
 * Helper để lấy ngày bắt đầu và kết thúc của tuần
 */
const getWeekRange = (weekOffset: number) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - (weekOffset * 7 + 7));
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  return {
    start: weekStart.toISOString(),
    end: weekEnd.toISOString()
  };
};

export const dashboardService = {
  /**
   * Lấy daily stats (combine từ các services)
   */
  async getDailyStats(days: number): Promise<DailyData[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const revenueData = revenueService.generateDailyRevenue(days);
    const dailyStats: DailyData[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toISOString().split('T')[0];

      const { start, end } = getDateRange(date);

      const [dailyPlayers, dailyBattles] = await Promise.all([
        playerService.getPlayersByDate({ start, end }),
        battleService.getBattlesByDate({ start, end })
      ]);

      const dailyRevenue = revenueData.find(d => d.date === dateStr)?.revenue || 0;

      dailyStats.push({
        date: dateStr,
        players: dailyPlayers,
        battles: dailyBattles,
        revenue: dailyRevenue
      });
    }

    return dailyStats;
  },

  /**
   * Lấy weekly stats
   */
  async getWeeklyStats(weeks: number = 4): Promise<{
    week: string;
    players: number;
    battles: number;
    revenue: number;
  }[]> {
    const weeklyStats = [];
    const revenueData = revenueService.generateDailyRevenue(30);

    for (let i = weeks - 1; i >= 0; i--) {
      const { start, end } = getWeekRange(i);
      const weekLabel = `Tuần ${weeks - i}`;

      const [weeklyPlayers, weeklyBattles] = await Promise.all([
        playerService.getPlayersByDate({ start, end }),
        battleService.getBattlesByDate({ start, end })
      ]);

      const weekStartDate = new Date(start);
      const weekEndDate = new Date(end);
      const weekRevenue = revenueData
        .filter(d => {
          const dDate = new Date(d.date);
          return dDate >= weekStartDate && dDate < weekEndDate;
        })
        .reduce((sum, d) => sum + d.revenue, 0);

      weeklyStats.push({
        week: weekLabel,
        players: weeklyPlayers,
        battles: weeklyBattles,
        revenue: weekRevenue
      });
    }

    return weeklyStats;
  },

  /**
   * Lấy tất cả dashboard stats
   */
  async getAllDashboardStats(): Promise<DashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString();

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);
    const weekAgoStr = weekAgo.toISOString();

    // Lấy tất cả stats song song
    const [
      playerStats,
      allianceStats,
      battleStats,
      revenueStats,
      dailyStats,
      weeklyStats
    ] = await Promise.all([
      playerService.getAllPlayerStats(todayStr, weekAgoStr),
      allianceService.getAllAllianceStats(todayStr),
      battleService.getAllBattleStats(todayStr, weekAgoStr),
      Promise.resolve(revenueService.getAllRevenueStats()),
      this.getDailyStats(30),
      this.getWeeklyStats(4)
    ]);

    return {
      // Player stats
      totalPlayers: playerStats.totalPlayers,
      newPlayersToday: playerStats.newPlayersToday,
      newPlayersThisWeek: playerStats.newPlayersThisWeek,
      activePlayersToday: playerStats.activePlayersToday,
      activePlayersThisWeek: playerStats.activePlayersThisWeek,

      // Alliance stats
      totalAlliances: allianceStats.totalAlliances,
      newAlliancesToday: allianceStats.newAlliancesToday,
      totalAllianceMembers: allianceStats.totalAllianceMembers,
      avgAllianceSize: allianceStats.avgAllianceSize,

      // Battle stats
      totalBattles: battleStats.totalBattles,
      battlesToday: battleStats.battlesToday,
      battlesThisWeek: battleStats.battlesThisWeek,
      battlesByStatus: battleStats.battlesByStatus,
      battleCompletionRate: battleStats.battleCompletionRate,

      // Revenue stats
      totalRevenue: revenueStats.totalRevenue,
      revenueToday: revenueStats.todayRevenue,
      revenueThisWeek: revenueStats.weekRevenue,
      revenueThisMonth: revenueStats.monthRevenue,
      revenueGrowth: revenueStats.revenueGrowth,
      revenueByType: revenueStats.revenueByType,

      // Trend data
      dailyStats: dailyStats,
      weeklyStats: weeklyStats
    };
  }
};
