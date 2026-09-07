// hooks/services/playerService.ts
import { supabase } from '@/utils/supabase/client';
import { DateRange } from '../types/dashboard.types';

export interface PlayerStats {
  totalPlayers: number;
  newPlayersToday: number;
  newPlayersThisWeek: number;
  activePlayersToday: number;
  activePlayersThisWeek: number;
}

export const playerService = {
  /**
   * Lấy tổng số người chơi
   */
  async getTotalPlayers(): Promise<number> {
    const { count } = await supabase
      .from('players')
      .select('*', { count: 'exact', head: true });

    return count || 0;
  },

  /**
   * Lấy số người chơi mới trong ngày
   */
  async getNewPlayersToday(dateStr: string): Promise<number> {
    const { count } = await supabase
      .from('players')
      .select('*', { count: 'exact', head: true })
      .gte('registration_date', dateStr);

    return count || 0;
  },

  /**
   * Lấy số người chơi mới trong tuần
   */
  async getNewPlayersThisWeek(dateStr: string): Promise<number> {
    const { count } = await supabase
      .from('players')
      .select('*', { count: 'exact', head: true })
      .gte('registration_date', dateStr);

    return count || 0;
  },

  /**
   * Lấy người chơi active theo date range
   */
  async getActivePlayers(dateRange: DateRange): Promise<Set<string>> {
    const { data } = await supabase
      .from('battles')
      .select('player1_id, player2_id')
      .gte('created_at', dateRange.start)
      .lt('created_at', dateRange.end);

    const activePlayerIds = new Set<string>();
    data?.forEach(battle => {
      if (battle.player1_id) activePlayerIds.add(battle.player1_id);
      if (battle.player2_id) activePlayerIds.add(battle.player2_id);
    });

    return activePlayerIds;
  },

  /**
   * Lấy số người chơi mới theo ngày
   */
  async getPlayersByDate(dateRange: DateRange): Promise<number> {
    const { count } = await supabase
      .from('players')
      .select('*', { count: 'exact', head: true })
      .gte('registration_date', dateRange.start)
      .lt('registration_date', dateRange.end);

    return count || 0;
  },

  /**
   * Lấy tất cả player stats
   */
  async getAllPlayerStats(todayStr: string, weekAgoStr: string): Promise<PlayerStats> {
    const [
      totalPlayers,
      newPlayersToday,
      newPlayersThisWeek,
      activeTodaySet,
      activeWeekSet
    ] = await Promise.all([
      this.getTotalPlayers(),
      this.getNewPlayersToday(todayStr),
      this.getNewPlayersThisWeek(weekAgoStr),
      this.getActivePlayers({ start: todayStr, end: new Date().toISOString() }),
      this.getActivePlayers({ start: weekAgoStr, end: new Date().toISOString() })
    ]);

    return {
      totalPlayers,
      newPlayersToday,
      newPlayersThisWeek,
      activePlayersToday: activeTodaySet.size,
      activePlayersThisWeek: activeWeekSet.size
    };
  }
};
