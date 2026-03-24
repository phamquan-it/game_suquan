import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { RequirementFormData } from '../types/quest.types';
import { supabase } from '@/utils/supabase/client';
import { QuestRequirement } from '../types';

export const useQuestRequirements = (questId: string) => {
  return useQuery({
    queryKey: ['questRequirements', questId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quest_requirements')
        .select('*')
        .eq('quest_id', questId)
        .order('requirement_type');

      if (error) {
        message.error('Không thể tải yêu cầu nhiệm vụ');
        throw error;
      }

      return data as QuestRequirement[];
    },
    enabled: !!questId,
  });
};

export const useCreateRequirement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requirement: RequirementFormData & { quest_id: string }) => {
      const { data, error } = await supabase
        .from('quest_requirements')
        .insert([requirement])
        .select()
        .single();

      if (error) {
        message.error('Không thể thêm yêu cầu');
        throw error;
      }

      return data;
    },
    onSuccess: (_, variables) => {
      message.success('Thêm yêu cầu thành công');
      queryClient.invalidateQueries({ queryKey: ['questRequirements', variables.quest_id] });
    },
  });
};

export const useUpdateRequirement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quest_id, ...data }: Partial<QuestRequirement> & { id: string; quest_id: string }) => {
      const { error } = await supabase
        .from('quest_requirements')
        .update(data)
        .eq('id', id);

      if (error) {
        message.error('Không thể cập nhật yêu cầu');
        throw error;
      }

      return { id, quest_id };
    },
    onSuccess: ({ quest_id }) => {
      message.success('Cập nhật yêu cầu thành công');
      queryClient.invalidateQueries({ queryKey: ['questRequirements', quest_id] });
    },
  });
};

export const useDeleteRequirement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quest_id }: { id: string; quest_id: string }) => {
      const { error } = await supabase
        .from('quest_requirements')
        .delete()
        .eq('id', id);

      if (error) {
        message.error('Không thể xóa yêu cầu');
        throw error;
      }

      return { id, quest_id };
    },
    onSuccess: ({ quest_id }) => {
      message.success('Xóa yêu cầu thành công');
      queryClient.invalidateQueries({ queryKey: ['questRequirements', quest_id] });
    },
  });
};
