// app/admin/lootboxes/components/RewardTables/RewardPoolManager.tsx
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
  InputNumber,
  Switch,
  message,
  Popconfirm,
  Tooltip,
  Typography,
  Row,
  Col,
  Divider,
  Select,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lootBoxService } from '../../services/lootbox.service';
import RewardItemManager from './RewardItemManager';
import { supabase } from '@/utils/supabase/client';

const { Title, Text } = Typography;
const { Option } = Select;

interface RewardPoolManagerProps {
  rewardTableId: string;
}

export default function RewardPoolManager({ rewardTableId }: RewardPoolManagerProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPool, setEditingPool] = useState<any>(null);
  const [selectedPool, setSelectedPool] = useState<any>(null);
  const [viewingItems, setViewingItems] = useState(false);
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { data: rewardTables } = useQuery({
    queryKey: ['rewardTables'],
    enabled: false,
  });

  const currentTable = Array.isArray(rewardTables) 
    ? rewardTables.find((t: any) => t.id === rewardTableId)
    : null;

  const pools = currentTable?.pools || [];

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: pool, error } = await supabase
        .from('loot_box_reward_pools')
        .insert([{
          reward_table_id: rewardTableId,
          ...data
        }])
        .select()
        .single();

      if (error) throw error;
      return pool;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardTables'] });
      message.success('Reward pool created successfully');
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to create reward pool');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: pool, error } = await supabase
        .from('loot_box_reward_pools')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return pool;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardTables'] });
      message.success('Reward pool updated successfully');
      setIsModalVisible(false);
      setEditingPool(null);
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update reward pool');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('loot_box_reward_pools')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardTables'] });
      message.success('Reward pool deleted successfully');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to delete reward pool');
    },
  });

  const handleEdit = (record: any) => {
    setEditingPool(record);
    form.setFieldsValue({
      name: record.name,
      weight: record.weight,
      min_drops: record.min_drops,
      max_drops: record.max_drops,
      guaranteed: record.guaranteed,
    });
    setIsModalVisible(true);
  };

  const handleViewItems = (record: any) => {
    setSelectedPool(record);
    setViewingItems(true);
  };

  const handleSubmit = async (values: any) => {
    if (editingPool) {
      await updateMutation.mutateAsync({ id: editingPool.id, data: values });
    } else {
      await createMutation.mutateAsync(values);
    }
  };

  const columns = [
    {
      title: 'Name',
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
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
      render: (weight: number) => <Tag color="purple">{weight}</Tag>,
    },
    {
      title: 'Drops',
      key: 'drops',
      render: (_: any, record: any) => (
        <Text>
          {record.min_drops} - {record.max_drops}
        </Text>
      ),
    },
    {
      title: 'Guaranteed',
      dataIndex: 'guaranteed',
      key: 'guaranteed',
      render: (value: boolean) => (
        <Tag color={value ? 'success' : 'default'}>
          {value ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Items',
      key: 'items',
      render: (_: any, record: any) => (
        <Button 
          type="link" 
          icon={<GiftOutlined />}
          onClick={() => handleViewItems(record)}
        >
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
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete reward pool"
            description="Are you sure? This will delete all associated items."
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

  if (viewingItems && selectedPool) {
    return (
      <RewardItemManager
        rewardPoolId={selectedPool.id}
        onBack={() => setViewingItems(false)}
      />
    );
  }

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={5}>Reward Pools</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingPool(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Add Pool
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={pools}
        rowKey="id"
        pagination={false}
        size="small"
      />

      <Modal
        title={editingPool ? 'Edit Reward Pool' : 'Create Reward Pool'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingPool(null);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            weight: 100,
            min_drops: 1,
            max_drops: 1,
            guaranteed: false,
          }}
        >
          <Form.Item
            name="name"
            label="Pool Name"
            rules={[{ required: true, message: 'Please enter pool name' }]}
          >
            <Input placeholder="e.g., Common Items Pool" />
          </Form.Item>

          <Form.Item
            name="weight"
            label="Weight"
            rules={[{ required: true, type: 'number', min: 1 }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="min_drops"
                label="Min Drops"
                rules={[{ required: true, type: 'number', min: 1 }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="max_drops"
                label="Max Drops"
                rules={[
                  { required: true, type: 'number', min: 1 },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('min_drops') <= value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Max drops must be >= min drops'));
                    },
                  }),
                ]}
              >
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="guaranteed" label="Guaranteed Drop" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Divider />

          <Row justify="end">
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={createMutation.isPending || updateMutation.isPending}>
                {editingPool ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
