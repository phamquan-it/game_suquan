import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RegionBuilding } from '../types/region.types';
import { regionKeys } from './useRegions';
import { message } from 'antd';
import { supabase } from '@/utils/supabase/client';

// Fetch available building types
export const useBuildingTypes = () => {
  return useQuery({
    queryKey: ['building-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('base_buildings')
        .select('*')
        .order('type');

      if (error) throw error;
      return data;
    },
  });
};

// Add building to region
export const useAddRegionBuilding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (building: Omit<RegionBuilding, 'region_id'> & { region_id: string }) => {
      const { data, error } = await supabase
        .from('region_buildings')
        .insert([building])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: regionKeys.buildings(variables.region_id) });
      queryClient.invalidateQueries({ queryKey: regionKeys.detail(variables.region_id) });
      message.success('Building added successfully');
    },
    onError: (error: any) => {
      message.error(`Failed to add building: ${error.message}`);
    },
  });
};

// Update region building
export const useUpdateRegionBuilding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      region_id, 
      building_type, 
      updates 
    }: { 
      region_id: string; 
      building_type: string; 
      updates: Partial<RegionBuilding> 
    }) => {
      const { data, error } = await supabase
        .from('region_buildings')
        .update(updates)
        .eq('region_id', region_id)
        .eq('building_type', building_type)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: regionKeys.buildings(variables.region_id) });
      queryClient.invalidateQueries({ queryKey: regionKeys.detail(variables.region_id) });
      message.success('Building updated successfully');
    },
    onError: (error: any) => {
      message.error(`Failed to update building: ${error.message}`);
    },
  });
};

// Remove building from region
export const useRemoveRegionBuilding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ region_id, building_type }: { region_id: string; building_type: string }) => {
      const { error } = await supabase
        .from('region_buildings')
        .delete()
        .eq('region_id', region_id)
        .eq('building_type', building_type);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: regionKeys.buildings(variables.region_id) });
      queryClient.invalidateQueries({ queryKey: regionKeys.detail(variables.region_id) });
      message.success('Building removed successfully');
    },
    onError: (error: any) => {
      message.error(`Failed to remove building: ${error.message}`);
    },
  });
};
