"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { FloatButton, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  selectActiveTab,
  selectOpenTabs,
  selectSelectedTables,
  selectTablePositions,
  setSelectedTables,
  setTablePositions,
  resetArrowKey,
  addOpenTab,
  closeTab,
  setActiveTab,
  setOpenTabs,
  loadDiagramState,
  undoDiagram,
  redoDiagram,
} from '@/lib/redux/diagramSlice';

import { useTableRelationship } from './hooks/useTableRelationship';
import { useDiagramCRUD } from './hooks/useDiagramCRUD';
import { buildStateMap } from './utils/buildStateMap';
import { DiagramTabsHeader } from './conponents/DiagramTabsHeader';
import { DiagramControlPanel } from './conponents/DiagramControlPanel';
import { DiagramCanvas } from './conponents/DiagramCanvas';
import { SaveDiagramModal } from './conponents/SaveDiagramModal';
import { OpenDiagramDrawer } from './conponents/OpenDiagramDrawer';
import { SyncProgressModal } from './conponents/SyncProgressModal';
import { MultiTableRelationship, TableColumn } from './types/diagram';
import { SyncLogEntry } from './types/syncLog';

// ===== Persist trạng thái các tab diagrams (mở lại khi tắt/bật trang) =====
const TAB_STORAGE_KEY = 'suquan_diagram_tabs';
interface DiagramTabsSnapshot {
  openTabs: string[];
  activeTab: string;
}

function loadTabSnapshot(): DiagramTabsSnapshot | null {
  try {
    const raw = localStorage.getItem(TAB_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.openTabs)) return null;
    return parsed as DiagramTabsSnapshot;
  } catch {
    return null;
  }
}

