// hooks/services/revenueService.ts
import { RevenueData, RevenueByType } from '../types/dashboard.types';

// Helper để tạo fake revenue data
const generateFakeRevenue = (baseAmount: number = 1000): number => {
  const variance = 0.3;
  const randomFactor = 1 + (Math.random() - 0.5) * 2 * variance;
  return Math.round(baseAmount * randomFactor);
};

export const revenueService = {
  /**
   * Tạo dữ liệu doanh thu giả cho số ngày nhất định
   */
  generateDailyRevenue(days: number): RevenueData[] {
    const result: RevenueData[] = [];
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
  },

  /**
   * Tính tổng doanh thu
   */
  calculateTotalRevenue(revenueData: RevenueData[]): number {
    return revenueData.reduce((sum, d) => sum + d.revenue, 0);
  },

  calculateRevenueByRange(revenueData: RevenueData[], startIndex: number, endIndex?: number): number {
    const end = endIndex !== undefined ? endIndex : revenueData.length;
    const start = startIndex < 0 ? revenueData.length + startIndex : startIndex;

    return revenueData.slice(start, end).reduce((sum, d) => sum + d.revenue, 0);
  },

  /**
   * Tính tăng trưởng doanh thu
   */
  calculateRevenueGrowth(currentWeek: number, lastWeek: number): number {
    if (lastWeek === 0) return 0;
    return Math.round(((currentWeek - lastWeek) / lastWeek) * 100);
  },

  /**
   * Phân bổ doanh thu theo loại
   */
  getRevenueByType(totalRevenue: number): RevenueByType[] {
    return [
      { type: 'In-app Purchase', amount: Math.round(totalRevenue * 0.45), percentage: 45 },
      { type: 'Subscription', amount: Math.round(totalRevenue * 0.30), percentage: 30 },
      { type: 'Advertising', amount: Math.round(totalRevenue * 0.15), percentage: 15 },
      { type: 'Other', amount: Math.round(totalRevenue * 0.10), percentage: 10 },
    ];
  },

  /**
   * Lấy tất cả revenue stats
   */
  getAllRevenueStats(): {
    dailyData: RevenueData[];
    totalRevenue: number;
    todayRevenue: number;
    weekRevenue: number;
    monthRevenue: number;
    revenueGrowth: number;
    revenueByType: RevenueByType[];
  } {
    const dailyData = this.generateDailyRevenue(30);
    const totalRevenue = this.calculateTotalRevenue(dailyData);
    const todayRevenue = dailyData[dailyData.length - 1]?.revenue || 0;
    const weekRevenue = this.calculateRevenueByRange(dailyData, -7);
    const monthRevenue = this.calculateRevenueByRange(dailyData, 0);
    const lastWeekRevenue = this.calculateRevenueByRange(dailyData, -14, -7);
    const revenueGrowth = this.calculateRevenueGrowth(weekRevenue, lastWeekRevenue);
    const revenueByType = this.getRevenueByType(totalRevenue);

    return {
      dailyData,
      totalRevenue,
      todayRevenue,
      weekRevenue,
      monthRevenue,
      revenueGrowth,
      revenueByType
    };
  }
};
