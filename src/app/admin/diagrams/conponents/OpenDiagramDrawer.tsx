"use client";

import { useMemo, useState } from 'react';
import {
  Button,
  Tag,
  Space,
  Typography,
  Badge,
  Drawer,
  Input,
  List,
  Popconfirm,
  Empty,
  Collapse,
  Dropdown,
  Modal,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  FolderOpenOutlined,
  FolderOutlined,
  DeleteOutlined,
  CloseOutlined,
  MenuOutlined,
  PlusOutlined,
  TableOutlined,
  EditOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectActiveTab, selectOpenTabs } from '@/lib/redux/diagramSlice';

const { Text } = Typography;

const UNGROUPED_LABEL = 'Chưa phân loại';

interface DiagramDataItem {
  id: string;
  name: string;
  description?: string;
  group?: string; // '' = chưa phân loại
  tableCount?: number;
  updatedAt: string;
}

interface OpenDiagramDrawerProps {
  open: boolean;
  metadataList: DiagramDataItem[];
  /** Danh sách group rỗng (được tạo qua context menu, chưa có diagram) */
  groupsList: Array<{ name: string; createdAt: string }>;
  /** Các tên group là đích để "Đổi nhóm" (gồm group trống) */
  groupChoices: string[];
  searchTerm: string;
  searchResults: DiagramDataItem[];
  isSearching: boolean;
  onClose: () => void;
  onSearch: (term: string) => void;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
  onCreateGroup: (name: string) => Promise<{ ok: boolean; reason?: string }>;
  onDeleteGroup: (name: string) => Promise<{ ok: boolean; reason?: string }>;
  onRenameDiagram: (id: string, newName: string) => Promise<{ ok: boolean; reason?: string }>;
  onMoveDiagram: (id: string, group: string) => Promise<boolean>;
}

/** nhãn group hiển thị: '' → "Chưa phân loại" */
const labelOf = (group?: string) => (group && group.trim() ? group.trim() : UNGROUPED_LABEL);

