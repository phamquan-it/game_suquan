// app/admin/stories/hooks/useStoryScenes.ts
import { useEffect, useState } from 'react';
import { message } from 'antd';
import { supabase } from '@/utils/supabase/client';

// Typing style options
export const TYPING_STYLES: { value: TypingStyle; label: string; description: string }[] = [
  { value: 'standard', label: 'Standard', description: 'Normal typing speed' },
  { value: 'brisk', label: 'Brisk', description: 'Fast, energetic typing' },
  { value: 'snap', label: 'Snap', description: 'Quick, sharp typing' },
  { value: 'slow', label: 'Slow', description: 'Slow, deliberate typing' },
  { value: 'fluid', label: 'Fluid', description: 'Smooth, flowing typing' },
];
// Types
export interface StoryScene {
  id: string;
  story_id: string;
  scene_order: number;
  background: string | null;
  speaker_id: string;
  dialog_text: string;
  sound_effect: string;
  created_at: string;
  // New columns
  is_end_story: boolean;
  is_failed_story: boolean;
  active_scene_name: string | null;
  failure_scene_name: string | null;
  typing_style: 'standard' | 'brisk' | 'snap' | 'slow' | 'fluid' | null;
  // Joined data
  speaker?: StoryCharacter;
  choices?: StoryChoice[];
  story?: Story;
}

export interface StoryCharacter {
  id: string;
  name: string;
  avatar: string;
  color: string;
  default_position: 'left' | 'right' | 'center';
  created_at: string;
  faction_id: string | null;
  emotion_states: any;
  is_su_quan: boolean;
}

export interface StoryChoice {
  id: string;
  scene_id: string;
  choice_text: string;
  next_scene_id: string | null;
  effect_text: string;
  stats_change: any;
  choice_order: number;
  created_at: string;
  boss_id: string | null;
  // Joined data
  next_scene?: StoryScene;
  quests?: any[];
}

export interface Story {
  id: string;
  title: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
  entry_scene_id?: string | null;
}

export interface StoryBasic {
  id: string;
  title: string;
  description: string | null;
}

export type TypingStyle = 'standard' | 'brisk' | 'snap' | 'slow' | 'fluid';

export interface SceneFilters {
  storyId?: string;
  search?: string;
  speakerId?: string;
  hasChoices?: boolean | null;
  hasBackground?: boolean | null;
  hasSoundEffect?: boolean | null;
  orderFrom?: number;
  orderTo?: number;
  dateFrom?: string;
  dateTo?: string;
  isEndStory?: boolean | null;
  isFailedStory?: boolean | null;
  typingStyle?: TypingStyle | null;
  hasActiveSceneName?: boolean | null;
  hasFailureSceneName?: boolean | null;
}

export interface SceneStats {
  total: number;
  totalWithChoices: number;
  totalWithoutChoices: number;
  totalWithBackground: number;
  totalWithSoundEffect: number;
  totalSpeakers: number;
  avgScenesPerStory: number;
  mostUsedSpeaker: {
    id: string;
    name: string;
    count: number;
  } | null;
  sceneOrderDistribution: {
    order: number;
    count: number;
  }[];
  totalEndStoryScenes: number;
  totalFailedStoryScenes: number;
  typingStyleDistribution: {
    style: string;
    count: number;
  }[];
}

