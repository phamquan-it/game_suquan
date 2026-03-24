// app/admin/currencies/hooks/useCurrencies.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Currency, CreateCurrencyInput, UpdateCurrencyInput } from '../types';
import { message } from 'antd';
import { supabase } from '@/utils/supabase/client';

export const useCurrencies = () => {
  const queryClient = useQueryClient();

  const { data: currencies, isLoading, error } = useQuery({
    queryKey: ['currencies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .order('category')
        .order('name');

      if (error) throw error;
      return data as Currency[];
    },
  });

  const createCurrency = useMutation({
    mutationFn: async (newCurrency: CreateCurrencyInput) => {
      const { data, error } = await supabase
        .from('currencies')
        .insert([newCurrency])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
      message.success('Currency created successfully');
    },
    onError: (error: any) => {
      message.error(`Failed to create currency: ${error.message}`);
    },
  });

  const updateCurrency = useMutation({
    mutationFn: async ({ currency_type, ...updates }: UpdateCurrencyInput) => {
      const { data, error } = await supabase
        .from('currencies')
        .update(updates)
        .eq('currency_type', currency_type)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
      message.success('Currency updated successfully');
    },
    onError: (error: any) => {
      message.error(`Failed to update currency: ${error.message}`);
    },
  });

  const deleteCurrency = useMutation({
    mutationFn: async (currency_type: string) => {
      const { error } = await supabase
        .from('currencies')
        .delete()
        .eq('currency_type', currency_type);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
      message.success('Currency deleted successfully');
    },
    onError: (error: any) => {
      message.error(`Failed to delete currency: ${error.message}`);
    },
  });

  return {
    currencies,
    isLoading,
    error,
    createCurrency,
    updateCurrency,
    deleteCurrency,
  };
};
