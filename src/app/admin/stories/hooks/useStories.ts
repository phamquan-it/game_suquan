// app/admin/stories/hooks/useStories.ts
import { useEffect, useState } from 'react';
import { message } from 'antd';
import { supabase } from '@/utils/supabase/client';

// Types
export interface Story {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  entry_scene_id: string | null;
  // Joined data
  entry_scene?: StoryScene;
  scene_count?: number;
  character_count?: number;
}

export interface StoryScene {
  id: string;
  story_id: string;
  scene_order: number;
  background: string | null;
  speaker_id: string;
  dialog_text: string;
  sound_effect: string;
  created_at: string;
  // Joined data
  speaker?: StoryCharacter;
  choices?: StoryChoice[];
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

export interface StoryFilters {
  search?: string;
  hasEntryScene?: boolean | null;
  hasScenes?: boolean | null;
  dateFrom?: string;
  dateTo?: string;
}

export interface StoryStats {
  total: number;
  withEntryScene: number;
  withoutEntryScene: number;
  totalScenes: number;
  totalCharacters: number;
  avgScenesPerStory: number;
}

export const useStories = (initialFilters?: StoryFilters) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<StoryFilters>(initialFilters || {
    search: '',
    hasEntryScene: null,
    hasScenes: null,
    dateFrom: '',
    dateTo: '',
  });
  const [stats, setStats] = useState<StoryStats | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [scenes, setScenes] = useState<StoryScene[]>([]);
  const [characters, setCharacters] = useState<StoryCharacter[]>([]);

