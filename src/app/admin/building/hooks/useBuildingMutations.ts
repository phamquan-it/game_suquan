import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import {
  BuildingFormData,
  BuildingAttributeFormData,
  BuildingProductionFormData,
  BuildingTrainingFormData,
  BuildingUnlockRuleFormData,
  BuildingUpgradeCostFormData
} from '../types/building.types';
import { buildingKeys } from './useBuildings';
import { supabase } from '@/utils/supabase/client';

export const useCreateBuilding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BuildingFormData) => {
      const { error } = await supabase
        .from('base_buildings')
        .insert([data]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: buildingKeys.lists() });
      message.success('Tạo công trình thành công');
    },
    onError: (error: any) => {
      message.error(`Lỗi: ${error.message}`);
    },
  });
};

export const useUpdateBuilding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ type, data }: { type: string; data: Partial<BuildingFormData> }) => {
      const { error } = await supabase
        .from('base_buildings')
        .update(data)
        .eq('type', type);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: buildingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: buildingKeys.detail(variables.type) });
      message.success('Cập nhật công trình thành công');
    },
    onError: (error: any) => {
      message.error(`Lỗi: ${error.message}`);
    },
  });
};

export const useDeleteBuilding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (type: string) => {
      const { error } = await supabase
        .from('base_buildings')
        .delete()
        .eq('type', type);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: buildingKeys.lists() });
      message.success('Xóa công trình thành công');
    },
    onError: (error: any) => {
      message.error(`Lỗi: ${error.message}`);
    },
  });
};

// Mutations cho building attribute details
export const useUpsertBuildingAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      building_type,
      data
    }: {
      building_type: string;
      data: BuildingAttributeFormData & { level: number }
    }) => {
      const { error } = await supabase
        .from('building_attribute_detail')
        .upsert([{
          building_type,
          ...data
        }], {
          onConflict: 'building_type,level'
        });

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: buildingKeys.detail(variables.building_type) });
      message.success('Cập nhật chỉ số công trình thành công');
    },
  });
};

// Mutations cho building production
export const useUpsertBuildingProduction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      building_type,
      data
    }: {
      building_type: string;
      data: BuildingProductionFormData
    }) => {
      const { error } = await supabase
        .from('building_production')
        .upsert([{
          building_type,
          ...data
        }], {
          onConflict: 'building_type,level,resource_code'
        });

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: buildingKeys.detail(variables.building_type) });
      message.success('Cập nhật sản xuất thành công');
    },
  });
};

// Mutations cho building unit training
export const useUpsertBuildingTraining = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      building_type,
      data
    }: {
      building_type: string;
      data: BuildingTrainingFormData
    }) => {
      const { error } = await supabase
        .from('building_unit_training')
        .upsert([{
          building_type,
          ...data
        }], {
          onConflict: 'building_type,level,unit_type'
        });

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: buildingKeys.detail(variables.building_type) });
      message.success('Cập nhật huấn luyện thành công');
    },
  });
};

// Mutations cho unlock rules
export const useUpsertUnlockRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      building_type,
      data
    }: {
      building_type: string;
      data: BuildingUnlockRuleFormData
    }) => {
      const { error } = await supabase
        .from('building_unit_unlock_rules')
        .upsert([{
          building_type,
          ...data
        }], {
          onConflict: 'building_type,unit_type'
        });

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: buildingKeys.detail(variables.building_type) });
      message.success('Cập nhật quy tắc mở khóa thành công');
    },
  });
};

// Mutations cho upgrade costs
export const useUpsertUpgradeCost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      building_type,
      data
    }: {
      building_type: string;
      data: BuildingUpgradeCostFormData
    }) => {
      const { error } = await supabase
        .from('building_upgrade_cost')
        .upsert([{
          building_type,
          ...data
        }], {
          onConflict: 'building_type,current_level,target_level,resource_code'
        });

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: buildingKeys.detail(variables.building_type) });
      message.success('Cập nhật chi phí nâng cấp thành công');
    },
  });
};

export const useDeleteUpgradeCost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('building_upgrade_cost')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: buildingKeys.lists() });
      message.success('Xóa chi phí nâng cấp thành công');
    },
  });
};
