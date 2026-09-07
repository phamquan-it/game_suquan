"use client";

import { Button, Tag, Space, Typography, Spin, message } from 'antd';
import {
  ReloadOutlined,
  ClearOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { clearTables, snapshotForUndo, selectSelectedTables } from '@/lib/redux/diagramSlice';
import styles from '../styles';
import { TableSelectorModal } from '../modals/TableSelectorModal';
import { TableInfo } from '../types/diagram';

const { Text } = Typography;

interface DiagramControlPanelProps {
  tables: TableInfo[];
  loadingTables: boolean;
  /** Có kết quả kiểm tra quan hệ hay chưa (null nếu chưa run / chưa đủ 2 bảng) */
  checkMultipleTablesResult: unknown;
  checkingMultipleTables: boolean;
  hasRelationships: boolean;
  relatedPairsCount: number;
  /** Trigger ép tải lại từ server (xóa cache schema + refetch). Trả Promise để panel hiện loading. */
  onRefreshTables: () => Promise<void>;
  /** Đang có đồng bộ (columns/quan hệ) chạy -> button hiện spin tiến trình. */
  syncing: boolean;
  /** Mở popup tiến trình đồng bộ. */
  onOpenSync: () => void;
}

export function DiagramControlPanel({
  tables,
  loadingTables,
  checkMultipleTablesResult,
  checkingMultipleTables,
  hasRelationships,
  relatedPairsCount,
  onRefreshTables,
  syncing,
  onOpenSync,
}: DiagramControlPanelProps) {
  const dispatch = useAppDispatch();
  const selectedTables = useAppSelector(selectSelectedTables);
  const [refreshing, setRefreshing] = useState(false);

  // Bao bọc onRefreshTables để hiện loading xuyên suốt thao tác (xóa cache + refetch)
  const handleRefreshTables = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await onRefreshTables();
      message.success('Đã tải lại dữ liệu từ server');
    } catch (error) {
      console.error('Refresh failed:', error);
      message.error('Tải lại thất bại');
    } finally {
      setRefreshing(false);
    }
  };

  const refreshLoading = refreshing || loadingTables;

  return (
    <div style={styles.controlPanel}>
      <Space size="middle" wrap>
        <div>
          <Text strong style={{ display: 'block', fontSize: 12, color: '#8B4513' }}>
            Thêm bảng
          </Text>
          <TableSelectorModal tables={tables} loadingTables={loadingTables} />
        </div>

        <Button
          icon={<ClearOutlined />}
          onClick={() => {
            dispatch(snapshotForUndo());
            dispatch(clearTables());
            message.info('Đã xóa tất cả bảng');
          }}
          disabled={selectedTables.length === 0}
          style={{ marginTop: 18 }}
        >
          Xóa tất cả
        </Button>

        {/* Nút mở popup tiến trình đồng bộ; hiện spin khi đang chạy */}
        <Button
          icon={syncing ? <Spin size="small" /> : <SyncOutlined />}
          onClick={onOpenSync}
          style={{ marginTop: 18 }}
          title="Xem tiến trình đồng bộ (từ client cache hay từ server)"
        >
          Đồng bộ
        </Button>

        <Button
          icon={<ReloadOutlined />}
          onClick={handleRefreshTables}
          loading={refreshLoading}
          style={{ marginTop: 18 }}
          title="Xóa cache (columns + quan hệ) trong trình duyệt rồi tải lại từ server. Bấm khi bạn vừa thay đổi schema để thấy kết quả mới."
        >
          Tải lại
        </Button>
      </Space>

      {/* Status */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        {checkingMultipleTables ? (
          <Spin size="small" />
        ) : checkMultipleTablesResult ? (
          hasRelationships ? (
            <Tag
              icon={<CheckCircleOutlined />}
              color="success"
              style={{ padding: '4px 12px' }}
            >
              {relatedPairsCount} quan hệ
            </Tag>
          ) : (
            <Tag
              icon={<CloseCircleOutlined />}
              color="error"
              style={{ padding: '4px 12px' }}
            >
              Không có quan hệ
            </Tag>
          )
        ) : (
          <Text type="secondary" style={{ fontSize: 13 }}>
            <PlusOutlined /> Chọn ít nhất 2 bảng
          </Text>
        )}
      </div>
    </div>
  );
}
