import React, { useState } from 'react';
import {
  Table,
  Space,
  Tag,
  Tooltip,
  Button,
  Dropdown,
  Badge,
  Modal,
  Empty,
} from 'antd';
import {
  LinkOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined,
  FlagOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  MenuOutlined,
  PictureOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import { ACTIVE_SCENE_OPTIONS } from '../../../hooks/useStoryChoices';
import { ChoiceTableProps } from './types';
import { Typography } from 'antd';

const { Text } = Typography;

export const ChoiceTable: React.FC<ChoiceTableProps> = ({
  choices,
  loading,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onReorder,
  selectedRowKeys,
  onSelectChange,
  onValidate,
  onFindPath,
  validationResults,
}) => {
  const columns: ColumnsType<any> = [
    {
      title: '#',
      dataIndex: 'choice_order',
      key: 'order',
      width: 70,
      render: (order: number) => (
        <Tag color="purple" style={{ minWidth: 30, textAlign: 'center', fontWeight: 600 }}>
          {order}
        </Tag>
      ),
      sorter: (a, b) => a.choice_order - b.choice_order,
    },
    {
      title: 'Choice Text',
      dataIndex: 'choice_text',
      key: 'text',
      ellipsis: true,
      width: 200,
      render: (text: string, record: any) => (
        <Space>
          <Text ellipsis strong>{text}</Text>
          {validationResults.has(record.id) && (
            <Tooltip title={validationResults.get(record.id)?.message}>
              {validationResults.get(record.id)?.valid ? (
                <CheckCircleOutlined style={{ color: '#2E8B57' }} />
              ) : (
                <CloseCircleOutlined style={{ color: '#DC143C' }} />
              )}
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: 'Effect',
      dataIndex: 'effect_text',
      key: 'effect',
      ellipsis: true,
      width: 150,
      render: (text: string) => (
        <Tooltip title={text}>
          <Text type="secondary" ellipsis>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Next Scene',
      dataIndex: 'next_scene',
      key: 'next_scene',
      width: 120,
      render: (nextScene: any) => (
        nextScene ? (
          <Tooltip title={`Scene #${nextScene.scene_order}: ${nextScene.dialog_text}`}>
            <Tag icon={<LinkOutlined />} color="green">
              Scene {nextScene.scene_order}
            </Tag>
          </Tooltip>
        ) : (
          <Tag color="default">End</Tag>
        )
      ),
    },
    {
      title: 'Active Scene',
      dataIndex: 'active_scene',
      key: 'active_scene',
      width: 120,
      render: (activeScene: string) => {
        const option = ACTIVE_SCENE_OPTIONS.find(o => o.value === activeScene);
        return (
          <Tag color="cyan">
            {option?.label || activeScene || 'main'}
          </Tag>
        );
      },
    },
    {
      title: 'Boss',
      dataIndex: 'boss',
      key: 'boss',
      width: 100,
      render: (boss: any) => (
        boss ? (
          <Tag icon={<TrophyOutlined />} color="red">
            {boss.name}
          </Tag>
        ) : (
          <Tag color="default">None</Tag>
        )
      ),
    },
    {
      title: 'Quests',
      dataIndex: 'quests',
      key: 'quests',
      width: 80,
      render: (quests: any[]) => (
        <Badge
          count={quests?.length || 0}
          showZero
          color={quests?.length > 0 ? '#D4AF37' : '#d9d9d9'}
        />
      ),
    },
    {
      title: 'Stats Change',
      dataIndex: 'stats_change',
      key: 'stats_change',
      width: 100,
      render: (statsChange: Record<string, any>) => {
        const keys = Object.keys(statsChange || {});
        return keys.length > 0 ? (
          <Tooltip title={JSON.stringify(statsChange, null, 2)}>
            <Tag color="blue">{keys.length} changes</Tag>
          </Tooltip>
        ) : (
          <Tag color="default">None</Tag>
        );
      },
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (date: string) => dayjs(date).format('MMM D, HH:mm'),
      sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_: any, record: any) => {
        const menuItems: MenuProps['items'] = [
          {
            key: 'validate',
            icon: <CheckCircleOutlined />,
            label: 'Validate Choice',
            onClick: () => onValidate(record.id),
          },
          {
            key: 'path',
            icon: <LinkOutlined />,
            label: 'Find Path',
            onClick: () => onFindPath(record.id),
          },
          { type: 'divider' },
          {
            key: 'view',
            icon: <EyeOutlined />,
            label: 'View Details',
            onClick: () => onView(record),
          },
          {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Edit Choice',
            onClick: () => onEdit(record),
          },
          {
            key: 'duplicate',
            icon: <CopyOutlined />,
            label: 'Duplicate Choice',
            onClick: () => onDuplicate(record.id),
          },
          { type: 'divider' },
          {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Delete Choice',
            danger: true,
            onClick: () => {
              Modal.confirm({
                title: 'Delete Choice',
                content: 'Are you sure you want to delete this choice?',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk: () => onDelete(record.id),
              });
            },
          },
        ];

        return (
          <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
            <Button type="text" size="small" icon={<MenuOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  // Drag and drop reorder
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === index) return;

    const reorderedChoices = [...choices];
    const [draggedItem] = reorderedChoices.splice(draggingIndex, 1);
    reorderedChoices.splice(index, 0, draggedItem);

    const updatedChoices = reorderedChoices.map((choice, idx) => ({
      ...choice,
      choice_order: idx + 1,
    }));

    onReorder(updatedChoices);
    setDraggingIndex(index);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  return (
    <Table
      columns={columns}
      dataSource={choices}
      rowKey="id"
      loading={loading}
      rowSelection={{
        selectedRowKeys,
        onChange: onSelectChange,
        selections: [
          Table.SELECTION_ALL,
          Table.SELECTION_INVERT,
          Table.SELECTION_NONE,
        ],
      }}
      pagination={{
        pageSize: 20,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} choices`,
        pageSizeOptions: ['10', '20', '50', '100'],
      }}
      scroll={{ x: 1500 }}
      locale={{
        emptyText: (
          <Empty
            description="No choices found for this scene"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ),
      }}
      onRow={(record, index) => ({
        draggable: true,
        onDragStart: () => handleDragStart(index || 0),
        onDragOver: (e) => handleDragOver(e, index || 0),
        onDragEnd: handleDragEnd,
        style: {
          cursor: 'move',
          backgroundColor: draggingIndex === index ? '#f0f0f0' : 'transparent',
        },
      })}
    />
  );
};
