"use client";

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
} from 'antd';
import {
  FolderOpenOutlined,
  DeleteOutlined,
  CloseOutlined,
  MenuOutlined,
  PlusOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectActiveTab, selectOpenTabs } from '@/lib/redux/diagramSlice';

const { Text } = Typography;

interface DiagramDataItem {
  id: string;
  name: string;
  description?: string;
  tableCount?: number;
  updatedAt: string;
}

interface OpenDiagramDrawerProps {
  open: boolean;
  metadataList: DiagramDataItem[];
  searchTerm: string;
  searchResults: DiagramDataItem[];
  isSearching: boolean;
  onClose: () => void;
  onSearch: (term: string) => void;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}

export function OpenDiagramDrawer({
  open,
  metadataList,
  searchTerm,
  searchResults,
  isSearching,
  onClose,
  onSearch,
  onOpen,
  onDelete,
  onCreateNew,
}: OpenDiagramDrawerProps) {
  const activeTab = useAppSelector(selectActiveTab);
  const openTabs = useAppSelector(selectOpenTabs);

  // ===== Render 1 List.Item cho kết quả tìm kiếm / danh sách đầy đủ =====
  const renderSearchListItem = (item: DiagramDataItem) => (
    <List.Item
      style={{ cursor: 'pointer' }}
      onClick={() => onOpen(item.id)}
      actions={[
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
        </Popconfirm>,
      ]}
    >
      <List.Item.Meta
        title={<Text strong>{item.name}</Text>}
        description={
          <Space direction="vertical" size={0}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {item.description || 'Không có mô tả'}
            </Text>
            <Text type="secondary" style={{ fontSize: 11 }}>
              {item.tableCount || 0} bảng • Cập nhật:{' '}
              {new Date(item.updatedAt).toLocaleDateString()}
            </Text>
          </Space>
        }
      />
    </List.Item>
  );

  const renderFullListItem = (item: DiagramDataItem) => {
    const isOpen = openTabs.includes(item.id);
    return (
      <List.Item
        style={{
          cursor: 'pointer',
          background: activeTab === item.id ? '#e6f7ff' : 'transparent',
          borderRadius: 4,
          opacity: isOpen ? 0.6 : 1,
        }}
        onClick={() => onOpen(item.id)}
        actions={[
          isOpen && (
            <Tag key="open" color="green" style={{ fontSize: 10 }}>
              Đã mở
            </Tag>
          ),
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
          </Popconfirm>,
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
          description={
            <Space direction="vertical" size={0}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {item.description || 'Không có mô tả'}
              </Text>
              <Text type="secondary" style={{ fontSize: 11 }}>
                {item.tableCount || 0} bảng • {new Date(item.updatedAt).toLocaleDateString()}
              </Text>
            </Space>
          }
        />
      </List.Item>
    );
  };

  return (
    <Drawer
      title={
        <Space>
          <FolderOpenOutlined />
          <Text strong>Mở diagram</Text>
          <Badge
            count={metadataList.length}
            style={{ backgroundColor: '#8B0000' }}
          />
        </Space>
      }
      placement="right"
      open={open}
      onClose={onClose}
      width={420}
      extra={
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={onClose}
        />
      }
    >
      <Input
        placeholder="Tìm kiếm diagram..."
        prefix={<MenuOutlined />}
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        allowClear
        style={{ marginBottom: 16 }}
      />

      {searchTerm && (
        <>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {isSearching
              ? 'Đang tìm...'
              : `Tìm thấy ${searchResults.length} kết quả`}
          </Text>
          {searchResults.length > 0 && (
            <List
              size="small"
              dataSource={searchResults}
              renderItem={renderSearchListItem}
            />
          )}
          {searchTerm && searchResults.length === 0 && !isSearching && (
            <Empty
              description="Không tìm thấy diagram"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </>
      )}

      {!searchTerm && (
        <>
          <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
            <Text type="secondary">Tất cả diagram ({metadataList.length})</Text>
            <Button
              type="text"
              size="small"
              onClick={onCreateNew}
            >
              <PlusOutlined /> Tạo mới
            </Button>
          </div>

          <List
            size="small"
            dataSource={metadataList}
            renderItem={renderFullListItem}
          />
        </>
      )}
    </Drawer>
  );
}
