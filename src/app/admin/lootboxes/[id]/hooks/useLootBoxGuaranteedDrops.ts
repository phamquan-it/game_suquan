import { supabase } from "@/utils/supabase/client";
import { useCallback, useEffect, useState } from "react";

// types/lootBox.ts
export interface LootBoxGuaranteedDrop {
  id: string;
  loot_box_id: string;
  open_count: number;
  reset_after_claim: boolean;
  rewards?: LootBoxGuaranteedReward[];
}

export interface LootBoxGuaranteedReward {
  id: string;
  guaranteed_drop_id: string;
  reward_item_id: string;
  reward_item?: LootBoxRewardItem;
}

export interface LootBoxRewardItem {
  id: string;
  reward_pool_id: string;
  reward_type: 'item' | 'currency' | 'experience' | 'vip_points' | 'alliance_points' | 'cosmetic' | 'title' | 'mount' | 'pet' | 'skill_point' | 'stat_point';
  item_id: string | null;
  currency_type: string | null;
  amount_min: number;
  amount_max: number;
  weight: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'ancient' | 'divine';
  bound_type: 'none' | 'account' | 'character';
}

export interface CreateGuaranteedDropDTO {
  loot_box_id: string;
  open_count: number;
  reset_after_claim?: boolean;
  rewards: Array<{
    reward_item_id: string;
  }>;
}

export interface UpdateGuaranteedDropDTO {
  open_count?: number;
  reset_after_claim?: boolean;
  rewards?: Array<{
    id?: string;
    reward_item_id: string;
    _delete?: boolean;
  }>;
}

interface UseLootBoxGuaranteedDropsProps {
  lootBoxId?: string;
  autoFetch?: boolean;
}

interface UseLootBoxGuaranteedDropsReturn {
  // Data
  guaranteedDrops: LootBoxGuaranteedDrop[];
  selectedDrop: LootBoxGuaranteedDrop | null;
  availableRewardItems: LootBoxRewardItem[];
  loading: boolean;
  error: string | null;

  // CRUD Operations
  fetchGuaranteedDrops: (lootBoxId?: string) => Promise<void>;
  fetchAvailableRewardItems: (rewardPoolId: string) => Promise<void>;
  getGuaranteedDropById: (id: string) => Promise<LootBoxGuaranteedDrop | null>;
  createGuaranteedDrop: (data: CreateGuaranteedDropDTO) => Promise<LootBoxGuaranteedDrop | null>;
  updateGuaranteedDrop: (id: string, data: UpdateGuaranteedDropDTO) => Promise<LootBoxGuaranteedDrop | null>;
  deleteGuaranteedDrop: (id: string) => Promise<boolean>;
  deleteGuaranteedReward: (rewardId: string) => Promise<boolean>;

  // Selection
  setSelectedDrop: (drop: LootBoxGuaranteedDrop | null) => void;
  clearSelectedDrop: () => void;

  // Utilities
  resetState: () => void;
  validateOpenCount: (openCount: number, existingDrops?: LootBoxGuaranteedDrop[]) => boolean;
  getNextAvailableOpenCount: (existingDrops: LootBoxGuaranteedDrop[]) => number;
}

