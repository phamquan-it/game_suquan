// services/diagramDB.ts
import { openDB, IDBPDatabase } from 'idb';

export interface DiagramState {
  pos: Record<string, { x: number; y: number }>;
  selected: string[];
  arrow: number;
}

export type DiagramStateMap = Map<string, DiagramState>;

const DB_NAME = 'DiagramDB';
const STORE_NAME = 'diagramStates';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase | null = null;

// ===== Open Database =====
export async function openDiagramDB(): Promise<IDBPDatabase> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
        });
        store.createIndex('updatedAt', 'updatedAt');
        store.createIndex('name', 'name');
      }
    },
  });

  return dbInstance;
}

// ===== Convert Map to JSON =====
export function mapToJSON(map: DiagramStateMap): Record<string, DiagramState> {
  return Object.fromEntries(map);
}

export function jsonToMap(json: Record<string, DiagramState>): DiagramStateMap {
  return new Map(Object.entries(json));
}

// ===== Check if diagram exists =====
export async function diagramExists(id: string): Promise<boolean> {
  const db = await openDiagramDB();
  const record = await db.get(STORE_NAME, id);
  return !!record;
}

// ===== CRUD Operations =====

export async function saveDiagramState(
  id: string,
  data: DiagramStateMap,
  metadata?: { name?: string; description?: string }
): Promise<void> {
  const db = await openDiagramDB();
  const existing = await db.get(STORE_NAME, id);

  const record = {
    id,
    data: mapToJSON(data),
    name: metadata?.name || existing?.name || id,
    description: metadata?.description || existing?.description || '',
    updatedAt: new Date().toISOString(),
    createdAt: existing?.createdAt || new Date().toISOString(),
  };

  await db.put(STORE_NAME, record);
}

export async function getDiagramState(id: string): Promise<DiagramStateMap | null> {
  const db = await openDiagramDB();
  const record = await db.get(STORE_NAME, id);
  if (!record) return null;
  return jsonToMap(record.data);
}

export async function getAllDiagramStates(): Promise<Array<{
  id: string;
  name: string;
  description: string;
  data: DiagramStateMap;
  updatedAt: string;
  createdAt: string;
}>> {
  const db = await openDiagramDB();
  const records = await db.getAll(STORE_NAME);

  return records.map(record => ({
    ...record,
    data: jsonToMap(record.data),
  }));
}

export async function getDiagramMetadata(id: string): Promise<{
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  createdAt: string;
} | null> {
  const db = await openDiagramDB();
  const record = await db.get(STORE_NAME, id);
  if (!record) return null;

  return {
    id: record.id,
    name: record.name,
    description: record.description,
    updatedAt: record.updatedAt,
    createdAt: record.createdAt,
  };
}

export async function getAllDiagramMetadata(): Promise<Array<{
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  createdAt: string;
  tableCount?: number;
}>> {
  const db = await openDiagramDB();
  const records = await db.getAll(STORE_NAME);

  return records.map(record => ({
    id: record.id,
    name: record.name,
    description: record.description,
    updatedAt: record.updatedAt,
    createdAt: record.createdAt,
    tableCount: Object.keys(record.data).length,
  }));
}

export async function updateDiagramState(
  id: string,
  data: DiagramStateMap,
  metadata?: { name?: string; description?: string }
): Promise<void> {
  const db = await openDiagramDB();
  const existing = await db.get(STORE_NAME, id);

  if (!existing) {
    throw new Error(`Diagram state with id "${id}" not found`);
  }

  const record = {
    ...existing,
    data: mapToJSON(data),
    name: metadata?.name || existing.name,
    description: metadata?.description || existing.description,
    updatedAt: new Date().toISOString(),
  };

  await db.put(STORE_NAME, record);
}

export async function updateDiagramMetadata(
  id: string,
  metadata: { name?: string; description?: string }
): Promise<void> {
  const db = await openDiagramDB();
  const existing = await db.get(STORE_NAME, id);

  if (!existing) {
    throw new Error(`Diagram state with id "${id}" not found`);
  }

  const record = {
    ...existing,
    name: metadata.name || existing.name,
    description: metadata.description || existing.description,
    updatedAt: new Date().toISOString(),
  };

  await db.put(STORE_NAME, record);
}

export async function deleteDiagramState(id: string): Promise<void> {
  const db = await openDiagramDB();
  await db.delete(STORE_NAME, id);
}

export async function deleteAllDiagramStates(): Promise<void> {
  const db = await openDiagramDB();
  const keys = await db.getAllKeys(STORE_NAME);
  for (const key of keys) {
    await db.delete(STORE_NAME, key);
  }
}

export async function searchDiagramStates(searchTerm: string): Promise<Array<{
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  tableCount: number;
}>> {
  const db = await openDiagramDB();
  const records = await db.getAll(STORE_NAME);

  const term = searchTerm.toLowerCase();
  return records
    .filter(record =>
      record.name.toLowerCase().includes(term) ||
      record.description.toLowerCase().includes(term) ||
      record.id.toLowerCase().includes(term)
    )
    .map(record => ({
      id: record.id,
      name: record.name,
      description: record.description,
      updatedAt: record.updatedAt,
      tableCount: Object.keys(record.data).length,
    }));
}

export async function exportAllData(): Promise<Record<string, any>> {
  const db = await openDiagramDB();
  const records = await db.getAll(STORE_NAME);

  return {
    version: DB_VERSION,
    exportedAt: new Date().toISOString(),
    totalDiagrams: records.length,
    data: records,
  };
}

export async function importData(data: Record<string, any>): Promise<void> {
  if (!data.data || !Array.isArray(data.data)) {
    throw new Error('Invalid data format');
  }

  const db = await openDiagramDB();
  for (const record of data.data) {
    await db.put(STORE_NAME, record);
  }
}
