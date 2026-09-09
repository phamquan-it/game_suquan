// app/admin/stories/hooks/useStoryChoices.ts
import { useEffect, useState, useCallback } from 'react';
import { message } from 'antd';
import { supabase } from '@/utils/supabase/client';

// Types
export interface StoryChoice {
  id: string;
  scene_id: string;
  choice_text: string;
  next_scene_id: string | null;
  effect_text: string;
  stats_change: Record<string, any>;
  choice_order: number;
  created_at: string;
  boss_id: string | null;
  active_scene: string; // New field
  // Joined data
  next_scene?: {
    id: string;
    scene_order: number;
    dialog_text: string;
    speaker_id: string;
    background: string | null;
    sound_effect: string;
    story_id: string;
  } | null;
  quests?: {
    id: string;
    quest_id: string;
    quest?: Quest;
  }[];
  boss?: {
    id: string;
    name: string;
    // Add any other fields that exist in your bosses table
  } | null;
  scene?: {
    id: string;
    scene_order: number;
    dialog_text: string;
    speaker_id: string;
    story_id: string;
  };
}

export interface StoryScene {
  id: string;
  story_id: string;
  scene_order: number;
  dialog_text: string;
  speaker_id: string;
  background: string | null;
  sound_effect: string;
  created_at: string;
}

export interface Quest {
  id: string;
  name: string;
  description: string | null;
  type: string;
  category: string;
  difficulty: string;
  status: string;
  completion_limit: number | null;
  created_at: string;
  updated_at: string;
  min_level: number;
  max_level: number;
  event_id: string | null;
  quest_nav_action: string | null;
  story_id: string | null;
}

export interface Boss {
  id: string;
  name: string;
  // Add other boss fields as needed
}

export interface ChoiceFilters {
  sceneId?: string;
  storyId?: string;
  search?: string;
  hasNextScene?: boolean | null;
  hasBoss?: boolean | null;
  hasQuests?: boolean | null;
  orderFrom?: number;
  orderTo?: number;
  dateFrom?: string;
  dateTo?: string;
  activeScene?: string | null; // New filter
}

export interface ChoiceStats {
  total: number;
  totalWithNextScene: number;
  totalWithoutNextScene: number;
  totalWithBoss: number;
  totalWithQuests: number;
  totalChoicesPerScene: {
    sceneId: string;
    sceneOrder: number;
    dialogText: string;
    choiceCount: number;
  }[];
  averageChoicesPerScene: number;
  maxChoicesInScene: number;
  minChoicesInScene: number;
  mostCommonNextScene: {
    sceneId: string;
    sceneOrder: number;
    dialogText: string;
    count: number;
  } | null;
  activeSceneDistribution: { // New stats
    scene: string;
    count: number;
  }[];
}

export interface CreateChoiceData {
  scene_id: string;
  choice_text: string;
  next_scene_id?: string | null;
  effect_text: string;
  stats_change?: Record<string, any>;
  choice_order: number;
  boss_id?: string | null;
  quest_ids?: string[];
  active_scene?: string; // New field
}

export interface UpdateChoiceData {
  choice_text?: string;
  next_scene_id?: string | null;
  effect_text?: string;
  stats_change?: Record<string, any>;
  choice_order?: number;
  boss_id?: string | null;
  quest_ids?: string[];
  active_scene?: string; // New field
}

export interface ChoiceValidationResult {
  valid: boolean;
  message: string;
  chain?: string[];
}

// Active scene options
export const ACTIVE_SCENE_OPTIONS = [
  { value: 'main', label: 'Main Scene' },
  { value: 'combat', label: 'Combat Scene' },
  { value: 'dialogue', label: 'Dialogue Scene' },
  { value: 'exploration', label: 'Exploration Scene' },
  { value: 'cutscene', label: 'Cutscene' },
  { value: 'special', label: 'Special Scene' },
];

