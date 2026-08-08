// app/admin/stories/hooks/useStory.ts
import { useState, useEffect, useCallback } from 'react';
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
  entry_scene?: {
    id: string;
    scene_order: number;
    dialog_text: string;
    speaker_id: string;
  };
  scene_count?: number;
  character_count?: number;
}

export interface StoryFilters {
  search?: string;
  hasEntryScene?: boolean | null;
  hasScenes?: boolean | null;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'created_at' | 'title' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
}

export interface StoryStats {
  total: number;
  withEntryScene: number;
  withoutEntryScene: number;
  totalScenes: number;
  totalCharacters: number;
  avgScenesPerStory: number;
  mostProlificStory?: {
    id: string;
    title: string;
    scene_count: number;
  };
  storiesByMonth: {
    month: string;
    count: number;
  }[];
}

export const useStory = (storyId?: string) => {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch a single story by ID
  const fetchStory = useCallback(async () => {
    if (!storyId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          entry_scene:entry_scene_id (
            id,
            scene_order,
            dialog_text,
            speaker_id
          )
        `)
        .eq('id', storyId)
        .single();

      if (error) throw error;

      // Get scene count
      const { count: sceneCount } = await supabase
        .from('story_scenes')
        .select('*', { count: 'exact', head: true })
        .eq('story_id', storyId);

      // Get unique characters count
      const { data: sceneData } = await supabase
        .from('story_scenes')
        .select('speaker_id')
        .eq('story_id', storyId);

      const uniqueCharacters = new Set(sceneData?.map(s => s.speaker_id) || []);

      setStory({
        ...data,
        scene_count: sceneCount || 0,
        character_count: uniqueCharacters.size,
      });
    } catch (error) {
      console.error('Error fetching story:', error);
      setError('Failed to load story details');
      message.error('Failed to load story details');
    } finally {
      setLoading(false);
    }
  }, [storyId]);

  // Create a new story
  const createStory = useCallback(async (data: {
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
      return story;
    } catch (error) {
      console.error('Error creating story:', error);
      message.error('Failed to create story');
      return null;
    }
  }, []);

  // Update a story
  const updateStory = useCallback(async (id: string, data: Partial<{
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
      if (storyId === id) {
        setStory(story);
      }
      return story;
    } catch (error) {
      console.error('Error updating story:', error);
      message.error('Failed to update story');
      return null;
    }
  }, [storyId]);

  // Delete a story
  const deleteStory = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      message.success('Story deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting story:', error);
      message.error('Failed to delete story');
      return false;
    }
  }, []);

  // Set entry scene
  const setEntryScene = useCallback(async (id: string, sceneId: string | null) => {
    try {
      const { error } = await supabase
        .from('stories')
        .update({
          entry_scene_id: sceneId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      
      message.success('Entry scene updated successfully');
      if (storyId === id) {
        await fetchStory();
      }
      return true;
    } catch (error) {
      console.error('Error setting entry scene:', error);
      message.error('Failed to set entry scene');
      return false;
    }
  }, [storyId, fetchStory]);

  // Get stories with pagination and filters
  const getStories = useCallback(async (filters?: StoryFilters, page?: number, pageSize?: number) => {
    try {
      let query = supabase
        .from('stories')
        .select('*', { count: 'exact' })
        .order(filters?.sortBy || 'created_at', { 
          ascending: filters?.sortOrder === 'asc' 
        });

      // Apply filters
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.hasEntryScene === true) {
        query = query.not('entry_scene_id', 'is', null);
      } else if (filters?.hasEntryScene === false) {
        query = query.is('entry_scene_id', null);
      }

      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      // Pagination
      if (page && pageSize) {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      // Get additional stats for each story
      const storiesWithStats = await Promise.all(
        (data || []).map(async (story) => {
          const { count: sceneCount } = await supabase
            .from('story_scenes')
            .select('*', { count: 'exact', head: true })
            .eq('story_id', story.id);

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

      return {
        data: storiesWithStats,
        count: count || 0,
      };
    } catch (error) {
      console.error('Error fetching stories:', error);
      message.error('Failed to load stories');
      return {
        data: [],
        count: 0,
      };
    }
  }, []);

  // Get story statistics
  const getStoryStats = useCallback(async () => {
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

      // Most prolific story
      let mostProlificStory = undefined;
      if (counts.length > 0) {
        const maxCount = Math.max(...counts);
        const maxStoryId = Object.keys(sceneCounts).find(
          key => sceneCounts[key] === maxCount
        );
        
        if (maxStoryId) {
          const { data: storyData } = await supabase
            .from('stories')
            .select('id, title')
            .eq('id', maxStoryId)
            .single();

          if (storyData) {
            mostProlificStory = {
              id: storyData.id,
              title: storyData.title,
              scene_count: maxCount,
            };
          }
        }
      }

      // Stories by month (last 12 months)
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      const { data: monthlyData } = await supabase
        .from('stories')
        .select('created_at')
        .gte('created_at', twelveMonthsAgo.toISOString());

      const storiesByMonth: Record<string, number> = {};
      monthlyData?.forEach(story => {
        const month = new Date(story.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
        });
        storiesByMonth[month] = (storiesByMonth[month] || 0) + 1;
      });

      const storiesByMonthArray = Object.entries(storiesByMonth).map(([month, count]) => ({
        month,
        count,
      })).sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA.getTime() - dateB.getTime();
      });

      const stats: StoryStats = {
        total: total || 0,
        withEntryScene: withEntryScene || 0,
        withoutEntryScene: withoutEntryScene || 0,
        totalScenes: totalScenes || 0,
        totalCharacters: totalCharacters || 0,
        avgScenesPerStory,
        mostProlificStory,
        storiesByMonth: storiesByMonthArray,
      };

      return stats;
    } catch (error) {
      console.error('Error fetching story stats:', error);
      message.error('Failed to load story statistics');
      return null;
    }
  }, []);

  // Check if story exists
  const storyExists = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('id')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking story existence:', error);
      return false;
    }
  }, []);

  // Get stories by character
  const getStoriesByCharacter = useCallback(async (characterId: string) => {
    try {
      // Get all scenes with this speaker
      const { data: scenes } = await supabase
        .from('story_scenes')
        .select('story_id')
        .eq('speaker_id', characterId);

      const storyIds = [...new Set(scenes?.map(s => s.story_id) || [])];

      if (storyIds.length === 0) {
        return [];
      }

      const { data: stories, error } = await supabase
        .from('stories')
        .select('*')
        .in('id', storyIds)
        .order('title', { ascending: true });

      if (error) throw error;
      return stories || [];
    } catch (error) {
      console.error('Error fetching stories by character:', error);
      message.error('Failed to load stories for character');
      return [];
    }
  }, []);

  // Search stories
  const searchStories = useCallback(async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching stories:', error);
      return [];
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (storyId) {
      fetchStory();
    }
  }, [storyId, fetchStory]);

  return {
    // State
    story,
    loading,
    error,

    // CRUD Operations
    createStory,
    updateStory,
    deleteStory,
    fetchStory,
    setEntryScene,

    // Query Operations
    getStories,
    getStoryStats,
    getStoriesByCharacter,
    searchStories,
    storyExists,

    // Utility
    refresh: fetchStory,
  };
};

// Type guard for checking if a story exists
export const isStory = (value: any): value is Story => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'id' in value &&
    'title' in value &&
    'created_at' in value
  );
};

// Helper function to format story title
export const formatStoryTitle = (story: Story): string => {
  return story.title.trim() || 'Untitled Story';
};

// Helper function to get story URL
export const getStoryUrl = (storyId: string): string => {
  return `/admin/stories/${storyId}`;
};

// Helper function to get story scenes URL
export const getStoryScenesUrl = (storyId: string): string => {
  return `/admin/stories/${storyId}/scenes`;
};
