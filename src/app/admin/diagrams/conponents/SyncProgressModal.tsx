"use client";

import { Modal, Spin, Button, Typography, theme } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { SyncLogEntry } from '../types/syncLog';

const { Text } = Typography;
const { useToken } = theme;

interface SyncProgressModalProps {
  open: boolean;
  syncing: boolean;
  logs: SyncLogEntry[];
  onClear: () => void;
  onClose: () => void;
}

/**
 * Modal tiến trình đồng bộ dữ liệu.
 * - Mở khi có đang tải columns/quan hệ (syncing).
 * - Mỗi dòng = một bước, text phía sau `from client`(xanh) / `from server`(cam).
 * - Thanh chia tỉ lệ xanh/cam phía trên.
 */
export function SyncProgressModal({
  open,
  syncing,
  logs,
  onClear,
  onClose,
}: SyncProgressModalProps) {
  const clientCount = logs.filter((l) => l.source === 'client').length;
  const serverCount = logs.length - clientCount;
  const total = Math.max(logs.length, 1);

  // Màu chuẩn hóa từ theme: client/cache = colorSuccess, server = colorWarning
  const { token } = useToken();
  const CLIENT_COLOR = token.colorSuccess; // #2E8B57 (xanh)
  const SERVER_COLOR = token.colorWarning; // #FF8C00 (cam)
  const TRACK_COLOR = token.colorFillSecondary; // track nền

  return (
    <Modal
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          {syncing && <Spin size="small" />}
          Đồng bộ dữ liệu
          {syncing ? '…' : ''}
        </span>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={480}
      closable
      maskClosable
    >
      {/* Breakdown thanh xanh/cam */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          fontSize: 12,
          marginBottom: 8,
        }}
      >
        <span style={{ flex: 'none', color: CLIENT_COLOR, fontWeight: 600 }}>
          {clientCount} client
        </span>
        <span style={{ flex: 'none', color: SERVER_COLOR, fontWeight: 600 }}>
          {serverCount} server
        </span>
        <div
          style={{
            flex: 1,
            height: 8,
            background: TRACK_COLOR,
            borderRadius: 4,
            overflow: 'hidden',
            display: 'flex',
          }}
          title={`${clientCount} từ client (IndexedDB), ${serverCount} từ server`}
        >
          <div
            style={{
              width: `${(clientCount / total) * 100}%`,
              background: CLIENT_COLOR,
              height: '100%',
              transition: 'width .2s',
            }}
          />
          <div
            style={{
              width: `${(serverCount / total) * 100}%`,
              background: SERVER_COLOR,
              height: '100%',
              transition: 'width .2s',
            }}
          />
        </div>
        <Button
          type="text"
          size="small"
          icon={<DeleteOutlined />}
          onClick={onClear}
          title="Xóa log đã xem"
          style={{ flex: 'none' }}
        />
      </div>

      {/* Từng bước (dòng mới nhất trên cùng) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          fontSize: 12,
          maxHeight: 220,
          overflowY: 'auto',
        }}
      >
        {logs.length === 0 ? (
          <Text type="secondary">Chưa có thao tác đồng bộ nào.</Text>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                fontFamily: 'monospace',
              }}
            >
              <span>
                <Text type="secondary">------ loading </Text>
                {log.label}
              </span>
              <span
                style={{
                  color: log.source === 'client' ? CLIENT_COLOR : SERVER_COLOR,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                from {log.source}
              </span>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
