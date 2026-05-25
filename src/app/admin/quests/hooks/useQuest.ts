"use client"
// useQuests.ts (Updated with Rewards support)
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';

// ==============================
// 1. TypeScript Interfaces
// ==============================

export type QuestStatus = 'active' | 'inactive';
export type QuestCategory = 'daily' | 'weekly' | 'alliance' | 'event' | 'main';
export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type QuestType =
  | 'login'
  | 'pvp_battle'
  | 'pve_battle'
  | 'exploration'
  | 'boss_hunt'
  | 'alliance'
  | 'alliance_battle'
  | 'crafting'
  | 'beauty';

export type RewardType = 'item' | 'currency' | 'exp';

export interface GameAction {
  id: string;
  description: string;
  category: string;
  repeatable: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface QuestRequirement {
  id: string;
  quest_id: string;
  requirement_type: string;
  target: number;
  meta: Record<string, unknown>;
  action?: GameAction;
}

export interface QuestReward {
  id: string;
  quest_id: string;
  item_id: string | null;
  amount: number;
  reward_type: RewardType;
  currency_type: string | null;
  experience_amount: number | null;
  description: string | null;
  created_at: string;
}

export interface Quest {
  id: string;
  name: string;
  description: string | null;
  type: QuestType;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  status: QuestStatus;
  completion_limit: number | null;
  created_at: string;
  updated_at: string;
  min_level: number;
  max_level: number;
  requirements: QuestRequirement[];
  rewards: QuestReward[];
}

export interface CreateQuestInput
  extends Omit<
    Quest,
    'id' | 'created_at' | 'updated_at' | 'requirements' | 'rewards'
  > {
  requirements?: Omit<QuestRequirement, 'id' | 'quest_id' | 'action'>[] | null;
  rewards?: Omit<QuestReward, 'id' | 'quest_id' | 'created_at'>[] | null;
}

export interface UpdateQuestInput
  extends Partial<CreateQuestInput> {
  id: string;
}

// ==============================
// 2. React Hook Implementation
// ==============================

export const useQuests = () => {
  const [data, setData] = useState<Quest[]>([]);
  const [actions, setActions] = useState<GameAction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ------------------------------
  // Normalize helper
  // ------------------------------
  const normalizeQuest = (raw: {
    quest_requirements?: Array<
      QuestRequirement & { game_actions?: GameAction }
    >;
    quest_rewards?: QuestReward[];
  } & Omit<Quest, 'requirements' | 'rewards'>): Quest => ({
    ...raw,
    requirements:
      raw.quest_requirements?.map((r) => ({
        ...r,
        action: r.game_actions ?? undefined,
      })) ?? [],
    rewards: raw.quest_rewards ?? [],
  });

  // ------------------------------
  // Fetch quests (with relations)
  // ------------------------------
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: result, error } = await supabase
      .from('quests')
      .select(`
        *,
        quest_requirements (
          *,
          game_actions (*)
        ),
        quest_rewards (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const normalized = (result ?? []).map(normalizeQuest);
    setData(normalized);
    setLoading(false);
  }, []);

  // ------------------------------
  // Fetch game actions
  // ------------------------------
  const fetchActions = useCallback(async () => {
    const { data: result, error } = await supabase
      .from('game_actions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      return;
    }

    setActions(result ?? []);
  }, []);

  // ------------------------------
  // Create (Optimistic)
  // ------------------------------
  const createItem = useCallback(
    async (input: CreateQuestInput) => {
      const tempId = crypto.randomUUID();

      // Handle null values - convert to empty arrays
      const requirementsList = input.requirements ?? [];
      const rewardsList = input.rewards ?? [];

      const optimisticQuest: Quest = {
        ...input,
        id: tempId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        requirements: requirementsList.map((r) => ({
          ...r,
          id: crypto.randomUUID(),
          quest_id: tempId,
        })),
        rewards: rewardsList.map((r) => ({
          ...r,
          id: crypto.randomUUID(),
          quest_id: tempId,
          created_at: new Date().toISOString(),
        })),
      };

      setData((prev) => [optimisticQuest, ...prev]);

      try {
        const { requirements, rewards, ...questData } = input;

        const { data: insertedQuest, error } = await supabase
          .from('quests')
          .insert([questData])
          .select()
          .single();

        if (error || !insertedQuest) throw error;

        let insertedRequirements: QuestRequirement[] = [];
        let insertedRewards: QuestReward[] = [];

        // Insert requirements if any
        if (requirements && requirements.length > 0) {
          const { data: reqData, error: reqError } = await supabase
            .from('quest_requirements')
            .insert(
              requirements.map((r) => ({
                ...r,
                quest_id: insertedQuest.id,
              }))
            )
            .select(`
              *,
              game_actions (*)
            `);

          if (reqError) throw reqError;

          insertedRequirements =
            reqData?.map((r) => ({
              ...r,
              action: (r as any).game_actions,
            })) ?? [];
        }

        // Insert rewards if any
        if (rewards && rewards.length > 0) {
          const { data: rewData, error: rewError } = await supabase
            .from('quest_rewards')
            .insert(
              rewards.map((r) => ({
                ...r,
                quest_id: insertedQuest.id,
              }))
            )
            .select();

          if (rewError) throw rewError;

          insertedRewards = rewData ?? [];
        }

        const finalQuest: Quest = {
          ...insertedQuest,
          requirements: insertedRequirements,
          rewards: insertedRewards,
        };

        setData((prev) =>
          prev.map((q) => (q.id === tempId ? finalQuest : q))
        );

        return finalQuest;
      } catch (err) {
        setData((prev) => prev.filter((q) => q.id !== tempId));
        setError(err instanceof Error ? err.message : 'Create failed');
        throw err;
      }
    },
    []
  );

  // ------------------------------
  // Update (Optimistic)
  // ------------------------------
  const updateItem = useCallback(
    async (input: UpdateQuestInput) => {
      const { id, requirements, rewards, ...updates } = input;

      const prevData = [...data];

      setData((prev) =>
        prev.map((q) =>
          q.id === id ? { ...q, ...updates } : q
        )
      );

      try {
        const { error } = await supabase
          .from('quests')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (error) throw error;

        // Handle requirements update if provided
        if (requirements !== undefined) {
          // Delete old requirements
          await supabase
            .from('quest_requirements')
            .delete()
            .eq('quest_id', id);

          // Insert new requirements if any
          if (requirements && requirements.length > 0) {
            const { error: reqError } = await supabase
              .from('quest_requirements')
              .insert(
                requirements.map((r) => ({
                  ...r,
                  quest_id: id,
                }))
              );

            if (reqError) throw reqError;
          }
        }

        // Handle rewards update if provided
        if (rewards !== undefined) {
          // Delete old rewards
          await supabase
            .from('quest_rewards')
            .delete()
            .eq('quest_id', id);

          // Insert new rewards if any
          if (rewards && rewards.length > 0) {
            const { error: rewError } = await supabase
              .from('quest_rewards')
              .insert(
                rewards.map((r) => ({
                  ...r,
                  quest_id: id,
                }))
              );

            if (rewError) throw rewError;
          }
        }

        // Refresh data to get latest with relations
        await fetchData();
      } catch (err) {
        setData(prevData);
        setError(err instanceof Error ? err.message : 'Update failed');
        throw err;
      }
    },
    [data, fetchData]
  );

  // ------------------------------
  // Delete (Optimistic)
  // ------------------------------
  const deleteItem = useCallback(
    async (id: string) => {
      const prevData = [...data];

      setData((prev) => prev.filter((q) => q.id !== id));

      try {
        const { error } = await supabase
          .from('quests')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (err) {
        setData(prevData);
        setError(err instanceof Error ? err.message : 'Delete failed');
        throw err;
      }
    },
    [data]
  );

  // ------------------------------
  // Reward Management Functions
  // ------------------------------

  // Add single reward to existing quest
  const addReward = useCallback(
    async (questId: string, reward: Omit<QuestReward, 'id' | 'quest_id' | 'created_at'>) => {
      const tempId = crypto.randomUUID();

      const newReward: QuestReward = {
        ...reward,
        id: tempId,
        quest_id: questId,
        created_at: new Date().toISOString(),
      };

      // Optimistic update
      setData((prev) =>
        prev.map((quest) =>
          quest.id === questId
            ? { ...quest, rewards: [...quest.rewards, newReward] }
            : quest
        )
      );

      try {
        const { data: insertedReward, error } = await supabase
          .from('quest_rewards')
          .insert([{
            quest_id: questId,
            reward_type: reward.reward_type,
            amount: reward.amount,
            item_id: reward.item_id,
            currency_type: reward.currency_type,
            experience_amount: reward.experience_amount,
            description: reward.description,
          }])
          .select()
          .single();

        if (error) throw error;

        // Replace temp with real data
        setData((prev) =>
          prev.map((quest) =>
            quest.id === questId
              ? {
                ...quest,
                rewards: quest.rewards.map((r) =>
                  r.id === tempId ? insertedReward : r
                ),
              }
              : quest
          )
        );

        return insertedReward;
      } catch (err) {
        // Rollback
        setData((prev) =>
          prev.map((quest) =>
            quest.id === questId
              ? {
                ...quest,
                rewards: quest.rewards.filter((r) => r.id !== tempId),
              }
              : quest
          )
        );
        throw err;
      }
    },
    []
  );

  // Remove reward from quest
  const removeReward = useCallback(
    async (questId: string, rewardId: string) => {
      let removedReward: QuestReward | undefined;

      setData((prev) =>
        prev.map((quest) =>
          quest.id === questId
            ? {
              ...quest,
              rewards: quest.rewards.filter((r) => {
                if (r.id === rewardId) {
                  removedReward = r;
                  return false;
                }
                return true;
              }),
            }
            : quest
        )
      );

      try {
        const { error } = await supabase
          .from('quest_rewards')
          .delete()
          .eq('id', rewardId);

        if (error) throw error;
      } catch (err) {
        // Rollback
        if (removedReward) {
          setData((prev) =>
            prev.map((quest) =>
              quest.id === questId
                ? {
                  ...quest,
                  rewards: [...quest.rewards, removedReward!],
                }
                : quest
            )
          );
        }
        throw err;
      }
    },
    []
  );

  // ------------------------------
  // Effects
  // ------------------------------
  useEffect(() => {
    fetchData();
    fetchActions();
  }, [fetchData, fetchActions]);

  return {
    data,
    actions,
    loading,
    error,
    fetchData,
    fetchActions,
    createItem,
    updateItem,
    deleteItem,
    addReward,
    removeReward,
  };
};
