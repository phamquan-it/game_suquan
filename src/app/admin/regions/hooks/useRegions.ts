import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Region, CreateRegionDTO, UpdateRegionDTO, RegionWithDetails } from '../types/region.types';
import { message } from 'antd';
import { supabase } from '@/utils/supabase/client';

// Keys for React Query
export const regionKeys = {
  all: ['regions'] as const,
  lists: () => [...regionKeys.all, 'list'] as const,
  list: (filters: string) => [...regionKeys.lists(), { filters }] as const,
  details: () => [...regionKeys.all, 'detail'] as const,
  detail: (id: string) => [...regionKeys.details(), id] as const,
  buildings: (id: string) => [...regionKeys.detail(id), 'buildings'] as const,
  expansion: (id: string) => [...regionKeys.detail(id), 'expansion'] as const,
};

// Fetch all regions
export const useRegions = () => {
  return useQuery({
    queryKey: regionKeys.lists(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Region[];
    },
  });
};

// Fetch region by ID with details
export const useRegionById = (id: string) => {
  return useQuery({
    queryKey: regionKeys.detail(id),
    queryFn: async () => {
      const { data: region, error: regionError } = await supabase
        .from('regions')
        .select('*')
        .eq('id', id)
        .single();

      if (regionError) throw regionError;

      // Fetch buildings
      const { data: buildings, error: buildingsError } = await supabase
        .from('region_buildings')
        .select('*')
        .eq('region_id', id);

      if (buildingsError) throw buildingsError;

      // Fetch expansion costs
      const { data: expansion, error: expansionError } = await supabase
        .from('region_expansion_costs')
        .select('*')
        .eq('region_id', id)
        .order('slot_index', { ascending: true });

      if (expansionError) throw expansionError;

      return {
        ...region,
        buildings: buildings || [],
        expansion_costs: expansion || [],
      } as RegionWithDetails;
    },
    enabled: !!id,
  });
};

// Create region mutation
export const useCreateRegion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newRegion: CreateRegionDTO) => {
      const { data, error } = await supabase
        .from('regions')
        .insert([newRegion])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: regionKeys.lists() });
      message.success('Region created successfully');
    },
    onError: (error: any) => {
      message.error(`Failed to create region: ${error.message}`);
    },
  });
};

// Update region mutation
export const useUpdateRegion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateRegionDTO & { id: string }) => {
      const { data, error } = await supabase
        .from('regions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: regionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: regionKeys.detail(variables.id) });
      message.success('Region updated successfully');
    },
    onError: (error: any) => {
      message.error(`Failed to update region: ${error.message}`);
    },
  });
};

// Delete region mutation
export const useDeleteRegion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('regions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: regionKeys.lists() });
      message.success('Region deleted successfully');
    },
    onError: (error: any) => {
      message.error(`Failed to delete region: ${error.message}`);
    },
  });
};
