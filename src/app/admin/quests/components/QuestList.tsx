'use client';

import React from 'react';
import { Table, Button, Space, Tag, Popconfirm, Tooltip, Badge } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  CheckCircleOutlined,
  StopOutlined 
} from '@ant-design/icons';
import { getCategoryColor, getDifficultyColor, getQuestTypeLabel } from '../utils/questHelpers';
import { useToggleQuestStatus, useDeleteQuest } from '../hooks/useQuestMutations';
import { Quest } from '../types';

interface QuestListProps {
  quests: Quest[];
  loading: boolean;
  onEdit: (quest: Quest) => void;
  onView: (quest: Quest) => void;
}

export const QuestList: React.FC<QuestListProps> = ({ 
  quests, 
  loading, 
  onEdit, 
  onView 
}) => {
  const toggleStatus = useToggleQuestStatus();
  const deleteQuest = useDeleteQuest();

  const columns: ColumnsType<Quest> = [
    {
      title: 'Tên nhiệm vụ',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Quest) => (
        <Space direction="vertical" size="small">
          <span className="font-semibold text-nobleBrown">{text}</span>
          <span className="text-xs text-gray-500">ID: {record.id.slice(0, 8)}...</span>
        </Space>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getQuestTypeLabel(type as any),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color={getCategoryColor(category as any)} className="uppercase">
          {category}
        </Tag>
      ),
    },
    {
      title: 'Độ khó',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (difficulty: string) => (
        <Tag color={getDifficultyColor(difficulty as any)}>
          {difficulty}
        </Tag>
      ),
    },
    {
      title: 'Cấp độ',
      key: 'level',
      render: (_, record: Quest) => (
        <span>
          {record.min_level} - {record.max_level}
        </span>
      ),
    },
    {
      title: 'Giới hạn',
      dataIndex: 'completion_limit',
      key: 'completion_limit',
      render: (limit: number | null) => limit || '∞',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'active' ? 'success' : 'error'} 
          text={status === 'active' ? 'Hoạt động' : 'Vô hiệu'} 
        />
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_: any, record: Quest) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => onView(record)}
            />
          </Tooltip>
          
          <Tooltip title="Chỉnh sửa">
            <Button 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => onEdit(record)}
            />
          </Tooltip>

          <Tooltip title={record.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}>
            <Button
              icon={record.status === 'active' ? <StopOutlined /> : <CheckCircleOutlined />}
              size="small"
              danger={record.status === 'active'}
              type={record.status === 'active' ? 'default' : 'primary'}
              onClick={() => toggleStatus.mutate({ 
                id: record.id, 
                status: record.status === 'active' ? 'inactive' : 'active' 
              })}
              loading={toggleStatus.isPending}
            />
          </Tooltip>

          <Popconfirm
            title="Xóa nhiệm vụ"
            description="Bạn có chắc chắn muốn xóa nhiệm vụ này?"
            onConfirm={() => deleteQuest.mutate(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button 
                icon={<DeleteOutlined />} 
                size="small"
                danger
                loading={deleteQuest.isPending}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={quests}
      rowKey="id"
      loading={loading}
      scroll={{ x: 1300 }}
      pagination={false}
      className="quest-table"
    />
  );
};
