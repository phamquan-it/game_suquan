// app/admin/units/hooks/useUnitMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { CreateUnitDTO, UpdateUnitDTO } from '../types';
import { supabase } from '@/utils/supabase/client';

export const useCreateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUnitDTO) => {
      const { data: unit, error } = await supabase
        .from('units')
        .insert([{
          id: data.id,
          name: data.name,
          type: data.type,
          description: data.description,
          max_hp: data.maxHp,
          current_hp: data.currentHp,
          atk: data.atk,
          def: data.def,
          speed: data.speed,
          range: data.range || 1,
          level: data.level || 1,
          quantity: data.quantity || 1,
          is_vip: data.isVip || false,
          rank: data.rank || 'regular',
          is_special: data.isSpecial || false,
          image_path: data.imagePath,
        }])
        .select()
        .single();

      if (error) throw error;
      return unit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      message.success('Unit created successfully');
    },
    onError: (error: Error) => {
      message.error(`Failed to create unit: ${error.message}`);
    },
  });
};

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUnitDTO) => {
      const { id, ...updateData } = data;
      const { data: unit, error } = await supabase
        .from('units')
        .update({
          name: updateData.name,
          type: updateData.type,
          description: updateData.description,
          max_hp: updateData.maxHp,
          current_hp: updateData.currentHp,
          atk: updateData.atk,
          def: updateData.def,
          speed: updateData.speed,
          range: updateData.range,
          level: updateData.level,
          quantity: updateData.quantity,
          is_vip: updateData.isVip,
          rank: updateData.rank,
          is_special: updateData.isSpecial,
          image_path: updateData.imagePath,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return unit;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['unit', variables.id] });
      message.success('Unit updated successfully');
    },
    onError: (error: Error) => {
      message.error(`Failed to update unit: ${error.message}`);
    },
  });
};

export const useDeleteUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('units')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      message.success('Unit deleted successfully');
    },
    onError: (error: Error) => {
      message.error(`Failed to delete unit: ${error.message}`);
    },
  });
};

export const useAssignSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ unitId, skillId }: { unitId: string; skillId: string }) => {
      const { data, error } = await supabase
        .from('unit_skills')
        .insert([{ unit_id: unitId, skill_id: skillId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['unit', variables.unitId] });
      queryClient.invalidateQueries({ queryKey: ['units'] });
      message.success('Skill assigned successfully');
    },
    onError: (error: Error) => {
      message.error(`Failed to assign skill: ${error.message}`);
    },
  });
};

export const useRemoveSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ unitId, skillId }: { unitId: string; skillId: string }) => {
      const { error } = await supabase
        .from('unit_skills')
        .delete()
        .eq('unit_id', unitId)
        .eq('skill_id', skillId);

      if (error) throw error;
      return { unitId, skillId };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['unit', variables.unitId] });
      queryClient.invalidateQueries({ queryKey: ['units'] });
      message.success('Skill removed successfully');
    },
    onError: (error: Error) => {
      message.error(`Failed to remove skill: ${error.message}`);
    },
  });
};
