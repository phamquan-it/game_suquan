import { supabase } from '@/utils/supabase/client';
import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

export interface SupabaseTable {
  schema_name: string;
  table_name: string;
  table_type: string;
  has_trigger: boolean;
  trigger_count: number;
}

export interface SupabaseTriggerDDL {
  schema_name: string;
  table_name: string;
  trigger_name: string;
  ddl: string;
}

export type TriggerFilter = 'all' | 'has_trigger' | 'no_trigger';

const SUPABASE_TABLES_QUERY_KEY = ['supabase-tables-with-triggers'];

export function useSupabaseTables() {
  const [searchText, setSearchText] = useState('');
  const [triggerFilter, setTriggerFilter] = useState<TriggerFilter>('has_trigger');

  const tablesQuery = useQuery({
    queryKey: SUPABASE_TABLES_QUERY_KEY,
    queryFn: async (): Promise<SupabaseTable[]> => {
      const { data, error } = await supabase.rpc(
        'get_all_tables_with_trigger_status'
      );

      if (error) throw error;

      return data ?? [];
    },
  });

  const generateTableDDLMutation = useMutation({
    mutationFn: async (tableName: string): Promise<string | null> => {
      const { data, error } = await supabase.rpc('generate_table_ddl', {
        target_table_name: tableName,
      });

      if (error) throw error;

      return data;
    },
  });

  const generateTriggerDDLMutation = useMutation({
    mutationFn: async (
      tableName?: string
    ): Promise<SupabaseTriggerDDL[]> => {
      const { data, error } = await supabase.rpc('generate_trigger_ddl', {
        target_table_name: tableName ?? null,
      });

      if (error) throw error;

      return data ?? [];
    },
  });

  const filteredTables = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return (tablesQuery.data ?? []).filter((table) => {
      const matchName =
        !keyword ||
        table.table_name.toLowerCase().includes(keyword) ||
        table.schema_name.toLowerCase().includes(keyword);

      const matchTrigger =
        triggerFilter === 'all' ||
        (triggerFilter === 'has_trigger' && table.has_trigger) ||
        (triggerFilter === 'no_trigger' && !table.has_trigger);

      return matchName && matchTrigger;
    });
  }, [tablesQuery.data, searchText, triggerFilter]);

  return {
    tables: tablesQuery.data ?? [],
    filteredTables,

    loadingTables: tablesQuery.isLoading,
    tablesError: tablesQuery.error,
    refetchTables: tablesQuery.refetch,

    searchText,
    setSearchText,

    triggerFilter,
    setTriggerFilter,

    generateTableDDL: generateTableDDLMutation.mutateAsync,
    generatingTableDDL: generateTableDDLMutation.isPending,

    generateTriggerDDL: generateTriggerDDLMutation.mutateAsync,
    generatingTriggerDDL: generateTriggerDDLMutation.isPending,
  };
}
