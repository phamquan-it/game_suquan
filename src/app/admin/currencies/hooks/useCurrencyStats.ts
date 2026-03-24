// app/admin/currencies/hooks/useCurrencyStats.ts
import { useQuery } from '@tanstack/react-query';
import { CurrencyStats, CurrencyCategory, CURRENCY_CATEGORIES } from '../types';
import { supabase } from '@/utils/supabase/client';

export const useCurrencyStats = () => {
  return useQuery({
    queryKey: ['currencyStats'],
    queryFn: async (): Promise<CurrencyStats> => {
      // Get total currencies
      const { count: totalCurrencies, error: totalError } = await supabase
        .from('currencies')
        .select('*', { count: 'exact', head: true });

      if (totalError) throw totalError;

      // Get count by category
      const categoriesCount: Record<CurrencyCategory, number> = {} as Record<CurrencyCategory, number>;
      
      for (const category of CURRENCY_CATEGORIES) {
        const { count, error } = await supabase
          .from('currencies')
          .select('*', { count: 'exact', head: true })
          .eq('category', category);

        if (error) throw error;
        categoriesCount[category] = count || 0;
      }

      // Get total exchange rates
      const { count: totalExchangeRates, error: ratesError } = await supabase
        .from('currency_exchange_rates')
        .select('*', { count: 'exact', head: true });

      if (ratesError) throw ratesError;

      // Get most traded currency (simplified - just get first currency with most rates)
      const { data: mostTraded, error: tradedError } = await supabase
        .from('currency_exchange_rates')
        .select('from_currency, count')
        .order('count', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (tradedError) throw tradedError;

      let mostTradedCurrency = null;
      if (mostTraded) {
        const { data: currency } = await supabase
          .from('currencies')
          .select('name')
          .eq('currency_type', mostTraded.from_currency)
          .single();
        
        mostTradedCurrency = currency?.name || null;
      }

      return {
        totalCurrencies: totalCurrencies || 0,
        totalExchangeRates: totalExchangeRates || 0,
        categoriesCount,
        mostTradedCurrency,
      };
    },
  });
};
