// hooks/services/battleService.ts
import { supabase } from '@/utils/supabase/client';
import { DateRange, BattleStatus } from '../types/dashboard.types';

export interface BattleStats {
  totalBattles: number;
  battlesToday: number;
  battlesThisWeek: number;
  battlesByStatus: BattleStatus[];
  battleCompletionRate: number;
}

export const battleService = {
  /**
   * Lấy tổng số trận đấu
   */
  async getTotalBattles(): Promise<number> {
    const { count } = await supabase
      .from('battles')
      .select('*', { count: 'exact', head: true });

    return count || 0;
  },

  /**
   * Lấy số trận đấu trong ngày
   */
  async getBattlesToday(dateStr: string): Promise<number> {
    const { count } = await supabase
      .from('battles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', dateStr);

    return count || 0;
  },

  /**
   * Lấy số trận đấu trong tuần
   */
  async getBattlesThisWeek(dateStr: string): Promise<number> {
    const { count } = await supabase
      .from('battles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', dateStr);

    return count || 0;
  },

  /**
   * Lấy số trận đấu theo status
   */
  async getBattlesByStatus(): Promise<BattleStatus[]> {
    const { data } = await supabase
      .from('battles')
      .select('status');

    const statusMap: Record<string, number> = {};
    data?.forEach(battle => {
      statusMap[battle.status] = (statusMap[battle.status] || 0) + 1;
    });

    return Object.entries(statusMap).map(([status, count]) => ({
      status,
      count,
    }));
  },

  /**
   * Tính tỷ lệ hoàn thành trận đấu
   */
  async getBattleCompletionRate(): Promise<number> {
    const battlesByStatus = await this.getBattlesByStatus();
    const totalBattles = await this.getTotalBattles();

    const completed = battlesByStatus.find(b => b.status === 'completed')?.count || 0;
    const total = totalBattles || 1;

    return Math.round((completed / total) * 100);
  },

  /**
   * Lấy số trận đấu theo ngày
   */
  async getBattlesByDate(dateRange: DateRange): Promise<number> {
    const { count } = await supabase
      .from('battles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', dateRange.start)
      .lt('created_at', dateRange.end);

    return count || 0;
  },

  /**
   * Lấy tất cả battle stats
   */
  async getAllBattleStats(todayStr: string, weekAgoStr: string): Promise<BattleStats> {
    const [totalBattles, battlesToday, battlesThisWeek, battlesByStatus, completionRate] = await Promise.all([
      this.getTotalBattles(),
      this.getBattlesToday(todayStr),
      this.getBattlesThisWeek(weekAgoStr),
      this.getBattlesByStatus(),
      this.getBattleCompletionRate()
    ]);

    return {
      totalBattles,
      battlesToday,
      battlesThisWeek,
      battlesByStatus,
      battleCompletionRate: completionRate
    };
  }
};