export function OpenDiagramDrawer({
  open,
  metadataList,
  groupsList,
  searchTerm,
  searchResults,
  isSearching,
  onClose,
  onSearch,
  onOpen,
  onDelete,
  onCreateNew,
  onCreateGroup,
  onDeleteGroup,
  onRenameDiagram,
  onMoveDiagram,
  groupChoices,
}: OpenDiagramDrawerProps) {
  const activeTab = useAppSelector(selectActiveTab);
  const openTabs = useAppSelector(selectOpenTabs);

  // ---- State cho việc TẠO group (modal nhập tên; tạo empty group) ----
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // ---- Nút xóa 1 diagram ----
  const deleteAction = (item: DiagramDataItem) => (
    <Popconfirm
      key="delete"
      title="Xóa diagram này?"
      description="Hành động này sẽ xóa vĩnh viễn khỏi database"
      onConfirm={(e) => {
        e?.stopPropagation();
        onDelete(item.id);
      }}
      okText="Xóa"
      cancelText="Hủy"
    >
      <Button
        type="text"
        size="small"
        icon={<DeleteOutlined />}
        danger
        onClick={(e) => e.stopPropagation()}
      />
    </Popconfirm>
  );

  const describe = (item: DiagramDataItem) => (
    <Space direction="vertical" size={0}>
      <Text type="secondary" style={{ fontSize: 12 }}>
        {item.description || 'Không có mô tả'}
      </Text>
      <Text type="secondary" style={{ fontSize: 11 }}>
        {item.tableCount || 0} bảng • Cập nhật: {new Date(item.updatedAt).toLocaleDateString()}
      </Text>
    </Space>
  );

  // ---- Nhóm diagram theo group (gộp cả group rỗng) để dựng cây ----
  const groupTree = useMemo(() => {
    const map = new Map<string, DiagramDataItem[]>();
    for (const item of metadataList) {
      const key = labelOf(item.group);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    // Group rỗng (không diagram) từ store → cũng hiện 1 folder
    for (const g of groupsList) map.set(g.name, map.get(g.name) || []);
    return Array.from(map.entries())
      .map(([label, items]) => ({
        label,
        rawGroup: items.length ? (items[0]?.group ?? '') : label, // group rỗng dùng label làm key
        items,
        isEmpty: items.length === 0,
      }))
      .sort((a, b) => {
        if (a.label === UNGROUPED_LABEL) return 1;
        if (b.label === UNGROUPED_LABEL) return -1;
        return a.label.localeCompare(b.label, 'vi');
      });
  }, [metadataList, groupsList]);

  // Mở rộng folder mặc định nếu chứa diagram đang active
  const defaultActiveGroups = groupTree
    .filter((g) => g.items.some((i) => i.id === activeTab))
    .map((g) => g.rawGroup);

  // ---- Xóa group (chỉ rỗng) ----
  const [deletingName, setDeletingName] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openCreateModal = () => {
    setDraftName('');
    setCreateError(null);
    setCreateModalOpen(true);
  };

  const submitCreate = async () => {
    setCreating(true);
    setCreateError(null);
    const res = await onCreateGroup(draftName);
    setCreating(false);
    if (res.ok) {
      setCreateModalOpen(false);
    } else {
      setCreateError(res.reason || 'Không thể tạo group');
    }
  };

  const groupMenuFor = (name: string, itemCount: number): MenuProps => {
    // Không bao giờ xóa folder ảo "Chưa phân loại" / '' hay store-sourced có diagram
    const cannotDelete = itemCount > 0 || !name || labelOf(name) === UNGROUPED_LABEL;
    return {
      items: [
        {
          key: 'delete',
          label: 'Xóa group',
          icon: <DeleteOutlined />,
          danger: true,
          disabled: cannotDelete,
        },
      ],
      onClick: ({ key }) => {
        if (key === 'delete') {
          if (cannotDelete) return;
          setDeletingName(name);
          setDeleteError(null);
        }
      },
    };
  };

  const confirmDelete = async () => {
    if (!deletingName) return;
    setDeleting(true);
    const res = await onDeleteGroup(deletingName);
    setDeleting(false);
    if (res.ok) {
      setDeletingName(null);
    } else {
      setDeleteError(res.reason || 'Không thể xóa group');
    }
  };

  // ---- Đổi tên / Đổi nhóm của 1 diagram ----
  const [renaming, setRenaming] = useState<DiagramDataItem | null>(null);
  const [renameVal, setRenameVal] = useState('');
  const [renameErr, setRenameErr] = useState<string | null>(null);
  const [renameBusy, setRenameBusy] = useState(false);

  const openRename = (item: DiagramDataItem) => {
    setRenameVal(item.name);
    setRenameErr(null);
    setRenaming(item);
  };

  // Đích để đổi nhóm: "Chưa phân loại" + các group (không tính group hiện tại)
  const moveTargets = useMemo(
    () => [
      { key: '__ungroup__', label: <Space><FolderOutlined /> Chưa phân loại</Space>, value: '' },
      ...groupChoices.map((g) => ({ key: g, label: g, value: g })),
    ],
    [groupChoices]
  );

  const submitRename = async () => {
    if (!renaming) return;
    setRenameBusy(true);
    setRenameErr(null);
    const res = await onRenameDiagram(renaming.id, renameVal);
    setRenameBusy(false);
    if (res.ok) {
      setRenaming(null);
    } else {
      setRenameErr(res.reason || 'Đổi tên thất bại');
    }
  };

  // ---- Context menu (chuột phải) của 1 diagram ----
  const diagramMenuFor = (item: DiagramDataItem): MenuProps => {
    const current = item.group || '';
    return {
      items: [
        { key: 'rename', label: 'Đổi tên', icon: <EditOutlined /> },
        {
          key: 'move',
          label: 'Đổi nhóm',
          icon: <SwapOutlined />,
          children: moveTargets
            .filter((t) => t.value !== current)
            .map((t) => ({ key: `move:${t.value}`, label: t.label })),
        },
        { type: 'divider' },
        { key: 'delete', label: 'Xóa diagram', icon: <DeleteOutlined />, danger: true },
      ],
      onClick: ({ key, domEvent }) => {
        if (key === 'rename') {
          openRename(item);
        } else if (key === 'delete') {
          Modal.confirm({
            title: 'Xóa diagram?',
            content: 'Diagram này sẽ bị xóa vĩnh viễn khỏi database.',
            okText: 'Xóa',
            okButtonProps: { danger: true },
            cancelText: 'Hủy',
            onOk: () => onDelete(item.id),
          });
        } else if (key.startsWith('move:')) {
          const target = key.slice('move:'.length);
          void onMoveDiagram(item.id, target);
        }
        domEvent.stopPropagation();
      },
    };
  };

  // ---- Item trong 1 group ----
  const renderGroupedListItem = (item: DiagramDataItem) => {
    const isOpen = openTabs.includes(item.id);
    return (
      <Dropdown menu={diagramMenuFor(item)} trigger={['contextMenu']}>
        <List.Item
          style={{
            cursor: 'pointer',
            background: activeTab === item.id ? '#e6f7ff' : 'transparent',
            borderRadius: 4,
            opacity: isOpen ? 0.6 : 1,
            paddingLeft: 8,
          }}
          onClick={() => onOpen(item.id)}
          actions={[
            isOpen && (
              <Tag key="open" color="green" style={{ fontSize: 10 }}>
                Đã mở
              </Tag>
            ),
            deleteAction(item),
          ].filter(Boolean)}
        >
          <List.Item.Meta
            avatar={<TableOutlined style={{ color: isOpen ? '#8B0000' : '#ccc' }} />}
            title={
              <Space>
                <Text strong>{item.name}</Text>
                {isOpen && (
                  <Tag color="blue" style={{ fontSize: 10 }}>
                    Đang mở
                  </Tag>
                )}
              </Space>
            }
            description={describe(item)}
          />
        </List.Item>
      </Dropdown>
    );
  };

  // ---- Search item ----
  const renderSearchListItem = (item: DiagramDataItem) => (
    <Dropdown menu={diagramMenuFor(item)} trigger={['contextMenu']}>
      <List.Item
        style={{ cursor: 'pointer' }}
        onClick={() => onOpen(item.id)}
        actions={[deleteAction(item)]}
      >
        <List.Item.Meta
          avatar={<TableOutlined style={{ color: '#ccc' }} />}
          title={
            <Space>
              <Text strong>{item.name}</Text>
              <Tag color="geekblue" style={{ fontSize: 10 }}>
                {labelOf(item.group)}
              </Tag>
            </Space>
          }
          description={describe(item)}
        />
      </List.Item>
    </Dropdown>
  );

  return (
    <>
      <Drawer
        title={
          <Space>
            <FolderOpenOutlined />
            <Text strong>Mở diagram</Text>
            <Badge count={metadataList.length} style={{ backgroundColor: '#8B0000' }} />
          </Space>
        }
        placement="right"
        open={open}
        onClose={onClose}
        width={460}
        extra={<Button type="text" icon={<CloseOutlined />} onClick={onClose} />}
      >
        <Input
          placeholder="Tìm kiếm diagram hoặc group..."
          prefix={<MenuOutlined />}
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          allowClear
          style={{ marginBottom: 16 }}
        />

        {/* KẾT QUẢ TÌM KIẾM */}
        {searchTerm && (
          <>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {isSearching ? 'Đang tìm...' : `Tìm thấy ${searchResults.length} kết quả`}
            </Text>
            {searchResults.length > 0 && (
              <List size="small" dataSource={searchResults} renderItem={renderSearchListItem} />
            )}
            {searchTerm && searchResults.length === 0 && !isSearching && (
              <Empty description="Không tìm thấy diagram" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </>
        )}

        {/* CÂY FOLDER THEO GROUP (context menu chuột phải trên từng group) */}
        {!searchTerm && (
          <div
            onContextMenu={(e) => {
              // Chuột phải chỗ TRỐNG của panel root mới là "tạo group".
              // Nếu đang phải nhấn trên collapse/list/input/interactive → bỏ qua.
              const t = e.target as HTMLElement;
              if (
                t.closest('.ant-collapse') ||
                t.closest('.ant-list') ||
                t.closest('.ant-input') ||
                t.closest('button') ||
                t.closest('.diagram-allow-ctx')
              ) {
                return;
              }
              e.preventDefault();
              openCreateModal();
            }}
            style={{ minHeight: 200 }}
          >
            <div
              style={{
                marginBottom: 8,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text type="secondary">
                {groupTree.length} group ({metadataList.length} diagram)
              </Text>
              <Button type="text" size="small" onClick={openCreateModal} title="Tạo group rỗng">
                <PlusOutlined /> Nhóm mới
              </Button>
            </div>

            {groupTree.length === 0 && (
              <Empty description="Chưa có diagram nào" image={Empty.PRESENTED_IMAGE_SIMPLE}>
                <Button type="primary" onClick={onCreateNew}>
                  <PlusOutlined /> Tạo diagram đầu tiên
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={openCreateModal}>
                  <PlusOutlined /> Tạo group
                </Button>
              </Empty>
            )}

            <Collapse
              ghost
              defaultActiveKey={defaultActiveGroups}
              expandIconPosition="end"
              items={groupTree.map((g) => ({
                key: g.rawGroup,
                // Bao cả header để right-click tạo/xoá điều khiển qua context menu riêng của group
                label: (
                  <Dropdown
                    menu={groupMenuFor(g.rawGroup, g.items.length)}
                    trigger={['contextMenu']}
                  >
                    <div className="diagram-allow-ctx">
                      <Space style={{ width: '100%', cursor: 'context-menu' }}>
                        <FolderOutlined style={{ color: g.isEmpty ? '#c0c0c0' : '#ffa940' }} />
                        <Text strong>{g.label}</Text>
                        <Tag style={{ fontSize: 10, marginRight: 0 }}>{g.items.length}</Tag>
                        {g.isEmpty && (
                          <Text type="secondary" style={{ fontSize: 10 }}>
                            (trống)
                          </Text>
                        )}
                      </Space>
                    </div>
                  </Dropdown>
                ),
                children: g.isEmpty ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Nhóm rỗng"
                    style={{ margin: '8px 0' }}
                  />
                ) : (
                  <List size="small" dataSource={g.items} renderItem={renderGroupedListItem} />
                ),
              }))}
            />
          </div>
        )}
      </Drawer>

      {/* Modal tạo group */}
      <Modal
        title={
          <Space>
            <FolderOutlined />
            <Text strong>Tạo group mới</Text>
          </Space>
        }
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onOk={submitCreate}
        okText="Tạo"
        cancelText="Hủy"
        confirmLoading={creating}
        width={420}
      >
        <Text strong style={{ display: 'block', marginBottom: 4 }}>
          Tên group
        </Text>
        <Input
          placeholder="Nhập tên group (VD: Core, PvP...)"
          value={draftName}
          autoFocus
          onChange={(e) => {
            setDraftName(e.target.value);
            if (createError) setCreateError(null);
          }}
          onPressEnter={submitCreate}
          status={createError ? 'error' : undefined}
        />
        {createError && (
          <Text type="danger" style={{ display: 'block', marginTop: 6 }}>
            {createError}
          </Text>
        )}
      </Modal>

      {/* Modal xóa group (chỉ page cho phép khi rỗng) */}
      <Modal
        title="Xóa group?"
        open={deletingName !== null}
        onCancel={() => setDeletingName(null)}
        onOk={confirmDelete}
        okText="Xóa"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
        confirmLoading={deleting}
        width={420}
      >
        {deleteError ? (
          <Text type="danger">{deleteError}</Text>
        ) : (
          <Text>
            Group <Text strong>“{deletingName}”</Text> hiện không có diagram nào và sẽ bị xóa vĩnh
            viễn. Tiếp tục?
          </Text>
        )}
      </Modal>

      {/* Modal đổi tên diagram */}
      <Modal
        title={
          <Space>
            <EditOutlined />
            <Text strong>Đổi tên diagram</Text>
          </Space>
        }
        open={renaming !== null}
        onCancel={() => setRenaming(null)}
        onOk={submitRename}
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
          onPressEnter={submitRename}
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
