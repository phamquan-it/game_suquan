import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GeneralWithRelations, GeneralFilterOptions } from '../types/general.types';
import { supabase } from '@/utils/supabase/client';

export const generalKeys = {
  all: ['generals'] as const,
  lists: () => [...generalKeys.all, 'list'] as const,
  list: (filters: string) => [...generalKeys.lists(), filters] as const,
  details: () => [...generalKeys.all, 'detail'] as const,
  detail: (id: string) => [...generalKeys.details(), id] as const,
};

export const useGenerals = (filters?: GeneralFilterOptions) => {
  const filterKey = JSON.stringify(filters || {});

  return useQuery({
    queryKey: generalKeys.list(filterKey),
    queryFn: async (): Promise<GeneralWithRelations[]> => {
      let query = supabase
        .from('generals')
        .select(`
          *,
          skills:general_skills(*),
          shard_rewards:battle_reward_hero_shards(*)
        `);

      // Apply filters
      if (filters) {
        if (filters.rarity?.length) {
          query = query.in('rarity', filters.rarity);
        }
        if (filters.element?.length) {
          query = query.in('element', filters.element);
        }
        if (filters.type?.length) {
          query = query.in('type', filters.type);
        }
        if (filters.status?.length) {
          query = query.in('status', filters.status);
        }
        if (filters.minLevel) {
          query = query.gte('level', filters.minLevel);
        }
        if (filters.maxLevel) {
          query = query.lte('level', filters.maxLevel);
        }
        if (filters.minStar) {
          query = query.gte('star_level', filters.minStar);
        }
        if (filters.isVip !== undefined) {
          query = query.eq('is_vip', filters.isVip);
        }
        if (filters.favorite !== undefined) {
          query = query.eq('favorite', filters.favorite);
        }
        if (filters.searchTerm) {
          query = query.or(`name.ilike.%${filters.searchTerm}%,title.ilike.%${filters.searchTerm}%`);
        }
      }

      const { data, error } = await query.order('name');

      if (error) throw error;
      return data || [];
    },
  });
};

export const useGeneral = (id: string) => {
  return useQuery({
    queryKey: generalKeys.detail(id),
    queryFn: async (): Promise<GeneralWithRelations | null> => {
      const { data, error } = await supabase
        .from('generals')
        .select(`
          *,
          skills:general_skills(*),
          shard_rewards:battle_reward_hero_shards(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useGeneralStats = () => {
  return useQuery({
    queryKey: [...generalKeys.all, 'stats'],
    queryFn: async () => {
      const { data: generals, error } = await supabase
        .from('generals')
        .select('*');

      if (error) throw error;

      const totalGenerals = generals.length;
      const totalLegendary = generals.filter(g => g.rarity === 'legendary').length;
      const totalMythic = generals.filter(g => g.rarity === 'mythic').length;
      const avgLevel = generals.reduce((sum, g) => sum + g.level, 0) / totalGenerals;
      
      // Calculate average power
      const avgPower = generals.reduce((sum, g) => {
        const power = g.current_attack * 2.5 + g.current_defense * 2 + g.current_health * 1.5;
        return sum + power;
      }, 0) / totalGenerals;

      // Find most common element
      const elementCount: Record<string, number> = {};
      generals.forEach(g => {
        elementCount[g.element] = (elementCount[g.element] || 0) + 1;
      });
      const mostCommonElement = Object.entries(elementCount).sort((a, b) => b[1] - a[1])[0]?.[0] as any;

      // Find most common type
      const typeCount: Record<string, number> = {};
      generals.forEach(g => {
        typeCount[g.type] = (typeCount[g.type] || 0) + 1;
      });
      const mostCommonType = Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0]?.[0] as any;

      return {
        totalGenerals,
        totalLegendary,
        totalMythic,
        avgLevel: Math.round(avgLevel * 10) / 10,
        avgPower: Math.round(avgPower),
        mostCommonElement,
        mostCommonType,
      };
    },
  });
};
