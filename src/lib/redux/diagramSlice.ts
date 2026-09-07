// store/diagramSlice.ts
import { Position } from '@/app/admin/diagrams/types/diagram';
import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';

export interface CanvasSnapshot {
  selectedTables: string[];
  tablePositions: Record<string, Position>;
}

export interface DiagramState {
  selectedTables: string[];
  arrowKey: number;
  tablePositions: Record<string, Position>;
  activeTab: string;
  openTabs: string[];
  // Undo/redo stack (dùng chung cho diagram đang active)
  past: CanvasSnapshot[];
  future: CanvasSnapshot[];
}

// Chặn undo quá lâu / tốn bộ nhớ
const MAX_HISTORY = 60;

function clonePositions(positions: Record<string, Position>): Record<string, Position> {
  const out: Record<string, Position> = {};
  for (const key of Object.keys(positions)) {
    const p = positions[key];
    out[key] = { x: p?.x ?? 0, y: p?.y ?? 0 };
  }
  return out;
}

function snapshotOf(state: DiagramState): CanvasSnapshot {
  return {
    selectedTables: [...state.selectedTables],
    tablePositions: clonePositions(state.tablePositions),
  };
}

const initialState: DiagramState = {
  selectedTables: [],
  arrowKey: 0,
  tablePositions: {},
  activeTab: 'new',
  openTabs: ['new'],
  past: [],
  future: [],
};

const diagramSlice = createSlice({
  name: 'diagram',
  initialState,
  reducers: {
    // ===== Selected Tables =====
    setSelectedTables: (state, action: PayloadAction<string[]>) => {
      state.selectedTables = action.payload;
    },
    addTable: (state, action: PayloadAction<string>) => {
      if (!state.selectedTables.includes(action.payload)) {
        state.selectedTables.push(action.payload);
      }
    },
    removeTable: (state, action: PayloadAction<string>) => {
      state.selectedTables = state.selectedTables.filter(t => t !== action.payload);
      delete state.tablePositions[action.payload];
    },
    clearTables: (state) => {
      state.selectedTables = [];
      state.tablePositions = {};
    },

    // ===== Table Positions =====
    setTablePosition: (state, action: PayloadAction<{ tableName: string; position: Position }>) => {
      state.tablePositions[action.payload.tableName] = action.payload.position;
    },
    setTablePositions: (state, action: PayloadAction<Record<string, Position>>) => {
      state.tablePositions = action.payload;
    },
    removeTablePosition: (state, action: PayloadAction<string>) => {
      delete state.tablePositions[action.payload];
    },
    clearPositions: (state) => {
      state.tablePositions = {};
    },

    // ===== Undo / Redo (thêm / xóa / di chuyển bảng) =====
    // Ghi "điểm mốc" của trạng thái hiện TẠI lên past — gọi TRƯỚC một thao tác
    // thay đổi (§ thêm/xóa bảng, hoặc khi bắt đầu kéo bảng). Chỉ ghi 1 lần/
    // một thao tác để mỗi cú kéo là một bước undo.
    snapshotForUndo: (state) => {
      // Không ghi snapshot trùng liên tiếp (tránh nhiều bước rỗng khi kéo)
      const last = state.past[state.past.length - 1];
      if (last) {
        const sameSel =
          last.selectedTables.length === state.selectedTables.length &&
          last.selectedTables.every((t, i) => t === state.selectedTables[i]);
        const samePos = JSON.stringify(last.tablePositions) === JSON.stringify(state.tablePositions);
        if (sameSel && samePos) return; // trạng thái chưa đổi đáng kể
      }
      state.past.push(snapshotOf(state));
      if (state.past.length > MAX_HISTORY) state.past.shift();
      // Một thao tác mới làm mất nhánh redo
      state.future = [];
    },
    undoDiagram: (state) => {
      const snap = state.past.pop();
      if (!snap) return;
      state.future.push(snapshotOf(state));
      if (state.future.length > MAX_HISTORY) state.future.shift();
      state.selectedTables = [...snap.selectedTables];
      state.tablePositions = clonePositions(snap.tablePositions);
      state.arrowKey += 1;
    },
    redoDiagram: (state) => {
      const snap = state.future.pop();
      if (!snap) return;
      state.past.push(snapshotOf(state));
      if (state.past.length > MAX_HISTORY) state.past.shift();
      state.selectedTables = [...snap.selectedTables];
      state.tablePositions = clonePositions(snap.tablePositions);
      state.arrowKey += 1;
    },
    resetHistory: (state) => {
      state.past = [];
      state.future = [];
    },

    // ===== Arrow Key =====
    setArrowKey: (state, action: PayloadAction<number>) => {
      state.arrowKey = action.payload;
    },
    incrementArrowKey: (state) => {
      state.arrowKey += 1;
    },
    resetArrowKey: (state) => {
      state.arrowKey = 0;
    },

    // ===== Tabs =====
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setOpenTabs: (state, action: PayloadAction<string[]>) => {
      state.openTabs = action.payload;
    },
    addOpenTab: (state, action: PayloadAction<string>) => {
      if (!state.openTabs.includes(action.payload)) {
        state.openTabs.push(action.payload);
      }
      state.activeTab = action.payload;
    },
    closeTab: (state, action: PayloadAction<string>) => {
      state.openTabs = state.openTabs.filter(t => t !== action.payload);
      if (state.activeTab === action.payload) {
        const otherTabs = state.openTabs.filter(t => t !== 'new');
        state.activeTab = otherTabs.length > 0 ? otherTabs[otherTabs.length - 1] : 'new';
      }
    },
    resetTabs: (state) => {
      state.openTabs = ['new'];
      state.activeTab = 'new';
    },

    // ===== Reset all =====
    resetState: () => initialState,
    loadDiagramState: (state, action: PayloadAction<{
      selectedTables: string[];
      tablePositions: Record<string, Position>;
      arrowKey?: number;
    }>) => {
      state.selectedTables = action.payload.selectedTables;
      state.tablePositions = action.payload.tablePositions;
      state.arrowKey = action.payload.arrowKey || 0;
      // đang mở diagram khác → bỏ lịch sử undo cũ
      state.past = [];
      state.future = [];
    },
  },
});

