"use client"
// useQuests.ts (Updated with proper exports)
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
}

export interface CreateQuestInput
  extends Omit<
    Quest,
    'id' | 'created_at' | 'updated_at' | 'requirements'
  > {
  requirements?: Omit<QuestRequirement, 'id' | 'quest_id' | 'action'>[];
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
  } & Omit<Quest, 'requirements'>): Quest => ({
    ...raw,
    requirements:
      raw.quest_requirements?.map((r) => ({
        ...r,
        action: r.game_actions ?? undefined,
      })) ?? [],
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
        )
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

      const optimisticQuest: Quest = {
        ...input,
        id: tempId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        requirements: (input.requirements ?? []).map((r) => ({
          ...r,
          id: crypto.randomUUID(),
          quest_id: tempId,
        })),
      };

      setData((prev) => [optimisticQuest, ...prev]);

      try {
        const { requirements, ...questData } = input;

        const { data: insertedQuest, error } = await supabase
          .from('quests')
          .insert([questData])
          .select()
          .single();

        if (error || !insertedQuest) throw error;

        let insertedRequirements: QuestRequirement[] = [];

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

        const finalQuest: Quest = {
          ...insertedQuest,
          requirements: insertedRequirements,
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
      const { id, requirements, ...updates } = input;

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

        if (requirements) {
          await supabase
            .from('quest_requirements')
            .delete()
            .eq('quest_id', id);

          if (requirements.length > 0) {
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
  };
};