function saveTabSnapshot(snapshot: DiagramTabsSnapshot) {
  try {
    localStorage.setItem(TAB_STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    /* bỏ qua lỗi lưu (private mode / quota) */
  }
}

export default function Page() {
  const dispatch = useAppDispatch();

  // ===== Redux state =====
  const selectedTables = useAppSelector(selectSelectedTables);
  const tablePositions = useAppSelector(selectTablePositions);
  const activeTab = useAppSelector(selectActiveTab);
  const openTabs = useAppSelector(selectOpenTabs);

  // ===== Local state =====
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isOpenPanelOpen, setIsOpenPanelOpen] = useState(false);
  const [diagramName, setDiagramName] = useState('');
  const [diagramDescription, setDiagramDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [columnsMap, setColumnsMap] = useState<Record<string, TableColumn[]>>({});

  // Group của diagram đang chỉnh/sắp lưu ('' = chưa phân loại)
  const [diagramGroup, setDiagramGroup] = useState('');

  // Log nguồn dữ liệu (client cache / server) hiển thị trong popup tiến trình
  const [syncLogs, setSyncLogs] = useState<SyncLogEntry[]>([]);
  // Trạng thái popup tiến trình: tự mở khi đang chạy đồng bộ, tự đóng khi xong
  const [syncModalOpen, setSyncModalOpen] = useState(false);

  // Tăng giá trị này để ép chạy lại các effect phụ thuộc (sau khi xóa schema cache):
  // → sẽ fetch columns & check relationship lại từ server và ghi đè cache mới.
  const [refreshNonce, setRefreshNonce] = useState(0);

  // ===== Queries / CRUD =====
  const {
    tables,
    loadingTables,
    checkMultipleTables,
    checkMultipleTablesResult,
    checkingMultipleTables,
    refetchTables,
    clearSchemaCache,
    getMultipleTablesColumns,
    gettingMultipleTablesColumns,
  } = useTableRelationship(
    // Nhận log đồng bộ từ hook để hiển thị dưới panel
    (entry) => {
      setSyncLogs((prev) => [
        entry,
        ...prev.filter((e) => e.id !== entry.id), // thay nếu trùng id, ngăn chặn đúp khi re-run
      ]);
    }
  );

  const {
    loading: saving,
    metadataList,
    createDiagram,
    updateDiagram,
    deleteDiagram,
    getDiagram,
    loadMetadata,
    exportData,
    importData,
    searchDiagrams,
    setDiagramGroup: persistGroup, // đổi group trực tiếp trong DB
    groupsList,
    addGroup,
    removeGroup,
    renameDiagram,
  } = useDiagramCRUD();

  // Có bất kỳ thao tác đồng bộ nào đang chạy (columns / quan hệ) không
  const syncing = checkingMultipleTables || gettingMultipleTablesColumns;

  // ===== Refs =====
  const isInitialLoad = useRef(true);
  const isSaving = useRef(false);
  // Đã hydrate xong trạng thái tab từ localStorage chưa (chặn ghi giá trị mặc định lẫn lúc khởi tạo)
  const didHydrate = useRef(false);

  // ===== Tự mở popup tiến trình khi bắt đầu đồng bộ, tự đóng khi xong =====
  const prevSyncing = useRef(false);
  useEffect(() => {
    if (!prevSyncing.current && syncing) {
      // bắt đầu chạy -> mở để xem
      setSyncModalOpen(true);
    } else if (prevSyncing.current && !syncing) {
      // hoàn tất -> tự đóng (title sẽ kịp hiện "hoàn tất")
      setSyncModalOpen(false);
    }
    prevSyncing.current = syncing;
  }, [syncing]);

  // ===== Derived data cho canvas (kèm columns đã tải) =====
  const selectedTablesData = tables
    .filter((table) => selectedTables.includes(table.table_name))
    .map((table) => ({
      ...table,
      columns: columnsMap[table.table_name] ?? [],
    }));

  const relatedPairs = (() => {
    if (!checkMultipleTablesResult) return [] as MultiTableRelationship[];
    return checkMultipleTablesResult.filter((r) => r.relationship.relationship_exists);
  })();

  const hasRelationships = relatedPairs.length > 0;

  // ===== Derived: tên group để gợi ý chọn (modal Lưu + đổi group nhanh) =====
  // Gộp từ (1) group mà các diagram đang dùng + (2) group rỗng đã tạo qua context menu
  // (vd group nhiệm vụ) — để mọi nơi đều chọn được cả group chưa có diagram nào.
  const groupLabels = useMemo(() => {
    const set = new Set<string>();
    for (const m of metadataList) {
      const g = (m as any).group;
      if (g && g.trim()) set.add(g.trim());
    }
    for (const gr of groupsList) {
      if (gr.name && gr.name.trim()) set.add(gr.name.trim());
    }
    return Array.from(set);
  }, [metadataList, groupsList]);

  // group của diagram đang mở (tab != 'new'); undefined khi ở tab 'new'
  const activeDiagramGroup = (() => {
    if (activeTab === 'new') return undefined;
    const meta = metadataList.find((m) => m.id === activeTab);
    return meta?.group ?? '';
  })();

  // ===== Load diagram khi đổi tab =====
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      // Khôi phục danh sách tab & tab đang active từ localStorage (lọc theo diagram còn tồn tại)
      (async () => {
        let existIds = new Set<string>();
        try {
          const meta = await loadMetadata();
          existIds = new Set(meta.map((m: any) => m.id));
        } catch {
          /* nếu không lấy metadata, bỏ qua việc lọc -> giữ nguyên saved */
        }

        const saved = loadTabSnapshot();
        const savedTabs = (saved?.openTabs ?? []).filter((id) => existIds.has(id));
        const tabs = savedTabs.length > 0 ? savedTabs : ['new'];
        let active = saved?.activeTab ?? 'new';
        if (!tabs.includes(active)) active = tabs[tabs.length - 1];

        dispatch(setOpenTabs(tabs));
        if (active !== activeTab) dispatch(setActiveTab(active));
        else if (active === 'new') {
          dispatch(setSelectedTables([]));
          dispatch(setTablePositions({}));
          dispatch(resetArrowKey());
        }
        didHydrate.current = true;
      })();
      return;
    }

    if (activeTab === 'new') {
      dispatch(setSelectedTables([]));
      dispatch(setTablePositions({}));
      dispatch(resetArrowKey());
      setDiagramGroup(''); // tab mới → reset group
      return;
    }

    const loadDiagram = async () => {
      const diagram = await getDiagram(activeTab);
      if (diagram) {
        const data = diagram.data;
        const diagramTables: string[] = [];
        const positions: Record<string, any> = {};

        data.forEach((value: any, key: string) => {
          diagramTables.push(key);
          if (value.pos) {
            positions[key] = value.pos;
          }
        });

        dispatch(
          loadDiagramState({
            selectedTables: diagramTables,
            tablePositions: positions,
            arrowKey: 0,
          })
        );
        message.success(`Đã tải: ${diagram.name}`);
      }
    };

    loadDiagram();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // ===== Đồng bộ group đang chỉnh theo diagram active (khi đổi tab / meta tải xong) =====
  useEffect(() => {
    if (activeTab === 'new') return;
    const meta = metadataList.find((m) => m.id === activeTab);
    setDiagramGroup(meta?.group ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, metadataList]);

  // ===== Đổi group nhanh trên header → lưu thẳng DB =====
  const handleChangeGroup = async (group: string) => {
    if (activeTab === 'new') return;
    const ok = await persistGroup(activeTab, group);
    if (ok) {
      message.success(group ? `Đã đổi sang group: ${group}` : 'Đã chuyển về Chưa phân loại');
    } else {
      message.error('Đổi group thất bại');
    }
  };

  // ===== Auto check relationships =====
  useEffect(() => {
    if (selectedTables.length >= 2) {
      checkMultipleTables(selectedTables);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTables, refreshNonce]);

  // ===== Lưu trạng thái tabs (mở + active) vào localStorage khi thay đổi =====
  useEffect(() => {
    if (!didHydrate.current) return;
    saveTabSnapshot({ openTabs, activeTab });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTabs, activeTab]);

  // ===== Tải columns cho các bảng đang chọn =====
  useEffect(() => {
    let cancelled = false;

    async function loadColumns() {
      // Các bảng hợp lệ (có trong danh sách tables) để loại bỏ bảng "ảo"
      const validNames = new Set(tables.map((t) => t.table_name));
      const targets = selectedTables.filter((name) => validNames.has(name));
      setColumnsMap({});

      if (targets.length === 0) return;

      const result = await getMultipleTablesColumns(targets);
      if (!cancelled) setColumnsMap(result);
    }

    loadColumns();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTables, refreshNonce]);

  // ===== Auto save với Ctrl+S + Undo/Redo (Ctrl+Z / Ctrl+Shift+Z) =====
  useEffect(() => {
    const isEditable = (el: EventTarget | null): boolean => {
      const t = el as HTMLElement | null;
      if (!t) return false;
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable) return true;
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;

      const key = e.key.toLowerCase();
      if (key === 's') {
        e.preventDefault();
        handleSaveCurrent();
        return;
      }
      // Undo/redo vẽ diagram — bỏ qua nếu đang gõ trong ô nhập
      if (key === 'z' && !isEditable(e.target)) {
        e.preventDefault();
        if (e.shiftKey) {
          dispatch(redoDiagram());
        } else {
          dispatch(undoDiagram());
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedTables, tablePositions]);

  // ===== Save "current" tab (hoặc mở modal nếu đang ở 'new') =====
  const handleSaveCurrent = async (id?: string) => {
    if (isSaving.current) return;
    isSaving.current = true;

    try {
      const stateMap = buildStateMap(selectedTables, tablePositions);

      const targetId = id || activeTab;
      if (targetId === 'new') {
        setIsSaveModalOpen(true);
        return;
      }

      const metadata = metadataList.find((m) => m.id === targetId);
      const success = await updateDiagram(targetId, stateMap, {
        name: metadata?.name || targetId,
        description: metadata?.description || '',
        // Giữ/ghi group hiện tại của tab ('' → chưa phân loại)
        group: diagramGroup,
      });

      if (success) {
        message.success('Đã lưu diagram!');
        await loadMetadata();
      }
    } catch (error) {
      message.error('Lưu thất bại');
    } finally {
      isSaving.current = false;
    }
  };

  // ===== Create diagram mới (gọi từ SaveModal) =====
  const handleCreateDiagram = async () => {
    if (!diagramName.trim()) {
      message.warning('Vui lòng nhập tên diagram');
      return;
    }

    const id = `diagram-${Date.now()}`;
    const stateMap = buildStateMap(selectedTables, tablePositions);

    const success = await createDiagram(id, stateMap, {
      name: diagramName.trim(),
      description: diagramDescription.trim(),
      group: diagramGroup,
    });

    if (success) {
      message.success(`Đã tạo diagram: ${diagramName}`);
      setIsSaveModalOpen(false);
      setDiagramName('');
      setDiagramDescription('');
      await loadMetadata();
      dispatch(addOpenTab(id));
    }
  };

  // ===== Delete diagram =====
  const handleDeleteDiagram = async (id: string) => {
    const success = await deleteDiagram(id);
    if (success) {
      message.success('Đã xóa diagram khỏi database');
      await loadMetadata();
      dispatch(closeTab(id));
    }
  };

  // ===== Tạo / xóa group (từ context menu trong drawer) =====
  const handleCreateGroup = async (name: string): Promise<{ ok: boolean; reason?: string }> => {
    const clean = (name || '').trim();
    if (!clean) return { ok: false, reason: 'Tên group không được để trống' };
    if (clean === 'Chưa phân loại')
      return { ok: false, reason: 'Vui lòng chọn tên khác “Chưa phân loại” (nhãn dành riêng)' };
    const exists = groupLabels.includes(clean) || groupsList.some((g) => g.name === clean);
    if (exists) return { ok: false, reason: `Group "${clean}" đã tồn tại` };
    const ok = await addGroup(clean);
    return ok ? { ok: true } : { ok: false, reason: 'Không thể tạo group' };
  };

  const handleDeleteGroup = async (name: string): Promise<{ ok: boolean; reason?: string }> =>
    removeGroup(name);

  // ===== Đổi tên diagram (từ menu chuột phải) =====
  const handleRenameDiagram = async (
    id: string,
    newName: string
  ): Promise<{ ok: boolean; reason?: string }> => {
    const clean = (newName || '').trim();
    if (!clean) return { ok: false, reason: 'Tên không được để trống' };
    const ok = await renameDiagram(id, clean);
    return ok ? { ok: true } : { ok: false, reason: 'Không thể đổi tên diagram' };
  };

  // ===== Đổi nhóm diagram (từ menu chuột phải) — chỉ chọn group có sẵn =====
  const handleMoveDiagram = async (id: string, group: string): Promise<boolean> => {
    const ok = await persistGroup(id, group);
    if (ok) {
      message.success(group ? `Đã chuyển sang group: ${group}` : 'Đã chuyển về Chưa phân loại');
    }
    return ok;
  };

  // ===== Open diagram từ list =====
  const handleOpenDiagram = async (id: string) => {
    if (!openTabs.includes(id)) {
      dispatch(addOpenTab(id));
    } else {
      dispatch(setActiveTab(id));
    }
    setIsOpenPanelOpen(false);
  };

  // ===== Tạo mới (nút trong drawer) =====
  const handleCreateNew = () => {
    if (activeTab !== 'new') {
      dispatch(setActiveTab('new'));
    }
    setIsOpenPanelOpen(false);
  };

  // ===== Search =====
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const results = await searchDiagrams(term);
    setSearchResults(results);
    setIsSearching(false);
  };

  // ===== Export =====
  const handleExport = async () => {
    await exportData();
    message.success('Đã xuất dữ liệu!');
  };

  // ===== Import =====
  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        const success = await importData(data);
        if (success) {
          message.success('Đã nhập dữ liệu!');
          await loadMetadata();
        }
      } catch (error) {
        message.error('Lỗi khi import');
      }
    };
    input.click();
  };

  // ===== Giải phóng modal save / reset trạng thái =====
  const closeSaveModal = () => {
    setIsSaveModalOpen(false);
    setDiagramName('');
    setDiagramDescription('');
  };

  // ===== Refresh relationships (nút trong RelationshipPanel) =====
  const refreshRelationships = () => {
    if (selectedTables.length >= 2) {
      checkMultipleTables(selectedTables);
    }
  };

  // ===== Nút "Tải lại": ép fetch mới từ server =====
  // 1) Xóa toàn bộ cache schema (columns + relationship) trong IndexedDB
  // 2) Refetch lại danh sách bảng
  // 3) Tăng refreshNonce để các effect phụ thuộc re-run → columns & relationship
  //    được lấy mới từ server (vì cache đã trống) và ghi đè cache mới.
  const handleRefresh = async (): Promise<void> => {
    await clearSchemaCache();
    setSyncLogs([]); // bắt đầu log mới cho phiên reload
    await refetchTables();
    setRefreshNonce((n) => n + 1);
  };

  const clearSyncLogs = () => setSyncLogs([]);

  return (
    <>
      {/* ===== TABS HEADER ===== */}
      <DiagramTabsHeader
        metadataList={metadataList}
        saving={saving}
        onSave={() => {
          if (activeTab === 'new') {
            setIsSaveModalOpen(true);
          } else {
            handleSaveCurrent(activeTab);
          }
        }}
        onOpenPanel={() => setIsOpenPanelOpen(true)}
        onExport={handleExport}
        onImport={handleImport}
        activeGroup={activeDiagramGroup}
        groupLabels={groupLabels}
        onChangeGroup={handleChangeGroup}
        groupChoices={groupLabels}
        onRenameDiagram={handleRenameDiagram}
        onMoveDiagram={handleMoveDiagram}
        onDeleteDiagram={(id) => {
          // Xóa diagram khỏi DB rồi đóng tab (giống handleDeleteDiagram)
          void handleDeleteDiagram(id);
        }}
      />

      {/* ===== CONTROL PANEL ===== */}
      <DiagramControlPanel
        tables={tables}
        loadingTables={loadingTables}
        checkMultipleTablesResult={checkMultipleTablesResult}
        checkingMultipleTables={checkingMultipleTables}
        hasRelationships={hasRelationships}
        relatedPairsCount={relatedPairs.length}
        onRefreshTables={handleRefresh}
        syncing={syncing}
        onOpenSync={() => setSyncModalOpen(true)}
      />

      {/* ===== DIAGRAM AREA ===== */}
      <DiagramCanvas
        loadingTables={loadingTables}
        totalTables={tables.length}
        relatedPairs={relatedPairs}
        hasRelationships={hasRelationships}
        checkingMultipleTables={checkingMultipleTables}
        selectedTablesData={selectedTablesData}
        loadingColumns={gettingMultipleTablesColumns}
        onRefreshRelationships={refreshRelationships}
        diagramId={activeTab}
      />

      {/* ===== SAVE MODAL ===== */}
      <SaveDiagramModal
        open={isSaveModalOpen}
        name={diagramName}
        description={diagramDescription}
        tableCount={selectedTables.length}
        group={diagramGroup}
        groupLabels={groupLabels}
        onNameChange={setDiagramName}
        onDescriptionChange={setDiagramDescription}
        onGroupChange={setDiagramGroup}
        onSave={handleCreateDiagram}
        onCancel={closeSaveModal}
      />

      {/* ===== OPEN PANEL (Drawer) ===== */}
      <OpenDiagramDrawer
        open={isOpenPanelOpen}
        metadataList={metadataList}
        groupsList={groupsList}
        groupChoices={groupLabels}
        searchTerm={searchTerm}
        searchResults={searchResults}
        isSearching={isSearching}
        onClose={() => setIsOpenPanelOpen(false)}
        onSearch={handleSearch}
        onOpen={handleOpenDiagram}
        onDelete={handleDeleteDiagram}
        onCreateNew={handleCreateNew}
        onCreateGroup={handleCreateGroup}
        onDeleteGroup={handleDeleteGroup}
        onRenameDiagram={handleRenameDiagram}
        onMoveDiagram={handleMoveDiagram}
      />

      {/* ===== FLOAT BUTTON QUICK SAVE ===== */}
      <FloatButton
        icon={<SaveOutlined />}
        type="primary"
        style={{ bottom: 140, right: 30 }}
        onClick={() => {
          if (activeTab === 'new') {
            setIsSaveModalOpen(true);
          } else {
            handleSaveCurrent(activeTab);
          }
        }}
        tooltip="Lưu (Ctrl+S)"
      />

      {/* ===== SYNC PROGRESS MODAL (tự mở khi đang đồng bộ) ===== */}
      <SyncProgressModal
        open={syncModalOpen}
        syncing={syncing}
        logs={syncLogs}
        onClear={clearSyncLogs}
        onClose={() => setSyncModalOpen(false)}
      />
    </>
  );
}
