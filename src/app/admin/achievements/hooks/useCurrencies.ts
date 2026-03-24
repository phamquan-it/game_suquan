// app/admin/achievements/hooks/useCurrencies.ts
import { supabase } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export const useCurrencies = () => {
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const { data, error } = await supabase
          .from('currencies')
          .select('*');

        if (error) throw error;
        setCurrencies(data || []);
      } catch (error) {
        console.error('Error fetching currencies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  return { currencies, loading };
};
