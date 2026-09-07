// hooks/types/dashboard.types.ts
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

  // Revenue stats
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

export interface DailyData {
  date: string;
  players: number;
  battles: number;
  revenue: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
}

export interface RevenueByType {
  type: string;
  amount: number;
  percentage: number;
}

export interface BattleStatus {
  status: string;
  count: number;
}

export interface DateRange {
  start: string;
  end: string;
}
