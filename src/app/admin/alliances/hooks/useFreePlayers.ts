// hooks/useFreePlayers.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

export interface FreePlayer {
  id: string;
  username: string;
  email: string;
  level: number;
  power: number;
  status: string;
  country: string | null;
  specialization: string | null;
  victory_points: number;
  win_rate: number;
  battles: number;
  wins: number;
  territory: number;
  avatar: string | null;
  last_login: string | null;
  registration_date: string;
  violations: number;
  title: string | null;
}

export interface FreePlayersFilters {
  search?: string;
  level_min?: number;
  level_max?: number;
  power_min?: number;
  power_max?: number;
  country?: string;
  specialization?: string;
  status?: string;
  min_win_rate?: number;
  max_win_rate?: number;
  min_victory_points?: number;
  max_victory_points?: number;
  sort_by?: 'level' | 'power' | 'victory_points' | 'win_rate' | 'registration_date';
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

export interface FreePlayersResponse {
  players: FreePlayer[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const useFreePlayers = (filters: FreePlayersFilters = {}) => {
  const queryClient = useQueryClient();

  const {
    search = '',
    level_min,
    level_max,
    power_min,
    power_max,
    country,
    specialization,
    status,
    min_win_rate,
    max_win_rate,
    min_victory_points,
    max_victory_points,
    sort_by = 'registration_date',
    sort_order = 'desc',
    page = 1,
    page_size = 20,
  } = filters;

  const fetchFreePlayers = async (): Promise<FreePlayersResponse> => {
    try {
      // First, get all player IDs that are in alliances
      const { data: alliedPlayers, error: alliedError } = await supabase
        .from('alliance_members')
        .select('player_id');

      if (alliedError) throw alliedError;

      const alliedPlayerIds = alliedPlayers?.map(m => m.player_id) || [];

      // Build query for free players (not in any alliance)
      let query = supabase
        .from('players')
        .select('*', { count: 'exact' });

      // Exclude players already in alliances
      if (alliedPlayerIds.length > 0) {
        query = query.not('id', 'in', `(${alliedPlayerIds.map(id => `'${id}'`).join(',')})`);
      }

      // Apply filters
      if (search) {
        query = query.or(`username.ilike.%${search}%,email.ilike.%${search}%`);
      }

      if (level_min !== undefined) {
        query = query.gte('level', level_min);
      }

      if (level_max !== undefined) {
        query = query.lte('level', level_max);
      }

      if (power_min !== undefined) {
        query = query.gte('power', power_min);
      }

      if (power_max !== undefined) {
        query = query.lte('power', power_max);
      }

      if (country) {
        query = query.eq('country', country);
      }

      if (specialization) {
        query = query.eq('specialization', specialization);
      }

      if (status) {
        query = query.eq('status', status);
      }

      if (min_win_rate !== undefined) {
        query = query.gte('win_rate', min_win_rate);
      }

      if (max_win_rate !== undefined) {
        query = query.lte('win_rate', max_win_rate);
      }

      if (min_victory_points !== undefined) {
        query = query.gte('victory_points', min_victory_points);
      }

      if (max_victory_points !== undefined) {
        query = query.lte('victory_points', max_victory_points);
      }

      // Apply sorting
      query = query.order(sort_by, { ascending: sort_order === 'asc' });

      // Apply pagination
      const from = (page - 1) * page_size;
      const to = from + page_size - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        players: data as FreePlayer[],
        totalCount: count || 0,
        page,
        pageSize: page_size,
        totalPages: Math.ceil((count || 0) / page_size),
      };
    } catch (error: any) {
      console.error('Error fetching free players:', error);
      throw new Error(error.message);
    }
  };

  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['free-players', filters],
    queryFn: fetchFreePlayers,
    staleTime: 30000, // 30 seconds
  });

  return {
    players: data?.players || [],
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    currentPage: page,
    pageSize: page_size,
    isLoading,
    isFetching,
    error,
    refetch,
  };
};

