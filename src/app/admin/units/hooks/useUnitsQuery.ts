// app/admin/units/hooks/useUnitsQuery.ts
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { UnitFilterParams, UnitsResponse, UnitWithSkills } from '../types';
import { supabase } from '@/utils/supabase/client';

// Helper function to build the query with filters
const buildUnitQuery = (filters: UnitFilterParams) => {
  let query = supabase
    .from('units')
    .select(`
      *,
      unit_skills (
        skill:skills (*)
      )
    `, { count: 'exact' });

  // Apply filters
  if (filters.type) {
    query = query.eq('type', filters.type);
  }

  if (filters.level) {
    query = query.eq('level', filters.level);
  }

  if (filters.isVip !== undefined) {
    query = query.eq('is_vip', filters.isVip);
  }

  if (filters.isSpecial !== undefined) {
    query = query.eq('is_special', filters.isSpecial);
  }

  if (filters.rank) {
    query = query.eq('rank', filters.rank);
  }

  if (filters.searchTerm) {
    query = query.or(`name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
  }

  if (filters.minAtk !== undefined) {
    query = query.gte('atk', filters.minAtk);
  }

  if (filters.maxAtk !== undefined) {
    query = query.lte('atk', filters.maxAtk);
  }

  if (filters.minDef !== undefined) {
    query = query.gte('def', filters.minDef);
  }

  if (filters.maxDef !== undefined) {
    query = query.lte('def', filters.maxDef);
  }

  return query;
};

// Transform raw database response to UnitWithSkills type
const transformUnitData = (data: any[]): UnitWithSkills[] => {
  return data.map(unit => ({
    id: unit.id,
    name: unit.name,
    imagePath: unit.image_path,
    type: unit.type,
    description: unit.description,
    quantity: unit.quantity,
    level: unit.level,
    maxHp: unit.max_hp,
    currentHp: unit.current_hp,
    atk: unit.atk,
    def: unit.def,
    speed: unit.speed,
    range: unit.range,
    isVip: unit.is_vip,
    createdAt: unit.created_at,
    updatedAt: unit.updated_at,
    rank: unit.rank,
    isSpecial: unit.is_special,
    joinDate: unit.join_date,
    playerUnitId: unit.player_unit_id,
    skills: unit.unit_skills
      ?.map((us: any) => us.skill)
      .filter(Boolean)
      .map((skill: any) => ({
        id: skill.id,
        name: skill.name,
        description: skill.description,
        type: skill.type,
        effectValue: skill.effect_value,
        cooldown: skill.cooldown,
        manaCost: skill.mana_cost,
        iconPath: skill.icon_path,
      })) || [],
  }));
};

// Main hook for infinite query with pagination
export const useUnitsQuery = (filters: UnitFilterParams = {}) => {
  return useInfiniteQuery<UnitsResponse>({
    queryKey: ['units', filters],
    queryFn: async () => {
      const pageParam = 1;
      const limit = filters.limit || 20;
      const from = pageParam * limit;
      const to = from + limit - 1;

      const query = buildUnitQuery(filters);
      
      const { data, error, count } = await query
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching units:', error);
        throw new Error(`Failed to fetch units: ${error.message}`);
      }

      const transformedData = transformUnitData(data || []);

      return {
        data: transformedData,
        total: count || 0,
        page: pageParam,
        limit,
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length;
      return nextPage * lastPage.limit < lastPage.total ? nextPage : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.page > 0 ? firstPage.page - 1 : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for fetching a single unit by ID
export const useUnitByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['unit', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('units')
        .select(`
          *,
          unit_skills (
            skill:skills (*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching unit:', error);
        throw new Error(`Failed to fetch unit: ${error.message}`);
      }

      const transformedData = transformUnitData([data]);
      return transformedData[0];
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook for fetching units with simple pagination (non-infinite)
export const useUnitsPaginatedQuery = (filters: UnitFilterParams = {}) => {
  return useQuery({
    queryKey: ['units-paginated', filters],
    queryFn: async () => {
      const page = filters.page || 0;
      const limit = filters.limit || 20;
      const from = page * limit;
      const to = from + limit - 1;

      const query = buildUnitQuery(filters);
      
      const { data, error, count } = await query
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching units:', error);
        throw new Error(`Failed to fetch units: ${error.message}`);
      }

      const transformedData = transformUnitData(data || []);

      return {
        data: transformedData,
        total: count || 0,
        page,
        limit,
        totalPages: count ? Math.ceil(count / limit) : 0,
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook for fetching all units (no pagination - use with caution)
export const useAllUnitsQuery = (filters: UnitFilterParams = {}) => {
  return useQuery({
    queryKey: ['units-all', filters],
    queryFn: async () => {
      const query = buildUnitQuery(filters);
      
      const { data, error } = await query
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all units:', error);
        throw new Error(`Failed to fetch units: ${error.message}`);
      }

      return transformUnitData(data || []);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: false, // Disable by default, only enable when needed
  });
};

// Hook for fetching unit statistics
export const useUnitStatsQuery = () => {
  return useQuery({
    queryKey: ['unit-stats'],
    queryFn: async () => {
      // Get total count
      const { count: total, error: totalError } = await supabase
        .from('units')
        .select('*', { count: 'exact', head: true });

      if (totalError) throw totalError;

      // Get counts by type
      const { data: typeData, error: typeError } = await supabase
        .rpc('get_unit_counts_by_type');

      if (typeError) throw typeError;

      // Get average level
      const { data: avgLevel, error: avgError } = await supabase
        .rpc('get_average_unit_level');

      if (avgError) throw avgError;

      // Get VIP and special counts
      const { count: vipCount, error: vipError } = await supabase
        .from('units')
        .select('*', { count: 'exact', head: true })
        .eq('is_vip', true);

      if (vipError) throw vipError;

      const { count: specialCount, error: specialError } = await supabase
        .from('units')
        .select('*', { count: 'exact', head: true })
        .eq('is_special', true);

      if (specialError) throw specialError;

      // Get units by rank
      const { data: rankData, error: rankError } = await supabase
        .rpc('get_unit_counts_by_rank');

      if (rankError) throw rankError;

      return {
        total: total || 0,
        byType: typeData || {},
        byRank: rankData || {},
        averageLevel: avgLevel || 0,
        vipCount: vipCount || 0,
        specialCount: specialCount || 0,
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
};

// Type for the return value of useUnitsQuery
export type UseUnitsQueryReturn = ReturnType<typeof useUnitsQuery>;
export type UseUnitByIdQueryReturn = ReturnType<typeof useUnitByIdQuery>;
export type UseUnitsPaginatedQueryReturn = ReturnType<typeof useUnitsPaginatedQuery>;
