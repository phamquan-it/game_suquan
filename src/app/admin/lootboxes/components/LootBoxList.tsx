// app/admin/lootboxes/components/LootBoxList.tsx
'use client';

import React, { useState } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Row,
  Col,
  Badge,
  Tooltip,
  Popconfirm,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useLootBoxes, useDeleteLootBox } from '../hooks/useLootBoxQueries';
import { LOOT_BOX_TYPES, LOOT_BOX_CATEGORIES, LOOT_BOX_TIERS } from '../constants/lootbox.constants';
import { LootBoxFilters } from '../types/lootbox.types';
import type { ColumnsType } from 'antd/es/table';
import { LootBox } from '@/lib/types/loot-box';

const { Title } = Typography;
const { Option } = Select;

export default function LootBoxList() {
  const router = useRouter();
  const [filters, setFilters] = useState<LootBoxFilters>({});
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  const { data, isLoading } = useLootBoxes(filters, pagination);
  const deleteMutation = useDeleteLootBox();

  const columns: ColumnsType<LootBox> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space direction="vertical" size="small">
          <Typography.Text strong>{text}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            ID: {record.id}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const typeInfo = LOOT_BOX_TYPES.find(t => t.value === type);
        return <Tag color="blue">{typeInfo?.label || type}</Tag>;
      },
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        const categoryInfo = LOOT_BOX_CATEGORIES.find(c => c.value === category);
        return <Tag>{categoryInfo?.label || category}</Tag>;
      },
    },
    {
      title: 'Tier',
      dataIndex: 'tier',
      key: 'tier',
      render: (tier) => {
        const tierInfo = LOOT_BOX_TIERS.find(t => t.value === tier);
        return <Tag color={tierInfo?.color}>{tierInfo?.label || tier}</Tag>;
      },
    },
    {
      title: 'Cost',
      key: 'cost',
      render: (_, record) => (
        <Typography.Text>
          {record.open_cost_amount} {record.open_cost_currency}
        </Typography.Text>
      ),
    },
    {
      title: 'Availability',
      key: 'availability',
      render: (_, record) => {
        const now = new Date();
        const availableFrom = record.available_from ? new Date(record.available_from) : null;
        const availableUntil = record.available_until ? new Date(record.available_until) : null;

        let isAvailable = true;
        if (availableFrom && availableFrom > now) isAvailable = false;
        if (availableUntil && availableUntil < now) isAvailable = false;

        return (
          <Space direction="vertical" size="small">
            <Badge status={isAvailable ? 'success' : 'error'} text={isAvailable ? 'Available' : 'Unavailable'} />
            {record.time_limited && (
              <Tag color="orange">Time Limited</Tag>
            )}
            {record.exclusive && (
              <Tag color="purple">Exclusive</Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Season/Event',
      key: 'seasonEvent',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.season && <Tag color="green">Season: {record.season}</Tag>}
          {record.event && <Tag color="gold">Event: {record.event}</Tag>}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => router.push(`/admin/lootboxes/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => router.push(`/admin/lootboxes/${record.id}/edit`)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete loot box"
            description="Are you sure you want to delete this loot box? This action cannot be undone."
            onConfirm={() => deleteMutation.mutate(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleFilterChange = (key: keyof LootBoxFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = (value: string) => {
    handleFilterChange('search', value);
  };

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2}>Loot Boxes</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push('/admin/lootboxes/new')}
          >
            Create Loot Box
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Input
            placeholder="Search by name or ID"
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            placeholder="Filter by type"
            style={{ width: '100%' }}
            allowClear
            onChange={(value) => handleFilterChange('type', value)}
          >
            {LOOT_BOX_TYPES.map(type => (
              <Option key={type.value} value={type.value}>{type.label}</Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            placeholder="Filter by category"
            style={{ width: '100%' }}
            allowClear
            onChange={(value) => handleFilterChange('category', value)}
          >
            {LOOT_BOX_CATEGORIES.map(category => (
              <Option key={category.value} value={category.value}>{category.label}</Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            placeholder="Filter by tier"
            style={{ width: '100%' }}
            allowClear
            onChange={(value) => handleFilterChange('tier', value)}
          >
            {LOOT_BOX_TIERS.map(tier => (
              <Option key={tier.value} value={tier.value}>{tier.label}</Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={data?.data}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: data?.total,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (page, limit) => setPagination({ page, limit }),
        }}
      />
    </Card>
  );
}
