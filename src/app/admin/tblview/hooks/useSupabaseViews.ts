// hooks/useSupabaseViews.ts

import { supabase } from '@/utils/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface SupabaseView {
  schema_name: string;
  view_name: string;
  definition: string;
}

const VIEWS_QUERY_KEY = ['supabase-views'];

export function useSupabaseViews() {
  const queryClient = useQueryClient();

  const viewsQuery = useQuery({
    queryKey: VIEWS_QUERY_KEY,
    queryFn: async (): Promise<SupabaseView[]> => {
      const { data, error } = await supabase.rpc('get_all_views');

      if (error) throw error;

      return data ?? [];
    },
  });

  const findViewsMutation = useMutation({
    mutationFn: async (searchText: string): Promise<SupabaseView[]> => {
      const { data, error } = await supabase.rpc('find_views', {
        search_text: searchText,
      });

      if (error) throw error;

      return data ?? [];
    },
  });

  const createViewMutation = useMutation({
    mutationFn: async ({
      viewName,
      viewSql,
    }: {
      viewName: string;
      viewSql: string;
    }) => {
      const { data, error } = await supabase.rpc('create_view', {
        view_name: viewName,
        view_sql: viewSql,
      });

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VIEWS_QUERY_KEY });
    },
  });

  const updateViewMutation = useMutation({
    mutationFn: async ({
      viewName,
      viewSql,
    }: {
      viewName: string;
      viewSql: string;
    }) => {
      const { data, error } = await supabase.rpc('update_view', {
        view_name: viewName,
        view_sql: viewSql,
      });

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VIEWS_QUERY_KEY });
    },
  });

  const dropViewMutation = useMutation({
    mutationFn: async (viewName: string) => {
      const { data, error } = await supabase.rpc('drop_view', {
        view_name: viewName,
      });

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VIEWS_QUERY_KEY });
    },
  });

  const getViewDDLMutation = useMutation({
    mutationFn: async (viewName: string): Promise<string | null> => {
      const { data, error } = await supabase.rpc('get_view_ddl', {
        target_view_name: viewName,
      });

      if (error) throw error;

      return data;
    },
  });

  return {
    views: viewsQuery.data ?? [],
    loadingViews: viewsQuery.isLoading,
    viewsError: viewsQuery.error,
    refetchViews: viewsQuery.refetch,

    findViews: findViewsMutation.mutateAsync,
    findingViews: findViewsMutation.isPending,

    createView: createViewMutation.mutateAsync,
    creatingView: createViewMutation.isPending,

    updateView: updateViewMutation.mutateAsync,
    updatingView: updateViewMutation.isPending,

    dropView: dropViewMutation.mutateAsync,
    droppingView: dropViewMutation.isPending,

    getViewDDL: getViewDDLMutation.mutateAsync,
    gettingViewDDL: getViewDDLMutation.isPending,
  };
}
