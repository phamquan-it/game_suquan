// app/admin/lootboxes/components/RewardTables/RewardTableManager.tsx
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
  Tabs,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  SettingOutlined,
  GiftOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lootBoxService } from '../../services/lootbox.service';
import RewardPoolManager from './RewardPoolManager';
import { DISTRIBUTION_TYPES } from '../../constants/lootbox.constants';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface RewardTableManagerProps {
  lootBoxId: string;
}

export default function RewardTableManager({ lootBoxId }: RewardTableManagerProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTable, setEditingTable] = useState<any>(null);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('tables');
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { data: rewardTables, isLoading } = useQuery({
    queryKey: ['rewardTables', lootBoxId],
    queryFn: () => lootBoxService.getRewardTables(lootBoxId),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => lootBoxService.createRewardTable(lootBoxId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardTables', lootBoxId] });
      message.success('Reward table created successfully');
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to create reward table');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      lootBoxService.updateRewardTable(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardTables', lootBoxId] });
      message.success('Reward table updated successfully');
      setIsModalVisible(false);
      setEditingTable(null);
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update reward table');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => lootBoxService.deleteRewardTable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardTables', lootBoxId] });
      message.success('Reward table deleted successfully');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to delete reward table');
    },
  });

  const handleEdit = (record: any) => {
    setEditingTable(record);
    form.setFieldsValue({
      name: record.name,
      distribution_type: record.distribution_type,
      anti_duplicate: record.anti_duplicate,
      duplicate_protection: record.duplicate_protection,
    });
    setIsModalVisible(true);
  };

  const handleDuplicate = (record: any) => {
    form.setFieldsValue({
      name: `${record.name} (Copy)`,
      distribution_type: record.distribution_type,
      anti_duplicate: record.anti_duplicate,
      duplicate_protection: record.duplicate_protection,
    });
    setIsModalVisible(true);
  };

  const handleViewPools = (record: any) => {
    setSelectedTable(record);
    setActiveTab('pools');
  };

  const handleSubmit = async (values: any) => {
    if (editingTable) {
      await updateMutation.mutateAsync({ id: editingTable.id, data: values });
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
      title: 'Distribution Type',
      dataIndex: 'distribution_type',
      key: 'distribution_type',
      render: (type: string) => {
        const distType = DISTRIBUTION_TYPES.find(d => d.value === type);
        return <Tag color="blue">{distType?.label || type}</Tag>;
      },
    },
    {
      title: 'Anti-Duplicate',
      dataIndex: 'anti_duplicate',
      key: 'anti_duplicate',
      render: (value: boolean) => (
        <Tag color={value ? 'success' : 'default'}>
          {value ? 'Enabled' : 'Disabled'}
        </Tag>
      ),
    },
    {
      title: 'Duplicate Protection',
      dataIndex: 'duplicate_protection',
      key: 'duplicate_protection',
      render: (value: number) => value ? `${value}%` : '-',
    },
    {
      title: 'Pools',
      key: 'pools',
      render: (_: any, record: any) => (
        <Tag color="geekblue">{record.pools?.length || 0} Pools</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Manage Pools">
            <Button
              type="text"
              icon={<GiftOutlined />}
              onClick={() => handleViewPools(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Duplicate">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => handleDuplicate(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete reward table"
            description="Are you sure? This will delete all associated pools and items."
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
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Reward Tables" key="tables">
          <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Col>
              <Title level={4}>Reward Tables</Title>
              <Text type="secondary">Manage different reward distribution tables for this loot box</Text>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingTable(null);
                  form.resetFields();
                  setIsModalVisible(true);
                }}
              >
                Create Reward Table
              </Button>
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={rewardTables}
            loading={isLoading}
            rowKey="id"
            pagination={false}
          />
        </TabPane>

        {selectedTable && (
          <TabPane tab={`Pools - ${selectedTable.name}`} key="pools">
            <Button
              style={{ marginBottom: 16 }}
              onClick={() => setActiveTab('tables')}
            >
              Back to Tables
            </Button>
            <RewardPoolManager rewardTableId={selectedTable.id} />
          </TabPane>
        )}
      </Tabs>

      <Modal
        title={editingTable ? 'Edit Reward Table' : 'Create Reward Table'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingTable(null);
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
            anti_duplicate: false,
            duplicate_protection: 0,
          }}
        >
          <Form.Item
            name="name"
            label="Table Name"
            rules={[{ required: true, message: 'Please enter table name' }]}
          >
            <Input placeholder="e.g., Main Reward Table" />
          </Form.Item>

          <Form.Item
            name="distribution_type"
            label="Distribution Type"
            rules={[{ required: true }]}
          >
            <Select>
              {DISTRIBUTION_TYPES.map(type => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="anti_duplicate" label="Anti-Duplicate Protection" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.anti_duplicate !== currentValues.anti_duplicate
            }
          >
            {({ getFieldValue }) =>
              getFieldValue('anti_duplicate') && (
                <Form.Item
                  name="duplicate_protection"
                  label="Duplicate Protection %"
                  rules={[{ required: true, type: 'number', min: 0, max: 100 }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value?.replace('%', '') as any}
                  />
                </Form.Item>
              )
            }
          </Form.Item>

          <Divider />

          <Row justify="end">
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={createMutation.isPending || updateMutation.isPending}>
                {editingTable ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Row>
        </Form>
      </Modal>
    </Card>
  );
}
