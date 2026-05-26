// hooks/useSupabaseFunctions.ts

import { supabase } from '@/utils/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface SupabaseFunction {
  name: string;
  schema: string;
  language: string;
  args?: string;
  identity_args?: string;
  ddl?: string;
}

const FUNCTION_QUERY_KEY = ['supabase-functions'];

export function useSupabaseFunctions() {
  const queryClient = useQueryClient();

  const functionsQuery = useQuery({
    queryKey: FUNCTION_QUERY_KEY,
    queryFn: async (): Promise<SupabaseFunction[]> => {
      const { data, error } = await supabase.rpc('get_all_functions');

      if (error) throw error;

      return data ?? [];
    },
  });

  const generateDDLMutation = useMutation({
    mutationFn: async ({ oid }: { oid: number }) => {
      const { data, error } = await supabase.rpc('generate_function_ddl', {
        function_oid: oid,
      });

      if (error) throw error;

      return data as string;
    },
  });

  const createFunctionMutation = useMutation({
    mutationFn: async ({
      name,
      params = '',
      returns = 'json',
      language = 'plpgsql',
      body,
    }: {
      name: string;
      params?: string;
      returns?: string;
      language?: string;
      body: string;
    }) => {
      const sql = `
CREATE OR REPLACE FUNCTION public.${name}(${params})
RETURNS ${returns}
LANGUAGE ${language}
AS $$
${body}
$$;
`;

      const { data, error } = await supabase.rpc('execute_sql', {
        sql_query: sql,
      });

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FUNCTION_QUERY_KEY });
    },
  });

  const deleteFunctionMutation = useMutation({
    mutationFn: async ({
      name,
      identityArgs = '',
    }: {
      name: string;
      identityArgs?: string;
    }) => {
      const sql = `
DROP FUNCTION IF EXISTS public.${name}(${identityArgs});
`;

      const { data, error } = await supabase.rpc('execute_sql', {
        sql_query: sql,
      });

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FUNCTION_QUERY_KEY });
    },
  });

  const executeFunctionMutation = useMutation({
    mutationFn: async ({
      functionName,
      params = {},
    }: {
      functionName: string;
      params?: Record<string, any>;
    }) => {
      const { data, error } = await supabase.rpc(functionName, params);

      if (error) throw error;

      return data;
    },
  });

  return {
    functions: functionsQuery.data ?? [],
    loadingFunctions: functionsQuery.isLoading,
    functionsError: functionsQuery.error,

    generateDDL: generateDDLMutation.mutateAsync,
    generatingDDL: generateDDLMutation.isPending,

    createFunction: createFunctionMutation.mutateAsync,
    creatingFunction: createFunctionMutation.isPending,

    deleteFunction: deleteFunctionMutation.mutateAsync,
    deletingFunction: deleteFunctionMutation.isPending,

    executeFunction: executeFunctionMutation.mutateAsync,
    executingFunction: executeFunctionMutation.isPending,

    refetchFunctions: functionsQuery.refetch,
  };
}
