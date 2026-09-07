"use client";

import { useState } from 'react';
import { Button, Badge, Space, Tooltip, Tabs, AutoComplete, Tag, Dropdown, Modal, Input } from 'antd';
import type { MenuProps } from 'antd';
import { Typography } from 'antd';
import {
  SaveOutlined,
  FolderOpenOutlined,
  ExportOutlined,
  ImportOutlined,
  PlusOutlined,
  TableOutlined,
  FolderOutlined,
  EditOutlined,
  SwapOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  selectActiveTab,
  selectOpenTabs,
  setActiveTab,
  closeTab,
} from '@/lib/redux/diagramSlice';

const { Text } = Typography;

const UNGROUPED_VALUE = '';
const UNGROUPED_LABEL = 'Chưa phân loại';

interface DiagramTabsHeaderProps {
  /** Danh sách metadata diagram để lấy tên + số bảng hiển thị trên tab */
  metadataList: Array<{ id: string; name: string; group?: string; tableCount?: number }>;
  saving: boolean;
  onSave: () => void;
  onOpenPanel: () => void;
  onExport: () => void;
  onImport: () => void;
  /** group của diagram đang active (tab != 'new'); '' = chưa phân loại */
  activeGroup?: string;
  /** list tên group đang dùng (để gợi ý khi đổi) */
  groupLabels?: string[];
  onChangeGroup: (group: string) => void;
  /** Context menu trên tab: đổi tên / đổi group / xóa (không kể tab 'new') */
  groupChoices: string[];
  onRenameDiagram: (id: string, newName: string) => Promise<{ ok: boolean; reason?: string }>;
  onMoveDiagram: (id: string, group: string) => Promise<boolean>;
  onDeleteDiagram: (id: string) => void;
}

export function DiagramTabsHeader({
  metadataList,
  saving,
  onSave,
  onOpenPanel,
  onExport,
  onImport,
  activeGroup,
  groupLabels = [],
  onChangeGroup,
  groupChoices,
  onRenameDiagram,
  onMoveDiagram,
  onDeleteDiagram,
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
            <Dropdown
              menu={diagramTabMenuFor(key) as MenuProps}
              trigger={['contextMenu']}
            >
              <span style={{ display: 'inline-block' }}>
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
            </Dropdown>
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

  // ---- Đổi group nhanh cho diagram đang mở (tab != 'new') ----
  const [editingGroup, setEditingGroup] = useState(false);
  const [draftGroup, setDraftGroup] = useState('');

  // ---- State modal đổi tên (từ context menu tab) ----
  const [renaming, setRenaming] = useState<string | null>(null); // id diagram
  const [renameVal, setRenameVal] = useState('');
  const [renameErr, setRenameErr] = useState<string | null>(null);
  const [renameBusy, setRenameBusy] = useState(false);

  const isSavedDiagram = activeTab !== 'new' && activeGroup !== undefined;
  const shownGroup =
    activeGroup && activeGroup.trim() ? activeGroup.trim() : UNGROUPED_LABEL;
  const groupSuggestions = [
    UNGROUPED_LABEL,
    ...groupLabels.filter((g) => g !== UNGROUPED_LABEL),
  ].map((g) => ({ value: g }));

  /** Áp dụng group đang chỉnh (rỗng = '' = chưa phân loại) */
  const commitGroupChange = () => {
    setEditingGroup(false);
    const v = draftGroup.trim();
    if (v !== shownGroup) {
      onChangeGroup(v === UNGROUPED_LABEL ? UNGROUPED_VALUE : v);
    }
  };

  const submitTabRename = async () => {
    if (!renaming) return;
    setRenameBusy(true);
    setRenameErr(null);
    const res = await onRenameDiagram(renaming, renameVal);
    setRenameBusy(false);
    if (res.ok) setRenaming(null);
    else setRenameErr(res.reason || 'Đổi tên thất bại');
  };

  /** Menu chuột phải cho 1 tab diagram (không phải tab 'new') */
  function diagramTabMenuFor(id: string): MenuProps | undefined {
    if (id === 'new') return undefined;
    const meta = metadataList.find((m) => m.id === id);
    const current = meta?.group || '';
    return {
      items: [
        { key: 'rename', label: 'Đổi tên', icon: <EditOutlined /> },
        {
          key: 'subGroup',
          label: 'Đổi group',
          icon: <SwapOutlined />,
          children: [
            { key: 'group:', label: 'Chưa phân loại' },
            ...groupChoices
              .filter((g) => g !== current)
              .map((g) => ({ key: `group:${g}`, label: g })),
          ],
        },
        { type: 'divider' },
        { key: 'delete', label: 'Xóa diagram', icon: <DeleteOutlined />, danger: true },
      ],
      onClick: ({ key }) => {
        if (key === 'rename') {
          setRenameVal(meta?.name ?? '');
          setRenameErr(null);
          setRenaming(id);
        } else if (key === 'delete') {
          Modal.confirm({
            title: 'Xóa diagram?',
            content: 'Diagram này sẽ bị xóa vĩnh viễn khỏi database.',
            okText: 'Xóa',
            okButtonProps: { danger: true },
            cancelText: 'Hủy',
            onOk: () => onDeleteDiagram(id),
          });
        } else if (key.startsWith('group:')) {
          const g = key.slice('group:'.length);
          void onMoveDiagram(id, g);
        }
      },
    };
  }

  return (
    <>
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

      <Space size={4} align="center" wrap>
        {/* Đổi group nhanh của diagram đang mở */}
        {isSavedDiagram && editingGroup ? (
          <AutoComplete
            autoFocus
            style={{ width: 180 }}
            value={draftGroup}
            options={groupSuggestions}
            placeholder="Tên group..."
            notFoundContent={<span>Nhập tên để tạo group mới</span>}
            onChange={(val) => setDraftGroup(val)}
            onSelect={(val) => {
              setDraftGroup(val);
              commitGroupChange();
            }}
            onBlur={commitGroupChange}
          />
        ) : (
          isSavedDiagram && (
            /* Hiển thị group hiện tại — bấm vào để đổi nhanh */
            <Tag
              icon={<FolderOutlined />}
              color="geekblue"
              style={{ cursor: 'pointer', margin: 0, userSelect: 'none' }}
              onClick={(e) => {
                e.stopPropagation();
                setDraftGroup(shownGroup);
                setEditingGroup(true);
              }}
              title="Bấm để đổi group"
            >
              {shownGroup}
            </Tag>
          )
        )}
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

    {/* Modal đổi tên diagram (từ menu chuột phải trên tab) */}
    <Modal
      title={
        <Space>
          <EditOutlined />
          <Text strong>Đổi tên diagram</Text>
        </Space>
      }
      open={renaming !== null}
      onCancel={() => setRenaming(null)}
      onOk={submitTabRename}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={renameBusy}
      width={420}
    >
      <Text strong style={{ display: 'block', marginBottom: 4 }}>
        Tên mới
      </Text>
      <Input
        placeholder="Nhập tên diagram..."
        value={renameVal}
        autoFocus
        onChange={(e) => {
          setRenameVal(e.target.value);
          if (renameErr) setRenameErr(null);
        }}
        onPressEnter={submitTabRename}
        status={renameErr ? 'error' : undefined}
      />
      {renameErr && (
        <Text type="danger" style={{ display: 'block', marginTop: 6 }}>
          {renameErr}
        </Text>
      )}
    </Modal>
    </>
  );
}
