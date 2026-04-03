// hooks/useLootBoxGuaranteedDrops.ts
import { useState, useCallback } from 'react';
import { supabase } from '@/utils/supabase/client';
import { LootBoxGuaranteedDropFull, LootBoxRewardItem } from '../types/database';
interface UseLootBoxGuaranteedDropsProps {
  lootBoxId: string;
}

export const useLootBoxGuaranteedDrops = ({ lootBoxId }: UseLootBoxGuaranteedDropsProps) => {
  const [guaranteedDrops, setGuaranteedDrops] = useState<LootBoxGuaranteedDropFull[]>([]);
  const [availableRewardItems, setAvailableRewardItems] = useState<LootBoxRewardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGuaranteedDrops = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('loot_box_guaranteed_drops')
        .select(`
          *,
          loot_box_guaranteed_rewards (
            *,
            loot_box_reward_items (*)
          )
        `)
        .eq('loot_box_id', lootBoxId)
        .order('open_count', { ascending: true });

      if (error) throw error;

      const transformedData: LootBoxGuaranteedDropFull[] = (data || []).map(drop => ({
        ...drop,
        loot_box_guaranteed_rewards: drop.loot_box_guaranteed_rewards?.map((reward: any) => ({
          ...reward,
          loot_box_reward_items: reward.loot_box_reward_items
        })) || []
      }));

      setGuaranteedDrops(transformedData);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching guaranteed drops:', err);
    } finally {
      setLoading(false);
    }
  }, [lootBoxId]);

  const fetchAvailableRewardItems = useCallback(async (rewardPoolId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('loot_box_reward_items')
        .select('*')
        .eq('reward_pool_id', rewardPoolId);

      if (error) throw error;
      setAvailableRewardItems(data || []);
    } catch (err: any) {
      console.error('Error fetching reward items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createGuaranteedDrop = useCallback(async (dropData: {
    id: string; // ✅ thêm id từ ngoài truyền vào
    loot_box_id: string;
    open_count: number;
    reset_after_claim: boolean;
    rewards: { reward_item_id: string }[];
  }) => {
    setLoading(true);
    try {
      // First create the drop
      const { data: drop, error: dropError } = await supabase
        .from('loot_box_guaranteed_drops')
        .insert({
          id: dropData.id, // ✅ dùng id user truyền
          loot_box_id: dropData.loot_box_id,
          open_count: dropData.open_count,
          reset_after_claim: dropData.reset_after_claim,
        })
        .select()
        .single();

      if (dropError) throw dropError;

      // Then create the rewards
      if (dropData.rewards.length > 0) {
        const rewardsToInsert = dropData.rewards.map(reward => ({
          guaranteed_drop_id: dropData.id, // ✅ dùng cùng id
          reward_item_id: reward.reward_item_id,
        }));

        const { error: rewardsError } = await supabase
          .from('loot_box_guaranteed_rewards')
          .insert(rewardsToInsert);

        if (rewardsError) throw rewardsError;
      }

      await fetchGuaranteedDrops();
      return drop;
    } catch (err: any) {
      setError(err.message);
      console.error('Error creating guaranteed drop:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchGuaranteedDrops]);

  const updateGuaranteedDrop = useCallback(async (id: string, updates: {
    open_count?: number;
    reset_after_claim?: boolean;
    rewards?: Array<{ id?: string; reward_item_id: string; _delete?: boolean }>;
  }) => {
    setLoading(true);
    try {
      // Update drop if needed
      if (updates.open_count !== undefined || updates.reset_after_claim !== undefined) {
        const { error: dropError } = await supabase
          .from('loot_box_guaranteed_drops')
          .update({
            open_count: updates.open_count,
            reset_after_claim: updates.reset_after_claim,
          })
          .eq('id', id);

        if (dropError) throw dropError;
      }

      // Update rewards if needed
      if (updates.rewards) {
        for (const reward of updates.rewards) {
          if (reward._delete && reward.id) {
            // Delete existing reward
            const { error: deleteError } = await supabase
              .from('loot_box_guaranteed_rewards')
              .delete()
              .eq('id', reward.id);

            if (deleteError) throw deleteError;
          } else if (!reward.id) {
            // Create new reward
            const { error: createError } = await supabase
              .from('loot_box_guaranteed_rewards')
              .insert({
                guaranteed_drop_id: id,
                reward_item_id: reward.reward_item_id,
              });

            if (createError) throw createError;
          }
        }
      }

      await fetchGuaranteedDrops();
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating guaranteed drop:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchGuaranteedDrops]);

  const deleteGuaranteedDrop = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('loot_box_guaranteed_drops')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchGuaranteedDrops();
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting guaranteed drop:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchGuaranteedDrops]);

  const deleteGuaranteedReward = useCallback(async (rewardId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('loot_box_guaranteed_rewards')
        .delete()
        .eq('id', rewardId);

      if (error) throw error;
      await fetchGuaranteedDrops();
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting guaranteed reward:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchGuaranteedDrops]);

  const validateOpenCount = useCallback((openCount: number, existingDrops: LootBoxGuaranteedDropFull[]) => {
    return !existingDrops.some(drop => drop.open_count === openCount);
  }, []);

  const getNextAvailableOpenCount = useCallback((existingDrops: LootBoxGuaranteedDropFull[]) => {
    const usedCounts = existingDrops.map(drop => drop.open_count).sort((a, b) => a - b);
    let nextCount = 1;
    for (const count of usedCounts) {
      if (count === nextCount) {
        nextCount++;
      } else {
        break;
      }
    }
    return nextCount;
  }, []);

  return {
    guaranteedDrops,
    availableRewardItems,
    loading,
    error,
    fetchGuaranteedDrops,
    fetchAvailableRewardItems,
    createGuaranteedDrop,
    updateGuaranteedDrop,
    deleteGuaranteedDrop,
    deleteGuaranteedReward,
    validateOpenCount,
    getNextAvailableOpenCount,
  };
};
