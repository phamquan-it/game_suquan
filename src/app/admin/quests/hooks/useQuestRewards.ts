import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { RewardFormData } from '../types/quest.types';
import { supabase } from '@/utils/supabase/client';
import { QuestReward } from '../types';

export const useQuestRewards = (questId: string) => {
  return useQuery({
    queryKey: ['questRewards', questId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quest_rewards')
        .select(`
          *,
          item:item_id (
            id,
            name,
            type,
            rarity,
            icon
          ),
          currency:currency_type (
            currency_type,
            name
          )
        `)
        .eq('quest_id', questId)
        .order('created_at');

      if (error) {
        message.error('Không thể tải phần thưởng nhiệm vụ');
        throw error;
      }

      return data as (QuestReward & {
        item?: { id: string; name: string; type: string; rarity: string; icon: string | null };
        currency?: { currency_type: string; name: string };
      })[];
    },
    enabled: !!questId,
  });
};

export const useCreateReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reward: RewardFormData & { quest_id: string }) => {
      // Validate based on reward type
      if (reward.reward_type === 'item' && !reward.item_id) {
        throw new Error('Vui lòng chọn vật phẩm');
      }
      if (reward.reward_type === 'currency' && !reward.currency_type) {
        throw new Error('Vui lòng chọn loại tiền tệ');
      }
      if (reward.reward_type === 'experience' && !reward.experience_amount) {
        throw new Error('Vui lòng nhập số kinh nghiệm');
      }

      // Prepare data for insertion
      const insertData: any = {
        quest_id: reward.quest_id,
        reward_type: reward.reward_type,
        amount: reward.amount || 1,
        description: reward.description || null,
      };

      // Add type-specific fields
      if (reward.reward_type === 'item') {
        insertData.item_id = reward.item_id;
      } else if (reward.reward_type === 'currency') {
        insertData.currency_type = reward.currency_type;
      } else if (reward.reward_type === 'experience') {
        insertData.experience_amount = reward.experience_amount;
      }

      const { data, error } = await supabase
        .from('quest_rewards')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Error creating reward:', error);
        message.error('Không thể thêm phần thưởng');
        throw error;
      }

      return data;
    },
    onSuccess: (_, variables) => {
      message.success('Thêm phần thưởng thành công');
      queryClient.invalidateQueries({ queryKey: ['questRewards', variables.quest_id] });
    },
    onError: (error: any) => {
      message.error(error.message || 'Không thể thêm phần thưởng');
    },
  });
};

export const useUpdateReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quest_id, ...data }: Partial<QuestReward> & { id: string; quest_id: string }) => {
      // Prepare update data
      const updateData: any = {
        ...data,
        updated_at: new Date().toISOString(),
      };

      // Clean up based on reward type
      if (data.reward_type === 'item') {
        delete updateData.currency_type;
        delete updateData.experience_amount;
      } else if (data.reward_type === 'currency') {
        delete updateData.item_id;
        delete updateData.experience_amount;
      } else if (data.reward_type === 'experience') {
        delete updateData.item_id;
        delete updateData.currency_type;
        delete updateData.amount;
      }

      const { error } = await supabase
        .from('quest_rewards')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating reward:', error);
        message.error('Không thể cập nhật phần thưởng');
        throw error;
      }

      return { id, quest_id };
    },
    onSuccess: ({ quest_id }) => {
      message.success('Cập nhật phần thưởng thành công');
      queryClient.invalidateQueries({ queryKey: ['questRewards', quest_id] });
    },
    onError: (error: any) => {
      message.error(error.message || 'Không thể cập nhật phần thưởng');
    },
  });
};

export const useDeleteReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quest_id }: { id: string; quest_id: string }) => {
      const { error } = await supabase
        .from('quest_rewards')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting reward:', error);
        message.error('Không thể xóa phần thưởng');
        throw error;
      }

      return { id, quest_id };
    },
    onSuccess: ({ quest_id }) => {
      message.success('Xóa phần thưởng thành công');
      queryClient.invalidateQueries({ queryKey: ['questRewards', quest_id] });
    },
    onError: (error: any) => {
      message.error(error.message || 'Không thể xóa phần thưởng');
    },
  });
};

// Optional: Hook for bulk operations
export const useBulkRewardOperations = () => {
  const queryClient = useQueryClient();

  const bulkCreateRewards = useMutation({
    mutationFn: async ({ quest_id, rewards }: { quest_id: string; rewards: RewardFormData[] }) => {
      const rewardsToInsert = rewards.map(reward => ({
        quest_id,
        ...reward,
      }));

      const { data, error } = await supabase
        .from('quest_rewards')
        .insert(rewardsToInsert)
        .select();

      if (error) {
        message.error('Không thể thêm nhiều phần thưởng');
        throw error;
      }

      return data;
    },
    onSuccess: (_, variables) => {
      message.success('Thêm phần thưởng thành công');
      queryClient.invalidateQueries({ queryKey: ['questRewards', variables.quest_id] });
    },
  });

  const bulkDeleteRewards = useMutation({
    mutationFn: async ({ quest_id, reward_ids }: { quest_id: string; reward_ids: string[] }) => {
      const { error } = await supabase
        .from('quest_rewards')
        .delete()
        .in('id', reward_ids);

      if (error) {
        message.error('Không thể xóa nhiều phần thưởng');
        throw error;
      }

      return { quest_id };
    },
    onSuccess: ({ quest_id }) => {
      message.success('Xóa phần thưởng thành công');
      queryClient.invalidateQueries({ queryKey: ['questRewards', quest_id] });
    },
  });

  return {
    bulkCreateRewards,
    bulkDeleteRewards,
  };
};
