// hooks/services/allianceService.ts
import { supabase } from '@/utils/supabase/client';

export interface AllianceStats {
  totalAlliances: number;
  newAlliancesToday: number;
  totalAllianceMembers: number;
  avgAllianceSize: number;
}

export const allianceService = {
  /**
   * Lấy tổng số liên minh
   */
  async getTotalAlliances(): Promise<number> {
    const { count } = await supabase
      .from('alliances')
      .select('*', { count: 'exact', head: true });

    return count || 0;
  },

  /**
   * Lấy số liên minh mới trong ngày
   */
  async getNewAlliancesToday(dateStr: string): Promise<number> {
    const { count } = await supabase
      .from('alliances')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', dateStr);

    return count || 0;
  },

  /**
   * Lấy thành viên của các liên minh
   */
  async getAllianceMembers(): Promise<{ alliance_id: string }[]> {
    const { data } = await supabase
      .from('alliance_members')
      .select('alliance_id', { count: 'exact' });

    return data || [];
  },

  /**
   * Tính kích thước trung bình của liên minh
   */
  async getAverageAllianceSize(): Promise<number> {
    const members = await this.getAllianceMembers();
    const totalMembers = members.length;

    if (totalMembers === 0) return 0;

    const allianceIds = new Set(members.map(m => m.alliance_id));
    return Math.round(totalMembers / allianceIds.size);
  },

  /**
   * Lấy tất cả alliance stats
   */
  async getAllAllianceStats(todayStr: string): Promise<AllianceStats> {
    const [totalAlliances, newAlliancesToday, avgAllianceSize] = await Promise.all([
      this.getTotalAlliances(),
      this.getNewAlliancesToday(todayStr),
      this.getAverageAllianceSize()
    ]);

    const members = await this.getAllianceMembers();

    return {
      totalAlliances,
      newAlliancesToday,
      totalAllianceMembers: members.length,
      avgAllianceSize
    };
  }
};
