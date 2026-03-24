// app/admin/base_items/hooks/useItems.ts
import { useQuery } from '@tanstack/react-query';
import { ItemWithRelations, ItemFilterParams } from '../types';
import { supabase } from '@/utils/supabase/client';

export const useItems = (filters: ItemFilterParams = {}) => {
  return useQuery({
    queryKey: ['base_items', filters],
    queryFn: async () => {
      let query = supabase
        .from('base_items')
        .select(`
          *,
          stats:item_stats(*),
          set_memberships:set_items(
            *,
            set:equipment_sets(*)
          )
        `);

      // Apply filters
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.rarity) {
        query = query.eq('rarity', filters.rarity);
      }
      if (filters.quality) {
        query = query.eq('quality', filters.quality);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.levelMin) {
        query = query.gte('level_requirement', filters.levelMin);
      }
      if (filters.levelMax) {
        query = query.lte('level_requirement', filters.levelMax);
      }
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      // Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await query
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        items: data as ItemWithRelations[],
        total: count || 0,
        page,
        totalPages: count ? Math.ceil(count / limit) : 0,
      };
    },
  });
};
