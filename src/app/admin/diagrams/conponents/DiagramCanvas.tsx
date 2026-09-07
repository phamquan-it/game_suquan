"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Spin, Typography, Empty, message } from "antd";
import { TableOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  selectArrowKey,
  selectSelectedTables,
  selectTablePositions,
  setTablePosition,
  incrementArrowKey,
  removeTable,
  snapshotForUndo,
} from "@/lib/redux/diagramSlice";
import styles from "../styles";
import { DraggableBox } from "./DraggableBox";
import { getBorderColor, getTableColor } from "../utils";
import { EmptyTable } from "./EmptyTable";
import RelationshipPanel from "./RelationshipPanel";
import { TableRightClickMenu, TableMenuAction } from "./TableRightClickMenu";
import { TablePreviewModal } from "./TablePreviewModal";
import { MultiTableRelationship, Position, TableInfo } from "../types/diagram";

const { Text } = Typography;

// react-arrows tham chiếu `window` ngay khi module được evaluate (import top-level sẽ
// crash SSR). `import type` chỉ dùng kiểu, KHÔNG chạy module → an toàn cho server.
// Các enum DIRECTION/HEAD là hằng số string thuần, giá trị khớp dist/main.js:
//   DIRECTION = { .., RIGHT: 'right', .., LEFT: 'left', .. }
//   HEAD{none}: 'none'
import type { DIRECTION } from "react-arrows";

const ARROW_DIRECTION: {
  RIGHT: DIRECTION;
  LEFT: DIRECTION;
} = { RIGHT: "right" as DIRECTION, LEFT: "left" as DIRECTION };
const ARROW_HEAD: { none: "none" } = { none: "none" };

// Import dynamic cho Arrow (ssr:false vì react-arrows)
const Arrow = dynamic(() => import("react-arrows").then((mod) => mod.default), {
  ssr: false,
  loading: () => <div style={{ display: "none" }} />,
});

// Persist vị trí nhìn (pan/zoom) của diagram theo id
const VIEW_STORAGE_PREFIX = "suquan_diagram_view_";
interface DiagramView {
  zoom: number;
  panX: number;
  panY: number;
}
function loadView(id: string): DiagramView | null {
  try {
    const raw = localStorage.getItem(VIEW_STORAGE_PREFIX + id);
    return raw ? (JSON.parse(raw) as DiagramView) : null;
  } catch {
    return null;
  }
}
function saveView(id: string, view: DiagramView) {
  try {
    localStorage.setItem(VIEW_STORAGE_PREFIX + id, JSON.stringify(view));
  } catch {
    /* ignore */
  }
}

const DEFAULT_VIEW: DiagramView = { zoom: 1, panX: 0, panY: 0 };
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3;

interface DiagramCanvasProps {
  loadingTables: boolean;
  totalTables: number;
  relatedPairs: MultiTableRelationship[];
  hasRelationships: boolean;
  checkingMultipleTables: boolean;
  selectedTablesData: TableInfo[];
  /** Đang tải columns cho các bảng đã chọn */
  loadingColumns?: boolean;
  onRefreshRelationships: () => void;
  /** id của diagram đang mở (dùng để lưu/khôi phục điểm nhìn); 'new' sẽ reset */
  diagramId?: string;
}