export const useStoryScenes = (initialFilters?: SceneFilters) => {
  const [scenes, setScenes] = useState<StoryScene[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SceneFilters>(initialFilters || {
    storyId: '',
    search: '',
    speakerId: '',
    hasChoices: null,
    hasBackground: null,
    hasSoundEffect: null,
    orderFrom: undefined,
    orderTo: undefined,
    dateFrom: '',
    dateTo: '',
    isEndStory: null,
    isFailedStory: null,
    typingStyle: null,
    hasActiveSceneName: null,
    hasFailureSceneName: null,
  });
  const [stats, setStats] = useState<SceneStats | null>(null);
  const [selectedScene, setSelectedScene] = useState<StoryScene | null>(null);
  const [availableCharacters, setAvailableCharacters] = useState<StoryCharacter[]>([]);
  const [availableStories, setAvailableStories] = useState<Story[]>([]);

  // Typing style options for UI
  const TYPING_STYLES: TypingStyle[] = ['standard', 'brisk', 'snap', 'slow', 'fluid'];

  // Fetch scenes with filters
  const fetchScenes = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('story_scenes')
        .select(`
          *,
          speaker:speaker_id (
            id,
            name,
            avatar,
            color,
            default_position,
            faction_id,
            emotion_states,
            is_su_quan
          ),
          story:story_id (
            id,
            title,
            description
          )
        `)
        .order('scene_order', { ascending: true });

      // Apply filters
      if (filters.storyId) {
        query = query.eq('story_id', filters.storyId);
      }

      if (filters.search) {
        query = query.or(`dialog_text.ilike.%${filters.search}%,background.ilike.%${filters.search}%,active_scene_name.ilike.%${filters.search}%,failure_scene_name.ilike.%${filters.search}%`);
      }

      if (filters.speakerId) {
        query = query.eq('speaker_id', filters.speakerId);
      }

      // New filters
      if (filters.isEndStory === true) {
        query = query.eq('is_end_story', true);
      } else if (filters.isEndStory === false) {
        query = query.eq('is_end_story', false);
      }

      if (filters.isFailedStory === true) {
        query = query.eq('is_failed_story', true);
      } else if (filters.isFailedStory === false) {
        query = query.eq('is_failed_story', false);
      }

      if (filters.typingStyle) {
        query = query.eq('typing_style', filters.typingStyle);
      }

      if (filters.hasActiveSceneName === true) {
        query = query.not('active_scene_name', 'is', null).neq('active_scene_name', '');
      } else if (filters.hasActiveSceneName === false) {
        query = query.or('active_scene_name.is.null,active_scene_name.eq.');
      }

      if (filters.hasFailureSceneName === true) {
        query = query.not('failure_scene_name', 'is', null).neq('failure_scene_name', '');
      } else if (filters.hasFailureSceneName === false) {
        query = query.or('failure_scene_name.is.null,failure_scene_name.eq.');
      }

      if (filters.hasChoices === true) {
        // Get scenes that have choices
        const { data: scenesWithChoices } = await supabase
          .from('story_choices')
          .select('scene_id')
          .not('scene_id', 'is', null);

        const sceneIds = scenesWithChoices?.map(s => s.scene_id) || [];
        if (sceneIds.length > 0) {
          query = query.in('id', sceneIds);
        } else {
          query = query.eq('id', 'no-such-id'); // Return empty
        }
      } else if (filters.hasChoices === false) {
        // Get scenes without choices
        const { data: scenesWithChoices } = await supabase
          .from('story_choices')
          .select('scene_id')
          .not('scene_id', 'is', null);

        const sceneIds = scenesWithChoices?.map(s => s.scene_id) || [];
        if (sceneIds.length > 0) {
          query = query.not('id', 'in', `(${sceneIds.join(',')})`);
        }
      }

      if (filters.hasBackground === true) {
        query = query.not('background', 'is', null);
      } else if (filters.hasBackground === false) {
        query = query.is('background', null);
      }

      if (filters.hasSoundEffect === true) {
        query = query.not('sound_effect', 'is', null).neq('sound_effect', '');
      } else if (filters.hasSoundEffect === false) {
        query = query.or('sound_effect.is.null,sound_effect.eq.');
      }

      if (filters.orderFrom !== undefined) {
        query = query.gte('scene_order', filters.orderFrom);
      }

      if (filters.orderTo !== undefined) {
        query = query.lte('scene_order', filters.orderTo);
      }

      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch choices for each scene
      const scenesWithChoices = await Promise.all(
        (data || []).map(async (scene) => {
          const { data: choicesData } = await supabase
            .from('story_choices')
            .select(`
              *,
              next_scene:next_scene_id (
                id,
                scene_order,
                dialog_text,
                speaker_id
              )
            `)
            .eq('scene_id', scene.id)
            .order('choice_order', { ascending: true });

          return {
            ...scene,
            choices: choicesData || [],
          };
        })
      );

      setScenes(scenesWithChoices);
    } catch (error) {
      console.error('Error fetching scenes:', error);
      message.error('Failed to load scenes');
    } finally {
      setLoading(false);
    }
  };

  // Fetch scene statistics
  const fetchStats = async () => {
    try {
      let baseQuery = supabase.from('story_scenes').select('*', { count: 'exact', head: true });

      if (filters.storyId) {
        baseQuery = baseQuery.eq('story_id', filters.storyId);
      }

      // Total scenes
      const { count: total } = await baseQuery;

      // Get all scenes with their choices and speaker info
      const { data: allScenes } = await supabase
        .from('story_scenes')
        .select(`
          id,
          story_id,
          scene_order,
          background,
          sound_effect,
          speaker_id,
          is_end_story,
          is_failed_story,
          typing_style
        `)
        .eq('story_id', filters.storyId || '');

      // Get speaker names separately
      const speakerIds = allScenes?.map(s => s.speaker_id).filter(Boolean) || [];
      let speakerMap: Record<string, string> = {};

      if (speakerIds.length > 0) {
        const { data: speakers } = await supabase
          .from('story_characters')
          .select('id, name')
          .in('id', speakerIds);

        speakerMap = speakers?.reduce((acc, s) => {
          acc[s.id] = s.name;
          return acc;
        }, {} as Record<string, string>) || {};
      }

      const scenesList = allScenes || [];

      // Count scenes with choices
      const { data: scenesWithChoices } = await supabase
        .from('story_choices')
        .select('scene_id')
        .in('scene_id', scenesList.map(s => s.id));

      const sceneIdsWithChoices = new Set(scenesWithChoices?.map(s => s.scene_id) || []);

      const totalWithChoices = scenesList.filter(s => sceneIdsWithChoices.has(s.id)).length;
      const totalWithoutChoices = scenesList.length - totalWithChoices;

      // Count scenes with background
      const totalWithBackground = scenesList.filter(s => s.background !== null).length;

      // Count scenes with sound effect
      const totalWithSoundEffect = scenesList.filter(s => s.sound_effect && s.sound_effect !== '').length;

      // Count unique speakers
      const uniqueSpeakers = new Set(scenesList.map(s => s.speaker_id).filter(Boolean));
      const totalSpeakers = uniqueSpeakers.size;

      // Find most used speaker
      const speakerCounts: Record<string, { name: string; count: number }> = {};
      scenesList.forEach(scene => {
        if (scene.speaker_id) {
          if (!speakerCounts[scene.speaker_id]) {
            speakerCounts[scene.speaker_id] = {
              name: speakerMap[scene.speaker_id] || 'Unknown',
              count: 0,
            };
          }
          speakerCounts[scene.speaker_id].count++;
        }
      });

      let mostUsedSpeaker = null;
      let maxCount = 0;
      for (const [id, data] of Object.entries(speakerCounts)) {
        if (data.count > maxCount) {
          maxCount = data.count;
          mostUsedSpeaker = { id, name: data.name, count: data.count };
        }
      }

      // Scene order distribution
      const orderDistribution: { order: number; count: number }[] = [];
      const orderMap: Record<number, number> = {};
      scenesList.forEach(scene => {
        const order = scene.scene_order || 0;
        orderMap[order] = (orderMap[order] || 0) + 1;
      });

      for (const [order, count] of Object.entries(orderMap)) {
        orderDistribution.push({ order: parseInt(order), count });
      }
      orderDistribution.sort((a, b) => a.order - b.order);

      // Calculate average scenes per story
      let avgScenesPerStory = 0;
      if (scenesList.length > 0) {
        const storyScenesMap: Record<string, number> = {};
        scenesList.forEach(scene => {
          storyScenesMap[scene.story_id] = (storyScenesMap[scene.story_id] || 0) + 1;
        });
        const counts = Object.values(storyScenesMap);
        avgScenesPerStory = counts.reduce((a, b) => a + b, 0) / counts.length;
      }

      // New stats
      const totalEndStoryScenes = scenesList.filter(s => s.is_end_story === true).length;
      const totalFailedStoryScenes = scenesList.filter(s => s.is_failed_story === true).length;

      // Typing style distribution
      const typingStyleMap: Record<string, number> = {};
      scenesList.forEach(scene => {
        const style = scene.typing_style || 'null';
        typingStyleMap[style] = (typingStyleMap[style] || 0) + 1;
      });

      const typingStyleDistribution = Object.entries(typingStyleMap).map(([style, count]) => ({
        style: style === 'null' ? 'Not Set' : style,
        count,
      }));

      setStats({
        total: total || 0,
        totalWithChoices,
        totalWithoutChoices,
        totalWithBackground,
        totalWithSoundEffect,
        totalSpeakers,
        avgScenesPerStory,
        mostUsedSpeaker,
        sceneOrderDistribution: orderDistribution,
        totalEndStoryScenes,
        totalFailedStoryScenes,
        typingStyleDistribution,
      });
    } catch (error) {
      console.error('Error fetching scene stats:', error);
    }
  };

  // Fetch a single scene with all details
  const fetchSceneDetails = async (sceneId: string) => {
    try {
      const { data: sceneData, error: sceneError } = await supabase
        .from('story_scenes')
        .select(`
          *,
          speaker:speaker_id (
            id,
            name,
            avatar,
            color,
            default_position,
            faction_id,
            emotion_states,
            is_su_quan
          ),
          story:story_id (
            id,
            title,
            description
          )
        `)
        .eq('id', sceneId)
        .single();

      if (sceneError) throw sceneError;

      // Fetch choices
      const { data: choicesData } = await supabase
        .from('story_choices')
        .select(`
          *,
          next_scene:next_scene_id (
            id,
            scene_order,
            dialog_text,
            speaker_id
          ),
          quests:story_choice_quests (
            quest_id,
            quest:quests (*)
          )
        `)
        .eq('scene_id', sceneId)
        .order('choice_order', { ascending: true });

      const sceneWithChoices = {
        ...sceneData,
        choices: choicesData || [],
      };

      setSelectedScene(sceneWithChoices);
      return sceneWithChoices;
    } catch (error) {
      console.error('Error fetching scene details:', error);
      message.error('Failed to load scene details');
      return null;
    }
  };

  // Fetch available characters
  const fetchCharacters = async () => {
    try {
      const { data, error } = await supabase
        .from('story_characters')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setAvailableCharacters(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching characters:', error);
      message.error('Failed to load characters');
      return [];
    }
  };

  // Fetch available stories
  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('id, title, description')
        .order('title', { ascending: true });

      if (error) throw error;

      const mappedStories: Story[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || null,
        created_at: '',
        updated_at: '',
        entry_scene_id: null,
      }));

      setAvailableStories(mappedStories);
      return mappedStories;
    } catch (error) {
      console.error('Error fetching stories:', error);
      message.error('Failed to load stories');
      return [];
    }
  };

  // Create a new scene
  const createScene = async (data: {
    story_id: string;
    scene_order: number;
    background?: string | null;
    speaker_id: string;
    dialog_text: string;
    sound_effect?: string;
    is_end_story?: boolean;
    is_failed_story?: boolean;
    active_scene_name?: string | null;
    failure_scene_name?: string | null;
    typing_style?: TypingStyle | null;
  }) => {
    try {
      // Check if scene order already exists
      const { count } = await supabase
        .from('story_scenes')
        .select('*', { count: 'exact', head: true })
        .eq('story_id', data.story_id)
        .eq('scene_order', data.scene_order);

      if (count && count > 0) {
        message.error(`Scene order ${data.scene_order} already exists in this story`);
        return null;
      }

      const { data: scene, error } = await supabase
        .from('story_scenes')
        .insert({
          id: crypto.randomUUID(),
          story_id: data.story_id,
          scene_order: data.scene_order,
          background: data.background || null,
          speaker_id: data.speaker_id,
          dialog_text: data.dialog_text,
          sound_effect: data.sound_effect || '',
          is_end_story: data.is_end_story || false,
          is_failed_story: data.is_failed_story || false,
          active_scene_name: data.active_scene_name || null,
          failure_scene_name: data.failure_scene_name || null,
          typing_style: data.typing_style || null,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      message.success('Scene created successfully');
      await fetchScenes();
      await fetchStats();
      return scene;
    } catch (error) {
      console.error('Error creating scene:', error);
      message.error('Failed to create scene');
      return null;
    }
  };

  // Update a scene
  const updateScene = async (id: string, data: Partial<{
    scene_order: number;
    background: string | null;
    speaker_id: string;
    dialog_text: string;
    sound_effect: string;
    is_end_story: boolean;
    is_failed_story: boolean;
    active_scene_name: string | null;
    failure_scene_name: string | null;
    typing_style: TypingStyle | null;
  }>) => {
    try {
      // If changing scene order, check for conflicts
      if (data.scene_order) {
        const { data: existingScene } = await supabase
          .from('story_scenes')
          .select('story_id')
          .eq('id', id)
          .single();

        if (existingScene) {
          const { count } = await supabase
            .from('story_scenes')
            .select('*', { count: 'exact', head: true })
            .eq('story_id', existingScene.story_id)
            .eq('scene_order', data.scene_order)
            .neq('id', id);

          if (count && count > 0) {
            message.error(`Scene order ${data.scene_order} already exists in this story`);
            return null;
          }
        }
      }

      const { data: scene, error } = await supabase
        .from('story_scenes')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      message.success('Scene updated successfully');
      await fetchScenes();
      await fetchStats();
      return scene;
    } catch (error) {
      console.error('Error updating scene:', error);
      message.error('Failed to update scene');
      return null;
    }
  };

  // Delete a scene
  const deleteScene = async (id: string) => {
    try {
      const { error } = await supabase
        .from('story_scenes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      message.success('Scene deleted successfully');
      await fetchScenes();
      await fetchStats();
      return true;
    } catch (error) {
      console.error('Error deleting scene:', error);
      message.error('Failed to delete scene');
      return false;
    }
  };

  // Bulk delete scenes
  const deleteScenes = async (ids: string[]) => {
    try {
      const { error } = await supabase
        .from('story_scenes')
        .delete()
        .in('id', ids);

      if (error) throw error;

      message.success(`Deleted ${ids.length} scenes successfully`);
      await fetchScenes();
      await fetchStats();
      return true;
    } catch (error) {
      console.error('Error deleting scenes:', error);
      message.error('Failed to delete scenes');
      return false;
    }
  };

  // Reorder scenes
  const reorderScenes = async (sceneIds: string[]) => {
    try {
      await Promise.all(
        sceneIds.map((id, index) =>
          supabase
            .from('story_scenes')
            .update({ scene_order: index + 1 })
            .eq('id', id)
        )
      );

      message.success('Scenes reordered successfully');
      await fetchScenes();
      return true;
    } catch (error) {
      console.error('Error reordering scenes:', error);
      message.error('Failed to reorder scenes');
      return false;
    }
  };

  // Duplicate a scene
  const duplicateScene = async (id: string) => {
    try {
      const { data: original, error: fetchError } = await supabase
        .from('story_scenes')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const { data: scenes } = await supabase
        .from('story_scenes')
        .select('scene_order')
        .eq('story_id', original.story_id)
        .order('scene_order', { ascending: false })
        .limit(1);

      const nextOrder = scenes && scenes.length > 0 ? scenes[0].scene_order + 1 : 1;

      const { data: newScene, error: insertError } = await supabase
        .from('story_scenes')
        .insert({
          id: crypto.randomUUID(),
          story_id: original.story_id,
          scene_order: nextOrder,
          background: original.background,
          speaker_id: original.speaker_id,
          dialog_text: `${original.dialog_text} (Copy)`,
          sound_effect: original.sound_effect,
          is_end_story: original.is_end_story,
          is_failed_story: original.is_failed_story,
          active_scene_name: original.active_scene_name,
          failure_scene_name: original.failure_scene_name,
          typing_style: original.typing_style,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      message.success('Scene duplicated successfully');
      await fetchScenes();
      await fetchStats();
      return newScene;
    } catch (error) {
      console.error('Error duplicating scene:', error);
      message.error('Failed to duplicate scene');
      return null;
    }
  };

  // Get scenes by story
  const getScenesByStory = async (storyId: string) => {
    try {
      const { data, error } = await supabase
        .from('story_scenes')
        .select(`
          *,
          speaker:speaker_id (
            id,
            name,
            color
          )
        `)
        .eq('story_id', storyId)
        .order('scene_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching scenes by story:', error);
      message.error('Failed to load scenes for story');
      return [];
    }
  };

  // Export scenes data
  const exportScenes = async (storyId: string) => {
    try {
      const scenesData = await getScenesByStory(storyId);

      const exportData = scenesData.map(scene => ({
        order: scene.scene_order,
        speaker: scene.speaker?.name || 'Unknown',
        dialog: scene.dialog_text,
        background: scene.background || 'None',
        sound_effect: scene.sound_effect || 'None',
        choices: scene.choices?.length || 0,
        is_end_story: scene.is_end_story,
        is_failed_story: scene.is_failed_story,
        active_scene_name: scene.active_scene_name || 'None',
        failure_scene_name: scene.failure_scene_name || 'None',
        typing_style: scene.typing_style || 'Not Set',
      }));

      return exportData;
    } catch (error) {
      console.error('Error exporting scenes:', error);
      message.error('Failed to export scenes');
      return null;
    }
  };

  // Initial load
  useEffect(() => {
    fetchScenes();
    fetchStats();
    fetchCharacters();
    fetchStories();
  }, [filters]);

  return {
    // State
    scenes,
    loading,
    filters,
    setFilters,
    stats,
    selectedScene,
    availableCharacters,
    availableStories,
    TYPING_STYLES,

    // CRUD Operations
    createScene,
    updateScene,
    deleteScene,
    deleteScenes,
    fetchSceneDetails,
    duplicateScene,
    reorderScenes,
    getScenesByStory,
    exportScenes,

    // Utility
    refresh: fetchScenes,
    refreshStats: fetchStats,
    fetchCharacters,
    fetchStories,
  };
};
