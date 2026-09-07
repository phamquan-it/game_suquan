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
const GROUPS_STORE = 'diagramGroups';
const DB_VERSION = 3;

let dbInstance: IDBPDatabase | null = null;

// ===== Group rỗng mặc định hiển thị như "chưa phân loại" =====
export const UNGROUPED_VALUE = '';
// Nhãn hiển thị cho diagram chưa có group
export const UNGROUPED_LABEL = 'Chưa phân loại';

function groupOrDefault(group: string | undefined | null): string {
  return group ?? '';
}

// ===== Open Database =====
export async function openDiagramDB(): Promise<IDBPDatabase> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      // Khởi tạo store diagramStates (chỉ khi store chưa tồn tại)
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt');
        store.createIndex('name', 'name');
        store.createIndex('group', 'group');
      }
      // v2 → v3: thêm store quản lý group rỗng (group tồn tại độc lập diagram).
      if (!db.objectStoreNames.contains(GROUPS_STORE)) {
        const gstore = db.createObjectStore(GROUPS_STORE, { keyPath: 'name' });
        gstore.createIndex('createdAt', 'createdAt');
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
  metadata?: { name?: string; description?: string; group?: string }
): Promise<void> {
  const db = await openDiagramDB();
  const existing = await db.get(STORE_NAME, id);

  const record = {
    id,
    data: mapToJSON(data),
    name: metadata?.name || existing?.name || id,
    description: metadata?.description || existing?.description || '',
    // group rỗng/undefined → '' (chưa phân loại). Ước từ tham số truyền, fallback record cũ.
    group: groupOrDefault(metadata?.group ?? existing?.group),
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
  group: string;
  data: DiagramStateMap;
  updatedAt: string;
  createdAt: string;
}>> {
  const db = await openDiagramDB();
  const records = await db.getAll(STORE_NAME);

  return records.map(record => ({
    ...record,
    group: groupOrDefault(record.group),
    data: jsonToMap(record.data),
  }));
}

export async function getDiagramMetadata(id: string): Promise<{
  id: string;
  name: string;
  description: string;
  group: string;
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
    group: groupOrDefault(record.group),
    updatedAt: record.updatedAt,
    createdAt: record.createdAt,
  };
}

export async function getAllDiagramMetadata(): Promise<Array<{
  id: string;
  name: string;
  description: string;
  group: string;
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
    group: groupOrDefault(record.group),
    updatedAt: record.updatedAt,
    createdAt: record.createdAt,
    tableCount: Object.keys(record.data).length,
  }));
}

export async function updateDiagramState(
  id: string,
  data: DiagramStateMap,
  metadata?: { name?: string; description?: string; group?: string }
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
    // Nếu không truyền group → giữ nguyên group cũ; nếu truyền '' → dời về chưa phân loại.
    ...(metadata && metadata.group !== undefined ? { group: groupOrDefault(metadata.group) } : {}),
    updatedAt: new Date().toISOString(),
  };

  await db.put(STORE_NAME, record);
}

export async function updateDiagramMetadata(
  id: string,
  metadata: { name?: string; description?: string; group?: string }
): Promise<void> {
  const db = await openDiagramDB();
  const existing = await db.get(STORE_NAME, id);

  if (!existing) {
    throw new Error(`Diagram state with id "${id}" not found`);
  }

  const record = {
    ...existing,
    name: metadata.name || existing.name,
    description: metadata.description !== undefined ? metadata.description : existing.description,
    // Đổi group: override '' (chưa phân loại) là hợp lệ.
    ...(metadata.group !== undefined ? { group: groupOrDefault(metadata.group) } : {}),
    updatedAt: new Date().toISOString(),
  };

  await db.put(STORE_NAME, record);
}

export async function deleteDiagramState(id: string): Promise<void> {
  const db = await openDiagramDB();
  await db.delete(STORE_NAME, id);
}

// ===== Group label hiển thị cho diagram ('' → "Chưa phân loại") =====
export function displayGroup(group: string | undefined | null): string {
  const g = groupOrDefault(group);
  return g || UNGROUPED_LABEL;
}

// ===== Lấy danh sách group đang dùng (không trùng) + số diagram mỗi group =====
/** Đề xuất: merge group rỗng từ store vào sau đây khi cần; duy trì cho import/export. */
export async function getAllGroups(): Promise<Array<{
  group: string; // ''
  label: string; // tên hiển thị ('' → "Chưa phân loại")
  count: number;
}>> {
  const db = await openDiagramDB();
  const records = await db.getAll(STORE_NAME);

  const map = new Map<string, number>();
  for (const record of records) {
    const g = groupOrDefault(record.group);
    map.set(g, (map.get(g) || 0) + 1);
  }

  return Array.from(map.entries())
    .map(([group, count]) => ({ group, label: displayGroup(group), count }))
    .sort((a, b) => a.label.localeCompare(b.label, 'vi'));
}

// ---- Quản lý group qua store riêng (group rỗng tồn tại độc lập) ----

export async function listGroups(): Promise<Array<{ name: string; createdAt: string }>> {
  const db = await openDiagramDB();
  const groups = await db.getAll(GROUPS_STORE);
  return groups
    .map((g) => ({ name: groupOrDefault(g.name), createdAt: g.createdAt }))
    .filter((g) => g.name !== '')
    .sort((a, b) => a.name.localeCompare(b.name, 'vi'));
}

export async function createGroup(name: string): Promise<void> {
  const clean = name.trim();
  if (!clean) throw new Error('Tên group không được để trống');
  const db = await openDiagramDB();
  await db.put(GROUPS_STORE, { name: clean, createdAt: new Date().toISOString() });
}

/** Xóa group — chỉ cho phép khi KHÔNG còn diagram nào thuộc group đó. */
export async function deleteGroup(name: string): Promise<{ ok: boolean; reason?: string }> {
  const clean = name.trim();
  if (!clean) return { ok: false, reason: 'Group empty' };

  const db = await openDiagramDB();
  const diagrams = await db.getAll(STORE_NAME);
  const usedDiagrams = diagrams.filter((d) => groupOrDefault(d.group) === clean);
  if (usedDiagrams.length > 0) {
    return {
      ok: false,
      reason: `Nhóm "${clean}" còn ${usedDiagrams.length} diagram. Hãy chuyển chúng sang nhóm khác trước khi xóa.`,
    };
  }
  await db.delete(GROUPS_STORE, clean);
  return { ok: true };
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
  group: string;
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
      displayGroup(record.group).toLowerCase().includes(term) || // tìm theo nhãn group
      record.id.toLowerCase().includes(term)
    )
    .map(record => ({
      id: record.id,
      name: record.name,
      description: record.description,
      group: groupOrDefault(record.group),
      updatedAt: record.updatedAt,
      tableCount: Object.keys(record.data).length,
    }));
}

export async function exportAllData(): Promise<Record<string, any>> {
  const db = await openDiagramDB();
  const records = await db.getAll(STORE_NAME);
  const groups = await db.getAll(GROUPS_STORE);

  return {
    version: DB_VERSION,
    exportedAt: new Date().toISOString(),
    totalDiagrams: records.length,
    totalGroups: groups.length,
    data: records,
    groups,
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
  // Nhập alias/group rỗng (nếu file backup có) — bỏ qua nếu thiếu.
  if (Array.isArray(data.groups)) {
    for (const g of data.groups) {
      if (g && g.name) await db.put(GROUPS_STORE, g);
    }
  }
}
