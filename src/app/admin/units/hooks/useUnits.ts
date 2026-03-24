// app/admin/units/hooks/useUnits.ts
import { supabase } from '@/utils/supabase/client';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { UnitFilterParams, UnitsResponse, UnitWithSkills } from '../types';

export const useUnits = (filters: UnitFilterParams = {}) => {
  return useInfiniteQuery<UnitsResponse>({
    queryKey: ['units', filters],
    queryFn: async ({  }) => {
      const {
        type,
        level,
        isVip,
        isSpecial,
        rank,
        searchTerm,
        minAtk,
        maxAtk,
        minDef,
        maxDef,
        limit = 20,
      } = filters;
      const pageParam = 1;

      let query = supabase
        .from('units')
        .select(`
          *,
          unit_skills (
            skill:skills (*)
          )
        `, { count: 'exact' });

      // Apply filters
      if (type) query = query.eq('type', type);
      if (level) query = query.eq('level', level);
      if (isVip !== undefined) query = query.eq('is_vip', isVip);
      if (isSpecial !== undefined) query = query.eq('is_special', isSpecial);
      if (rank) query = query.eq('rank', rank);
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      if (minAtk) query = query.gte('atk', minAtk);
      if (maxAtk) query = query.lte('atk', maxAtk);
      if (minDef) query = query.gte('def', minDef);
      if (maxDef) query = query.lte('def', maxDef);

      // Pagination
      const from = pageParam * limit;
      const to = from + limit - 1;

      const { data, error, count } = await query
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to include skills
      const transformedData = data?.map(unit => ({
        ...unit,
        skills: unit.unit_skills?.map((us: any) => us.skill).filter(Boolean) || [],
      })) || [];

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
    initialPageParam: 0,
  });
};

export const useUnit = (id: string) => {
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

      if (error) throw error;

      return {
        ...data,
        skills: data.unit_skills?.map((us: any) => us.skill).filter(Boolean) || [],
      } as UnitWithSkills;
    },
    enabled: !!id,
  });
};
