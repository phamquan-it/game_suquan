// services/diagramCache.ts
//
// Cache "reference schema" dữ liệu (columns của bảng + quan hệ giữa các cặp bảng)
// vào IndexedDB để KHÔNG phải gọi lại Supabase mỗi lần mở / đổi chọn trên canvas.
//
// Triết lý: dữ liệu cache giữ lại VÔ THỜI HẠN cho tới khi user chủ động bấm
// nút "Tải lại" (Refresh) → gọi invalidateSchemaCache() → lần truy cập kế tiếp
// sẽ fetch lại từ server và ghi đè. Không có TTL tự động.
import { openDB, IDBPDatabase } from 'idb';
import { TableColumn } from '../types/diagram';

// ==== DB schema ====
const DB_NAME = 'DiagramCacheDB';
const DB_VERSION = 1;

// Columns theo từng bảng
const COLUMNS_STORE = 'columnsCache';
// Quan hệ giữa 2 bảng, key chuẩn hóa "tableA__tableB" (đã sort theo alphabet)
const REL_STORE = 'relationshipCache';

// Mỗi record ghi kèm cachedAt để debug/tracing; không dùng cho TTL.
interface CacheRecord<T> {
  cachedAt: string;
  value: T;
}

// Cache lookup nếu có record, else null
type CacheHit<T> = T | null;

let dbInstance: IDBPDatabase | null = null;

async function openCacheDB(): Promise<IDBPDatabase> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(COLUMNS_STORE)) {
        db.createObjectStore(COLUMNS_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(REL_STORE)) {
        db.createObjectStore(REL_STORE, { keyPath: 'id' });
      }
    },
  });

  return dbInstance;
}

// ===== Columns cache (key: tên bảng) =====

export async function getCachedColumnsTable(
  tableName: string
): Promise<CacheHit<TableColumn[]>> {
  const db = await openCacheDB();
  const record = (await db.get(COLUMNS_STORE, tableName)) as
    | CacheRecord<TableColumn[]>
    | undefined;
  if (!record) return null;
  return record.value;
}

export async function setCachedColumnsTable(
  tableName: string,
  columns: TableColumn[]
): Promise<void> {
  const db = await openCacheDB();
  await db.put(COLUMNS_STORE, {
    id: tableName,
    cachedAt: new Date().toISOString(),
    value: columns,
  } as CacheRecord<TableColumn[]>);
}

/** Đọc columns cache cho nhiều bảng; trả về map gồm cả phần đã cache được. */
export async function getCachedColumns(
  tableNames: string[]
): Promise<Record<string, TableColumn[]>> {
  const result: Record<string, TableColumn[]> = {};
  for (const name of tableNames) {
    const cached = await getCachedColumnsTable(name);
    if (cached !== null) result[name] = cached;
  }
  return result;
}

// ===== Relationship cache (key: "tableA__tableB", sorted) =====

function normalizedRelKey(table1: string, table2: string): string {
  return [table1, table2].sort().join('__');
}

/** Cache hit -> object quan hệ; nếu chưa từng check hoặc không tồn tại -> null. */
export async function getCachedRelationship(
  table1: string,
  table2: string
): Promise<CacheHit<any>> {
  const db = await openCacheDB();
  const key = normalizedRelKey(table1, table2);
  const record = (await db.get(REL_STORE, key)) as CacheRecord<any> | undefined;
  if (!record) return null;
  return record.value;
}

export async function setCachedRelationship(
  table1: string,
  table2: string,
  relationship: any
): Promise<void> {
  const db = await openCacheDB();
  await db.put(REL_STORE, {
    id: normalizedRelKey(table1, table2),
    cachedAt: new Date().toISOString(),
    value: relationship,
  } as CacheRecord<any>);
}

// ===== Invalidation (nút "Tải lại") =====
// Xóa toàn bộ cache columns + relationship → các lần truy cập tiếp theo
// sẽ gọi lại server và ghi cache mới.

export async function invalidateSchemaCache(): Promise<void> {
  const db = await openCacheDB();

  const clearStore = async (store: string) => {
    const keys = await db.getAllKeys(store);
    for (const key of keys) {
      await db.delete(store, key);
    }
  };

  await Promise.all([clearStore(COLUMNS_STORE), clearStore(REL_STORE)]);
}

/** Đếm entries hiện có trong mỗi store cache (dùng cho UI thông báo, không bắt buộc). */
export async function getCacheStats(): Promise<{
  columns: number;
  relationships: number;
}> {
  const db = await openCacheDB();
  const columns = (await db.getAllKeys(COLUMNS_STORE)).length;
  const relationships = (await db.getAllKeys(REL_STORE)).length;
  return { columns, relationships };
}
