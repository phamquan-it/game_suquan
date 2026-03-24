// app/admin/achievements/hooks/useAchievements.ts
import { useEffect, useState } from 'react';
import { message } from 'antd';
import { Achievement, AchievementFilters, AchievementStats } from '../types';
import { supabase } from '@/utils/supabase/client';

export const useAchievements = (initialFilters?: AchievementFilters) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AchievementFilters>(initialFilters || {
    search: '',
    type: [],
    category: [],
    tier: [],
    rarity: [],
    difficulty: [],
    status: [],
    repeatable: null,
  });
  const [stats, setStats] = useState<AchievementStats | null>(null);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('achievements')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters.type.length > 0) {
        query = query.in('type', filters.type);
      }
      if (filters.category.length > 0) {
        query = query.in('category', filters.category);
      }
      if (filters.tier.length > 0) {
        query = query.in('tier', filters.tier);
      }
      if (filters.rarity.length > 0) {
        query = query.in('rarity', filters.rarity);
      }
      if (filters.difficulty.length > 0) {
        query = query.in('difficulty', filters.difficulty);
      }
      if (filters.status.length > 0) {
        query = query.in('status', filters.status);
      }
      if (filters.repeatable !== null) {
        query = query.eq('repeatable', filters.repeatable);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      message.error('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get total counts
      const { count: total } = await supabase
        .from('achievements')
        .select('*', { count: 'exact', head: true });

      const { count: active } = await supabase
        .from('achievements')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const { count: inactive } = await supabase
        .from('achievements')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'inactive');

      const { count: hidden } = await supabase
        .from('achievements')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'hidden');

      // Get total points
      const { data: pointsData } = await supabase
        .from('achievements')
        .select('points');

      const totalPoints = pointsData?.reduce((sum, a) => sum + a.points, 0) || 0;

      // Get average completion rate
      const { data: completionData } = await supabase
        .from('achievements')
        .select('completion_rate')
        .not('completion_rate', 'is', null);

      const avgCompletionRate = completionData?.length
        ? completionData.reduce((sum, a) => sum + (a.completion_rate || 0), 0) / completionData.length
        : 0;

      setStats({
        total: total || 0,
        active: active || 0,
        inactive: inactive || 0,
        hidden: hidden || 0,
        totalPoints,
        avgCompletionRate,
        mostUnlocked: null, // You can implement this with player_achievements
        leastUnlocked: null,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchAchievements();
    fetchStats();
  }, [filters]);

  const deleteAchievement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      message.success('Achievement deleted successfully');
      fetchAchievements();
      fetchStats();
    } catch (error) {
      console.error('Error deleting achievement:', error);
      message.error('Failed to delete achievement');
    }
  };

  const updateStatus = async (id: string, status: Achievement['status']) => {
    try {
      const { error } = await supabase
        .from('achievements')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      message.success('Status updated successfully');
      fetchAchievements();
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('Failed to update status');
    }
  };

  return {
    achievements,
    loading,
    filters,
    setFilters,
    stats,
    deleteAchievement,
    updateStatus,
    refresh: fetchAchievements,
  };
};