export const useStoryChoices = (initialFilters?: ChoiceFilters) => {
  const [choices, setChoices] = useState<StoryChoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ChoiceFilters>(initialFilters || {
    sceneId: '',
    storyId: '',
    search: '',
    hasNextScene: null,
    hasBoss: null,
    hasQuests: null,
    orderFrom: undefined,
    orderTo: undefined,
    dateFrom: '',
    dateTo: '',
    activeScene: null,
  });
  const [stats, setStats] = useState<ChoiceStats | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<StoryChoice | null>(null);
  const [availableScenes, setAvailableScenes] = useState<StoryScene[]>([]);
  const [availableBosses, setAvailableBosses] = useState<Boss[]>([]);
  const [availableQuests, setAvailableQuests] = useState<Quest[]>([]);

  // Fetch choices with filters
  const fetchChoices = useCallback(async () => {
    try {
      setLoading(true);

      // Build the query
      let query = supabase
        .from('story_choices')
        .select(`
          *,
          next_scene:next_scene_id (
            id,
            scene_order,
            dialog_text,
            speaker_id,
            background,
            sound_effect,
            story_id
          ),
          boss:boss_id (
            id,
            name
          ),
          quests:story_choice_quests (
            id,
            quest_id,
            quest:quests (
              id,
              name,
              description,
              type,
              category,
              difficulty,
              status,
              completion_limit,
              created_at,
              updated_at,
              min_level,
              max_level,
              event_id,
              quest_nav_action,
              story_id
            )
          ),
          scene:scene_id (
            id,
            scene_order,
            dialog_text,
            speaker_id,
            story_id
          )
        `)
        .order('choice_order', { ascending: true });

      // Apply filters
      if (filters.sceneId) {
        query = query.eq('scene_id', filters.sceneId);
      }

      if (filters.storyId) {
        // First get all scenes for this story
        const { data: scenes } = await supabase
          .from('story_scenes')
          .select('id')
          .eq('story_id', filters.storyId);

        const sceneIds = scenes?.map(s => s.id) || [];
        if (sceneIds.length > 0) {
          query = query.in('scene_id', sceneIds);
        } else {
          query = query.eq('id', 'no-such-id');
        }
      }

      if (filters.search) {
        query = query.or(`choice_text.ilike.%${filters.search}%,effect_text.ilike.%${filters.search}%`);
      }

      if (filters.hasNextScene === true) {
        query = query.not('next_scene_id', 'is', null);
      } else if (filters.hasNextScene === false) {
        query = query.is('next_scene_id', null);
      }

      if (filters.hasBoss === true) {
        query = query.not('boss_id', 'is', null);
      } else if (filters.hasBoss === false) {
        query = query.is('boss_id', null);
      }

      // New active scene filter
      if (filters.activeScene) {
        query = query.eq('active_scene', filters.activeScene);
      }

      if (filters.hasQuests === true) {
        const { data: choicesWithQuests } = await supabase
          .from('story_choice_quests')
          .select('choice_id')
          .not('choice_id', 'is', null);

        const choiceIds = choicesWithQuests?.map(c => c.choice_id) || [];
        if (choiceIds.length > 0) {
          query = query.in('id', choiceIds);
        } else {
          query = query.eq('id', 'no-such-id');
        }
      } else if (filters.hasQuests === false) {
        const { data: choicesWithQuests } = await supabase
          .from('story_choice_quests')
          .select('choice_id')
          .not('choice_id', 'is', null);

        const choiceIds = choicesWithQuests?.map(c => c.choice_id) || [];
        if (choiceIds.length > 0) {
          query = query.not('id', 'in', `(${choiceIds.join(',')})`);
        }
      }

      if (filters.orderFrom !== undefined) {
        query = query.gte('choice_order', filters.orderFrom);
      }

      if (filters.orderTo !== undefined) {
        query = query.lte('choice_order', filters.orderTo);
      }

      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data to ensure quests is properly typed
      const transformedData = (data || []).map(item => ({
        ...item,
        quests: item.quests || [],
        stats_change: item.stats_change || {},
        active_scene: item.active_scene || 'main', // Default to 'main' if null
      }));

      setChoices(transformedData);
    } catch (error) {
      console.error('Error fetching choices:', error);
      message.error('Failed to load choices');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch choice statistics
  const fetchStats = useCallback(async () => {
    try {
      let query = supabase
        .from('story_choices')
        .select('*', { count: 'exact', head: true });

      if (filters.sceneId) {
        query = query.eq('scene_id', filters.sceneId);
      }

      const { count: total } = await query;

      let choicesQuery = supabase
        .from('story_choices')
        .select(`
          id,
          scene_id,
          choice_order,
          next_scene_id,
          boss_id,
          active_scene,
          scene:scene_id (
            id,
            scene_order,
            dialog_text
          ),
          next_scene:next_scene_id (
            id,
            scene_order,
            dialog_text
          )
        `);

      if (filters.sceneId) {
        choicesQuery = choicesQuery.eq('scene_id', filters.sceneId);
      }

      const { data: allChoices } = await choicesQuery;

      const choicesList = allChoices || [];

      const totalWithNextScene = choicesList.filter(c => c.next_scene_id !== null).length;
      const totalWithoutNextScene = choicesList.length - totalWithNextScene;
      const totalWithBoss = choicesList.filter(c => c.boss_id !== null).length;

      const { data: choicesWithQuests } = await supabase
        .from('story_choice_quests')
        .select('choice_id')
        .in('choice_id', choicesList.map(c => c.id));

      const choiceIdsWithQuests = new Set(choicesWithQuests?.map(c => c.choice_id) || []);
      const totalWithQuests = choicesList.filter(c => choiceIdsWithQuests.has(c.id)).length;

      // Choices per scene
      const choicesPerScene: Record<string, {
        sceneId: string;
        sceneOrder: number;
        dialogText: string;
        choiceCount: number;
      }> = {};

      choicesList.forEach(choice => {
        const sceneId = choice.scene_id;
        if (!choicesPerScene[sceneId]) {
          const sceneData = (choice as any).scene;
          choicesPerScene[sceneId] = {
            sceneId: sceneId,
            sceneOrder: sceneData?.scene_order || 0,
            dialogText: sceneData?.dialog_text || 'Unknown',
            choiceCount: 0,
          };
        }
        choicesPerScene[sceneId].choiceCount++;
      });

      const totalChoicesPerScene = Object.values(choicesPerScene);

      const sceneCounts = totalChoicesPerScene.map(scene => scene.choiceCount);
      const averageChoicesPerScene = sceneCounts.length > 0
        ? sceneCounts.reduce((a, b) => a + b, 0) / sceneCounts.length
        : 0;

      const maxChoicesInScene = sceneCounts.length > 0 ? Math.max(...sceneCounts) : 0;
      const minChoicesInScene = sceneCounts.length > 0 ? Math.min(...sceneCounts) : 0;

      // Find most common next scene
      const nextSceneCounts: Record<string, {
        sceneId: string;
        sceneOrder: number;
        dialogText: string;
        count: number;
      }> = {};

      choicesList.forEach(choice => {
        if (choice.next_scene_id) {
          if (!nextSceneCounts[choice.next_scene_id]) {
            const nextSceneData = (choice as any).next_scene;
            nextSceneCounts[choice.next_scene_id] = {
              sceneId: choice.next_scene_id,
              sceneOrder: nextSceneData?.scene_order || 0,
              dialogText: nextSceneData?.dialog_text || 'Unknown',
              count: 0,
            };
          }
          nextSceneCounts[choice.next_scene_id].count++;
        }
      });

      const mostCommonNextSceneArray = Object.values(nextSceneCounts);
      const mostCommonNextScene = mostCommonNextSceneArray.length > 0
        ? mostCommonNextSceneArray.reduce((a, b) => a.count > b.count ? a : b)
        : null;

      // Active scene distribution
      const activeSceneMap: Record<string, number> = {};
      choicesList.forEach(choice => {
        const scene = choice.active_scene || 'main';
        activeSceneMap[scene] = (activeSceneMap[scene] || 0) + 1;
      });

      const activeSceneDistribution = Object.entries(activeSceneMap).map(([scene, count]) => ({
        scene,
        count,
      }));

      setStats({
        total: total || 0,
        totalWithNextScene,
        totalWithoutNextScene,
        totalWithBoss,
        totalWithQuests,
        totalChoicesPerScene,
        averageChoicesPerScene,
        maxChoicesInScene,
        minChoicesInScene,
        mostCommonNextScene,
        activeSceneDistribution,
      });
    } catch (error) {
      console.error('Error fetching choice stats:', error);
    }
  }, [filters]);

  // Fetch a single choice with all details
  const fetchChoiceDetails = useCallback(async (choiceId: string): Promise<StoryChoice | null> => {
    try {
      const { data, error } = await supabase
        .from('story_choices')
        .select(`
          *,
          next_scene:next_scene_id (
            id,
            scene_order,
            dialog_text,
            speaker_id,
            background,
            sound_effect,
            story_id
          ),
          boss:boss_id (
            id,
            name
          ),
          quests:story_choice_quests (
            id,
            quest_id,
            quest:quests (
              id,
              name,
              description,
              type,
              category,
              difficulty,
              status,
              completion_limit,
              created_at,
              updated_at,
              min_level,
              max_level,
              event_id,
              quest_nav_action,
              story_id
            )
          ),
          scene:scene_id (
            id,
            scene_order,
            dialog_text,
            speaker_id,
            story_id
          )
        `)
        .eq('id', choiceId)
        .single();

      if (error) throw error;

      const transformedData = {
        ...data,
        quests: data?.quests || [],
        stats_change: data?.stats_change || {},
        active_scene: data?.active_scene || 'main',
      };

      setSelectedChoice(transformedData);
      return transformedData;
    } catch (error) {
      console.error('Error fetching choice details:', error);
      message.error('Failed to load choice details');
      return null;
    }
  }, []);

  // Fetch available scenes for a specific story
  const fetchScenes = useCallback(async (storyId?: string): Promise<StoryScene[]> => {
    try {
      let query = supabase
        .from('story_scenes')
        .select('*')
        .order('scene_order', { ascending: true });

      if (storyId) {
        query = query.eq('story_id', storyId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAvailableScenes(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching scenes:', error);
      message.error('Failed to load scenes');
      return [];
    }
  }, []);

  // Fetch available bosses
  const fetchBosses = useCallback(async (): Promise<Boss[]> => {
    try {
      const { data, error } = await supabase
        .from('bosses')
        .select('id, name')
        .order('name', { ascending: true });

      if (error) throw error;
      setAvailableBosses(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching bosses:', error);
      message.error('Failed to load bosses');
      return [];
    }
  }, []);

  // Fetch available quests
  const fetchQuests = useCallback(async (): Promise<Quest[]> => {
    try {
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setAvailableQuests(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching quests:', error);
      message.error('Failed to load quests');
      return [];
    }
  }, []);

  // Create a new choice
  const createChoice = useCallback(async (data: CreateChoiceData): Promise<StoryChoice | null> => {
    try {
      // Check if choice order already exists in the scene
      const { count } = await supabase
        .from('story_choices')
        .select('*', { count: 'exact', head: true })
        .eq('scene_id', data.scene_id)
        .eq('choice_order', data.choice_order);

      if (count && count > 0) {
        message.error(`Choice order ${data.choice_order} already exists in this scene`);
        return null;
      }

      // Create the choice
      const { data: choice, error } = await supabase
        .from('story_choices')
        .insert({
          id: crypto.randomUUID(),
          scene_id: data.scene_id,
          choice_text: data.choice_text,
          next_scene_id: data.next_scene_id || null,
          effect_text: data.effect_text,
          stats_change: data.stats_change || {},
          choice_order: data.choice_order,
          boss_id: data.boss_id || null,
          active_scene: data.active_scene || 'main',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Add quests if provided
      if (data.quest_ids && data.quest_ids.length > 0) {
        const questInserts = data.quest_ids.map(questId => ({
          id: crypto.randomUUID(),
          choice_id: choice.id,
          quest_id: questId,
          created_at: new Date().toISOString(),
        }));

        const { error: questError } = await supabase
          .from('story_choice_quests')
          .insert(questInserts);

        if (questError) throw questError;
      }

      message.success('Choice created successfully');
      await fetchChoices();
      await fetchStats();
      return choice;
    } catch (error) {
      console.error('Error creating choice:', error);
      message.error('Failed to create choice');
      return null;
    }
  }, [fetchChoices, fetchStats]);

  // Update a choice
  const updateChoice = useCallback(async (id: string, data: UpdateChoiceData): Promise<StoryChoice | null> => {
    try {
      if (data.choice_order !== undefined) {
        const { data: existingChoice } = await supabase
          .from('story_choices')
          .select('scene_id')
          .eq('id', id)
          .single();

        if (existingChoice) {
          const { count } = await supabase
            .from('story_choices')
            .select('*', { count: 'exact', head: true })
            .eq('scene_id', existingChoice.scene_id)
            .eq('choice_order', data.choice_order)
            .neq('id', id);

          if (count && count > 0) {
            message.error(`Choice order ${data.choice_order} already exists in this scene`);
            return null;
          }
        }
      }

      const updateData: any = { ...data };
      const questIds = updateData.quest_ids;
      delete updateData.quest_ids;

      // Remove updated_at as it doesn't exist in the table
      // updateData.updated_at = new Date().toISOString();

      const { data: choice, error } = await supabase
        .from('story_choices')
        .update({
          ...updateData,
          stats_change: data.stats_change || {},
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (questIds !== undefined) {
        const { error: deleteError } = await supabase
          .from('story_choice_quests')
          .delete()
          .eq('choice_id', id);

        if (deleteError) throw deleteError;

        if (questIds.length > 0) {
          const questInserts = questIds.map((questId: string) => ({
            id: crypto.randomUUID(),
            choice_id: id,
            quest_id: questId,
            created_at: new Date().toISOString(),
          }));

          const { error: questError } = await supabase
            .from('story_choice_quests')
            .insert(questInserts);

          if (questError) throw questError;
        }
      }

      message.success('Choice updated successfully');
      await fetchChoices();
      await fetchStats();
      return choice;
    } catch (error) {
      console.error('Error updating choice:', error);
      message.error('Failed to update choice');
      return null;
    }
  }, [fetchChoices, fetchStats]);

  // Delete a choice
  const deleteChoice = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('story_choices')
        .delete()
        .eq('id', id);

      if (error) throw error;

      message.success('Choice deleted successfully');
      await fetchChoices();
      await fetchStats();
      return true;
    } catch (error) {
      console.error('Error deleting choice:', error);
      message.error('Failed to delete choice');
      return false;
    }
  }, [fetchChoices, fetchStats]);

  // Bulk delete choices
  const deleteChoices = useCallback(async (ids: string[]): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('story_choices')
        .delete()
        .in('id', ids);

      if (error) throw error;

      message.success(`Deleted ${ids.length} choices successfully`);
      await fetchChoices();
      await fetchStats();
      return true;
    } catch (error) {
      console.error('Error deleting choices:', error);
      message.error('Failed to delete choices');
      return false;
    }
  }, [fetchChoices, fetchStats]);

  // Reorder choices
  const reorderChoices = useCallback(async (choiceIds: string[]): Promise<boolean> => {
    try {
      await Promise.all(
        choiceIds.map((id, index) =>
          supabase
            .from('story_choices')
            .update({ choice_order: index + 1 })
            .eq('id', id)
        )
      );

      message.success('Choices reordered successfully');
      await fetchChoices();
      return true;
    } catch (error) {
      console.error('Error reordering choices:', error);
      message.error('Failed to reorder choices');
      return false;
    }
  }, [fetchChoices]);

  // Duplicate a choice
  const duplicateChoice = useCallback(async (id: string): Promise<StoryChoice | null> => {
    try {
      const { data: original, error: fetchError } = await supabase
        .from('story_choices')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const { data: choices } = await supabase
        .from('story_choices')
        .select('choice_order')
        .eq('scene_id', original.scene_id)
        .order('choice_order', { ascending: false })
        .limit(1);

      const nextOrder = choices && choices.length > 0 ? choices[0].choice_order + 1 : 1;

      const { data: quests } = await supabase
        .from('story_choice_quests')
        .select('quest_id')
        .eq('choice_id', id);

      const { data: newChoice, error: insertError } = await supabase
        .from('story_choices')
        .insert({
          id: crypto.randomUUID(),
          scene_id: original.scene_id,
          choice_text: `${original.choice_text} (Copy)`,
          next_scene_id: original.next_scene_id,
          effect_text: original.effect_text,
          stats_change: original.stats_change,
          choice_order: nextOrder,
          boss_id: original.boss_id,
          active_scene: original.active_scene || 'main',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      if (quests && quests.length > 0) {
        const questInserts = quests.map(q => ({
          id: crypto.randomUUID(),
          choice_id: newChoice.id,
          quest_id: q.quest_id,
          created_at: new Date().toISOString(),
        }));

        const { error: questError } = await supabase
          .from('story_choice_quests')
          .insert(questInserts);

        if (questError) throw questError;
      }

      message.success('Choice duplicated successfully');
      await fetchChoices();
      await fetchStats();
      return newChoice;
    } catch (error) {
      console.error('Error duplicating choice:', error);
      message.error('Failed to duplicate choice');
      return null;
    }
  }, [fetchChoices, fetchStats]);

  // Get choices by scene
  const getChoicesByScene = useCallback(async (sceneId: string): Promise<StoryChoice[]> => {
    try {
      const { data, error } = await supabase
        .from('story_choices')
        .select(`
          *,
          next_scene:next_scene_id (
            id,
            scene_order,
            dialog_text,
            speaker_id,
            background,
            sound_effect
          ),
          boss:boss_id (
            id,
            name
          ),
          quests:story_choice_quests (
            id,
            quest_id,
            quest:quests (
              id,
              name,
              description
            )
          )
        `)
        .eq('scene_id', sceneId)
        .order('choice_order', { ascending: true });

      if (error) throw error;

      const transformedData = (data || []).map(item => ({
        ...item,
        quests: item.quests || [],
        stats_change: item.stats_change || {},
        active_scene: item.active_scene || 'main',
      }));

      return transformedData;
    } catch (error) {
      console.error('Error fetching choices by scene:', error);
      message.error('Failed to load choices for scene');
      return [];
    }
  }, []);

  // Export choices data
  const exportChoices = useCallback(async (sceneId: string): Promise<any[] | null> => {
    try {
      const choicesData = await getChoicesByScene(sceneId);

      const exportData = choicesData.map(choice => ({
        order: choice.choice_order,
        text: choice.choice_text,
        effect: choice.effect_text,
        next_scene: choice.next_scene?.dialog_text || 'None',
        next_scene_id: choice.next_scene_id || 'None',
        boss: choice.boss?.name || 'None',
        boss_id: choice.boss_id || 'None',
        active_scene: choice.active_scene || 'main',
        stats_change: JSON.stringify(choice.stats_change),
        has_quests: (choice.quests?.length || 0) > 0,
        quest_names: choice.quests?.map(q => q.quest?.name).filter(Boolean).join(', ') || 'None',
      }));

      return exportData;
    } catch (error) {
      console.error('Error exporting choices:', error);
      message.error('Failed to export choices');
      return null;
    }
  }, [getChoicesByScene]);

  // Validate choice chain
  const validateChoiceChain = useCallback(async (
    choiceId: string,
    targetSceneId?: string
  ): Promise<ChoiceValidationResult> => {
    try {
      let currentChoiceId = choiceId;
      const visited = new Set<string>();
      const chain: string[] = [];

      while (currentChoiceId) {
        if (visited.has(currentChoiceId)) {
          return {
            valid: false,
            message: 'Circular reference detected in choice chain',
            chain: [...chain, currentChoiceId],
          };
        }

        visited.add(currentChoiceId);
        chain.push(currentChoiceId);

        const { data: choice, error } = await supabase
          .from('story_choices')
          .select('next_scene_id, scene_id')
          .eq('id', currentChoiceId)
          .single();

        if (error) break;

        if (!choice || !choice.next_scene_id) {
          break;
        }

        if (targetSceneId && choice.next_scene_id === targetSceneId) {
          return {
            valid: true,
            message: 'Target scene reachable',
            chain,
          };
        }

        const { data: nextChoice, error: nextError } = await supabase
          .from('story_choices')
          .select('id')
          .eq('scene_id', choice.next_scene_id)
          .eq('choice_order', 1)
          .maybeSingle();

        if (nextError || !nextChoice) {
          break;
        }

        currentChoiceId = nextChoice.id;
      }

      return {
        valid: true,
        message: targetSceneId
          ? `Target scene ${targetSceneId} not reachable from choice ${choiceId}`
          : 'Choice chain is valid and ends properly',
        chain,
      };
    } catch (error) {
      console.error('Error validating choice chain:', error);
      return {
        valid: false,
        message: 'Error validating choice chain',
      };
    }
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({
      sceneId: '',
      storyId: '',
      search: '',
      hasNextScene: null,
      hasBoss: null,
      hasQuests: null,
      orderFrom: undefined,
      orderTo: undefined,
      dateFrom: '',
      dateTo: '',
      activeScene: null,
    });
  }, []);

  // Get story ID from scene
  const getStoryIdFromScene = useCallback(async (sceneId: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('story_scenes')
        .select('story_id')
        .eq('id', sceneId)
        .single();

      if (error) throw error;
      return data?.story_id || null;
    } catch (error) {
      console.error('Error getting story ID from scene:', error);
      return null;
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      if (filters.sceneId) {
        const storyId = await getStoryIdFromScene(filters.sceneId);
        if (storyId) {
          await fetchScenes(storyId);
        }
      }

      await fetchChoices();
      await fetchStats();
      await fetchBosses();
      await fetchQuests();
    };

    loadData();
  }, [filters, fetchChoices, fetchStats, fetchScenes, fetchBosses, fetchQuests, getStoryIdFromScene]);

  return {
    // State
    choices,
    loading,
    filters,
    setFilters,
    stats,
    selectedChoice,
    availableScenes,
    availableBosses,
    availableQuests,
    ACTIVE_SCENE_OPTIONS,

    // CRUD Operations
    createChoice,
    updateChoice,
    deleteChoice,
    deleteChoices,
    fetchChoiceDetails,
    duplicateChoice,
    reorderChoices,
    getChoicesByScene,
    exportChoices,
    validateChoiceChain,

    // Utility
    refresh: fetchChoices,
    refreshStats: fetchStats,
    fetchScenes,
    fetchBosses,
    fetchQuests,
    clearFilters,
    getStoryIdFromScene,
  };
};
