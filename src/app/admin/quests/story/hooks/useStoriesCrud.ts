// hooks/useStoriesCrud.ts
'use client';

import { supabase } from '@/utils/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type Position = 'left' | 'right' | 'center';

export interface Story {
  id: string;
  title: string;
  description: string | null;
  entry_scene_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface StoryCharacter {
  id: string;
  name: string;
  avatar: string;
  color: string;
  default_position: Position;
  faction_id: string | null;
  emotion_states: Record<string, any> | null;
  is_su_quan: boolean | null;
  created_at: string;
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
}

export interface StoryChoice {
  id: string;
  scene_id: string;
  choice_text: string;
  next_scene_id: string | null;
  effect_text: string;
  stats_change: Record<string, any>;
  choice_order: number;
  created_at: string;
}

export type StoryInsert = Omit<Story, 'created_at' | 'updated_at'>;
export type StoryUpdate = Partial<Omit<Story, 'created_at' | 'updated_at' | 'id'>>;

export type StoryCharacterInsert = Omit<StoryCharacter, 'created_at'>;
export type StoryCharacterUpdate = Partial<Omit<StoryCharacter, 'created_at' | 'id'>>;

export type StorySceneInsert = Omit<StoryScene, 'created_at'>;
export type StorySceneUpdate = Partial<Omit<StoryScene, 'created_at' | 'id'>>;

export type StoryChoiceInsert = Omit<StoryChoice, 'created_at'>;
export type StoryChoiceUpdate = Partial<Omit<StoryChoice, 'created_at' | 'id'>>;

const keys = {
  stories: ['stories'],
  story: (id: string) => ['stories', id],

  characters: ['story_characters'],
  scenes: (storyId: string) => ['story_scenes', storyId],
  choices: (sceneId: string) => ['story_choices', sceneId],
};

function throwIfError(error: any) {
  if (error) throw error;
}

export function useStories() {
  return useQuery({
    queryKey: keys.stories,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });

      throwIfError(error);
      return data as Story[];
    },
  });
}

export function useStory(id?: string) {
  return useQuery({
    queryKey: keys.story(id ?? ''),
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('id', id)
        .single();

      throwIfError(error);
      return data as Story;
    },
  });
}

export function useStoryCharacters() {
  return useQuery({
    queryKey: keys.characters,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('story_characters')
        .select('*')
        .order('created_at', { ascending: true });

      throwIfError(error);
      return data as StoryCharacter[];
    },
  });
}

export function useStoryScenes(storyId?: string) {
  return useQuery({
    queryKey: keys.scenes(storyId ?? ''),
    enabled: !!storyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('story_scenes')
        .select(`
          *,
          speaker:story_characters(*)
        `)
        .eq('story_id', storyId)
        .order('scene_order', { ascending: true });

      throwIfError(error);
      return data as Array<StoryScene & { speaker: StoryCharacter }>;
    },
  });
}

export function useStoryChoices(sceneId?: string) {
  return useQuery({
    queryKey: keys.choices(sceneId ?? ''),
    enabled: !!sceneId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('story_choices')
        .select('*')
        .eq('scene_id', sceneId)
        .order('choice_order', { ascending: true });

      throwIfError(error);
      return data as StoryChoice[];
    },
  });
}

export function useStoryCrud() {
  const queryClient = useQueryClient();

  const createStory = useMutation({
    mutationFn: async (payload: StoryInsert) => {
      const { data, error } = await supabase
        .from('stories')
        .insert(payload)
        .select()
        .single();

      throwIfError(error);
      return data as Story;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.stories });
    },
  });

  const updateStory = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: StoryUpdate;
    }) => {
      const { data, error } = await supabase
        .from('stories')
        .update({
          ...payload,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      throwIfError(error);
      return data as Story;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: keys.stories });
      queryClient.invalidateQueries({ queryKey: keys.story(variables.id) });
    },
  });

  const deleteStory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('stories').delete().eq('id', id);
      throwIfError(error);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.stories });
    },
  });

  return {
    createStory,
    updateStory,
    deleteStory,
  };
}

export function useStorySceneCrud(storyId?: string) {
  const queryClient = useQueryClient();

  const createScene = useMutation({
    mutationFn: async (payload: StorySceneInsert) => {
      const { data, error } = await supabase
        .from('story_scenes')
        .insert(payload)
        .select()
        .single();

      throwIfError(error);
      return data as StoryScene;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: keys.scenes(data.story_id) });
    },
  });

  const updateScene = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: StorySceneUpdate;
    }) => {
      const { data, error } = await supabase
        .from('story_scenes')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      throwIfError(error);
      return data as StoryScene;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: keys.scenes(data.story_id) });
    },
  });

  const deleteScene = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('story_scenes').delete().eq('id', id);
      throwIfError(error);
      return id;
    },
    onSuccess: () => {
      if (storyId) {
        queryClient.invalidateQueries({ queryKey: keys.scenes(storyId) });
      }
    },
  });

  return {
    createScene,
    updateScene,
    deleteScene,
  };
}

export function useStoryChoiceCrud(sceneId?: string) {
  const queryClient = useQueryClient();

  const createChoice = useMutation({
    mutationFn: async (payload: StoryChoiceInsert) => {
      const { data, error } = await supabase
        .from('story_choices')
        .insert(payload)
        .select()
        .single();

      throwIfError(error);
      return data as StoryChoice;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: keys.choices(data.scene_id) });
    },
  });

  const updateChoice = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: StoryChoiceUpdate;
    }) => {
      const { data, error } = await supabase
        .from('story_choices')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      throwIfError(error);
      return data as StoryChoice;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: keys.choices(data.scene_id) });
    },
  });

  const deleteChoice = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('story_choices').delete().eq('id', id);
      throwIfError(error);
      return id;
    },
    onSuccess: () => {
      if (sceneId) {
        queryClient.invalidateQueries({ queryKey: keys.choices(sceneId) });
      }
    },
  });

  return {
    createChoice,
    updateChoice,
    deleteChoice,
  };
}

export function useStoryCharacterCrud() {
  const queryClient = useQueryClient();

  const createCharacter = useMutation({
    mutationFn: async (payload: StoryCharacterInsert) => {
      const { data, error } = await supabase
        .from('story_characters')
        .insert(payload)
        .select()
        .single();

      throwIfError(error);
      return data as StoryCharacter;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.characters });
    },
  });

  const updateCharacter = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: StoryCharacterUpdate;
    }) => {
      const { data, error } = await supabase
        .from('story_characters')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      throwIfError(error);
      return data as StoryCharacter;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.characters });
    },
  });

  const deleteCharacter = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('story_characters')
        .delete()
        .eq('id', id);

      throwIfError(error);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.characters });
    },
  });

  return {
    createCharacter,
    updateCharacter,
    deleteCharacter,
  };
}
