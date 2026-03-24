// app/admin/lootboxes/components/PitySystem/PitySystemManager.tsx
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
import { RARITIES } from '../../constants/lootbox.constants';

const { Title, Text } = Typography;
const { Option } = Select;

interface PitySystemManagerProps {
  lootBoxId: string;
}

export default function PitySystemManager({ lootBoxId }: PitySystemManagerProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCounter, setEditingCounter] = useState<any>(null);
  const [selectedCounter, setSelectedCounter] = useState<any>(null);
  const [viewingItems, setViewingItems] = useState(false);
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { data: pitySystem, isLoading } = useQuery({
    queryKey: ['pitySystem', lootBoxId],
    queryFn: () => lootBoxService.getPitySystem(lootBoxId),
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => lootBoxService.updatePitySystem(lootBoxId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pitySystem', lootBoxId] });
      message.success('Pity system updated successfully');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update pity system');
    },
  });

  const handleSaveSettings = (values: any) => {
    updateMutation.mutate({
      ...pitySystem,
      enabled: values.enabled,
      reset_on_rare_drop: values.reset_on_rare_drop,
    });
  };

  const handleAddCounter = () => {
    setEditingCounter(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditCounter = (record: any) => {
    setEditingCounter(record);
    form.setFieldsValue({
      rarity: record.rarity,
      threshold: record.threshold,
    });
    setIsModalVisible(true);
  };

  const handleSaveCounter = async (values: any) => {
    const currentCounters = pitySystem?.counters || [];
    let newCounters;

    if (editingCounter) {
      newCounters = currentCounters.map((c: any) =>
        c.id === editingCounter.id ? { ...c, ...values } : c
      );
    } else {
      newCounters = [...currentCounters, { ...values, id: `temp_${Date.now()}` }];
    }

    await updateMutation.mutateAsync({
      ...pitySystem,
      counters: newCounters,
    });

    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDeleteCounter = async (counterId: string) => {
    const newCounters = (pitySystem?.counters || []).filter((c: any) => c.id !== counterId);
    await updateMutation.mutateAsync({
      ...pitySystem,
      counters: newCounters,
    });
  };

  const columns = [
    {
      title: 'Rarity',
      dataIndex: 'rarity',
      key: 'rarity',
      render: (rarity: string) => {
        const rarityInfo = RARITIES.find(r => r.value === rarity);
        return (
          <Tag color={rarityInfo?.color}>
            {rarityInfo?.label || rarity}
          </Tag>
        );
      },
    },
    {
      title: 'Threshold',
      dataIndex: 'threshold',
      key: 'threshold',
      render: (threshold: number) => <Text strong>{threshold} opens</Text>,
    },
    {
      title: 'Items',
      key: 'items',
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => {
          setSelectedCounter(record);
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
              onClick={() => handleEditCounter(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete pity counter"
            description="Are you sure?"
            onConfirm={() => handleDeleteCounter(record.id)}
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

  if (viewingItems && selectedCounter) {
    return (
      <PityItemManager
        counter={selectedCounter}
        pitySystem={pitySystem}
        onBack={() => setViewingItems(false)}
        onUpdate={updateMutation.mutateAsync}
      />
    );
  }

  return (
    <Card>
      <Title level={4}>Pity System Configuration</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Configure pity counters that guarantee rare drops after a certain number of opens
      </Text>

      <Form
        layout="inline"
        initialValues={{
          enabled: pitySystem?.enabled || false,
          reset_on_rare_drop: pitySystem?.reset_on_rare_drop !== false,
        }}
        onFinish={handleSaveSettings}
        style={{ marginBottom: 24 }}
      >
        <Form.Item name="enabled" valuePropName="checked">
          <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
        </Form.Item>
        <Form.Item name="reset_on_rare_drop" valuePropName="checked">
          <Switch checkedChildren="Reset on Rare" unCheckedChildren="No Reset" />
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
          <Title level={5}>Pity Counters</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddCounter}
          >
            Add Counter
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={pitySystem?.counters}
        loading={isLoading}
        rowKey="id"
        pagination={false}
      />

      <Modal
        title={editingCounter ? 'Edit Pity Counter' : 'Add Pity Counter'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingCounter(null);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveCounter}
        >
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

          <Form.Item
            name="threshold"
            label="Threshold (opens)"
            rules={[{ required: true, type: 'number', min: 1 }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>

          <Divider />

          <Row justify="end">
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingCounter ? 'Update' : 'Add'}
              </Button>
            </Space>
          </Row>
        </Form>
      </Modal>
    </Card>
  );
}

// PityItemManager Component
function PityItemManager({ counter, pitySystem, onBack, onUpdate }: any) {
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
    const currentItems = counter.items || [];
    let newItems;

    if (editingItem) {
      newItems = currentItems.map((i: any) =>
        i.id === editingItem.id ? { ...i, ...values } : i
      );
    } else {
      newItems = [...currentItems, { ...values, id: `temp_${Date.now()}` }];
    }

    const updatedCounters = pitySystem.counters.map((c: any) =>
      c.id === counter.id ? { ...c, items: newItems } : c
    );

    await onUpdate({
      ...pitySystem,
      counters: updatedCounters,
    });

    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDeleteItem = async (itemId: string) => {
    const newItems = (counter.items || []).filter((i: any) => i.id !== itemId);
    const updatedCounters = pitySystem.counters.map((c: any) =>
      c.id === counter.id ? { ...c, items: newItems } : c
    );

    await onUpdate({
      ...pitySystem,
      counters: updatedCounters,
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
              Back to Counters
            </Button>
            <Title level={5} style={{ margin: 0 }}>
              Pity Items - {counter.rarity}
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
        dataSource={counter.items || []}
        rowKey="id"
        pagination={false}
        size="small"
      />

      <Modal
        title={editingItem ? 'Edit Pity Item' : 'Add Pity Item'}
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
