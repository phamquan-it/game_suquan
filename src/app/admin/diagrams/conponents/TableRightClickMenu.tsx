"use client";

import { theme } from 'antd';
import { DatabaseOutlined, FileTextOutlined } from '@ant-design/icons';

const { useToken } = theme;

export type TableMenuAction = 'data' | 'ddl';

interface TableRightClickMenuProps {
  /** Vị trí chuột (clientX/clientY) để đặt menu cố định */
  x: number;
  y: number;
  tableName: string;
  onPick: (action: TableMenuAction) => void;
  onClose: () => void;
}

/**
 * Custom context menu xuất hiện khi bấm chuột phải vào 1 bảng.
 * Đặt ở vị trí `fixed` theo tọa độ client để không bị `overflow:hidden`
 * của canvas cắt khi menu gần mép.
 */
export function TableRightClickMenu({
  x,
  y,
  tableName,
  onPick,
  onClose,
}: TableRightClickMenuProps) {
  const { token } = useToken();

  const items: { action: TableMenuAction; icon: React.ReactNode; label: string }[] = [
    { action: 'data', icon: <DatabaseOutlined />, label: 'Xem data' },
    { action: 'ddl', icon: <FileTextOutlined />, label: 'Xem DDL' },
  ];

  return (
    // Layer phủ toàn màn hình: đóng menu khi bấm ngoài
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 1000 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        style={{
          position: 'fixed',
          left: x,
          top: y,
          zIndex: 1001,
          minWidth: 168,
          padding: '4px',
          background: token.colorBgElevated,
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadius,
          boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
        }}
      >
        <div
          style={{
            padding: '6px 10px',
            marginBottom: 2,
            fontSize: 11,
            color: token.colorTextSecondary,
            borderBottom: `1px solid ${token.colorFillSecondary}`,
            whiteSpace: 'nowrap',
            fontFamily: 'monospace',
          }}
        >
          {tableName}
        </div>
        {items.map((it) => (
          <div
            key={it.action}
            onClick={(e) => {
              e.stopPropagation();
              onPick(it.action);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 10px',
              fontSize: 13,
              cursor: 'pointer',
              color: token.colorText,
              borderRadius: 4,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = token.colorFillTertiary;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            <span style={{ color: token.colorPrimary }}>{it.icon}</span>
            {it.label}
          </div>
        ))}
      </div>
    </div>
  );
}