  // Fetch stories with filters
  const fetchStories = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('stories')
        .select(`
          *,
          entry_scene:entry_scene_id (
            id,
            scene_order,
            background,
            dialog_text,
            speaker_id,
            sound_effect
          )
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.hasEntryScene === true) {
        query = query.not('entry_scene_id', 'is', null);
      } else if (filters.hasEntryScene === false) {
        query = query.is('entry_scene_id', null);
      }

      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Get additional stats for each story
      const storiesWithStats = await Promise.all(
        (data || []).map(async (story) => {
          // Get scene count
          const { count: sceneCount } = await supabase
            .from('story_scenes')
            .select('*', { count: 'exact', head: true })
            .eq('story_id', story.id);

          // Get unique characters count
          const { data: sceneData } = await supabase
            .from('story_scenes')
            .select('speaker_id')
            .eq('story_id', story.id);

          const uniqueCharacters = new Set(sceneData?.map(s => s.speaker_id) || []);

          return {
            ...story,
            scene_count: sceneCount || 0,
            character_count: uniqueCharacters.size,
          };
        })
      );

      setStories(storiesWithStats);
    } catch (error) {
      console.error('Error fetching stories:', error);
      message.error('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  // Fetch story statistics
  const fetchStats = async () => {
    try {
      // Total stories
      const { count: total } = await supabase
        .from('stories')
        .select('*', { count: 'exact', head: true });

      // Stories with entry scene
      const { count: withEntryScene } = await supabase
        .from('stories')
        .select('*', { count: 'exact', head: true })
        .not('entry_scene_id', 'is', null);

      // Stories without entry scene
      const { count: withoutEntryScene } = await supabase
        .from('stories')
        .select('*', { count: 'exact', head: true })
        .is('entry_scene_id', null);

      // Total scenes
      const { count: totalScenes } = await supabase
        .from('story_scenes')
        .select('*', { count: 'exact', head: true });

      // Total characters
      const { count: totalCharacters } = await supabase
        .from('story_characters')
        .select('*', { count: 'exact', head: true });

      // Average scenes per story
      const { data: sceneData } = await supabase
        .from('story_scenes')
        .select('story_id', { count: 'exact' });

      const sceneCounts: Record<string, number> = {};
      sceneData?.forEach(scene => {
        sceneCounts[scene.story_id] = (sceneCounts[scene.story_id] || 0) + 1;
      });

      const counts = Object.values(sceneCounts);
      const avgScenesPerStory = counts.length 
        ? counts.reduce((a, b) => a + b, 0) / counts.length 
        : 0;

      setStats({
        total: total || 0,
        withEntryScene: withEntryScene || 0,
        withoutEntryScene: withoutEntryScene || 0,
        totalScenes: totalScenes || 0,
        totalCharacters: totalCharacters || 0,
        avgScenesPerStory,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Fetch a single story with all its scenes and choices
  const fetchStoryDetails = async (storyId: string) => {
    try {
      // Get story
      const { data: storyData, error: storyError } = await supabase
        .from('stories')
        .select('*')
        .eq('id', storyId)
        .single();

      if (storyError) throw storyError;
      setSelectedStory(storyData);

      // Get all scenes for this story
      const { data: scenesData, error: scenesError } = await supabase
        .from('story_scenes')
        .select(`
          *,
          speaker:speaker_id (*)
        `)
        .eq('story_id', storyId)
        .order('scene_order', { ascending: true });

      if (scenesError) throw scenesError;

      // Get choices for each scene
      const scenesWithChoices = await Promise.all(
        (scenesData || []).map(async (scene) => {
          const { data: choicesData } = await supabase
            .from('story_choices')
            .select(`
              *,
              next_scene:next_scene_id (*)
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
      return scenesWithChoices;
    } catch (error) {
      console.error('Error fetching story details:', error);
      message.error('Failed to load story details');
      return null;
    }
  };

  // Fetch all characters (for use in forms)
  const fetchCharacters = async () => {
    try {
      const { data, error } = await supabase
        .from('story_characters')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCharacters(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching characters:', error);
      message.error('Failed to load characters');
      return [];
    }
  };

  // Create a new story
  const createStory = async (data: {
    title: string;
    description?: string;
    entry_scene_id?: string | null;
  }) => {
    try {
      const { data: story, error } = await supabase
        .from('stories')
        .insert({
          id: crypto.randomUUID(),
          title: data.title,
          description: data.description || null,
          entry_scene_id: data.entry_scene_id || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      
      message.success('Story created successfully');
      await fetchStories();
      return story;
    } catch (error) {
      console.error('Error creating story:', error);
      message.error('Failed to create story');
      return null;
    }
  };

  // Update a story
  const updateStory = async (id: string, data: Partial<{
    title: string;
    description: string | null;
    entry_scene_id: string | null;
  }>) => {
    try {
      const { data: story, error } = await supabase
        .from('stories')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      message.success('Story updated successfully');
      await fetchStories();
      return story;
    } catch (error) {
      console.error('Error updating story:', error);
      message.error('Failed to update story');
      return null;
    }
  };

  // Delete a story
  const deleteStory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      message.success('Story deleted successfully');
      await fetchStories();
      await fetchStats();
      return true;
    } catch (error) {
      console.error('Error deleting story:', error);
      message.error('Failed to delete story');
      return false;
    }
  };

  // Create a new scene
  const createScene = async (data: {
    story_id: string;
    scene_order: number;
    background?: string;
    speaker_id: string;
    dialog_text: string;
    sound_effect?: string;
  }) => {
    try {
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
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      
      message.success('Scene created successfully');
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
  }>) => {
    try {
      const { data: scene, error } = await supabase
        .from('story_scenes')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      message.success('Scene updated successfully');
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
      return true;
    } catch (error) {
      console.error('Error deleting scene:', error);
      message.error('Failed to delete scene');
      return false;
    }
  };

  // Create a choice
  const createChoice = async (data: {
    scene_id: string;
    choice_text: string;
    next_scene_id?: string | null;
    effect_text: string;
    stats_change?: any;
    choice_order: number;
    boss_id?: string | null;
  }) => {
    try {
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
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      
      message.success('Choice created successfully');
      return choice;
    } catch (error) {
      console.error('Error creating choice:', error);
      message.error('Failed to create choice');
      return null;
    }
  };

  // Update a choice
  const updateChoice = async (id: string, data: Partial<{
    choice_text: string;
    next_scene_id: string | null;
    effect_text: string;
    stats_change: any;
    choice_order: number;
    boss_id: string | null;
  }>) => {
    try {
      const { data: choice, error } = await supabase
        .from('story_choices')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      message.success('Choice updated successfully');
      return choice;
    } catch (error) {
      console.error('Error updating choice:', error);
      message.error('Failed to update choice');
      return null;
    }
  };

  // Delete a choice
  const deleteChoice = async (id: string) => {
    try {
      const { error } = await supabase
        .from('story_choices')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      message.success('Choice deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting choice:', error);
      message.error('Failed to delete choice');
      return false;
    }
  };

  // Set entry scene for a story
  const setEntryScene = async (storyId: string, sceneId: string | null) => {
    try {
      const { error } = await supabase
        .from('stories')
        .update({
          entry_scene_id: sceneId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', storyId);

      if (error) throw error;
      
      message.success('Entry scene updated successfully');
      await fetchStories();
      return true;
    } catch (error) {
      console.error('Error setting entry scene:', error);
      message.error('Failed to set entry scene');
      return false;
    }
  };

  // Reorder scenes
  const reorderScenes = async (sceneIds: string[]) => {
    try {
      // Update each scene's order
      await Promise.all(
        sceneIds.map((id, index) =>
          supabase
            .from('story_scenes')
            .update({ scene_order: index + 1 })
            .eq('id', id)
        )
      );
      
      message.success('Scenes reordered successfully');
      return true;
    } catch (error) {
      console.error('Error reordering scenes:', error);
      message.error('Failed to reorder scenes');
      return false;
    }
  };

  // Initial load
  useEffect(() => {
    fetchStories();
    fetchStats();
    fetchCharacters();
  }, [filters]);

  return {
    // State
    stories,
    loading,
    filters,
    setFilters,
    stats,
    selectedStory,
    scenes,
    characters,
    
    // CRUD operations
    createStory,
    updateStory,
    deleteStory,
    fetchStoryDetails,
    setEntryScene,
    
    // Scene operations
    createScene,
    updateScene,
    deleteScene,
    reorderScenes,
    
    // Choice operations
    createChoice,
    updateChoice,
    deleteChoice,
    
    // Utility
    refresh: fetchStories,
    refreshStats: fetchStats,
    fetchCharacters,
  };
};
