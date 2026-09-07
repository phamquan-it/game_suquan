// hooks/useDiagramCRUD.ts
import { useState, useCallback, useEffect } from 'react';
import { DiagramStateMap } from '../types/diagram';
import * as diagramDB from '../services/diagramDB';

interface DiagramRecord {
  id: string;
  name: string;
  description: string;
  group: string;
  data: DiagramStateMap;
  updatedAt: string;
  createdAt: string;
}

interface DiagramMetadata {
  id: string;
  name: string;
  description: string;
  group: string;
  updatedAt: string;
  createdAt: string;
  tableCount?: number;
}

export function useDiagramCRUD() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [diagrams, setDiagrams] = useState<DiagramRecord[]>([]);
  const [metadataList, setMetadataList] = useState<DiagramMetadata[]>([]);
  const [currentDiagram, setCurrentDiagram] = useState<DiagramRecord | null>(null);
  // Danh sách group rỗng (không có diagram) — tạo/xóa qua context menu
  const [groupsList, setGroupsList] = useState<Array<{ name: string; createdAt: string }>>([]);

  // ===== Load all groups (rỗng) =====
  const loadGroups = useCallback(async () => {
    try {
      const groups = await diagramDB.listGroups();
      setGroupsList(groups);
      return groups;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load groups'));
      return [];
    }
  }, []);

  // ===== Load all diagrams =====
  const loadAllDiagrams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await diagramDB.getAllDiagramStates();
      setDiagrams(records);
      return records;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load diagrams'));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ===== Load metadata =====
  const loadMetadata = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const metadata = await diagramDB.getAllDiagramMetadata();
      setMetadataList(metadata);
      return metadata;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load metadata'));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ===== Get diagram by id =====
  const getDiagram = useCallback(async (id: string): Promise<DiagramRecord | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await diagramDB.getDiagramState(id);
      if (!data) return null;

      const record = {
        id,
        data,
        name: id,
        description: '',
        group: '',
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      // Lấy metadata nếu có
      const metadata = await diagramDB.getDiagramMetadata(id);
      if (metadata) {
        record.name = metadata.name;
        record.description = metadata.description;
        record.group = metadata.group;
        record.updatedAt = metadata.updatedAt;
        record.createdAt = metadata.createdAt;
      }

      setCurrentDiagram(record);
      return record;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get diagram'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ===== Create new diagram =====
  const createDiagram = useCallback(async (
    id: string,
    data: DiagramStateMap,
    options?: { name?: string; description?: string; group?: string }
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await diagramDB.saveDiagramState(id, data, options);
      await loadAllDiagrams();
      await loadMetadata();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create diagram'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadAllDiagrams, loadMetadata]);

  // ===== Update diagram =====
  const updateDiagram = useCallback(async (
    id: string,
    data: DiagramStateMap,
    options?: { name?: string; description?: string; group?: string }
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await diagramDB.updateDiagramState(id, data, options);
      await loadAllDiagrams();
      await loadMetadata();

      // Update current if exists
      if (currentDiagram?.id === id) {
        const updated = await getDiagram(id);
        setCurrentDiagram(updated);
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update diagram'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadAllDiagrams, loadMetadata, currentDiagram, getDiagram]);

  // ===== Update metadata only =====
  const updateMetadata = useCallback(async (
    id: string,
    metadata: { name?: string; description?: string; group?: string }
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await diagramDB.updateDiagramMetadata(id, metadata);
      await loadAllDiagrams();
      await loadMetadata();

      // Update current if exists
      if (currentDiagram?.id === id) {
        const updated = await getDiagram(id);
        setCurrentDiagram(updated);
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update metadata'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadAllDiagrams, loadMetadata, currentDiagram, getDiagram]);

  // ===== Delete diagram =====
  const deleteDiagram = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await diagramDB.deleteDiagramState(id);
      await loadAllDiagrams();
      await loadMetadata();

      if (currentDiagram?.id === id) {
        setCurrentDiagram(null);
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete diagram'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadAllDiagrams, loadMetadata, currentDiagram]);

  // ===== Delete all diagrams =====
  const deleteAllDiagrams = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await diagramDB.deleteAllDiagramStates();
      setDiagrams([]);
      setMetadataList([]);
      setCurrentDiagram(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete all diagrams'));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // ===== Search diagrams =====
  const searchDiagrams = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await diagramDB.searchDiagramStates(searchTerm);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to search diagrams'));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ===== Export =====
  const exportData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await diagramDB.exportAllData();
      // Tạo file download
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `diagram-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to export data'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ===== Import =====
  const importData = useCallback(async (jsonData: Record<string, any>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await diagramDB.importData(jsonData);
      await loadAllDiagrams();
      await loadMetadata();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to import data'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadAllDiagrams, loadMetadata]);

  // ===== Get diagram by name =====
  const getDiagramByName = useCallback(async (name: string): Promise<DiagramRecord | null> => {
    setLoading(true);
    setError(null);
    try {
      const allDiagrams = await diagramDB.getAllDiagramStates();
      const found = allDiagrams.find(d => d.name === name);
      if (found) {
        const record = await getDiagram(found.id);
        return record;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get diagram by name'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [getDiagram]);

  // ===== Check if diagram exists =====
  const diagramExists = useCallback(async (id: string): Promise<boolean> => {
    try {
      const exists = await diagramDB.diagramExists(id);
      return exists;
    } catch (err) {
      return false;
    }
  }, []);

  // ===== Get table count =====
  const getTableCount = useCallback((id: string): number => {
    const meta = metadataList.find(m => m.id === id);
    return meta?.tableCount || 0;
  }, [metadataList]);

  // ===== Get latest diagrams =====
  const getLatestDiagrams = useCallback((limit: number = 5) => {
    return [...metadataList]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);
  }, [metadataList]);

  // ===== Rename diagram =====
  const renameDiagram = useCallback(async (
    id: string,
    newName: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const existing = await diagramDB.getDiagramMetadata(id);
      if (!existing) {
        throw new Error('Diagram not found');
      }

      await diagramDB.updateDiagramMetadata(id, {
        name: newName,
        description: existing.description
      });
      await loadAllDiagrams();
      await loadMetadata();

      if (currentDiagram?.id === id) {
        const updated = await getDiagram(id);
        setCurrentDiagram(updated);
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to rename diagram'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadAllDiagrams, loadMetadata, currentDiagram, getDiagram]);

  // ===== List tất cả group đang dùng (từ DB thực tế) =====
  const getAllGroups = useCallback(async (): Promise<Array<{
    group: string;
    label: string;
    count: number;
  }>> => {
    try {
      const groups = await diagramDB.getAllGroups();
      return groups;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to list groups'));
      return [];
    }
  }, []);

  // ===== Tạo group rỗng (chưa có diagram) =====
  const addGroup = useCallback(async (name: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await diagramDB.createGroup(name);
      await loadGroups();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create group'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadGroups]);

  // ===== Xóa group (chỉ được khi group đó rỗng) =====
  const removeGroup = useCallback(async (name: string): Promise<{ ok: boolean; reason?: string }> => {
    setLoading(true);
    setError(null);
    try {
      const result = await diagramDB.deleteGroup(name);
      if (result.ok) {
        await loadGroups();
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete group'));
      return { ok: false, reason: 'Lỗi khi xóa group' };
    } finally {
      setLoading(false);
    }
  }, [loadGroups]);

  // ===== Đổi group cho một diagram (chỉ cập nhật metadata) =====
  const setDiagramGroup = useCallback(async (id: string, group: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const metadata = await diagramDB.getDiagramMetadata(id);
      if (!metadata) {
        throw new Error('Diagram not found');
      }
      await diagramDB.updateDiagramMetadata(id, {
        name: metadata.name,
        description: metadata.description,
        group,
      });
      await loadAllDiagrams();
      await loadMetadata();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to change diagram group'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadAllDiagrams, loadMetadata]);

  // ===== Duplicate diagram =====
  const duplicateDiagram = useCallback(async (
    id: string,
    newName?: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const original = await diagramDB.getDiagramState(id);
      if (!original) {
        throw new Error('Diagram not found');
      }

      const metadata = await diagramDB.getDiagramMetadata(id);
      const newId = `diagram-${Date.now()}`;
      const name = newName || `${metadata?.name || id} (Copy)`;

      await diagramDB.saveDiagramState(newId, original, {
        name: name,
        description: metadata?.description || '',
      });

      await loadAllDiagrams();
      await loadMetadata();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to duplicate diagram'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadAllDiagrams, loadMetadata]);

  // ===== Auto load on mount =====
  useEffect(() => {
    loadMetadata();
    loadGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    // State
    loading,
    error,
    diagrams,
    metadataList,
    currentDiagram,
    groupsList,

    // CRUD
    loadAllDiagrams,
    loadMetadata,
    loadGroups,
    addGroup,
    removeGroup,
    getDiagram,
    getDiagramByName,
    createDiagram,
    updateDiagram,
    updateMetadata,
    deleteDiagram,
    deleteAllDiagrams,
    diagramExists,
    renameDiagram,
    duplicateDiagram,
    getAllGroups,
    setDiagramGroup,

    // Search & Export
    searchDiagrams,
    exportData,
    importData,

    // Helpers
    getTableCount,
    getLatestDiagrams,
    clearError: () => setError(null),
  };
}
