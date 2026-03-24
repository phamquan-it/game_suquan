import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { GeneralFormData, GeneralSkillFormData, GeneralShardFormData } from '../types/general.types';
import { generalKeys } from './useGenerals';
import { supabase } from '@/utils/supabase/client';

export const useCreateGeneral = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GeneralFormData) => {
      const { error } = await supabase
        .from('generals')
        .insert([data]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: generalKeys.lists() });
      message.success('Tạo tướng thành công');
    },
    onError: (error: any) => {
      message.error(`Lỗi: ${error.message}`);
    },
  });
};

export const useUpdateGeneral = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<GeneralFormData> }) => {
      const { error } = await supabase
        .from('generals')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: generalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: generalKeys.detail(variables.id) });
      message.success('Cập nhật tướng thành công');
    },
    onError: (error: any) => {
      message.error(`Lỗi: ${error.message}`);
    },
  });
};

export const useDeleteGeneral = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('generals')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: generalKeys.lists() });
      message.success('Xóa tướng thành công');
    },
    onError: (error: any) => {
      message.error(`Lỗi: ${error.message}`);
    },
  });
};

// Skill mutations
export const useCreateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ generalId, data }: { generalId: string; data: GeneralSkillFormData }) => {
      const { error } = await supabase
        .from('general_skills')
        .insert([{
          ...data,
          general_id: generalId,
        }]);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: generalKeys.detail(variables.generalId) });
      message.success('Thêm kỹ năng thành công');
    },
  });
};

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ skillId, data, generalId }: { skillId: string; data: Partial<GeneralSkillFormData>; generalId: string }) => {
      const { error } = await supabase
        .from('general_skills')
        .update(data)
        .eq('id', skillId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: generalKeys.detail(variables.generalId) });
      message.success('Cập nhật kỹ năng thành công');
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ skillId, generalId }: { skillId: string; generalId: string }) => {
      const { error } = await supabase
        .from('general_skills')
        .delete()
        .eq('id', skillId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: generalKeys.detail(variables.generalId) });
      message.success('Xóa kỹ năng thành công');
    },
  });
};

// Shard mutations
export const useCreateShard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ generalId, data }: { generalId: string; data: GeneralShardFormData }) => {
      const { error } = await supabase
        .from('battle_reward_hero_shards')
        .insert([{
          ...data,
          hero_id: generalId,
        }]);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: generalKeys.detail(variables.generalId) });
      message.success('Thêm mảnh tướng thành công');
    },
  });
};

export const useDeleteShard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ shardId, generalId }: { shardId: string; generalId: string }) => {
      const { error } = await supabase
        .from('battle_reward_hero_shards')
        .delete()
        .eq('id', shardId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: generalKeys.detail(variables.generalId) });
      message.success('Xóa mảnh tướng thành công');
    },
  });
};
