"use client";

import { Button, Badge, Space, Tooltip, Tabs } from 'antd';
import {
  SaveOutlined,
  FolderOpenOutlined,
  ExportOutlined,
  ImportOutlined,
  PlusOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  selectActiveTab,
  selectOpenTabs,
  setActiveTab,
  closeTab,
} from '@/lib/redux/diagramSlice';

interface DiagramTabsHeaderProps {
  /** Danh sách metadata diagram để lấy tên + số bảng hiển thị trên tab */
  metadataList: Array<{ id: string; name: string; tableCount?: number }>;
  saving: boolean;
  onSave: () => void;
  onOpenPanel: () => void;
  onExport: () => void;
  onImport: () => void;
}

export function DiagramTabsHeader({
  metadataList,
  saving,
  onSave,
  onOpenPanel,
  onExport,
  onImport,
}: DiagramTabsHeaderProps) {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(selectActiveTab);
  const openTabs = useAppSelector(selectOpenTabs);

  // ===== Tabs items =====
  const tabItems = [
    {
      key: 'new',
      label: (
        <span>
          <PlusOutlined /> New
        </span>
      ),
      children: null,
      closable: false,
    },
    ...openTabs
      .filter((key) => key !== 'new')
      .map((key) => {
        const meta = metadataList.find((m) => m.id === key);
        return {
          key,
          label: (
            <span>
              <TableOutlined /> {meta?.name || key.slice(0, 12)}
              {meta?.tableCount && meta.tableCount > 0 && (
                <Badge
                  count={meta.tableCount}
                  style={{
                    backgroundColor: '#8B0000',
                    fontSize: 10,
                    height: 18,
                    lineHeight: '18px',
                    minWidth: 18,
                    marginLeft: 4,
                  }}
                />
              )}
            </span>
          ),
          closable: true,
          children: null,
        };
      }),
  ];

  // ===== Handle tab change =====
  const handleTabChange = (key: string) => {
    if (key === activeTab) return;
    dispatch(setActiveTab(key));
  };

  // ===== Close tab =====
  const handleCloseTab = (targetKey: string) => {
    if (targetKey === 'new') return;
    dispatch(closeTab(targetKey));
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderBottom: '2px solid #D4AF37',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
      }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={tabItems}
        type="editable-card"
        hideAdd
        onEdit={(targetKey, action) => {
          if (action === 'remove') {
            handleCloseTab(targetKey as string);
          }
        }}
        style={{ flex: 1, marginBottom: -1 }}
        tabBarStyle={{ marginBottom: 0 }}
      />

      <Space size={4}>
        <Tooltip title="Lưu (Ctrl+S)">
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={onSave}
            loading={saving}
            size="small"
          >
            Lưu
          </Button>
        </Tooltip>

        <Tooltip title="Mở diagram">
          <Button icon={<FolderOpenOutlined />} onClick={onOpenPanel} size="small" />
        </Tooltip>

        <Tooltip title="Export">
          <Button icon={<ExportOutlined />} onClick={onExport} size="small" />
        </Tooltip>

        <Tooltip title="Import">
          <Button icon={<ImportOutlined />} onClick={onImport} size="small" />
        </Tooltip>
      </Space>
    </div>
  );
}