export const useLootBoxGuaranteedDrops = ({
  lootBoxId,
  autoFetch = true,
}: UseLootBoxGuaranteedDropsProps = {}): UseLootBoxGuaranteedDropsReturn => {
  const [guaranteedDrops, setGuaranteedDrops] = useState<LootBoxGuaranteedDrop[]>([]);
  const [selectedDrop, setSelectedDrop] = useState<LootBoxGuaranteedDrop | null>(null);
  const [availableRewardItems, setAvailableRewardItems] = useState<LootBoxRewardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch guaranteed drops with their rewards
  const fetchGuaranteedDrops = useCallback(async (boxId?: string) => {
    const targetLootBoxId = boxId || lootBoxId;

    if (!targetLootBoxId) {
      setError('Loot box ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch guaranteed drops
      const { data: drops, error: dropsError } = await supabase
        .from('loot_box_guaranteed_drops')
        .select(`
          *,
          rewards:loot_box_guaranteed_rewards (
            *,
            reward_item:loot_box_reward_items (*)
          )
        `)
        .eq('loot_box_id', targetLootBoxId)
        .order('open_count', { ascending: true });

      if (dropsError) throw dropsError;

      setGuaranteedDrops(drops || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch guaranteed drops';
      setError(errorMessage);
      console.error('Error fetching guaranteed drops:', err);
    } finally {
      setLoading(false);
    }
  }, [lootBoxId]);

  // Fetch available reward items for a specific reward pool
  const fetchAvailableRewardItems = useCallback(async (rewardPoolId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data: items, error: itemsError } = await supabase
        .from('loot_box_reward_items')
        .select('*')
        .eq('reward_pool_id', rewardPoolId)
        .order('rarity', { ascending: false });

      if (itemsError) throw itemsError;

      setAvailableRewardItems(items || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch reward items';
      setError(errorMessage);
      console.error('Error fetching reward items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single guaranteed drop by ID
  const getGuaranteedDropById = useCallback(async (id: string): Promise<LootBoxGuaranteedDrop | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data: drop, error: dropError } = await supabase
        .from('loot_box_guaranteed_drops')
        .select(`
          *,
          rewards:loot_box_guaranteed_rewards (
            *,
            reward_item:loot_box_reward_items (*)
          )
        `)
        .eq('id', id)
        .single();

      if (dropError) throw dropError;

      return drop;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch guaranteed drop';
      setError(errorMessage);
      console.error('Error fetching guaranteed drop:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new guaranteed drop with rewards
  const createGuaranteedDrop = useCallback(async (
    data: CreateGuaranteedDropDTO
  ): Promise<LootBoxGuaranteedDrop | null> => {
    setLoading(true);
    setError(null);

    try {
      // Start a transaction
      const { data: drop, error: dropError } = await supabase
        .from('loot_box_guaranteed_drops')
        .insert({
          loot_box_id: data.loot_box_id,
          open_count: data.open_count,
          reset_after_claim: data.reset_after_claim ?? true,
        })
        .select()
        .single();

      if (dropError) throw dropError;

      // Insert rewards if any
      if (data.rewards && data.rewards.length > 0) {
        const rewardsToInsert = data.rewards.map(reward => ({
          guaranteed_drop_id: drop.id,
          reward_item_id: reward.reward_item_id,
        }));

        const { error: rewardsError } = await supabase
          .from('loot_box_guaranteed_rewards')
          .insert(rewardsToInsert);

        if (rewardsError) throw rewardsError;
      }

      // Fetch the complete drop with rewards
      const completeDrop = await getGuaranteedDropById(drop.id);

      // Update local state
      if (completeDrop) {
        setGuaranteedDrops(prev => [...prev, completeDrop].sort((a, b) => a.open_count - b.open_count));
      }

      return completeDrop;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create guaranteed drop';
      setError(errorMessage);
      console.error('Error creating guaranteed drop:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getGuaranteedDropById]);

  // Update guaranteed drop and its rewards
  const updateGuaranteedDrop = useCallback(async (
    id: string,
    data: UpdateGuaranteedDropDTO
  ): Promise<LootBoxGuaranteedDrop | null> => {
    setLoading(true);
    setError(null);

    try {
      // Update drop details
      const updateData: any = {};
      if (data.open_count !== undefined) updateData.open_count = data.open_count;
      if (data.reset_after_claim !== undefined) updateData.reset_after_claim = data.reset_after_claim;

      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabase
          .from('loot_box_guaranteed_drops')
          .update(updateData)
          .eq('id', id);

        if (updateError) throw updateError;
      }

      // Update rewards if provided
      if (data.rewards && data.rewards.length > 0) {
        for (const reward of data.rewards) {
          if (reward._delete && reward.id) {
            // Delete reward
            const { error: deleteError } = await supabase
              .from('loot_box_guaranteed_rewards')
              .delete()
              .eq('id', reward.id);

            if (deleteError) throw deleteError;
          } else if (reward.id) {
            // Update existing reward
            const { error: updateError } = await supabase
              .from('loot_box_guaranteed_rewards')
              .update({ reward_item_id: reward.reward_item_id })
              .eq('id', reward.id);

            if (updateError) throw updateError;
          } else {
            // Create new reward
            const { error: insertError } = await supabase
              .from('loot_box_guaranteed_rewards')
              .insert({
                guaranteed_drop_id: id,
                reward_item_id: reward.reward_item_id,
              });

            if (insertError) throw insertError;
          }
        }
      }

      // Fetch updated drop
      const updatedDrop = await getGuaranteedDropById(id);

      // Update local state
      if (updatedDrop) {
        setGuaranteedDrops(prev =>
          prev.map(drop => drop.id === id ? updatedDrop : drop)
            .sort((a, b) => a.open_count - b.open_count)
        );

        if (selectedDrop?.id === id) {
          setSelectedDrop(updatedDrop);
        }
      }

      return updatedDrop;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update guaranteed drop';
      setError(errorMessage);
      console.error('Error updating guaranteed drop:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getGuaranteedDropById, selectedDrop]);

  // Delete guaranteed drop and its rewards (cascade will handle rewards)
  const deleteGuaranteedDrop = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('loot_box_guaranteed_drops')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Update local state
      setGuaranteedDrops(prev => prev.filter(drop => drop.id !== id));

      if (selectedDrop?.id === id) {
        setSelectedDrop(null);
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete guaranteed drop';
      setError(errorMessage);
      console.error('Error deleting guaranteed drop:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedDrop]);

  // Delete single reward from guaranteed drop
  const deleteGuaranteedReward = useCallback(async (rewardId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('loot_box_guaranteed_rewards')
        .delete()
        .eq('id', rewardId);

      if (deleteError) throw deleteError;

      // Update local state
      setGuaranteedDrops(prev => prev.map(drop => ({
        ...drop,
        rewards: drop.rewards?.filter(reward => reward.id !== rewardId)
      })));

      if (selectedDrop) {
        setSelectedDrop({
          ...selectedDrop,
          rewards: selectedDrop.rewards?.filter(reward => reward.id !== rewardId)
        });
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete reward';
      setError(errorMessage);
      console.error('Error deleting reward:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedDrop]);

  // Validate open count to ensure no duplicates
  const validateOpenCount = useCallback((openCount: number, existingDrops: LootBoxGuaranteedDrop[] = guaranteedDrops): boolean => {
    return !existingDrops.some(drop => drop.open_count === openCount);
  }, [guaranteedDrops]);

  // Get next available open count
  const getNextAvailableOpenCount = useCallback((existingDrops: LootBoxGuaranteedDrop[] = guaranteedDrops): number => {
    const usedCounts = existingDrops.map(drop => drop.open_count);
    let nextCount = 1;
    while (usedCounts.includes(nextCount)) {
      nextCount++;
    }
    return nextCount;
  }, [guaranteedDrops]);

  // Reset all state
  const resetState = useCallback(() => {
    setGuaranteedDrops([]);
    setSelectedDrop(null);
    setAvailableRewardItems([]);
    setError(null);
    setLoading(false);
  }, []);

  // Clear selected drop
  const clearSelectedDrop = useCallback(() => {
    setSelectedDrop(null);
  }, []);

  // Auto-fetch on mount if lootBoxId provided
  useEffect(() => {
    if (autoFetch && lootBoxId) {
      fetchGuaranteedDrops(lootBoxId);
    }
  }, [autoFetch, lootBoxId, fetchGuaranteedDrops]);

  return {
    // Data
    guaranteedDrops,
    selectedDrop,
    availableRewardItems,
    loading,
    error,

    // CRUD Operations
    fetchGuaranteedDrops,
    fetchAvailableRewardItems,
    getGuaranteedDropById,
    createGuaranteedDrop,
    updateGuaranteedDrop,
    deleteGuaranteedDrop,
    deleteGuaranteedReward,

    // Selection
    setSelectedDrop,
    clearSelectedDrop,

    // Utilities
    resetState,
    validateOpenCount,
    getNextAvailableOpenCount,
  };
};
