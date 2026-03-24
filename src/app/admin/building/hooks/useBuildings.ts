import { supabase } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { BuildingWithRelations } from "../types/building.types";

export const buildingKeys = {
  all: ['buildings'] as const,
  lists: () => [...buildingKeys.all, 'list'] as const,
  list: (filters: string) => [...buildingKeys.lists(), filters] as const,
  details: () => [...buildingKeys.all, 'detail'] as const,
  detail: (id: string) => [...buildingKeys.details(), id] as const,
};

export const useBuildings = () => {
  return useQuery({
    queryKey: buildingKeys.lists(),
    queryFn: async (): Promise<BuildingWithRelations[]> => {
      const { data, error } = await supabase
        .from('base_buildings')
        .select(`
          *,
          attribute_details:building_attribute_detail(*),
          production:building_production(*),
          unit_training:building_unit_training(*),
          unlock_rules:building_unit_unlock_rules(*),
          upgrade_costs:building_upgrade_cost(*)
        `)
        .order('type');

      if (error) throw error;
      return data || [];
    },
  });
};

export const useBuilding = (type: string) => {
  return useQuery({
    queryKey: buildingKeys.detail(type),
    queryFn: async (): Promise<BuildingWithRelations | null> => {
      const { data, error } = await supabase
        .from('base_buildings')
        .select(`
          *,
          attribute_details:building_attribute_detail(*),
          production:building_production(*),
          unit_training:building_unit_training(*),
          unlock_rules:building_unit_unlock_rules(*),
          upgrade_costs:building_upgrade_cost(*)
        `)
        .eq('type', type)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!type,
  });
};
