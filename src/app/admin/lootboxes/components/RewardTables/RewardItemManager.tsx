// app/admin/lootboxes/components/RewardTables/RewardItemManager.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  InputNumber,
  Select,
  message,
  Popconfirm,
  Tooltip,
  Typography,
  Row,
  Col,
  Divider,
  Card,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RARITIES, REWARD_TYPES, BOUND_TYPES, CURRENCY_OPTIONS } from '../../constants/lootbox.constants';
import { supabase } from '@/utils/supabase/client';

const { Title, Text } = Typography;
const { Option } = Select;

interface RewardItemManagerProps {
  rewardPoolId: string;
  onBack: () => void;
}

export default function RewardItemManager({ rewardPoolId, onBack }: RewardItemManagerProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [availableItems, setAvailableItems] = useState<any[]>([]);
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const rewardType = Form.useWatch('reward_type', form);

  useEffect(() => {
    fetchAvailableItems();
  }, []);

  const fetchAvailableItems = async () => {
    const { data } = await supabase
      .from('base_items')
      .select('id, name, type, rarity');
    setAvailableItems(data || []);
  };

  const { data: items, isLoading } = useQuery({
    queryKey: ['rewardItems', rewardPoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loot_box_reward_items')
        .select('*')
        .eq('reward_pool_id', rewardPoolId);

      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: item, error } = await supabase
        .from('loot_box_reward_items')
        .insert([{ reward_pool_id: rewardPoolId, ...data }])
        .select()
        .single();

      if (error) throw error;
      return item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardItems', rewardPoolId] });
      message.success('Reward item created successfully');
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to create reward item');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: item, error } = await supabase
        .from('loot_box_reward_items')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardItems', rewardPoolId] });
      message.success('Reward item updated successfully');
      setIsModalVisible(false);
      setEditingItem(null);
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update reward item');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('loot_box_reward_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardItems', rewardPoolId] });
      message.success('Reward item deleted successfully');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to delete reward item');
    },
  });

  const handleEdit = (record: any) => {
    setEditingItem(record);
    form.setFieldsValue({
      reward_type: record.reward_type,
      item_id: record.item_id,
      currency_type: record.currency_type,
      amount_min: record.amount_min,
      amount_max: record.amount_max,
      weight: record.weight,
      rarity: record.rarity,
      bound_type: record.bound_type,
    });
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem.id, data: values });
    } else {
      await createMutation.mutateAsync(values);
    }
  };

  const getRarityColor = (rarity: string) => {
    const rarityInfo = RARITIES.find(r => r.value === rarity);
    return rarityInfo?.color || '#808080';
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'reward_type',
      key: 'reward_type',
      render: (type: string) => {
        const typeInfo = REWARD_TYPES.find(t => t.value === type);
        return <Tag>{typeInfo?.label || type}</Tag>;
      },
    },
    {
      title: 'Item/Currency',
      key: 'reference',
      render: (_: any, record: any) => {
        if (record.reward_type === 'item') {
          const item = availableItems.find(i => i.id === record.item_id);
          return item?.name || record.item_id;
        } else if (record.reward_type === 'currency') {
          const currency = CURRENCY_OPTIONS.find(c => c.value === record.currency_type);
          return currency?.label || record.currency_type;
        }
        return '-';
      },
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (_: any, record: any) => (
        <Text>
          {record.amount_min} - {record.amount_max}
        </Text>
      ),
    },
    {
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
      render: (weight: number) => <Tag color="purple">{weight}</Tag>,
    },
    {
      title: 'Rarity',
      dataIndex: 'rarity',
      key: 'rarity',
      render: (rarity: string) => (
        <Tag color={getRarityColor(rarity)}>
          {rarity.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Bound Type',
      dataIndex: 'bound_type',
      key: 'bound_type',
      render: (type: string) => {
        const boundInfo = BOUND_TYPES.find(b => b.value === type);
        return <Tag>{boundInfo?.label || type}</Tag>;
      },
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
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete reward item"
            description="Are you sure?"
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

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
              Back to Pools
            </Button>
            <Title level={5} style={{ margin: 0 }}>Reward Items</Title>
          </Space>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingItem(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Add Item
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={items}
        loading={isLoading}
        rowKey="id"
        pagination={false}
        size="small"
      />

      <Modal
        title={editingItem ? 'Edit Reward Item' : 'Create Reward Item'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingItem(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            weight: 100,
            amount_min: 1,
            amount_max: 1,
            bound_type: 'none',
          }}
        >
          <Form.Item
            name="reward_type"
            label="Reward Type"
            rules={[{ required: true }]}
          >
            <Select>
              {REWARD_TYPES.map(type => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {rewardType === 'item' && (
            <Form.Item
              name="item_id"
              label="Select Item"
              rules={[{ required: true, message: 'Please select an item' }]}
            >
              <Select
                showSearch
                placeholder="Search for an item"
                optionFilterProp="children"
              >
                {availableItems.map(item => (
                  <Option key={item.id} value={item.id}>
                    {item.name} ({item.rarity})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {rewardType === 'currency' && (
            <Form.Item
              name="currency_type"
              label="Currency Type"
              rules={[{ required: true }]}
            >
              <Select>
                {CURRENCY_OPTIONS.map(currency => (
                  <Option key={currency.value} value={currency.value}>
                    {currency.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="amount_min"
                label="Min Amount"
                rules={[{ required: true, type: 'number', min: 1 }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="amount_max"
                label="Max Amount"
                rules={[
                  { required: true, type: 'number', min: 1 },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('amount_min') <= value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Max amount must be >= min amount'));
                    },
                  }),
                ]}
              >
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="weight"
                label="Weight"
                rules={[{ required: true, type: 'number', min: 1 }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="rarity"
                label="Rarity"
                rules={[{ required: true }]}
              >
                <Select>
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
            </Col>
          </Row>

          <Form.Item
            name="bound_type"
            label="Bound Type"
            rules={[{ required: true }]}
          >
            <Select>
              {BOUND_TYPES.map(type => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Divider />

          <Row justify="end">
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={createMutation.isPending || updateMutation.isPending}>
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Row>
        </Form>
      </Modal>
    </Card>
  );
}
