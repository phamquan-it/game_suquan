import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { CreateQuestInput, Quest, UpdateQuestInput } from '../types';
import { supabase } from '@/utils/supabase/client';

export const useCreateQuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questData: CreateQuestInput) => {
      const { data, error } = await supabase
        .from('quests')
        .insert([questData])
        .select()
        .single();

      if (error) {
        message.error('Không thể tạo nhiệm vụ mới');
        throw error;
      }

      return data as Quest;
    },
    onSuccess: () => {
      message.success('Tạo nhiệm vụ thành công');
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    },
  });
};

export const useUpdateQuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateQuestInput & { id: string }) => {
      const { error } = await supabase
        .from('quests')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        message.error('Không thể cập nhật nhiệm vụ');
        throw error;
      }

      return id;
    },
    onSuccess: (id) => {
      message.success('Cập nhật nhiệm vụ thành công');
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      queryClient.invalidateQueries({ queryKey: ['quest', id] });
    },
  });
};

export const useDeleteQuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('quests')
        .delete()
        .eq('id', id);

      if (error) {
        message.error('Không thể xóa nhiệm vụ');
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      message.success('Xóa nhiệm vụ thành công');
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    },
  });
};

export const useToggleQuestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'active' | 'inactive' }) => {
      const { error } = await supabase
        .from('quests')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        message.error('Không thể thay đổi trạng thái nhiệm vụ');
        throw error;
      }

      return id;
    },
    onSuccess: (id) => {
      message.success('Cập nhật trạng thái thành công');
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      queryClient.invalidateQueries({ queryKey: ['quest', id] });
    },
  });
};