export function DiagramCanvas({
  loadingTables,
  totalTables,
  relatedPairs,
  hasRelationships,
  checkingMultipleTables,
  selectedTablesData,
  loadingColumns = false,
  onRefreshRelationships,
  diagramId = "new",
}: DiagramCanvasProps) {
  const dispatch = useAppDispatch();
  const selectedTables = useAppSelector(selectSelectedTables);
  const tablePositions = useAppSelector(selectTablePositions);
  const arrowKey = useAppSelector(selectArrowKey);

  // ===== Handle drag: cập nhật vị trí + tăng arrowKey để vẽ lại =====
  const handleDrag = (tableName: string, data: { x: number; y: number }) => {
    dispatch(
      setTablePosition({ tableName, position: { x: data.x, y: data.y } })
    );
    dispatch(incrementArrowKey());
  };

  // ===== Context menu chuột phải trên 1 bảng =====
  const [ctxMenu, setCtxMenu] = useState<{
    table: string | null;
    schema?: string | null;
    cols?: string[];
    x: number;
    y: number;
  }>({ table: null, schema: null, cols: [], x: 0, y: 0 });

  // Modal preview (xem data / xem DDL) đang mở cho bảng nào
  const [preview, setPreview] = useState<{
    mode: TableMenuAction;
    table: string;
    schema?: string | null;
    cols?: string[];
  } | null>(null);

  const openCtxMenu = (
    tableName: string,
    schema: string | null | undefined,
    cols: string[],
    e: React.MouseEvent
  ) => {
    // Không cho menu mặc định của trình duyệt (đã preventDefault trong DraggableBox)
    setCtxMenu({ table: tableName, schema, cols, x: e.clientX, y: e.clientY });
  };

  const handleCtxPick = (action: TableMenuAction) => {
    const t = ctxMenu.table;
    if (t) {
      setPreview({
        mode: action,
        table: t,
        schema: ctxMenu.schema,
        cols: ctxMenu.cols,
      });
    }
    setCtxMenu((c) => ({ ...c, table: null })); // đóng menu
  };

  // ===== Pan / Zoom =====
  // - Zoom: giữ Ctrl (hoặc Cmd) + kéo chuột (bất kỳ đâu, kể cả trên bảng)
  // - Pan : giữ Space + kéo chuột (bất kỳ đâu)
  // View transform đặt trên 1 wrapper quanh các bảng; arrow tự theo bởi vì
  // react-arrows poll getBoundingClientRect mỗi ~150ms.
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<DiagramView>({ ...DEFAULT_VIEW });
  const gestureRef = useRef<{
    mode: "zoom" | "pan" | null;
    startX: number;
    startY: number;
    startZoom: number;
    startPan: { x: number; y: number };
  }>({
    mode: null,
    startX: 0,
    startY: 0,
    startZoom: 1,
    startPan: { x: 0, y: 0 },
  });
  // Phím đang giữ: suy xem kéo là zoom (ctrl) hay pan (space)
  const keysRef = useRef<{ ctrl: boolean; space: boolean }>({
    ctrl: false,
    space: false,
  });
  const [dragDisabled, setDragDisabled] = useState(false);
  const [cursor, setCursor] = useState<string>("grab");
  // zoom dùng để hiệu chỉnh scale cho react-draggable khi kéo bảng ở mức zoom khác 1
  const [dragZoom, setDragZoom] = useState(1);

  const syncDragZoom = useCallback((zoom: number) => {
    setDragZoom(zoom);
  }, []);

  const applyView = useCallback((view: DiagramView) => {
    viewRef.current = view;
    if (viewportRef.current) {
      viewportRef.current.style.transform = `translate(${view.panX}px, ${view.panY}px) scale(${view.zoom})`;
    }
  }, []);

  // Reset / restore view mỗi khi đổi diagram
  const diagramIdRef = useRef(diagramId);
  useEffect(() => {
    if (diagramIdRef.current !== diagramId) {
      const prev = diagramIdRef.current;
      diagramIdRef.current = diagramId;
      // Lưu view của diagram vừa rời (theo id cũ)
      if (prev && prev !== "new") saveView(prev, viewRef.current);

      let next: DiagramView = { ...DEFAULT_VIEW };
      if (diagramId !== "new") {
        const v = loadView(diagramId);
        if (v) {
          next = {
            zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v.zoom ?? 1)),
            panX: v.panX ?? 0,
            panY: v.panY ?? 0,
          };
        }
      }
      applyView(next);
      syncDragZoom(next.zoom);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagramId]);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space") {
      keysRef.current.space = true;
      setCursor("grab");
      // tránh cuộn trang khi đang trong canvas
      const t = e.target as HTMLElement;
      if (
        t &&
        (t as any).closest &&
        (t as any).closest("[data-diagram-canvas]")
      ) {
        e.preventDefault();
      }
    }
    if (e.ctrlKey || e.metaKey) {
      keysRef.current.ctrl = true;
      setCursor("zoom-in");
    }
    setDragDisabled(keysRef.current.ctrl || keysRef.current.space);
  }, []);

  const onKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space") keysRef.current.space = false;
    if (e.key === "Control" || e.key === "Meta") keysRef.current.ctrl = false;
    if (
      e.code.includes("Control") ||
      e.code === "MetaLeft" ||
      e.code === "MetaRight"
    ) {
      keysRef.current.ctrl = false;
    }
    setDragDisabled(keysRef.current.ctrl || keysRef.current.space);
    setCursor("grab");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPointerDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // chỉ chuột trái
    if (e.button !== 0) return;

    const space = keysRef.current.space;
    const ctrl = keysRef.current.ctrl || e.ctrlKey || e.metaKey;

    gestureRef.current = {
      mode: ctrl ? "zoom" : space ? "pan" : null,
      startX: e.clientX,
      startY: e.clientY,
      startZoom: viewRef.current.zoom,
      startPan: { x: viewRef.current.panX, y: viewRef.current.panY },
    };

    if (gestureRef.current.mode) {
      if (space) e.preventDefault();
    }
  }, []);

  const onPointerMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const g = gestureRef.current;
      if (!g.mode) return;
      e.preventDefault();

      const dx = e.clientX - g.startX;
      const dy = e.clientY - g.startY;

      if (g.mode === "zoom") {
        // cooldown: kéo lên -> phóng to, kéo xuống -> thu nhỏ
        const nextZoom = Math.min(
          MAX_ZOOM,
          Math.max(MIN_ZOOM, g.startZoom * Math.exp(dy * -0.008))
        );
        // giữ điểm dưới con trỏ đứng yên khi zoom
        const el = viewportRef.current?.parentElement as HTMLElement | null;
        if (el) {
          const rect = el.getBoundingClientRect();
          const cx = e.clientX - rect.left - g.startPan.x;
          const cy = e.clientY - rect.top - g.startPan.y;
          const ratio = nextZoom / g.startZoom;
          const panX = g.startPan.x - cx * (ratio - 1);
          const panY = g.startPan.y - cy * (ratio - 1);
          applyView({ zoom: nextZoom, panX, panY });
        } else {
          applyView({ zoom: nextZoom, panX: g.startPan.x, panY: g.startPan.y });
        }
      } else {
        // pan
        applyView({
          zoom: g.startZoom,
          panX: g.startPan.x + dx,
          panY: g.startPan.y + dy,
        });
      }
    },
    [applyView]
  );

  const endGesture = useCallback(() => {
    gestureRef.current.mode = null;
    syncDragZoom(viewRef.current.zoom);
    // lưu view hiện tại
    if (diagramIdRef.current && diagramIdRef.current !== "new") {
      saveView(diagramIdRef.current, viewRef.current);
    }
  }, [syncDragZoom]);

  const onPointerUp = useCallback(() => {
    endGesture();
  }, [endGesture]);

  // gắn listener bàn phím
  useEffect(() => {
    const onBlur = () => {
      keysRef.current = { ctrl: false, space: false };
      setDragDisabled(false);
      setCursor("grab");
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur as any);
    window.addEventListener("mouseup", onPointerUp as any);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur as any);
      window.removeEventListener("mouseup", onPointerUp as any);
    };
  }, [onKeyDown, onKeyUp, onPointerUp]);

  // Reset/khôi phục bước đầu khi mount
  useEffect(() => {
    if (diagramId === "new") {
      applyView({ ...DEFAULT_VIEW });
      syncDragZoom(1);
      return;
    }
    const v = loadView(diagramId);
    if (v) {
      const z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v.zoom ?? 1));
      applyView({ zoom: z, panX: v.panX ?? 0, panY: v.panY ?? 0 });
      syncDragZoom(z);
    } else {
      applyView({ ...DEFAULT_VIEW });
      syncDragZoom(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={styles.content as React.CSSProperties}
      data-diagram-canvas
      onMouseDown={onPointerDown}
      onMouseMove={onPointerMove}
      onMouseUp={onPointerUp}
      onMouseLeave={onPointerUp}
    >
      <style jsx global>{`
        .arrow {
          pointer-events: none;
        }

        .arrow__path {
          stroke: #000;
          fill: transparent;
          stroke-dasharray: 4 2;
        }

        .arrow__head line {
          stroke: #000;
          stroke-width: 1px;
        }
      `}</style>
      {loadingTables ? (
        <div style={styles.loadingState}>
          <Spin size="large" />
          <Text type="secondary" style={{ marginTop: 16 }}>
            Đang tải danh sách bảng...
          </Text>
        </div>
      ) : totalTables === 0 ? (
        <Empty
          description="Không tìm thấy bảng nào"
          style={{ marginTop: 80 }}
        />
      ) : (
        <>
          {/* Viewport layer: toàn bộ bảng di chuyển theo pan + zoom (Ctrl kéo / Space kéo) */}
          <div
            ref={viewportRef}
            data-viewport="diagram"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              transformOrigin: "0 0",
              willChange: "transform",
              cursor,
            }}
          >
            {(() => {
              const dataByTable: Record<string, TableInfo> = {};
              selectedTablesData.forEach(
                (t) => (dataByTable[t.table_name] = t)
              );

              return selectedTables.map((tableName, index) => {
                const table = dataByTable[tableName];
                const columns = table?.columns ?? [];
                const pos: Position = tablePositions[tableName] || {
                  x: 150 + (index % 5) * 220,
                  y: 150 + Math.floor(index / 5) * 160,
                };

                return (
                  <DraggableBox
                    key={tableName}
                    id={tableName}
                    position={pos}
                    color={getTableColor(tableName)}
                    borderColor={getBorderColor(tableName)}
                    scale={dragZoom}
                    dragDisabled={dragDisabled}
                    onStart={() => dispatch(snapshotForUndo())}
                    onDrag={(e: any, data: { x: number; y: number }) =>
                      handleDrag(tableName, data)
                    }
                    onContextMenu={(e: React.MouseEvent) =>
                      openCtxMenu(
                        tableName,
                        table?.schema_name,
                        (table?.columns ?? []).map((c) => c.column_name),
                        e
                      )
                    }
                  >
                    {loadingColumns && columns.length === 0 ? (
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                          padding: "10px 12px",
                        }}
                      >
                        <Spin size="small" />
                        <Text type="secondary">Đang tải columns...</Text>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          textAlign: "left" as const,
                          minWidth: 0,
                        }}
                      >
                        {/* Header: tên bảng */}
                        <div
                          style={styles.tableCardHeader(
                            getBorderColor(tableName)
                          )}
                        >
                          <TableOutlined
                            style={{ fontSize: 18, color: "#fff" }}
                          />
                          <Text strong style={{ fontSize: 15, color: "#fff" }}>
                            {tableName}
                          </Text>
                        </div>

                        {/* Danh sách columns */}
                        <div style={styles.tableColumnsList}>
                          {columns.length > 0 ? (
                            columns.map((col) => (
                              <div
                                key={col.column_name}
                                title={[
                                  col.column_name,
                                  col.is_primary_key ? "PK" : "",
                                  col.is_foreign_key
                                    ? `FK → ${col.foreign_table}.${col.foreign_column}`
                                    : "",
                                  `type: ${col.data_type}`,
                                  col.is_nullable ? "nullable" : "NOT NULL",
                                  col.column_default
                                    ? `default: ${col.column_default}`
                                    : "",
                                ]
                                  .filter(Boolean)
                                  .join(" · ")}
                                style={{
                                  ...styles.tableColumnRow,
                                  borderColor: getBorderColor(tableName),
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    flex: 1,
                                    minWidth: 0,
                                  }}
                                >
                                  <Text
                                    strong
                                    style={{ fontSize: 12 }}
                                    ellipsis={{ tooltip: col.column_name }}
                                  >
                                    {col.column_name}
                                  </Text>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                  }}
                                >
                                  {(col.is_primary_key ||
                                    col.is_foreign_key) && (
                                      <span
                                        title={
                                          col.is_primary_key
                                            ? "Primary Key"
                                            : `Foreign Key → ${col.foreign_table}.${col.foreign_column}`
                                        }
                                        style={{
                                          fontSize: 10,
                                          lineHeight: 1,
                                          padding: "2px 4px",
                                          borderRadius: 3,
                                          color: "#fff",
                                          background: col.is_primary_key
                                            ? "#D4AF37"
                                            : "#DC143C",
                                        }}
                                      >
                                        {col.is_primary_key ? "PK" : "FK"}
                                      </span>
                                    )}
                                  <Text
                                    type="secondary"
                                    style={{ fontSize: 11 }}
                                    title={`data_type: ${col.data_type}`}
                                  >
                                    {col.data_type}
                                  </Text>
                                  {!col.is_nullable && (
                                    <Text
                                      type="secondary"
                                      style={{ fontSize: 10, color: "#DC143C" }}
                                      title="NOT NULL"
                                    >
                                      nn
                                    </Text>
                                  )}
                                  {col.column_default != null && (
                                    <Text
                                      type="secondary"
                                      style={{ fontSize: 10 }}
                                      title={`default: ${col.column_default}`}
                                    >
                                      ⚙
                                    </Text>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <Text
                              type="secondary"
                              style={{
                                fontSize: 12,
                                display: "block",
                                paddingTop: 4,
                                paddingLeft: 12,
                                paddingRight: 12,
                              }}
                            >
                              Không có columns
                            </Text>
                          )}
                        </div>

                        {/* Footer: schema / số columns */}
                        <div style={styles.tableCardFooter}>
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            {table?.schema_name}
                          </Text>
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            {columns.length} cols
                          </Text>
                        </div>
                      </div>
                    )}
                  </DraggableBox>
                );
              });
            })()}
          </div>

          {/* Render arrows */}
          {relatedPairs.map((pair, index) => {
            // Chỉ vẽ arrow nếu cả 2 đầu bảng đang được chọn
            if (
              !selectedTables.includes(pair.table1) ||
              !selectedTables.includes(pair.table2)
            ) {
              return null;
            }

            return (
              <Arrow
                key={`arrow-${index}-${arrowKey}`}
                className="arrow"
                from={{
                  direction: ARROW_DIRECTION.RIGHT,
                  node: () => document.getElementById(pair.table1),
                  translation: [0.5, 0],
                }}
                to={{
                  direction: ARROW_DIRECTION.LEFT,
                  node: () => document.getElementById(pair.table2),
                  translation: [-0.5, 0],
                }}
                head={ARROW_HEAD.none}
              />
            );
          })}

          {/* Relationship Panel */}
          <RelationshipPanel
            relationships={relatedPairs}
            hasRelationships={hasRelationships}
            loading={checkingMultipleTables}
            onRefresh={onRefreshRelationships}
            onHandleRemoveTable={(tableName: string) => {
              dispatch(snapshotForUndo());
              dispatch(removeTable(tableName));
              message.info(`Đã xóa bảng: ${tableName}`);
            }}
            selectedTablesData={selectedTablesData}
          />

          {/* Help text */}
          {selectedTables.length === 0 && <EmptyTable />}
        </>
      )}

      {/* ===== Context menu chuột phải trên bảng ===== */}
      {ctxMenu.table && (
        <TableRightClickMenu
          x={ctxMenu.x}
          y={ctxMenu.y}
          tableName={ctxMenu.table}
          onPick={handleCtxPick}
          onClose={() => setCtxMenu((c) => ({ ...c, table: null }))}
        />
      )}

      {/* ===== Modal xem data / xem DDL của bảng ===== */}
      <TablePreviewModal
        open={preview !== null}
        tableName={preview?.table ?? null}
        schemaName={preview?.schema}
        tableColumns={preview?.cols}
        mode={preview?.mode ?? null}
        onClose={() => setPreview(null)}
      />
    </div>
  );
}
