import { DiagramStateMap } from '../types/diagram';

/**
 * Build a DiagramStateMap (name → vị trí + danh sách bảng selected)
 * từ selectedTables + tablePositions hiện tại. Dùng chung cho
 * cả "Lưu diagram hiện tại" và "Tạo diagram mới".
 */
export function buildStateMap(
  selectedTables: string[],
  tablePositions: Record<string, { x: number; y: number }>
): DiagramStateMap {
  const stateMap = new Map<string, any>();
  selectedTables.forEach((table) => {
    stateMap.set(table, {
      pos: tablePositions[table] || { x: 0, y: 0 },
      selected: selectedTables,
    });
  });
  return stateMap;
}
