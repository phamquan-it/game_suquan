// hooks/useTableRelationship.ts
import { supabase } from '@/utils/supabase/client';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  MultiTableRelationship,
  RelationshipSummary,
  TableInfo,
  TableRelationship,
  TableColumn,
} from '../types/diagram';
import {
  getCachedColumns,
  setCachedColumnsTable,
  getCachedRelationship,
  setCachedRelationship,
  invalidateSchemaCache,
} from '../services/diagramCache';
import { OnSyncLog } from '../types/syncLog';
// ==================== HOOK ====================

export function useTableRelationship(onLog?: OnSyncLog) {
  // ---------- State ----------
  const [relationshipHistory, setRelationshipHistory] = useState<
    Array<{
      tables: string[];
      results: MultiTableRelationship[];
      timestamp: Date;
    }>
  >([]);

  // ---------- Logging (đẩy về UI) ----------
  const reportLog = (entry: Parameters<OnSyncLog>[0]) => {
    if (onLog) onLog(entry);
  };

  // ---------- Queries ----------

  const tablesQuery = useQuery({
    queryKey: ['all-tables'],
    queryFn: async (): Promise<TableInfo[]> => {
      const { data, error } = await supabase.rpc('get_all_tables');

      if (error) {
        console.error('Error fetching tables:', error);
        throw error;
      }

      return data ?? [];
    },
  });

  // 👇 Query lấy columns của 1 bảng
  const getTableColumnsQuery = (tableName: string) => {
    return useQuery({
      queryKey: ['table-columns', tableName],
      queryFn: async (): Promise<TableColumn[]> => {
        const { data, error } = await supabase.rpc('get_table_columns_diagrams', {
          target_table_name: tableName,
        });

        if (error) {
          console.error('Error fetching columns:', error);
          throw error;
        }

        return data ?? [];
      },
      enabled: !!tableName,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // ---------- Mutations ----------

  // Kiểm tra quan hệ giữa 2 bảng
  const checkRelationshipMutation = useMutation({
    mutationFn: async ({
      table1,
      table2,
    }: {
      table1: string;
      table2: string;
    }): Promise<TableRelationship> => {
      const { data, error } = await supabase.rpc('check_table_relationship', {
        table1_name: table1,
        table2_name: table2,
      });

      if (error) throw error;
      return data as TableRelationship;
    },
  });

  // Kiểm tra tất cả quan hệ giữa nhiều bảng (mỗi cặp đọc cache trước,
  // chỉ gọi server cho cặp chưa cache)
  const checkMultipleTablesMutation = useMutation({
    mutationFn: async (tables: string[]): Promise<MultiTableRelationship[]> => {
      const results: MultiTableRelationship[] = [];

      // Kiểm tra từng cặp bảng
      for (let i = 0; i < tables.length; i++) {
        for (let j = i + 1; j < tables.length; j++) {
          const t1 = tables[i];
          const t2 = tables[j];

          // 1) Thử đọc cache cho cặp này
          const cachedRel = await getCachedRelationship(t1, t2);
          let rel: TableRelationship;

          if (cachedRel !== null) {
            rel = cachedRel as TableRelationship;
          } else {
            // 2) Chưa cache → gọi server
            const { data, error } = await supabase.rpc('check_table_relationship', {
              table1_name: t1,
              table2_name: t2,
            });

            if (error) {
              console.error(`Error checking ${t1} and ${t2}:`, error);
              continue;
            }

            rel = data as TableRelationship;
            // ghi cache
            await setCachedRelationship(t1, t2, rel);
          }

          results.push({
            table1: t1,
            table2: t2,
            relationship: rel,
          });

          reportLog({
            id: `rel-${t1}-${t2}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            kind: 'relationship',
            label: `Relationship: ${t1}` + '↔' + `${t2}`,
            source: cachedRel !== null ? 'client' : 'server',
            at: Date.now(),
          });
        }
      }

      // Lưu vào history
      setRelationshipHistory((prev) => [
        ...prev,
        {
          tables,
          results,
          timestamp: new Date(),
        },
      ]);

      return results;
    },
  });

  // Kiểm tra tất cả quan hệ của 1 bảng
  const getTableRelationshipsMutation = useMutation({
    mutationFn: async (tableName: string): Promise<RelationshipSummary> => {
      const tables = await tablesQuery.refetch();
      const allTables = tables.data || [];

      const incoming: TableRelationship[] = [];
      const outgoing: TableRelationship[] = [];

      for (const table of allTables) {
        if (table.table_name === tableName) continue;

        const outgoingResult = await supabase.rpc('check_table_relationship', {
          table1_name: tableName,
          table2_name: table.table_name,
        });
        if (outgoingResult.data && outgoingResult.data.relationship_exists) {
          outgoing.push(outgoingResult.data);
        }

        const incomingResult = await supabase.rpc('check_table_relationship', {
          table1_name: table.table_name,
          table2_name: tableName,
        });
        if (incomingResult.data && incomingResult.data.relationship_exists) {
          incoming.push(incomingResult.data);
        }
      }

      return {
        table_name: tableName,
        relationships: {
          incoming,
          outgoing,
        },
      };
    },
  });

  // Kiểm tra nhiều bảng cùng lúc (dùng RPC)
  const checkMultipleRelationshipsMutation = useMutation({
    mutationFn: async (tables: string[]): Promise<any> => {
      const { data, error } = await supabase.rpc('check_multiple_relationships', {
        tables: tables,
      });

      if (error) throw error;
      return data;
    },
  });

  // Lấy DDL của table
  const getTableDDLMutation = useMutation({
    mutationFn: async (tableName: string): Promise<string | null> => {
      const { data, error } = await supabase.rpc('generate_table_ddl', {
        target_table_name: tableName,
      });

      if (error) throw error;
      return data;
    },
  });

  // 👇 Mutation lấy columns của 1 bảng
  const getTableColumnsMutation = useMutation({
    mutationFn: async (tableName: string): Promise<TableColumn[]> => {
      const { data, error } = await supabase.rpc('get_table_columns_diagrams', {
        target_table_name: tableName,
      });

      if (error) {
        console.error('Error fetching columns:', error);
        throw error;
      }

      return data ?? [];
    },
  });

  // 👇 Mutation lấy columns của nhiều bảng (đọc cache IndexedDB trước,
  // chỉ gọi server cho những bảng chưa được cache)
  const getMultipleTablesColumnsMutation = useMutation({
    mutationFn: async (tableNames: string[]): Promise<Record<string, TableColumn[]>> => {
      const result: Record<string, TableColumn[]> = {};

      // 1) Lấy phần đã cache được
      const cached = await getCachedColumns(tableNames);
      Object.assign(result, cached);

      // 2) Chỉ fetch từ server những bảng chưa có cache
      const missing = tableNames.filter((name) => !(name in cached));

      for (const tableName of missing) {
        const { data, error } = await supabase.rpc('get_table_columns_diagrams', {
          target_table_name: tableName,
        });

        if (error) {
          console.error(`Error fetching columns for ${tableName}:`, error);
          result[tableName] = [];
        } else {
          const columns = data ?? [];
          result[tableName] = columns;
          // ghi cache
          await setCachedColumnsTable(tableName, columns);
        }
      }

      // 3) Log từng bảng theo nguồn nó được lấy
      const unique = Array.from(new Set(tableNames));
      for (const tableName of unique) {
        const fromClient = tableName in result && !missing.includes(tableName);
        reportLog({
          id: `col-${tableName}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          kind: 'columns',
          label: `Columns: ${tableName}`,
          source: fromClient ? 'client' : 'server',
          at: Date.now(),
          count: (result[tableName] || []).length,
        });
      }

      return result;
    },
  });

  // ---------- Helper Functions ----------

  const clearHistory = () => {
    setRelationshipHistory([]);
  };

  /**
   * Xóa toàn bộ cache schema (columns + relationship) trong IndexedDB.
   * Thường được gọi từ nút "Tải lại": sau đó trang sẽ fetch mới từ server
   * và ghi đè cache cho lần hiển thị này.
   */
  const clearSchemaCache = async (): Promise<void> => {
    await invalidateSchemaCache();
  };

  const getRelationshipSummary = (result: TableRelationship): string => {
    if (!result.relationship_exists) return 'No relationship';

    if (result.total_relationships && result.total_relationships > 1) {
      return `${result.total_relationships} relationships`;
    }

    return `${result.source_table}.${result.source_column} → ${result.target_table}.${result.target_column}`;
  };

  const getRelationshipColor = (result: TableRelationship): string => {
    if (!result.relationship_exists) return 'text-gray-500';
    return 'text-green-600';
  };

  const getDeleteActionColor = (action?: string | null): string => {
    if (action === 'CASCADE') return 'bg-red-100 text-red-700';
    if (action === 'SET NULL') return 'bg-yellow-100 text-yellow-700';
    if (action === 'RESTRICT') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getRelatedTables = (results: MultiTableRelationship[]): string[] => {
    const related = new Set<string>();
    results.forEach((r) => {
      if (r.relationship.relationship_exists) {
        related.add(r.table1);
        related.add(r.table2);
      }
    });
    return Array.from(related);
  };

  const getRelationshipsBetween = (
    results: MultiTableRelationship[],
    table1: string,
    table2: string
  ): MultiTableRelationship | undefined => {
    return results.find(
      (r) =>
        (r.table1 === table1 && r.table2 === table2) ||
        (r.table1 === table2 && r.table2 === table1)
    );
  };

  // ---------- Return ----------

  return {
    relationshipHistory,
    // Queries
    tables: tablesQuery.data ?? [],
    loadingTables: tablesQuery.isLoading,
    tablesError: tablesQuery.error,
    refetchTables: tablesQuery.refetch,
    clearSchemaCache,

    // 👇 Columns queries
    getTableColumnsQuery, // Hook query (dùng trong component)

    // Mutations
    checkRelationship: checkRelationshipMutation.mutateAsync,
    checkRelationshipResult: checkRelationshipMutation.data,
    checkingRelationship: checkRelationshipMutation.isPending,
    relationshipError: checkRelationshipMutation.error,

    checkMultipleTables: checkMultipleTablesMutation.mutateAsync,
    checkMultipleTablesResult: checkMultipleTablesMutation.data,
    checkingMultipleTables: checkMultipleTablesMutation.isPending,
    checkMultipleTablesError: checkMultipleTablesMutation.error,

    getTableRelationships: getTableRelationshipsMutation.mutateAsync,
    getTableRelationshipsResult: getTableRelationshipsMutation.data,
    gettingTableRelationships: getTableRelationshipsMutation.isPending,
    getTableRelationshipsError: getTableRelationshipsMutation.error,

    checkMultipleRelationships: checkMultipleRelationshipsMutation.mutateAsync,
    multipleRelationshipsResult: checkMultipleRelationshipsMutation.data,
    checkingMultipleRelationships: checkMultipleRelationshipsMutation.isPending,
    multipleRelationshipsError: checkMultipleRelationshipsMutation.error,

    getTableDDL: getTableDDLMutation.mutateAsync,
    getTableDDLResult: getTableDDLMutation.data,
    gettingTableDDL: getTableDDLMutation.isPending,
    getTableDDLError: getTableDDLMutation.error,

    // 👇 Columns mutations
    getTableColumns: getTableColumnsMutation.mutateAsync,
    getTableColumnsResult: getTableColumnsMutation.data,
    gettingTableColumns: getTableColumnsMutation.isPending,
    getTableColumnsError: getTableColumnsMutation.error,

    getMultipleTablesColumns: getMultipleTablesColumnsMutation.mutateAsync,
    getMultipleTablesColumnsResult: getMultipleTablesColumnsMutation.data,
    gettingMultipleTablesColumns: getMultipleTablesColumnsMutation.isPending,
    getMultipleTablesColumnsError: getMultipleTablesColumnsMutation.error,

    // Helpers
    clearHistory,
    getRelationshipSummary,
    getRelationshipColor,
    getDeleteActionColor,
    getRelatedTables,
    getRelationshipsBetween,
  };
}
