import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RegionExpansionCost } from '../types/region.types';
import { regionKeys } from './useRegions';
import { message } from 'antd';
import { supabase } from '@/utils/supabase/client';

// Fetch resource types
export const useResourceTypes = () => {
  return useQuery({
    queryKey: ['resource-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resource_types')
        .select('*')
        .order('resource_code');

      if (error) throw error;
      return data;
    },
  });
};

// Add expansion cost
export const useAddExpansionCost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cost: Omit<RegionExpansionCost, 'region_id'> & { region_id: string }) => {
      const { data, error } = await supabase
        .from('region_expansion_costs')
        .insert([cost])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: regionKeys.expansion(variables.region_id) });
      queryClient.invalidateQueries({ queryKey: regionKeys.detail(variables.region_id) });
      message.success('Expansion cost added successfully');
    },
    onError: (error: any) => {
      message.error(`Failed to add expansion cost: ${error.message}`);
    },
  });
};

// Update expansion cost
export const useUpdateExpansionCost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      region_id, 
      slot_index, 
      cost_type,
      updates 
    }: { 
      region_id: string; 
      slot_index: number; 
      cost_type: string;
      updates: Partial<RegionExpansionCost> 
    }) => {
      const { data, error } = await supabase
        .from('region_expansion_costs')
        .update(updates)
        .eq('region_id', region_id)
        .eq('slot_index', slot_index)
        .eq('cost_type', cost_type)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: regionKeys.expansion(variables.region_id) });
      queryClient.invalidateQueries({ queryKey: regionKeys.detail(variables.region_id) });
      message.success('Expansion cost updated successfully');
    },
    onError: (error: any) => {
      message.error(`Failed to update expansion cost: ${error.message}`);
    },
  });
};

// Remove expansion cost
export const useRemoveExpansionCost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ region_id, slot_index, cost_type }: { region_id: string; slot_index: number; cost_type: string }) => {
      const { error } = await supabase
        .from('region_expansion_costs')
        .delete()
        .eq('region_id', region_id)
        .eq('slot_index', slot_index)
        .eq('cost_type', cost_type);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: regionKeys.expansion(variables.region_id) });
      queryClient.invalidateQueries({ queryKey: regionKeys.detail(variables.region_id) });
      message.success('Expansion cost removed successfully');
    },
    onError: (error: any) => {
      message.error(`Failed to remove expansion cost: ${error.message}`);
    },
  });
};
