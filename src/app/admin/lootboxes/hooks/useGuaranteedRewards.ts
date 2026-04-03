// hooks/useLootBoxGuaranteedRewards.ts
import { supabase } from '@/utils/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LootBoxGuaranteedReward, LootBoxRewardItem } from '../types';


export const useLootBoxGuaranteedRewards = () => {
  const queryClient = useQueryClient();

  // ---------- Fetch all rewards for a specific guaranteed drop ----------
  const fetchRewardsByDropId = async (guaranteedDropId: string) => {
    const { data, error } = await supabase
      .from('loot_box_guaranteed_rewards')
      .select(`
        *,
        loot_box_reward_items (*)
      `)
      .eq('guaranteed_drop_id', guaranteedDropId);

    if (error) throw error;
    return data as (LootBoxGuaranteedReward & { loot_box_reward_items: LootBoxRewardItem })[];
  };

  // ---------- Fetch a single guaranteed reward by its ID ----------
  const fetchLootBoxGuaranteedRewardById = async (id: string) => {
    const { data, error } = await supabase
      .from('loot_box_guaranteed_rewards')
      .select(`
        *,
        loot_box_reward_items (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as LootBoxGuaranteedReward & { loot_box_reward_items: LootBoxRewardItem };
  };

  // ---------- Create a guaranteed reward (link a reward item to a drop) ----------
  const createLootBoxGuaranteedReward = async (
    reward: Omit<LootBoxGuaranteedReward, 'id'>
  ) => {
    const { data, error } = await supabase
      .from('loot_box_guaranteed_rewards')
      .insert(reward)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  // ---------- Delete a guaranteed reward by ID ----------
  const deleteLootBoxGuaranteedReward = async (id: string) => {
    const { error } = await supabase
      .from('loot_box_guaranteed_rewards')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return id;
  };

  // ---------- Bulk operations: add/remove multiple rewards to a drop ----------
  const setLootBoxGuaranteedRewardsForDrop = async (
    guaranteedDropId: string,
    rewardItemIds: string[]
  ) => {
    // First, delete all existing rewards for this drop
    const { error: deleteError } = await supabase
      .from('loot_box_guaranteed_rewards')
      .delete()
      .eq('guaranteed_drop_id', guaranteedDropId);
    if (deleteError) throw deleteError;

    // Then insert new ones
    if (rewardItemIds.length === 0) return [];

    const rewardsToInsert = rewardItemIds.map(rewardItemId => ({
      guaranteed_drop_id: guaranteedDropId,
      reward_item_id: rewardItemId,
    }));

    const { data, error: insertError } = await supabase
      .from('loot_box_guaranteed_rewards')
      .insert(rewardsToInsert)
      .select();

    if (insertError) throw insertError;
    return data;
  };

  // ---------- React Query Hooks ----------
  const useGetRewardsByDropId = (guaranteedDropId: string) =>
    useQuery({
      queryKey: ['guaranteedRewards', guaranteedDropId],
      queryFn: () => fetchRewardsByDropId(guaranteedDropId),
      enabled: !!guaranteedDropId,
    });

  const useGetLootBoxGuaranteedReward = (id: string) =>
    useQuery({
      queryKey: ['guaranteedReward', id],
      queryFn: () => fetchLootBoxGuaranteedRewardById(id),
      enabled: !!id,
    });

  const useCreateLootBoxGuaranteedReward = () =>
    useMutation({
      mutationFn: createLootBoxGuaranteedReward,
      onSuccess: (_, variables) => {
        // Invalidate the list for the drop this reward belongs to
        queryClient.invalidateQueries({
          queryKey: ['guaranteedRewards', variables.guaranteed_drop_id],
        });
      },
    });

  const useDeleteLootBoxGuaranteedReward = () =>
    useMutation({
      mutationFn: deleteLootBoxGuaranteedReward,
      onSuccess: (_, id) => {
        // Invalidate any queries that might contain this reward
        // Since we don't have the drop ID directly, we can invalidate all guaranteedRewards queries
        queryClient.invalidateQueries({ queryKey: ['guaranteedRewards'] });
      },
    });

  const useSetLootBoxGuaranteedRewardsForDrop = () =>
    useMutation({
      mutationFn: ({
        guaranteedDropId,
        rewardItemIds,
      }: {
        guaranteedDropId: string;
        rewardItemIds: string[];
      }) => setLootBoxGuaranteedRewardsForDrop(guaranteedDropId, rewardItemIds),
      onSuccess: (_, { guaranteedDropId }) => {
        queryClient.invalidateQueries({
          queryKey: ['guaranteedRewards', guaranteedDropId],
        });
        // Also invalidate any queries that depend on the drop's data (e.g., the drop itself)
        queryClient.invalidateQueries({
          queryKey: ['guaranteedDrop', guaranteedDropId],
        });
      },
    });

  return {
    // Direct functions
    fetchRewardsByDropId,
    fetchLootBoxGuaranteedRewardById,
    createLootBoxGuaranteedReward,
    deleteLootBoxGuaranteedReward,
    setLootBoxGuaranteedRewardsForDrop,

    // React Query hooks
    useGetRewardsByDropId,
    useGetLootBoxGuaranteedReward,
    useCreateLootBoxGuaranteedReward,
    useDeleteLootBoxGuaranteedReward,
    useSetLootBoxGuaranteedRewardsForDrop,
  };
};
