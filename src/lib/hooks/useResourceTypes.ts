'use client';

import { supabase } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

export interface ResourceType {
  resource_code: string;
  resource_name: string;
  resource_category: string;
  description?: string;
  icon_url?: string;
  sort_order?: number;
}

/**
 * Fetch all resource types from Supabase
 */
const fetchResourceTypes = async (): Promise<ResourceType[]> => {
  const { data, error } = await supabase
    .from('resource_types')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Get all resource types
 */
export const useResourceTypes = () => {
  return useQuery({
    queryKey: ['resource-types'],
    queryFn: fetchResourceTypes,
    staleTime: 1000 * 60 * 30, // 30 phút vì table này ít đổi
  });
};

/**
 * Filter by category (server-side luôn)
 */
export const useResourceTypesByCategory = (category?: string) => {
  return useQuery({
    queryKey: ['resource-types', category],
    queryFn: async () => {
      let query = supabase
        .from('resource_types')
        .select('*')
        .order('sort_order', { ascending: true });

      if (category) {
        query = query.eq('resource_category', category);
      }

      const { data, error } = await query;

      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: true,
  });
};

/**
 * Convert to Select options (Antd)
 */
export const useResourceTypeOptions = (category?: string) => {
  return useQuery({
    queryKey: ['resource-type-options', category],
    queryFn: async () => {
      let query = supabase
        .from('resource_types')
        .select('resource_code, resource_name, resource_category, sort_order')
        .order('sort_order', { ascending: true });

      if (category) {
        query = query.eq('resource_category', category);
      }

      const { data, error } = await query;

      if (error) throw new Error(error.message);

      return (data || []).map((r) => ({
        label: r.resource_name,
        value: r.resource_code,
      }));
    },
    staleTime: 1000 * 60 * 30,
  });
};
