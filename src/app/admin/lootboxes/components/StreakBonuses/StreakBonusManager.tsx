// app/admin/lootboxes/components/StreakBonuses/StreakBonusManager.tsx
'use client';

import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  message,
  Popconfirm,
  Tooltip,
  Typography,
  Row,
  Col,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lootBoxService } from '../../services/lootbox.service';
import { RARITIES, STREAK_TYPES } from '../../constants/lootbox.constants';

const { Title, Text } = Typography;
const { Option } = Select;

interface StreakBonusManagerProps {
  lootBoxId: string;
}

export default function StreakBonusManager({ lootBoxId }: StreakBonusManagerProps) {
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [viewingStreak, setViewingStreak] = useState(false);

  const { data: rewardTables } = useQuery({
    queryKey: ['rewardTables', lootBoxId],
    queryFn: () => lootBoxService.getRewardTables(lootBoxId),
  });

  const tablesWithStreak = rewardTables?.filter((table: any) => table.streak_bonus) || [];

  const columns = [
    {
      title: 'Table Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
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
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: 'Streak Bonus',
      key: 'streak',
      render: (_: any, record: any) => {
        const bonus = record.streak_bonus;
        if (!bonus) return <Tag color="default">Not Configured</Tag>;
        return (
          <Space>
            <Tag color={bonus.enabled ? 'success' : 'default'}>
              {bonus.enabled ? 'Enabled' : 'Disabled'}
            </Tag>
            <Tag color="geekblue">{bonus.streak_type}</Tag>
            <Tag color="purple">{bonus.tiers?.length || 0} Tiers</Tag>
          </Space>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: any) => (
        <Button
          type="primary"
          onClick={() => {
            setSelectedTable(record);
            setViewingStreak(true);
          }}
        >
          Configure Streak
        </Button>
      ),
    },
  ];

  if (viewingStreak && selectedTable) {
    return (
      <StreakBonusConfig
        rewardTable={selectedTable}
        onBack={() => setViewingStreak(false)}
      />
    );
  }

  return (
    <Card>
      <Title level={4}>Streak Bonuses</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Configure streak bonuses for reward tables
      </Text>

      <Table
        columns={columns}
        dataSource={rewardTables}
        rowKey="id"
        pagination={false}
      />
    </Card>
  );
}

function StreakBonusConfig({ rewardTable, onBack }: any) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTier, setEditingTier] = useState<any>(null);
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [viewingItems, setViewingItems] = useState(false);
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const streakBonus = rewardTable.streak_bonus;

  const updateMutation = useMutation({
    mutationFn: (data: any) => 
      lootBoxService.updateStreakBonus(rewardTable.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardTables'] });
      message.success('Streak bonus updated successfully');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update streak bonus');
    },
  });

  const handleSaveSettings = (values: any) => {
    updateMutation.mutate({
      ...streakBonus,
      enabled: values.enabled,
      streak_type: values.streak_type,
    });
  };

  const handleAddTier = () => {
    setEditingTier(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditTier = (tier: any) => {
    setEditingTier(tier);
    form.setFieldsValue({
      streak_count: tier.streak_count,
      multiplier: tier.multiplier,
      guaranteed_rarity: tier.guaranteed_rarity,
    });
    setIsModalVisible(true);
  };

  const handleSaveTier = async (values: any) => {
    const currentTiers = streakBonus?.tiers || [];
    let newTiers;

    if (editingTier) {
      newTiers = currentTiers.map((t: any) =>
        t.id === editingTier.id ? { ...t, ...values } : t
      );
    } else {
      newTiers = [...currentTiers, { ...values, id: `temp_${Date.now()}` }];
    }

    await updateMutation.mutateAsync({
      ...streakBonus,
      tiers: newTiers,
    });

    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDeleteTier = async (tierId: string) => {
    const newTiers = (streakBonus?.tiers || []).filter((t: any) => t.id !== tierId);
    await updateMutation.mutateAsync({
      ...streakBonus,
      tiers: newTiers,
    });
  };

  const columns = [
    {
      title: 'Streak Count',
      dataIndex: 'streak_count',
      key: 'streak_count',
      render: (count: number) => <Tag color="blue">{count} streaks</Tag>,
    },
    {
      title: 'Multiplier',
      dataIndex: 'multiplier',
      key: 'multiplier',
      render: (mult: number) => <Tag color="green">{mult}x</Tag>,
    },
    {
      title: 'Guaranteed Rarity',
      dataIndex: 'guaranteed_rarity',
      key: 'guaranteed_rarity',
      render: (rarity: string) => {
        if (!rarity) return '-';
        const rarityInfo = RARITIES.find(r => r.value === rarity);
        return <Tag color={rarityInfo?.color}>{rarityInfo?.label}</Tag>;
      },
    },
    {
      title: 'Items',
      key: 'items',
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => {
          setSelectedTier(record);
          setViewingItems(true);
        }}>
          {record.items?.length || 0} Items
        </Button>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditTier(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete streak tier"
            onConfirm={() => handleDeleteTier(record.id)}
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

  if (viewingItems && selectedTier) {
    return (
      <StreakItemManager
        tier={selectedTier}
        streakBonus={streakBonus}
        onBack={() => setViewingItems(false)}
        onUpdate={updateMutation.mutateAsync}
      />
    );
  }

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
              Back to Tables
            </Button>
            <Title level={5} style={{ margin: 0 }}>
              Streak Bonus - {rewardTable.name}
            </Title>
          </Space>
        </Col>
      </Row>

      <Form
        layout="inline"
        initialValues={{
          enabled: streakBonus?.enabled || false,
          streak_type: streakBonus?.streak_type || 'consecutive',
        }}
        onFinish={handleSaveSettings}
        style={{ marginBottom: 24 }}
      >
        <Form.Item name="enabled" valuePropName="checked">
          <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
        </Form.Item>
        <Form.Item name="streak_type" label="Streak Type">
          <Select style={{ width: 150 }}>
            {STREAK_TYPES.map(type => (
              <Option key={type.value} value={type.value}>
                {type.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={updateMutation.isPending}
          >
            Save Settings
          </Button>
        </Form.Item>
      </Form>

      <Divider />

      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={5}>Streak Tiers</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddTier}
          >
            Add Tier
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={streakBonus?.tiers}
        rowKey="id"
        pagination={false}
        size="small"
      />

      <Modal
        title={editingTier ? 'Edit Streak Tier' : 'Add Streak Tier'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingTier(null);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveTier}
          initialValues={{ multiplier: 1.0 }}
        >
          <Form.Item
            name="streak_count"
            label="Streak Count"
            rules={[{ required: true, type: 'number', min: 1 }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>

          <Form.Item
            name="multiplier"
            label="Multiplier"
            rules={[{ required: true, type: 'number', min: 1 }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              step={0.1}
              formatter={value => `${value}x`}
              parser={value => value?.replace('x', '') as any}
            />
          </Form.Item>

          <Form.Item name="guaranteed_rarity" label="Guaranteed Rarity (Optional)">
            <Select allowClear>
              {RARITIES.map(rarity => (
                <Option key={rarity.value} value={rarity.value}>
                  <Space>
                    <span style={{
                      display: 'inline-block',
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: rarity.color
                    }} />
                    {rarity.label}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Divider />

          <Row justify="end">
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingTier ? 'Update' : 'Add'}
              </Button>
            </Space>
          </Row>
        </Form>
      </Modal>
    </Card>
  );
}

function StreakItemManager({ tier, streakBonus, onBack, onUpdate }: any) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();

  const handleAddItem = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    form.setFieldsValue({
      reward_item_id: item.reward_item_id,
      weight: item.weight,
    });
    setIsModalVisible(true);
  };

  const handleSaveItem = async (values: any) => {
    const currentItems = tier.items || [];
    let newItems;

    if (editingItem) {
      newItems = currentItems.map((i: any) =>
        i.id === editingItem.id ? { ...i, ...values } : i
      );
    } else {
      newItems = [...currentItems, { ...values, id: `temp_${Date.now()}` }];
    }

    const updatedTiers = streakBonus.tiers.map((t: any) =>
      t.id === tier.id ? { ...t, items: newItems } : t
    );

    await onUpdate({
      ...streakBonus,
      tiers: updatedTiers,
    });

    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDeleteItem = async (itemId: string) => {
    const newItems = (tier.items || []).filter((i: any) => i.id !== itemId);
    const updatedTiers = streakBonus.tiers.map((t: any) =>
      t.id === tier.id ? { ...t, items: newItems } : t
    );

    await onUpdate({
      ...streakBonus,
      tiers: updatedTiers,
    });
  };

  const columns = [
    {
      title: 'Reward Item ID',
      dataIndex: 'reward_item_id',
      key: 'reward_item_id',
    },
    {
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
      render: (weight: number) => <Tag color="purple">{weight}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditItem(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete item"
            onConfirm={() => handleDeleteItem(record.id)}
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

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
              Back to Tiers
            </Button>
            <Title level={5} style={{ margin: 0 }}>
              Streak Items - Tier {tier.streak_count}
            </Title>
          </Space>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddItem}
          >
            Add Item
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={tier.items || []}
        rowKey="id"
        pagination={false}
        size="small"
      />

      <Modal
        title={editingItem ? 'Edit Streak Item' : 'Add Streak Item'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingItem(null);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveItem}
          initialValues={{ weight: 100 }}
        >
          <Form.Item
            name="reward_item_id"
            label="Reward Item ID"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter reward item ID" />
          </Form.Item>

          <Form.Item
            name="weight"
            label="Weight"
            rules={[{ required: true, type: 'number', min: 1 }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>

          <Divider />

          <Row justify="end">
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingItem ? 'Update' : 'Add'}
              </Button>
            </Space>
          </Row>
        </Form>
      </Modal>
    </Card>
  );
}
