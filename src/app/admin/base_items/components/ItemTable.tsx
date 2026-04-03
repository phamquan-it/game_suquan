// app/admin/base_items/components/ItemTable.tsx
'use client';

import React from 'react';
import {
  Table,
  Space,
  Button,
  Tag,
  Tooltip,
  Popconfirm,
  Badge,
  Image,
  Typography,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { useItems } from '../hooks/useItems';
import { useDeleteItem } from '../hooks/useDeleteItem';
import { getRarityColor, getQualityColor, formatItemType } from '../utils/itemHelpers';
import { ItemFilterParams, ItemWithRelations } from '../types';
import { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

interface ItemTableProps {
  filters: ItemFilterParams;
  onEdit: (item: any) => void;
}

export default function ItemTable({ filters, onEdit }: ItemTableProps) {
  const { data, isLoading } = useItems(filters);
  const deleteItem = useDeleteItem();

  const columns: ColumnsType<ItemWithRelations> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {formatItemType(record.type)}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Rarity',
      dataIndex: 'rarity',
      key: 'rarity',
      render: (rarity: string) => (
        <Tag color={getRarityColor(rarity)} style={{ textTransform: 'uppercase' }}>
          {rarity}
        </Tag>
      ),
    },
    {
      title: 'Quality',
      dataIndex: 'quality',
      key: 'quality',
      render: (quality: string) => (
        <Tag color={getQualityColor(quality)} style={{ textTransform: 'uppercase' }}>
          {quality}
        </Tag>
      ),
    },
    {
      title: 'Level',
      dataIndex: 'levelRequirement',
      key: 'levelRequirement',
      width: 80,
      render: (level: number) => (
        <Badge count={level} style={{ backgroundColor: '#8B4513' }} />
      ),
    },
    {
      title: 'Value',
      dataIndex: 'baseValue',
      key: 'baseValue',
      width: 100,
      render: (value: number) => (
        <Text>{value} 🪙</Text>
      ),
    },
    {
      title: 'Stack',
      key: 'stack',
      width: 80,
      render: (_: any, record: any) => (
        record.stackable ? (
          <Tag color="green">Up to {record.maxStack}</Tag>
        ) : (
          <Tag color="red">No</Tag>
        )
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const colors = {
          active: 'green',
          inactive: 'orange',
          testing: 'blue',
        };
        return (
          <Tag color={colors[status as keyof typeof colors] || 'default'}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 180,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="View">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => window.open(`/items/${record.id}`, '_blank')}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Duplicate">
            <Button
              type="text"
              icon={<CopyOutlined />}
            />
          </Tooltip>
          <Popconfirm
            title="Delete item"
            description="Are you sure you want to delete this item?"
            onConfirm={() => deleteItem.mutate(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
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
      dataSource={data?.items || []}
      loading={isLoading}
      rowKey="id"
      pagination={{
        total: data?.total || 0,
        pageSize: filters.limit || 20,
        current: filters.page || 1,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} items`,
      }}
      scroll={{ x: 1300 }}
    />
  );
}
