import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/utils/supabase/client';
import { BaseItem } from '../../base_items/types';

interface UseItemsOptions {
  enabled?: boolean;
}

export const useItems = ({ enabled = true }: UseItemsOptions = {}) => {
  const [items, setItems] = useState<BaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: supabaseError } = await supabase
          .from('base_items')
          .select('*')
          .eq('status', 'active')
          .order('name');

        if (supabaseError) throw supabaseError;
        setItems(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [enabled]);

  return { items, loading, error };
};
