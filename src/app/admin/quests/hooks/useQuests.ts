import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message, notification } from 'antd';
import { Quest, QuestRequirement, QuestReward } from '../types';
import { QuestFilters, QuestListResponse } from '../types/quest.types';
import { supabase } from '@/utils/supabase/client';

const fetchQuests = async (filters: QuestFilters): Promise<QuestListResponse> => {
  let query = supabase
    .from('quests')
    .select('*', { count: 'exact' });

  // Apply filters
  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }
  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }
  if (filters.difficulty && filters.difficulty !== 'all') {
    query = query.eq('difficulty', filters.difficulty);
  }
  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }
  if (filters.type && filters.type !== 'all') {
    query = query.eq('type', filters.type);
  }
  if (filters.minLevel) {
    query = query.gte('min_level', filters.minLevel);
  }
  if (filters.maxLevel) {
    query = query.lte('max_level', filters.maxLevel);
  }

  // Pagination
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  query = query
    .order('created_at', { ascending: false })
    .range(start, end);

  const { data, error, count } = await query;

  if (error) {
    message.error('Không thể tải danh sách nhiệm vụ');
    throw error;
  }

  return {
    data: data as Quest[],
    total: count || 0,
    page,
    pageSize,
  };
};

export const useQuests = (filters: QuestFilters) => {
  return useQuery({
    queryKey: ['quests', filters],
    queryFn: () => fetchQuests(filters),
  });
};

export const useQuest = (id: string) => {
  return useQuery({
    queryKey: ['quest', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quests')
        .select(`
          *,
          quest_requirements (*),
          quest_rewards (*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        message.error('Không thể tải thông tin nhiệm vụ');
        throw error;
      }

      return data as Quest & {
        quest_requirements: QuestRequirement[];
        quest_rewards: QuestReward[];
      };
    },
    enabled: !!id,
  });
};


export const useUpdateReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quest_id, ...data }: Partial<QuestReward> & { id: string; quest_id: string }) => {
      // Prepare update data
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      // Handle different reward types and clean up data
      if (data.reward_type) {
        updateData.reward_type = data.reward_type;
      }

      // Handle item reward
      if (data.reward_type === 'item' || data.item_id) {
        if (data.item_id !== undefined) updateData.item_id = data.item_id || null;
        if (data.amount !== undefined) updateData.amount = data.amount;
        // Clear other type-specific fields
        updateData.currency_type = null;
        updateData.experience_amount = null;
      }
      // Handle currency reward
      else if (data.reward_type === 'currency' || data.currency_type) {
        if (data.currency_type !== undefined) updateData.currency_type = data.currency_type || null;
        if (data.amount !== undefined) updateData.amount = data.amount;
        // Clear other type-specific fields
        updateData.item_id = null;
        updateData.experience_amount = null;
      }
      // Handle experience reward
      else if (data.reward_type === 'experience' || data.experience_amount) {
        if (data.experience_amount !== undefined) updateData.experience_amount = data.experience_amount;
        // Clear other type-specific fields
        updateData.item_id = null;
        updateData.currency_type = null;
        updateData.amount = 1; // Default amount for experience
      }

      // Handle description
      if (data.description !== undefined) {
        updateData.description = data.description;
      }

      // Log the update data for debugging
      console.log('Updating reward with data:', { id, ...updateData });

      const { error, data: updatedData } = await supabase
        .from('quest_rewards')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating reward:', error);
        throw new Error(error.message || 'Không thể cập nhật phần thưởng');
      }

      return { id, quest_id, data: updatedData };
    },

    onSuccess: ({ quest_id }) => {
      // Show success message
      message.success({
        content: 'Cập nhật phần thưởng thành công',
        duration: 3,
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ['questRewards', quest_id]
      });

      // Also invalidate the specific reward if needed
      queryClient.invalidateQueries({
        queryKey: ['questReward']
      });
    },

    onError: (error: any) => {
      // Show error message
      message.error({
        content: error.message || 'Không thể cập nhật phần thưởng',
        duration: 4,
      });
    },

    // Optional: Add retry logic
    retry: (failureCount, error: any) => {
      // Don't retry on validation errors
      if (error.message?.includes('Vui lòng')) {
        return false;
      }
      // Retry up to 2 times for network errors
      return failureCount < 2;
    },
  });
};


export const useDeleteReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quest_id }: { id: string; quest_id: string }) => {
      // First, check if this reward is being used anywhere else
      const { data: usageData, error: usageError } = await supabase
        .from('quest_rewards')
        .select('id')
        .eq('id', id)
        .single();

      if (usageError) {
        console.error('Error checking reward usage:', usageError);
        throw new Error('Không thể kiểm tra phần thưởng');
      }

      if (!usageData) {
        throw new Error('Không tìm thấy phần thưởng');
      }

      // Optional: Add a soft delete or archive before hard delete
      // For now, we'll do hard delete
      const { error, data } = await supabase
        .from('quest_rewards')
        .delete()
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error deleting reward:', error);

        // Handle foreign key constraints or other errors
        if (error.code === '23503') { // Foreign key violation
          throw new Error('Không thể xóa vì phần thưởng đang được sử dụng');
        }

        throw new Error(error.message || 'Không thể xóa phần thưởng');
      }

      return {
        id,
        quest_id,
        deleted: true,
        data: data?.[0] // Return deleted data if needed
      };
    },

    onSuccess: ({ quest_id }) => {
      // Show success message
      message.success({
        content: 'Xóa phần thưởng thành công',
        duration: 3,
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ['questRewards', quest_id]
      });

      // Optional: Show additional notification
      notification.success({
        message: 'Thành công',
        description: 'Phần thưởng đã được xóa khỏi hệ thống',
        placement: 'topRight',
      });
    },

    onError: (error: any) => {
      // Show error message
      message.error({
        content: error.message || 'Không thể xóa phần thưởng',
        duration: 4,
      });

      // Optional: Show more detailed error in notification
      notification.error({
        message: 'Lỗi xóa phần thưởng',
        description: error.message || 'Đã có lỗi xảy ra khi xóa phần thưởng',
        placement: 'topRight',
      });
    },

    // Optimistic update for better UX
    onMutate: async ({ id, quest_id }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['questRewards', quest_id]
      });

      // Snapshot the previous value
      const previousRewards = queryClient.getQueryData(['questRewards', quest_id]);

      // Optimistically remove the reward from the cache
      queryClient.setQueryData(['questRewards', quest_id], (old: any) => {
        return old?.filter((reward: any) => reward.id !== id) || [];
      });

      return { previousRewards, quest_id };
    },

    onError: (error: any, variables, context: any) => {
      // Rollback optimistic update on error
      if (context?.previousRewards) {
        queryClient.setQueryData(
          ['questRewards', context.quest_id],
          context.previousRewards
        );
      }

      // Show error message
      message.error({
        content: error.message || 'Không thể xóa phần thưởng',
        duration: 4,
      });
    },

    // Always refetch after error or success
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['questRewards', variables.quest_id]
      });
    },
  });
};
