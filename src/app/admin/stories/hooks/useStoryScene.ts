// app/admin/stories/hooks/useStoryScene.ts
import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { supabase } from '@/utils/supabase/client';

export interface StoryScene {
  id: string;
  story_id: string;
  scene_order: number;
  background: string | null;
  speaker_id: string;
  dialog_text: string;
  sound_effect: string;
  created_at: string;
  speaker?: {
    id: string;
    name: string;
    color: string;
    avatar: string;
  };
  story?: {
    id: string;
    title: string;
  };
}

export const useStoryScene = (sceneId?: string) => {
  const [scene, setScene] = useState<StoryScene | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScene = useCallback(async () => {
    if (!sceneId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('story_scenes')
        .select(`
          *,
          speaker:speaker_id (
            id,
            name,
            color,
            avatar
          ),
          story:story_id (
            id,
            title
          )
        `)
        .eq('id', sceneId)
        .single();

      if (error) throw error;
      setScene(data);
    } catch (error) {
      console.error('Error fetching scene:', error);
      setError('Failed to load scene details');
      message.error('Failed to load scene details');
    } finally {
      setLoading(false);
    }
  }, [sceneId]);

  const updateScene = useCallback(async (data: Partial<StoryScene>) => {
    if (!sceneId) return null;

    try {
      const { data: updated, error } = await supabase
        .from('story_scenes')
        .update(data)
        .eq('id', sceneId)
        .select()
        .single();

      if (error) throw error;
      setScene(updated);
      message.success('Scene updated successfully');
      return updated;
    } catch (error) {
      console.error('Error updating scene:', error);
      message.error('Failed to update scene');
      return null;
    }
  }, [sceneId]);

  const deleteScene = useCallback(async () => {
    if (!sceneId) return false;

    try {
      const { error } = await supabase
        .from('story_scenes')
        .delete()
        .eq('id', sceneId);

      if (error) throw error;
      message.success('Scene deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting scene:', error);
      message.error('Failed to delete scene');
      return false;
    }
  }, [sceneId]);

  useEffect(() => {
    fetchScene();
  }, [fetchScene]);

  return {
    scene,
    loading,
    error,
    fetchScene,
    updateScene,
    deleteScene,
  };
};
