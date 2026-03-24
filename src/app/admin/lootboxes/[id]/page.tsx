// app/admin/lootboxes/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Descriptions,
  Badge,
  Button,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Tabs,
  Statistic,
  Table,
  Divider,
  Empty,
  Spin,
  message,
  Modal,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  CopyOutlined,
  GiftOutlined,
  SafetyOutlined,
  StarOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  CalendarOutlined,
  TagOutlined,
  EyeOutlined,
  HistoryOutlined,
  BarChartOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lootBoxService } from '../services/lootbox.service';
import {
  LOOT_BOX_TYPES,
  LOOT_BOX_CATEGORIES,
  LOOT_BOX_TIERS,
  RARITIES,
} from '../constants/lootbox.constants';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { confirm } = Modal;

interface LootBoxDetailPageProps {
  params: {
    id: string;
  };
}

export default function LootBoxDetailPage({ params }: LootBoxDetailPageProps) {
  const { id } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');

  // Fetch loot box details
  const { data: lootBox, isLoading, error } = useQuery({
    queryKey: ['lootBox', id],
    queryFn: () => lootBoxService.getLootBoxById(id),
  });

  // Fetch reward tables
  const { data: rewardTables } = useQuery({
    queryKey: ['rewardTables', id],
    queryFn: () => lootBoxService.getRewardTables(id),
    enabled: !!id,
  });

  // Fetch pity system
  const { data: pitySystem } = useQuery({
    queryKey: ['pitySystem', id],
    queryFn: () => lootBoxService.getPitySystem(id),
    enabled: !!id,
  });

  // Fetch guaranteed drops
  const { data: guaranteedDrops } = useQuery({
    queryKey: ['guaranteedDrops', id],
    queryFn: () => lootBoxService.getGuaranteedDrops(id),
    enabled: !!id,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => lootBoxService.deleteLootBox(id),
    onSuccess: () => {
      message.success('Loot box deleted successfully');
      router.push('/admin/lootboxes');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to delete loot box');
    },
  });

  // Duplicate mutation
  const duplicateMutation = useMutation({
    mutationFn: async () => {
      if (!lootBox) throw new Error('Loot box not found');
      const { id: _, created_at, updated_at, ...rest } = lootBox;
      return lootBoxService.createLootBox({
        ...rest,
        name: `${rest.name} (Copy)`,
        id: `${rest.name}_copy_${Date.now()}`,
      });
    },
    onSuccess: (newLootBox) => {
      message.success('Loot box duplicated successfully');
      router.push(`/admin/lootboxes/${newLootBox.id}`);
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to duplicate loot box');
    },
  });

  const handleDelete = () => {
    confirm({
      title: 'Delete Loot Box',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete this loot box? This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        return deleteMutation.mutateAsync();
      },
    });
  };

  const handleDuplicate = () => {
    duplicateMutation.mutate();
  };

  const getTierColor = (tier: string) => {
    const tierInfo = LOOT_BOX_TIERS.find(t => t.value === tier);
    return tierInfo?.color || '#808080';
  };

  const getStatus = () => {
    if (!lootBox) return { status: 'unknown', color: 'default', text: 'Unknown' };
    
    const now = dayjs();
    const availableFrom = lootBox.available_from ? dayjs(lootBox.available_from) : null;
    const availableUntil = lootBox.available_until ? dayjs(lootBox.available_until) : null;
    
    if (availableFrom && availableFrom > now) {
      return { 
        status: 'upcoming', 
        color: 'blue', 
        text: 'Upcoming',
        description: `Available in ${availableFrom.fromNow(true)}`
      };
    }
    if (availableUntil && availableUntil < now) {
      return { 
        status: 'expired', 
        color: 'red', 
        text: 'Expired',
        description: `Expired ${availableUntil.fromNow()}`
      };
    }
    if (lootBox.time_limited) {
      return { 
        status: 'limited', 
        color: 'orange', 
        text: 'Time Limited',
        description: availableUntil ? `Available until ${availableUntil.format('MMM DD, YYYY')}` : 'Limited time'
      };
    }
    return { 
      status: 'available', 
      color: 'green', 
      text: 'Available',
      description: 'Currently available'
    };
  };

  const getRarityColor = (rarity: string) => {
    const rarityInfo = RARITIES.find(r => r.value === rarity);
    return rarityInfo?.color || '#808080';
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !lootBox) {
    return (
      <Card>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Loot box not found"
        >
          <Button type="primary" onClick={() => router.push('/admin/lootboxes')}>
            Back to Loot Boxes
          </Button>
        </Empty>
      </Card>
    );
  }

  const status = getStatus();

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push('/admin/lootboxes')}
            >
              Back
            </Button>
            <div>
              <Title level={2} style={{ margin: 0 }}>
                {lootBox.name}
              </Title>
              <Text type="secondary">ID: {lootBox.id}</Text>
            </div>
          </Space>
        </Col>
        <Col>
          <Space>
            <Button
              icon={<CopyOutlined />}
              onClick={handleDuplicate}
              loading={duplicateMutation.isPending}
            >
              Duplicate
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => router.push(`/admin/lootboxes/${id}/edit`)}
            >
              Edit
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              loading={deleteMutation.isPending}
            >
              Delete
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Status Banner */}
      <Card style={{ marginBottom: 24, background: '#fafafa' }}>
        <Row gutter={24} align="middle">
          <Col>
            <Badge status={status.color as any} text={status.text} style={{ fontSize: 16 }} />
          </Col>
          <Col>
            <Text type="secondary">{status.description}</Text>
          </Col>
          {lootBox.exclusive && (
            <Col>
              <Tag color="purple" icon={<StarOutlined />}>Exclusive</Tag>
            </Col>
          )}
          {lootBox.season && (
            <Col>
              <Tag color="cyan" icon={<CalendarOutlined />}>Season: {lootBox.season}</Tag>
            </Col>
          )}
          {lootBox.event && (
            <Col>
              <Tag color="gold" icon={<TrophyOutlined />}>Event: {lootBox.event}</Tag>
            </Col>
          )}
        </Row>
      </Card>

      {/* Tabs */}
      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
        <TabPane tab="Overview" key="overview">
          <Row gutter={24}>
            <Col span={16}>
              {/* Basic Information */}
              <Card title="Basic Information" style={{ marginBottom: 24 }}>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="Name" span={2}>
                    {lootBox.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="ID" span={2}>
                    <Text copyable>{lootBox.id}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Description" span={2}>
                    {lootBox.description || 'No description provided'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Type">
                    <Tag color="blue">
                      {LOOT_BOX_TYPES.find(t => t.value === lootBox.type)?.label || lootBox.type}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Box Type">
                    <Tag color="blue">
                      {LOOT_BOX_TYPES.find(t => t.value === lootBox.box_type)?.label || lootBox.box_type}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Category">
                    <Tag>
                      {LOOT_BOX_CATEGORIES.find(c => c.value === lootBox.category)?.label || lootBox.category}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tier">
                    <Tag color={getTierColor(lootBox.tier)} style={{ textTransform: 'uppercase' }}>
                      {lootBox.tier}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Open Cost">
                    <Badge 
                      count={`${lootBox.open_cost_amount} ${lootBox.open_cost_currency}`}
                      style={{ backgroundColor: '#52c41a' }}
                    />
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {/* Visual Settings */}
              <Card title="Visual Settings" style={{ marginBottom: 24 }}>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Statistic 
                      title="Animation Type"
                      value={lootBox.opening_animation_type}
                      prefix={<EyeOutlined />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic 
                      title="Duration"
                      value={`${lootBox.opening_animation_duration}ms`}
                      prefix={<HistoryOutlined />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic 
                      title="Sound Effect"
                      value={lootBox.sound_effect || 'None'}
                    />
                  </Col>
                </Row>
                <Divider />
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <div>
                      <Text type="secondary">Glow Color</Text>
                      <div style={{ marginTop: 8 }}>
                        {lootBox.glow_color ? (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ 
                              width: 24, 
                              height: 24, 
                              borderRadius: 4, 
                              backgroundColor: lootBox.glow_color,
                              marginRight: 8,
                              border: '1px solid #d9d9d9'
                            }} />
                            <Text>{lootBox.glow_color}</Text>
                          </div>
                        ) : 'None'}
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div>
                      <Text type="secondary">Particle Color</Text>
                      <div style={{ marginTop: 8 }}>
                        {lootBox.particle_color ? (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ 
                              width: 24, 
                              height: 24, 
                              borderRadius: 4, 
                              backgroundColor: lootBox.particle_color,
                              marginRight: 8,
                              border: '1px solid #d9d9d9'
                            }} />
                            <Text>{lootBox.particle_color}</Text>
                          </div>
                        ) : 'None'}
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div>
                      <Text type="secondary">Effects</Text>
                      <div style={{ marginTop: 8 }}>
                        <Space>
                          {lootBox.shine_effect && (
                            <Tag icon={<StarOutlined />} color="gold">Shine</Tag>
                          )}
                          {lootBox.rarity_pulse && (
                            <Tag icon={<ThunderboltOutlined />} color="purple">Pulse</Tag>
                          )}
                          {!lootBox.shine_effect && !lootBox.rarity_pulse && 'None'}
                        </Space>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>

              {/* Tags */}
              {lootBox.tags && Object.keys(lootBox.tags).length > 0 && (
                <Card title="Tags" style={{ marginBottom: 24 }}>
                  <Space wrap>
                    {Object.keys(lootBox.tags).map(tag => (
                      <Tag key={tag} icon={<TagOutlined />} color="geekblue">
                        {tag}
                      </Tag>
                    ))}
                  </Space>
                </Card>
              )}
            </Col>

            <Col span={8}>
              {/* Availability */}
              <Card title="Availability" style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary">Created</Text>
                  <div>
                    <Text strong>{dayjs(lootBox.created_at).format('MMM DD, YYYY HH:mm')}</Text>
                    <br />
                    <Text type="secondary">{dayjs(lootBox.created_at).fromNow()}</Text>
                  </div>
                </div>
                {lootBox.updated_at && (
                  <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">Last Updated</Text>
                    <div>
                      <Text strong>{dayjs(lootBox.updated_at).format('MMM DD, YYYY HH:mm')}</Text>
                      <br />
                      <Text type="secondary">{dayjs(lootBox.updated_at).fromNow()}</Text>
                    </div>
                  </div>
                )}
                {lootBox.available_from && (
                  <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">Available From</Text>
                    <div>
                      <Text strong>{dayjs(lootBox.available_from).format('MMM DD, YYYY HH:mm')}</Text>
                    </div>
                  </div>
                )}
                {lootBox.available_until && (
                  <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">Available Until</Text>
                    <div>
                      <Text strong>{dayjs(lootBox.available_until).format('MMM DD, YYYY HH:mm')}</Text>
                    </div>
                  </div>
                )}
              </Card>

              {/* Statistics */}
              <Card title="Statistics" style={{ marginBottom: 24 }}>
                <Statistic 
                  title="Total Reward Tables"
                  value={rewardTables?.length || 0}
                  prefix={<GiftOutlined />}
                  style={{ marginBottom: 16 }}
                />
                <Statistic 
                  title="Pity System"
                  value={pitySystem?.enabled ? 'Enabled' : 'Disabled'}
                  valueStyle={{ color: pitySystem?.enabled ? '#3f8600' : '#cf1322' }}
                  prefix={<SafetyOutlined />}
                  style={{ marginBottom: 16 }}
                />
                <Statistic 
                  title="Guaranteed Drops"
                  value={guaranteedDrops?.length || 0}
                  prefix={<StarOutlined />}
                />
              </Card>

              {/* Quick Actions */}
              <Card title="Quick Actions">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button 
                    block 
                    icon={<GiftOutlined />}
                    onClick={() => setActiveTab('rewards')}
                  >
                    Manage Reward Tables
                  </Button>
                  <Button 
                    block 
                    icon={<SafetyOutlined />}
                    onClick={() => setActiveTab('pity')}
                  >
                    Configure Pity System
                  </Button>
                  <Button 
                    block 
                    icon={<StarOutlined />}
                    onClick={() => setActiveTab('guaranteed')}
                  >
                    Setup Guaranteed Drops
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Reward Tables" key="rewards">
          <Card>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
              <Col>
                <Title level={4}>Reward Tables</Title>
                <Text type="secondary">
                  {rewardTables?.length || 0} reward tables configured
                </Text>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => router.push(`/admin/lootboxes/${id}/edit?tab=rewards`)}
                >
                  Add Reward Table
                </Button>
              </Col>
            </Row>

            {rewardTables && rewardTables.length > 0 ? (
              <Table
                dataSource={rewardTables}
                rowKey="id"
                pagination={false}
                expandable={{
                  expandedRowRender: (record) => (
                    <div style={{ paddingLeft: 24 }}>
                      <Title level={5}>Pools</Title>
                      {record.pools && record.pools.length > 0 ? (
                        <Table
                          dataSource={record.pools}
                          rowKey="id"
                          size="small"
                          pagination={false}
                          columns={[
                            {
                              title: 'Pool Name',
                              dataIndex: 'name',
                              key: 'name',
                            },
                            {
                              title: 'Weight',
                              dataIndex: 'weight',
                              key: 'weight',
                              render: (weight) => <Tag color="purple">{weight}</Tag>,
                            },
                            {
                              title: 'Drops',
                              key: 'drops',
                              render: (_, pool) => (
                                <Text>{pool.min_drops} - {pool.max_drops}</Text>
                              ),
                            },
                            {
                              title: 'Items',
                              key: 'items',
                              render: (_, pool) => (
                                <Tag color="blue">{pool.items?.length || 0} items</Tag>
                              ),
                            },
                            {
                              title: 'Guaranteed',
                              dataIndex: 'guaranteed',
                              key: 'guaranteed',
                              render: (guaranteed) => (
                                <Tag color={guaranteed ? 'success' : 'default'}>
                                  {guaranteed ? 'Yes' : 'No'}
                                </Tag>
                              ),
                            },
                          ]}
                        />
                      ) : (
                        <Text type="secondary">No pools configured</Text>
                      )}
                    </div>
                  ),
                }}
                columns={[
                  {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                    render: (text, record) => (
                      <Space direction="vertical" size="small">
                        <Text strong>{text}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>ID: {record.id}</Text>
                      </Space>
                    ),
                  },
                  {
                    title: 'Distribution',
                    dataIndex: 'distribution_type',
                    key: 'distribution_type',
                    render: (type) => <Tag color="blue">{type}</Tag>,
                  },
                  {
                    title: 'Anti-Duplicate',
                    dataIndex: 'anti_duplicate',
                    key: 'anti_duplicate',
                    render: (value) => (
                      <Tag color={value ? 'success' : 'default'}>
                        {value ? 'Enabled' : 'Disabled'}
                      </Tag>
                    ),
                  },
                  {
                    title: 'Pools',
                    key: 'pools',
                    render: (_, record) => (
                      <Tag color="geekblue">{record.pools?.length || 0} pools</Tag>
                    ),
                  },
                ]}
              />
            ) : (
              <Empty description="No reward tables configured" />
            )}
          </Card>
        </TabPane>

        <TabPane tab="Pity System" key="pity">
          <Card>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
              <Col>
                <Title level={4}>Pity System Configuration</Title>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => router.push(`/admin/lootboxes/${id}/edit?tab=pity`)}
                >
                  Configure Pity System
                </Button>
              </Col>
            </Row>

            {pitySystem ? (
              <>
                <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
                  <Descriptions.Item label="Status">
                    <Badge 
                      status={pitySystem.enabled ? 'success' : 'default'} 
                      text={pitySystem.enabled ? 'Enabled' : 'Disabled'} 
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Reset on Rare Drop">
                    <Badge 
                      status={pitySystem.reset_on_rare_drop ? 'processing' : 'default'} 
                      text={pitySystem.reset_on_rare_drop ? 'Yes' : 'No'} 
                    />
                  </Descriptions.Item>
                </Descriptions>

                <Title level={5}>Pity Counters</Title>
                {pitySystem.counters && pitySystem.counters.length > 0 ? (
                  <Table
                    dataSource={pitySystem.counters}
                    rowKey="id"
                    pagination={false}
                    columns={[
                      {
                        title: 'Rarity',
                        dataIndex: 'rarity',
                        key: 'rarity',
                        render: (rarity) => (
                          <Tag color={getRarityColor(rarity)}>
                            {rarity.toUpperCase()}
                          </Tag>
                        ),
                      },
                      {
                        title: 'Threshold',
                        dataIndex: 'threshold',
                        key: 'threshold',
                        render: (threshold) => <Text strong>{threshold} opens</Text>,
                      },
                      {
                        title: 'Items',
                        key: 'items',
                        render: (_, record) => (
                          <Tag color="purple">{record.items?.length || 0} items</Tag>
                        ),
                      },
                    ]}
                    expandable={{
                      expandedRowRender: (record) => (
                        <div style={{ paddingLeft: 24 }}>
                          <Title level={5}>Guaranteed Items</Title>
                          {record.items && record.items.length > 0 ? (
                            <Table
                              dataSource={record.items}
                              rowKey="id"
                              size="small"
                              pagination={false}
                              columns={[
                                {
                                  title: 'Reward Item ID',
                                  dataIndex: 'reward_item_id',
                                  key: 'reward_item_id',
                                },
                                {
                                  title: 'Weight',
                                  dataIndex: 'weight',
                                  key: 'weight',
                                  render: (weight) => <Tag color="purple">{weight}</Tag>,
                                },
                              ]}
                            />
                          ) : (
                            <Text type="secondary">No items configured</Text>
                          )}
                        </div>
                      ),
                    }}
                  />
                ) : (
                  <Empty description="No pity counters configured" />
                )}
              </>
            ) : (
              <Empty description="No pity system configured" />
            )}
          </Card>
        </TabPane>

        <TabPane tab="Guaranteed Drops" key="guaranteed">
          <Card>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
              <Col>
                <Title level={4}>Guaranteed Drops</Title>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => router.push(`/admin/lootboxes/${id}/edit?tab=guaranteed`)}
                >
                  Manage Guaranteed Drops
                </Button>
              </Col>
            </Row>

            {guaranteedDrops && guaranteedDrops.length > 0 ? (
              <Table
                dataSource={guaranteedDrops}
                rowKey="id"
                pagination={false}
                columns={[
                  {
                    title: 'Open Count',
                    dataIndex: 'open_count',
                    key: 'open_count',
                    render: (count) => <Tag color="gold">Every {count} opens</Tag>,
                  },
                  {
                    title: 'Reset After Claim',
                    dataIndex: 'reset_after_claim',
                    key: 'reset_after_claim',
                    render: (value) => (
                      <Tag color={value ? 'success' : 'default'}>
                        {value ? 'Yes' : 'No'}
                      </Tag>
                    ),
                  },
                  {
                    title: 'Rewards',
                    key: 'rewards',
                    render: (_, record) => (
                      <Tag color="blue">{record.rewards?.length || 0} rewards</Tag>
                    ),
                  },
                ]}
                expandable={{
                  expandedRowRender: (record) => (
                    <div style={{ paddingLeft: 24 }}>
                      <Title level={5}>Reward Items</Title>
                      {record.rewards && record.rewards.length > 0 ? (
                        <Table
                          dataSource={record.rewards}
                          rowKey="id"
                          size="small"
                          pagination={false}
                          columns={[
                            {
                              title: 'Reward Item ID',
                              dataIndex: 'reward_item_id',
                              key: 'reward_item_id',
                            },
                          ]}
                        />
                      ) : (
                        <Text type="secondary">No rewards configured</Text>
                      )}
                    </div>
                  ),
                }}
              />
            ) : (
              <Empty description="No guaranteed drops configured" />
            )}
          </Card>
        </TabPane>

        <TabPane tab="Streak Bonuses" key="streak">
          <Card>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
              <Col>
                <Title level={4}>Streak Bonuses</Title>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => router.push(`/admin/lootboxes/${id}/edit?tab=streak`)}
                >
                  Manage Streak Bonuses
                </Button>
              </Col>
            </Row>

            {rewardTables??[].filter(t => t.streak_bonus).length > 0 ? (
              <Table
                dataSource={rewardTables??[].filter(t => t.streak_bonus)}
                rowKey="id"
                pagination={false}
                columns={[
                  {
                    title: 'Reward Table',
                    dataIndex: 'name',
                    key: 'name',
                  },
                  {
                    title: 'Status',
                    key: 'status',
                    render: (_, record) => (
                      <Badge 
                        status={record.streak_bonus.enabled ? 'success' : 'default'} 
                        text={record.streak_bonus.enabled ? 'Enabled' : 'Disabled'} 
                      />
                    ),
                  },
                  {
                    title: 'Streak Type',
                    key: 'type',
                    render: (_, record) => (
                      <Tag color="geekblue">{record.streak_bonus.streak_type}</Tag>
                    ),
                  },
                  {
                    title: 'Tiers',
                    key: 'tiers',
                    render: (_, record) => (
                      <Tag color="purple">{record.streak_bonus.tiers?.length || 0} tiers</Tag>
                    ),
                  },
                ]}
              />
            ) : (
              <Empty description="No streak bonuses configured" />
            )}
          </Card>
        </TabPane>

        <TabPane tab="First Time Bonuses" key="firsttime">
          <Card>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
              <Col>
                <Title level={4}>First Time Bonuses</Title>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => router.push(`/admin/lootboxes/${id}/edit?tab=firsttime`)}
                >
                  Manage First Time Bonuses
                </Button>
              </Col>
            </Row>

            {rewardTables?.filter(t => t.first_time_bonus).length > 0 ? (
              <Table
                dataSource={rewardTables?.filter(t => t.first_time_bonus)}
                rowKey="id"
                pagination={false}
                columns={[
                  {
                    title: 'Reward Table',
                    dataIndex: 'name',
                    key: 'name',
                  },
                  {
                    title: 'Status',
                    key: 'status',
                    render: (_, record) => (
                      <Badge 
                        status={record.first_time_bonus.enabled ? 'success' : 'default'} 
                        text={record.first_time_bonus.enabled ? 'Enabled' : 'Disabled'} 
                      />
                    ),
                  },
                  {
                    title: 'Multiplier',
                    key: 'multiplier',
                    render: (_, record) => (
                      <Tag color="green">{record.first_time_bonus.multiplier}x</Tag>
                    ),
                  },
                  {
                    title: 'Rewards',
                    key: 'rewards',
                    render: (_, record) => (
                      <Tag color="blue">{record.first_time_bonus.rewards?.length || 0} rewards</Tag>
                    ),
                  },
                ]}
              />
            ) : (
              <Empty description="No first time bonuses configured" />
            )}
          </Card>
        </TabPane>

        <TabPane tab="Analytics" key="analytics">
          <Card>
            <Title level={4}>Analytics</Title>
            <Text type="secondary">Analytics and statistics will be displayed here</Text>
            
            <Row gutter={16} style={{ marginTop: 24 }}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Total Opens"
                    value={0}
                    prefix={<EyeOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Unique Openers"
                    value={0}
                    prefix={<GiftOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Rarest Drop"
                    value="N/A"
                    prefix={<StarOutlined />}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
}
