// app/admin/currencies/hooks/useExchangeRates.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CurrencyExchangeRate,
  CurrencyExchangeRateWithRelations,
  CreateExchangeRateInput,
} from "../types";
import { message } from "antd";
import { supabase } from "@/utils/supabase/client";

export const useExchangeRates = () => {
  const queryClient = useQueryClient();

  const {
    data: exchangeRates,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["exchangeRates"],
    queryFn: async () => {
      const { data, error } = await supabase.from("currency_exchange_rates")
        .select(`
          *,
          from_currency_details:currencies!currency_exchange_rates_from_currency_fkey(*),
          to_currency_details:currencies!currency_exchange_rates_to_currency_fkey(*)
        `);

      if (error) throw error;
      return data as CurrencyExchangeRateWithRelations[];
    },
  });

  const createExchangeRate = useMutation({
    mutationFn: async (newRate: CreateExchangeRateInput) => {
      const { data, error } = await supabase
        .from("currency_exchange_rates")
        .insert([newRate])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exchangeRates"] });
      message.success("Exchange rate created successfully");
    },
    onError: (error: any) => {
      message.error(`Failed to create exchange rate: ${error.message}`);
    },
  });

  const updateExchangeRate = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<CurrencyExchangeRate> & { id: string }) => {
      const { data, error } = await supabase
        .from("currency_exchange_rates")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exchangeRates"] });
      message.success("Exchange rate updated successfully");
    },
    onError: (error: any) => {
      message.error(`Failed to update exchange rate: ${error.message}`);
    },
  });

  const deleteExchangeRate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("currency_exchange_rates")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exchangeRates"] });
      message.success("Exchange rate deleted successfully");
    },
    onError: (error: any) => {
      message.error(`Failed to delete exchange rate: ${error.message}`);
    },
  });

  return {
    exchangeRates,
    isLoading,
    error,
    createExchangeRate,
    updateExchangeRate,
    deleteExchangeRate,
  };
};
