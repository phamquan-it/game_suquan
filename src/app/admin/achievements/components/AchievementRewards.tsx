// app/admin/achievements/components/AchievementRewards.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Form,
  InputNumber,
  Select,
  Popconfirm,
  message,
  Card,
  Typography,
  Divider,
  Tag,
  Modal,
  Radio,
  Tooltip,
  Progress,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  GiftOutlined,
  GoldOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { AchievementReward } from '../types';
import { supabase } from '@/utils/supabase/client';

const { Text } = Typography;
const { Option } = Select;

interface AchievementRewardsProps {
  achievementId?: string;
  currencies: any[];
  readOnly?: boolean;
}

interface RewardFormData {
  reward_type: 'item' | 'currency';
  item_id?: string;
  currency_type?: string;
  quantity: number;
  probability: number;
}

export const AchievementRewards: React.FC<AchievementRewardsProps> = ({
  achievementId,
  currencies,
  readOnly = false,
}) => {
  const [rewards, setRewards] = useState<AchievementReward[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingReward, setEditingReward] = useState<AchievementReward | null>(null);
  const [rewardType, setRewardType] = useState<'item' | 'currency'>('item');
  const [form] = Form.useForm();

  useEffect(() => {
    if (achievementId) {
      fetchRewards();
    }
  }, [achievementId]);

  const fetchRewards = async () => {
    if (!achievementId) return;

    try {
      setLoading(true);
      
      // Fetch rewards with related data
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('achievement_rewards')
        .select(`
          *,
          item:item_id (
            id,
            name,
            rarity
          ),
          currency:currency_type (
            currency_type,
            name,
            icon
          )
        `)
        .eq('requirement_id', null); // For achievement-level rewards

      if (rewardsError) throw rewardsError;
      setRewards(rewardsData || []);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      message.error('Failed to load rewards');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: RewardFormData) => {
    if (!achievementId) {
      message.warning('Please save the achievement first before adding rewards');
      return;
    }

    try {
      const rewardData: any = {
        quantity: values.quantity,
        probability: values.probability,
      };

      if (values.reward_type === 'item') {
        rewardData.item_id = values.item_id;
        rewardData.currency_type = null;
      } else {
        rewardData.currency_type = values.currency_type;
        rewardData.item_id = null;
      }

      let error;
      if (editingReward) {
        // Update existing reward
        const { error: updateError } = await supabase
          .from('achievement_rewards')
          .update(rewardData)
          .eq('id', editingReward.id);
        error = updateError;
      } else {
        // Create new reward
        const { error: insertError } = await supabase
          .from('achievement_rewards')
          .insert([{
            ...rewardData,
            requirement_id: null, // Achievement-level reward
          }]);
        error = insertError;
      }

      if (error) throw error;

      message.success(`Reward ${editingReward ? 'updated' : 'added'} successfully`);
      setModalVisible(false);
      form.resetFields();
      setEditingReward(null);
      fetchRewards();
    } catch (error) {
      console.error('Error saving reward:', error);
      message.error('Failed to save reward');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('achievement_rewards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      message.success('Reward deleted successfully');
      fetchRewards();
    } catch (error) {
      console.error('Error deleting reward:', error);
      message.error('Failed to delete reward');
    }
  };

  const getRewardIcon = (record: AchievementReward) => {
    if (record.item_id) {
      return <GiftOutlined className="text-purple-600" />;
    }
    if (record.currency_type) {
      return <GoldOutlined className="text-yellow-600" />;
    }
    return null;
  };

  const getRewardName = (record: AchievementReward) => {
    if (record.item_id) {
      return (record as any).item?.name || record.item_id;
    }
    if (record.currency_type) {
      const currency = currencies.find(c => c.currency_type === record.currency_type);
      return currency?.name || record.currency_type;
    }
    return 'Unknown';
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'item_id',
      key: 'type',
      width: 100,
      render: (_: any, record: AchievementReward) => (
        <Space>
          {getRewardIcon(record)}
          <Tag color={record.item_id ? 'purple' : 'gold'}>
            {record.item_id ? 'Item' : 'Currency'}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Reward',
      key: 'name',
      render: (_: any, record: AchievementReward) => (
        <Space direction="vertical" size={0}>
          <Text strong>{getRewardName(record)}</Text>
          {record.item_id && (record as any).item?.rarity && (
            <Tag color="blue" >
              {(record as any).item.rarity}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'right' as const,
      render: (quantity: number) => (
        <Text strong className="text-green-600">
          x{quantity.toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Probability',
      dataIndex: 'probability',
      key: 'probability',
      width: 150,
      render: (probability: number) => (
        <Space direction="vertical" size={0} className="w-full">
          <Text>{(probability * 100).toFixed(2)}%</Text>
          <Progress
            percent={probability * 100}
            size="small"
            showInfo={false}
            strokeColor={probability >= 1 ? '#52c41a' : '#faad14'}
          />
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: AchievementReward) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingReward(record);
                setRewardType(record.item_id ? 'item' : 'currency');
                form.setFieldsValue({
                  reward_type: record.item_id ? 'item' : 'currency',
                  item_id: record.item_id,
                  currency_type: record.currency_type,
                  quantity: record.quantity,
                  probability: record.probability,
                });
                setModalVisible(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Delete reward"
            description="Are you sure you want to delete this reward?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Mock items data - replace with actual items from your database
  const mockItems = [
    { id: 'item_1', name: 'Legendary Sword', rarity: 'legendary' },
    { id: 'item_2', name: 'Health Potion', rarity: 'common' },
    { id: 'item_3', name: 'Dragon Armor', rarity: 'epic' },
    { id: 'item_4', name: 'Mystic Amulet', rarity: 'rare' },
  ];

  return (
    <Card className="bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <Text strong className="text-lg">
          Completion Rewards ({rewards.length})
        </Text>
        {!readOnly && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingReward(null);
              form.resetFields();
              setRewardType('item');
              setModalVisible(true);
            }}
            disabled={!achievementId}
          >
            Add Reward
          </Button>
        )}
      </div>

      {!achievementId && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
          <Text type="warning">
            Please save the achievement first to add rewards
          </Text>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={rewards}
        loading={loading}
        rowKey="id"
        pagination={false}
        size="small"
        locale={{ emptyText: 'No rewards added yet' }}
      />

      <Modal
        title={editingReward ? 'Edit Reward' : 'Add Reward'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingReward(null);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            reward_type: 'item',
            quantity: 1,
            probability: 1.0,
          }}
        >
          <Form.Item
            name="reward_type"
            label="Reward Type"
            rules={[{ required: true }]}
          >
            <Radio.Group
              onChange={(e) => setRewardType(e.target.value)}
              className="w-full"
            >
              <Radio.Button value="item" className="w-1/2 text-center">
                <GiftOutlined /> Item
              </Radio.Button>
              <Radio.Button value="currency" className="w-1/2 text-center">
                <GoldOutlined /> Currency
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          {rewardType === 'item' ? (
            <Form.Item
              name="item_id"
              label="Item"
              rules={[{ required: true, message: 'Please select an item' }]}
            >
              <Select
                placeholder="Select item"
                showSearch
                optionFilterProp="children"
              >
                {mockItems.map(item => (
                  <Option key={item.id} value={item.id}>
                    <Space>
                      <span>{item.name}</span>
                      <Tag color="blue" >
                        {item.rarity}
                      </Tag>
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          ) : (
            <Form.Item
              name="currency_type"
              label="Currency"
              rules={[{ required: true, message: 'Please select currency' }]}
            >
              <Select placeholder="Select currency">
                {currencies.map(currency => (
                  <Option key={currency.currency_type} value={currency.currency_type}>
                    <Space>
                      {currency.icon && <span>{currency.icon}</span>}
                      <span>{currency.name}</span>
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <InputNumber
              min={1}
              className="w-full"
              placeholder="Enter quantity"
            />
          </Form.Item>

          <Form.Item
            name="probability"
            label="Drop Probability"
            rules={[
              { required: true, message: 'Please enter probability' },
              {
                validator: (_, value) => {
                  if (value >= 0 && value <= 1) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Probability must be between 0 and 1'));
                },
              },
            ]}
          >
            <InputNumber
              min={0}
              max={1}
              step={0.01}
              className="w-full"
              placeholder="Enter probability (0-1)"
            />
          </Form.Item>

          <Divider />

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button
                onClick={() => {
                  setModalVisible(false);
                  setEditingReward(null);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                {editingReward ? 'Update' : 'Add'} Reward
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
