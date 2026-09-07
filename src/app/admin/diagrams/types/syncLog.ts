// types/syncLog.ts
// Một mục log cho biết một thao tác đồng bộ columns/quan hệ lấy dữ liệu
// từ client (IndexedDB cache — xanh) hay từ server (Supabase — cam).

export type SyncSource = 'server' | 'client';

export interface SyncLogEntry {
  /** uid duy nhất để render key */
  id: string;
  /** loại thao tác */
  kind: 'columns' | 'relationship';
  /** text mô tả thao tác, vd "Columns: users" hay "Relations: users ↔ orders" */
  label: string;
  /** nguồn dữ liệu khi thao tác hoàn tất */
  source: SyncSource;
  /** timestamp (ms) */
  at: number;
  /** mấy columns/cặp (tùy chọn) để làm rõ */
  count?: number;
}

export type OnSyncLog = (entry: SyncLogEntry) => void;
