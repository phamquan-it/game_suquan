// app/admin/lootboxes/components/GuaranteedDrops/GuaranteedDropManager.tsx
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
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lootBoxService } from '../../services/lootbox.service';

const { Title, Text } = Typography;
const { Option } = Select;

interface GuaranteedDropManagerProps {
  lootBoxId: string;
}

export default function GuaranteedDropManager({ lootBoxId }: GuaranteedDropManagerProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDrop, setEditingDrop] = useState<any>(null);
  const [selectedDrop, setSelectedDrop] = useState<any>(null);
  const [viewingRewards, setViewingRewards] = useState(false);
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { data: guaranteedDrops, isLoading } = useQuery({
    queryKey: ['guaranteedDrops', lootBoxId],
    queryFn: () => lootBoxService.getGuaranteedDrops(lootBoxId),
  });

  const { data: rewardItems } = useQuery({
    queryKey: ['rewardItems', lootBoxId],
    queryFn: () => lootBoxService.getRewardItems(lootBoxId),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => lootBoxService.createGuaranteedDrop(lootBoxId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guaranteedDrops', lootBoxId] });
      message.success('Guaranteed drop created successfully');
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to create guaranteed drop');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      lootBoxService.updateGuaranteedDrop(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guaranteedDrops', lootBoxId] });
      message.success('Guaranteed drop updated successfully');
      setIsModalVisible(false);
      setEditingDrop(null);
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update guaranteed drop');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => lootBoxService.deleteGuaranteedDrop(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guaranteedDrops', lootBoxId] });
      message.success('Guaranteed drop deleted successfully');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to delete guaranteed drop');
    },
  });

  const handleEdit = (record: any) => {
    setEditingDrop(record);
    form.setFieldsValue({
      open_count: record.open_count,
      reset_after_claim: record.reset_after_claim,
      rewards: record.rewards?.map((r: any) => r.reward_item_id) || [],
    });
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    if (editingDrop) {
      await updateMutation.mutateAsync({ id: editingDrop.id, data: values });
    } else {
      await createMutation.mutateAsync(values);
    }
  };

  const columns = [
    {
      title: 'Open Count',
      dataIndex: 'open_count',
      key: 'open_count',
      render: (count: number) => <Tag color="gold">Every {count} opens</Tag>,
    },
    {
      title: 'Reset After Claim',
      dataIndex: 'reset_after_claim',
      key: 'reset_after_claim',
      render: (value: boolean) => (
        <Tag color={value ? 'success' : 'default'}>
          {value ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Rewards',
      key: 'rewards',
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => {
          setSelectedDrop(record);
          setViewingRewards(true);
        }}>
          {record.rewards?.length || 0} Rewards
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
            title="Delete guaranteed drop"
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
          <Title level={4}>Guaranteed Drops</Title>
          <Text type="secondary">
            Configure drops that are guaranteed after a certain number of opens
          </Text>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingDrop(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Add Guaranteed Drop
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={guaranteedDrops}
        loading={isLoading}
        rowKey="id"
        pagination={false}
      />

      <Modal
        title={editingDrop ? 'Edit Guaranteed Drop' : 'Add Guaranteed Drop'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingDrop(null);
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
            reset_after_claim: true,
          }}
        >
          <Form.Item
            name="open_count"
            label="Open Count"
            rules={[{ required: true, type: 'number', min: 1 }]}
            tooltip="Number of opens required to guarantee this drop"
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>

          <Form.Item
            name="reset_after_claim"
            label="Reset After Claim"
            valuePropName="checked"
            tooltip="Whether to reset the counter after the guaranteed drop is claimed"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="rewards"
            label="Reward Items"
            rules={[{ required: true, message: 'Please select at least one reward' }]}
          >
            <Select
              mode="multiple"
              placeholder="Select reward items"
              optionFilterProp="children"
              showSearch
            >
              {rewardItems?.map((item: any) => (
                <Option key={item.id} value={item.id}>
                  {item.id} (Rarity: {item.rarity})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Divider />

          <Row justify="end">
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={createMutation.isPending || updateMutation.isPending}>
                {editingDrop ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Row>
        </Form>
      </Modal>
    </Card>
  );
}
