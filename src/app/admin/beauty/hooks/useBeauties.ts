'use client';

import { useEffect, useState } from 'react';
import { BeautyCharacter } from '../types';
import { message } from 'antd';
import { supabase } from '@/utils/supabase/client';

interface UseBeautiesProps {
  filters?: any;
  sortConfig?: { field: string; order: string | null };
  pagination?: { current: number; pageSize: number };
}

export function useBeauties({ 
  filters = {}, 
  sortConfig = { field: 'acquisition_date', order: 'descend' },
  pagination = { current: 1, pageSize: 10 }
}: UseBeautiesProps = {}) {
  const [beauties, setBeauties] = useState<BeautyCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchBeauties();
  }, [filters, sortConfig, pagination]);

  const fetchBeauties = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('beauty_characters')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.rarity) {
        query = query.eq('rarity', filters.rarity);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,title.ilike.%${filters.search}%`);
      }
      if (filters.minLevel) {
        query = query.gte('level', filters.minLevel);
      }
      if (filters.maxLevel) {
        query = query.lte('level', filters.maxLevel);
      }

      // Apply sorting
      if (sortConfig.field && sortConfig.order) {
        query = query.order(sortConfig.field, { 
          ascending: sortConfig.order === 'ascend' 
        });
      } else {
        // Default sort
        query = query.order('acquisition_date', { ascending: false });
      }

      // Apply pagination
      const from = (pagination.current - 1) * pagination.pageSize;
      const to = from + pagination.pageSize - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) throw error;

      setBeauties(data || []);
      setTotal(count || 0);
    } catch (error: any) {
      message.error('Error fetching beauties: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    fetchBeauties();
  };

  return {
    beauties,
    loading,
    total,
    refresh,
  };
}
