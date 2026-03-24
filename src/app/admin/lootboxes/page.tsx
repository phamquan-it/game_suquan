// app/admin/lootboxes/page.tsx
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
  message,
  Typography,
  Dropdown,
  Menu,
  Avatar,
  Statistic,
  DatePicker,
  Modal,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  UploadOutlined,
  CopyOutlined,
  ExclamationCircleOutlined,
  GiftOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  StarOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lootBoxService } from './services/lootbox.service';
import {
  LOOT_BOX_TYPES,
  LOOT_BOX_CATEGORIES,
  LOOT_BOX_TIERS,
} from './constants/lootbox.constants';
import type { ColumnsType } from 'antd/es/table';
import type { LootBox } from '@/types/lootbox';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

export default function LootBoxesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [tierFilter, setTierFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Fetch loot boxes with filters
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['lootBoxes', { searchText, typeFilter, categoryFilter, tierFilter, dateRange, pagination }],
    queryFn: () => lootBoxService.getLootBoxes(
      {
        search: searchText,
        type: typeFilter || undefined,
        category: categoryFilter || undefined,
        tier: tierFilter || undefined,
        dateRange: dateRange ? {
          start: dateRange[0]?.toISOString(),
          end: dateRange[1]?.toISOString(),
        } : undefined,
      },
      {
        page: pagination.current,
        limit: pagination.pageSize,
      }
    ),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => lootBoxService.deleteLootBox(id),
    onSuccess: () => {
      message.success('Loot box deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['lootBoxes'] });
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to delete loot box');
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => Promise.all(ids.map(id => lootBoxService.deleteLootBox(id))),
    onSuccess: () => {
      message.success(`${selectedRowKeys.length} loot boxes deleted successfully`);
      setSelectedRowKeys([]);
      queryClient.invalidateQueries({ queryKey: ['lootBoxes'] });
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to delete loot boxes');
    },
  });

  // Duplicate mutation
  const duplicateMutation = useMutation({
    mutationFn: async (id: string) => {
      const original = await lootBoxService.getLootBoxById(id);
      const { id: _, created_at, updated_at, ...rest } = original;
      return lootBoxService.createLootBox({
        ...rest,
        name: `${rest.name} (Copy)`,
        id: `${rest.id}_copy_${Date.now()}`,
      });
    },
    onSuccess: () => {
      message.success('Loot box duplicated successfully');
      queryClient.invalidateQueries({ queryKey: ['lootBoxes'] });
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to duplicate loot box');
    },
  });

  const handleDelete = (id: string) => {
    confirm({
      title: 'Delete Loot Box',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete this loot box? This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        return deleteMutation.mutateAsync(id);
      },
    });
  };

  const handleBulkDelete = () => {
    confirm({
      title: `Delete ${selectedRowKeys.length} Loot Boxes`,
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete the selected loot boxes? This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        return bulkDeleteMutation.mutateAsync(selectedRowKeys as string[]);
      },
    });
  };

  const handleDuplicate = (id: string) => {
    duplicateMutation.mutate(id);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(data?.data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `lootboxes_export_${dayjs().format('YYYYMMDD_HHmmss')}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const lootBoxes = JSON.parse(content);
        
        // Validate and import each loot box
        for (const lootBox of Array.isArray(lootBoxes) ? lootBoxes : [lootBoxes]) {
          try {
            await lootBoxService.createLootBox(lootBox);
          } catch (error) {
            console.error('Failed to import loot box:', lootBox.id, error);
          }
        }
        
        message.success('Import completed');
        queryClient.invalidateQueries({ queryKey: ['lootBoxes'] });
      } catch (error) {
        message.error('Failed to parse import file');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  const getTierColor = (tier: string) => {
    const tierInfo = LOOT_BOX_TIERS.find(t => t.value === tier);
    return tierInfo?.color || '#808080';
  };

  const getStatus = (record: LootBox) => {
    const now = dayjs();
    const availableFrom = record.available_from ? dayjs(record.available_from) : null;
    const availableUntil = record.available_until ? dayjs(record.available_until) : null;
    
    if (availableFrom && availableFrom > now) {
      return { status: 'upcoming', color: 'blue', text: 'Upcoming' };
    }
    if (availableUntil && availableUntil < now) {
      return { status: 'expired', color: 'red', text: 'Expired' };
    }
    if (record.time_limited) {
      return { status: 'limited', color: 'orange', text: 'Time Limited' };
    }
    return { status: 'available', color: 'green', text: 'Available' };
  };

  const columns: ColumnsType<LootBox> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 250,
      render: (text: string, record: LootBox) => (
        <Space direction="vertical" size="small">
          <Text strong style={{ fontSize: 16 }}>{text}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>ID: {record.id}</Text>
          <Space size={4} wrap>
            {record.exclusive && <Tag color="purple">Exclusive</Tag>}
            {record.season && <Tag color="cyan">Season: {record.season}</Tag>}
            {record.event && <Tag color="gold">Event: {record.event}</Tag>}
          </Space>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => {
        const typeInfo = LOOT_BOX_TYPES.find(t => t.value === type);
        return <Tag color="blue">{typeInfo?.label || type}</Tag>;
      },
      filters: LOOT_BOX_TYPES.map(t => ({ text: t.label, value: t.value })),
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: string) => {
        const categoryInfo = LOOT_BOX_CATEGORIES.find(c => c.value === category);
        return <Tag>{categoryInfo?.label || category}</Tag>;
      },
      filters: LOOT_BOX_CATEGORIES.map(c => ({ text: c.label, value: c.value })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Tier',
      dataIndex: 'tier',
      key: 'tier',
      width: 100,
      render: (tier: string) => (
        <Tag color={getTierColor(tier)} style={{ textTransform: 'uppercase' }}>
          {tier}
        </Tag>
      ),
      filters: LOOT_BOX_TIERS.map(t => ({ text: t.label, value: t.value })),
      onFilter: (value, record) => record.tier === value,
    },
    {
      title: 'Cost',
      key: 'cost',
      width: 120,
      render: (_: any, record: LootBox) => (
        <Badge 
          count={`${record.open_cost_amount} ${record.open_cost_currency}`}
          style={{ backgroundColor: '#52c41a' }}
        />
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_: any, record: LootBox) => {
        const status = getStatus(record);
        return (
          <Space direction="vertical" size="small">
            <Badge status={status.color as any} text={status.text} />
            {record.available_from && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                From: {dayjs(record.available_from).format('MMM DD, YYYY')}
              </Text>
            )}
            {record.available_until && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                Until: {dayjs(record.available_until).format('MMM DD, YYYY')}
              </Text>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Features',
      key: 'features',
      width: 150,
      render: (_: any, record: LootBox) => (
        <Space size={4} wrap>
          {record.shine_effect && <Tooltip title="Shine Effect"><Tag icon={<StarOutlined />} color="gold">Shine</Tag></Tooltip>}
          {record.rarity_pulse && <Tooltip title="Rarity Pulse"><Tag icon={<ThunderboltOutlined />} color="purple">Pulse</Tag></Tooltip>}
        </Space>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_: any, record: LootBox) => (
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
          <Tooltip title="Duplicate">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => handleDuplicate(record.id)}
              loading={duplicateMutation.isPending}
            />
          </Tooltip>
          <Tooltip title="Reward Tables">
            <Button
              type="text"
              icon={<GiftOutlined />}
              onClick={() => router.push(`/admin/lootboxes/${record.id}?tab=rewards`)}
            />
          </Tooltip>
          <Tooltip title="Pity System">
            <Button
              type="text"
              icon={<SafetyOutlined />}
              onClick={() => router.push(`/admin/lootboxes/${record.id}?tab=pity`)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete loot box"
            description="Are you sure you want to delete this loot box?"
            onConfirm={() => handleDelete(record.id)}
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

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const menu = (
    <Menu>
      <Menu.Item key="export" icon={<DownloadOutlined />} onClick={handleExport}>
        Export to JSON
      </Menu.Item>
      <Menu.Item key="import" icon={<UploadOutlined />}>
        <label style={{ cursor: 'pointer' }}>
          Import from JSON
          <input
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
        </label>
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={{ padding: 24 }}>
      <Card>
        {/* Header */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              Loot Boxes
            </Title>
            <Text type="secondary">
              Manage and configure all loot boxes in the game
            </Text>
          </Col>
          <Col>
            <Space>
              <Dropdown overlay={menu} placement="bottomRight">
                <Button icon={<DownloadOutlined />}>
                  Import/Export
                </Button>
              </Dropdown>
              {selectedRowKeys.length > 0 && (
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleBulkDelete}
                  loading={bulkDeleteMutation.isPending}
                >
                  Delete ({selectedRowKeys.length})
                </Button>
              )}
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => router.push('/admin/lootboxes/new')}
                size="large"
              >
                Create Loot Box
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Statistics */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Loot Boxes"
                value={data?.total || 0}
                prefix={<GiftOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Active"
                value={data?.data?.filter(b => getStatus(b).status === 'available').length || 0}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Upcoming"
                value={data?.data?.filter(b => getStatus(b).status === 'upcoming').length || 0}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Expired"
                value={data?.data?.filter(b => getStatus(b).status === 'expired').length || 0}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card size="small" style={{ marginBottom: 16, background: '#fafafa' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={24} md={8} lg={6}>
              <Input
                placeholder="Search by name or ID"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Select
                placeholder="Filter by type"
                style={{ width: '100%' }}
                value={typeFilter || undefined}
                onChange={setTypeFilter}
                allowClear
              >
                {LOOT_BOX_TYPES.map(type => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Select
                placeholder="Filter by category"
                style={{ width: '100%' }}
                value={categoryFilter || undefined}
                onChange={setCategoryFilter}
                allowClear
              >
                {LOOT_BOX_CATEGORIES.map(category => (
                  <Option key={category.value} value={category.value}>
                    {category.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Select
                placeholder="Filter by tier"
                style={{ width: '100%' }}
                value={tierFilter || undefined}
                onChange={setTierFilter}
                allowClear
              >
                {LOOT_BOX_TIERS.map(tier => (
                  <Option key={tier.value} value={tier.value}>
                    <Space>
                      <span style={{
                        display: 'inline-block',
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: tier.color
                      }} />
                      {tier.label}
                    </Space>
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <RangePicker
                style={{ width: '100%' }}
                onChange={(dates) => setDateRange(dates as any)}
                placeholder={['Available from', 'Available until']}
              />
            </Col>
          </Row>
        </Card>

        {/* Table */}
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data?.data}
          loading={isLoading}
          rowKey="id"
          scroll={{ x: 1500 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: data?.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} items`,
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize: pageSize || 10 });
            },
          }}
        />
      </Card>
    </div>
  );
}
