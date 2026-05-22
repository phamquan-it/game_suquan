// hooks/useGameActions.ts
import { supabase } from '@/utils/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateGameActionInput, GameAction, UpdateGameActionInput } from './types';


const QUERY_KEY = ['game_actions'];

export function useGameActions() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('game_actions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data as GameAction[];
    },
  });
}

export function useGameAction(id?: string) {
  return useQuery({
    queryKey: ['game_actions', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('game_actions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data as GameAction;
    },
  });
}

export function useCreateGameAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateGameActionInput) => {
      const { data, error } = await supabase
        .from('game_actions')
        .insert({
          id: input.id,
          description: input.description,
          category: input.category,
          repeatable: input.repeatable ?? true,
          metadata: input.metadata ?? {},
        })
        .select()
        .single();

      if (error) throw error;

      return data as GameAction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useUpdateGameAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateGameActionInput) => {
      const { data, error } = await supabase
        .from('game_actions')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data as GameAction;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: ['game_actions', variables.id],
      });
    },
  });
}

export function useDeleteGameAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('game_actions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.removeQueries({ queryKey: ['game_actions', id] });
    },
  });
}