// ===== Export actions =====
export const {
  setSelectedTables,
  addTable,
  removeTable,
  clearTables,
  setTablePosition,
  setTablePositions,
  removeTablePosition,
  clearPositions,
  snapshotForUndo,
  undoDiagram,
  redoDiagram,
  resetHistory,
  setArrowKey,
  incrementArrowKey,
  resetArrowKey,
  setActiveTab,
  setOpenTabs,
  addOpenTab,
  closeTab,
  resetTabs,
  resetState,
  loadDiagramState,
} = diagramSlice.actions;

// ===== Selectors =====
export const selectSelectedTables = (state: { diagram: DiagramState }) => state.diagram.selectedTables;
export const selectArrowKey = (state: { diagram: DiagramState }) => state.diagram.arrowKey;
export const selectTablePositions = (state: { diagram: DiagramState }) => state.diagram.tablePositions;
export const selectActiveTab = (state: { diagram: DiagramState }) => state.diagram.activeTab;
export const selectOpenTabs = (state: { diagram: DiagramState }) => state.diagram.openTabs;

export const selectTablePosition = (tableName: string) =>
  createSelector(
    selectTablePositions,
    (positions) => positions[tableName] || { x: 0, y: 0 }
  );

export const selectIsTableSelected = (tableName: string) =>
  createSelector(
    selectSelectedTables,
    (tables) => tables.includes(tableName)
  );

export const selectSelectedTablesCount = createSelector(
  selectSelectedTables,
  (tables) => tables.length
);

export default diagramSlice.reducer;