// Hook for adding player to alliance
export const useAddPlayerToAlliance = () => {
  const queryClient = useQueryClient();

  const addPlayerToAlliance = useMutation({
    mutationFn: async ({
      allianceId,
      playerId,
      role = 'member',
    }: {
      allianceId: string;
      playerId: string;
      role?: string;
    }) => {
      // Check if player is already in an alliance
      const { data: existingMember, error: checkError } = await supabase
        .from('alliance_members')
        .select('*')
        .eq('player_id', playerId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingMember) {
        throw new Error('Người chơi này đã ở trong một liên minh khác');
      }

      // Add player to alliance
      const { data, error } = await supabase
        .from('alliance_members')
        .insert({
          alliance_id: allianceId,
          player_id: playerId,
          role: role,
        })
        .select(`
          *,
          player:players (
            id,
            username,
            level,
            power,
            avatar
          )
        `)
        .single();

      if (error) throw error;

      // Update player's alliance and role_in_alliance fields
      const { error: updateError } = await supabase
        .from('players')
        .update({
          alliance: (await supabase.from('alliances').select('name').eq('id', allianceId).single()).data?.name,
          role_in_alliance: role,
        })
        .eq('id', playerId);

      if (updateError) console.error('Error updating player alliance info:', updateError);

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['free-players'] });
      queryClient.invalidateQueries({ queryKey: ['alliance-members', variables.allianceId] });
      queryClient.invalidateQueries({ queryKey: ['alliances'] });
      message.success('Đã thêm thành viên vào liên minh thành công');
    },
    onError: (error: Error) => {
      message.error(error.message || 'Không thể thêm thành viên vào liên minh');
    },
  });

  return addPlayerToAlliance;
};

// Hook for getting player statistics summary
export const useFreePlayersStats = () => {
  const [stats, setStats] = useState({
    totalFreePlayers: 0,
    avgLevel: 0,
    avgPower: 0,
    avgWinRate: 0,
    totalPower: 0,
    byCountry: [] as { country: string; count: number }[],
    bySpecialization: [] as { specialization: string; count: number }[],
  });

  const fetchStats = async () => {
    try {
      // Get allied player IDs
      const { data: alliedPlayers } = await supabase
        .from('alliance_members')
        .select('player_id');

      const alliedPlayerIds = alliedPlayers?.map(m => m.player_id) || [];

      // Query free players
      let query = supabase
        .from('players')
        .select('*');

      if (alliedPlayerIds.length > 0) {
        query = query.not('id', 'in', `(${alliedPlayerIds.map(id => `'${id}'`).join(',')})`);
      }

      const { data: players, error } = await query;

      if (error) throw error;

      const freePlayers = players as FreePlayer[];
      const total = freePlayers.length;

      const avgLevel = total > 0
        ? freePlayers.reduce((sum, p) => sum + p.level, 0) / total
        : 0;

      const avgPower = total > 0
        ? freePlayers.reduce((sum, p) => sum + p.power, 0) / total
        : 0;

      const avgWinRate = total > 0
        ? freePlayers.reduce((sum, p) => sum + p.win_rate, 0) / total
        : 0;

      const totalPower = freePlayers.reduce((sum, p) => sum + p.power, 0);

      // Group by country
      const countryMap = new Map<string, number>();
      freePlayers.forEach(p => {
        if (p.country) {
          countryMap.set(p.country, (countryMap.get(p.country) || 0) + 1);
        }
      });
      const byCountry = Array.from(countryMap.entries())
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Group by specialization
      const specMap = new Map<string, number>();
      freePlayers.forEach(p => {
        if (p.specialization) {
          specMap.set(p.specialization, (specMap.get(p.specialization) || 0) + 1);
        }
      });
      const bySpecialization = Array.from(specMap.entries())
        .map(([specialization, count]) => ({ specialization, count }))
        .sort((a, b) => b.count - a.count);

      setStats({
        totalFreePlayers: total,
        avgLevel: Math.round(avgLevel * 10) / 10,
        avgPower: Math.round(avgPower),
        avgWinRate: Math.round(avgWinRate * 10) / 10,
        totalPower,
        byCountry,
        bySpecialization,
      });
    } catch (error) {
      console.error('Error fetching free players stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, refreshStats: fetchStats };
};

// Hook for searching players (autocomplete)
export const useSearchFreePlayers = () => {
  const searchPlayers = async (searchTerm: string, limit: number = 10) => {
    if (!searchTerm || searchTerm.length < 2) return [];

    try {
      // Get allied player IDs
      const { data: alliedPlayers } = await supabase
        .from('alliance_members')
        .select('player_id');

      let query = supabase
        .from('players')
        .select('id, username, level, power, avatar')
        .or(`username.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .limit(limit);


      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error searching players:', error);
      return [];
    }
  };

  return { searchPlayers };
};
