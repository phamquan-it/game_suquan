// app/admin/lootboxes/components/FirstTimeBonuses/FirstTimeBonusManager.tsx
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
  SaveOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lootBoxService } from '../../services/lootbox.service';

const { Title, Text } = Typography;
const { Option } = Select;

interface FirstTimeBonusManagerProps {
  lootBoxId: string;
}

export default function FirstTimeBonusManager({ lootBoxId }: FirstTimeBonusManagerProps) {
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [viewingBonus, setViewingBonus] = useState(false);

  const { data: rewardTables } = useQuery({
    queryKey: ['rewardTables', lootBoxId],
    queryFn: () => lootBoxService.getRewardTables(lootBoxId),
  });

  const tablesWithBonus = rewardTables?.filter((table: any) => table.first_time_bonus) || [];

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
      title: 'First Time Bonus',
      key: 'bonus',
      render: (_: any, record: any) => {
        const bonus = record.first_time_bonus;
        if (!bonus) return <Tag color="default">Not Configured</Tag>;
        return (
          <Space>
            <Tag color={bonus.enabled ? 'success' : 'default'}>
              {bonus.enabled ? 'Enabled' : 'Disabled'}
            </Tag>
            <Tag color="green">{bonus.multiplier}x Multiplier</Tag>
            <Tag color="purple">{bonus.rewards?.length || 0} Rewards</Tag>
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
            setViewingBonus(true);
          }}
        >
          Configure Bonus
        </Button>
      ),
    },
  ];

  if (viewingBonus && selectedTable) {
    return (
      <FirstTimeBonusConfig
        rewardTable={selectedTable}
        onBack={() => setViewingBonus(false)}
      />
    );
  }

  return (
    <Card>
      <Title level={4}>First Time Bonuses</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Configure bonuses for first-time opening of this loot box
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

function FirstTimeBonusConfig({ rewardTable, onBack }: any) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const firstTimeBonus = rewardTable.first_time_bonus;

  const { data: rewardItems } = useQuery({
    queryKey: ['rewardItems'],
    queryFn: () => lootBoxService.getRewardItems(),
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => 
      lootBoxService.updateFirstTimeBonus(rewardTable.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardTables'] });
      message.success('First time bonus updated successfully');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update first time bonus');
    },
  });

  const handleSaveSettings = (values: any) => {
    updateMutation.mutate({
      ...firstTimeBonus,
      enabled: values.enabled,
      multiplier: values.multiplier,
    });
  };

  const handleSaveRewards = async (values: any) => {
    await updateMutation.mutateAsync({
      ...firstTimeBonus,
      rewards: values.rewards.map((id: string) => ({
        id: `temp_${Date.now()}_${id}`,
        first_time_bonus_id: firstTimeBonus?.id,
        reward_item_id: id,
      })),
    });
    setIsModalVisible(false);
  };

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
              Back to Tables
            </Button>
            <Title level={5} style={{ margin: 0 }}>
              First Time Bonus - {rewardTable.name}
            </Title>
          </Space>
        </Col>
      </Row>

      <Form
        layout="inline"
        initialValues={{
          enabled: firstTimeBonus?.enabled || false,
          multiplier: firstTimeBonus?.multiplier || 1.0,
        }}
        onFinish={handleSaveSettings}
        style={{ marginBottom: 24 }}
      >
        <Form.Item name="enabled" valuePropName="checked">
          <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
        </Form.Item>
        <Form.Item name="multiplier" label="Multiplier">
          <InputNumber
            min={1}
            step={0.1}
            formatter={value => `${value}x`}
            parser={value => value?.replace('x', '') as any}
          />
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
          <Title level={5}>Bonus Rewards</Title>
          <Text type="secondary">
            These rewards are guaranteed on first open
          </Text>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Configure Rewards
          </Button>
        </Col>
      </Row>

      {firstTimeBonus?.rewards?.length > 0 ? (
        <Table
          dataSource={firstTimeBonus.rewards}
          rowKey="id"
          pagination={false}
          size="small"
          columns={[
            {
              title: 'Reward Item ID',
              dataIndex: 'reward_item_id',
              key: 'reward_item_id',
            },
            {
              title: 'Actions',
              key: 'actions',
              width: 100,
              render: (_: any, record: any) => (
                <Popconfirm
                  title="Remove reward"
                  description="Are you sure you want to remove this reward?"
                  onConfirm={() => {
                    const newRewards = firstTimeBonus.rewards.filter(
                      (r: any) => r.id !== record.id
                    );
                    updateMutation.mutate({
                      ...firstTimeBonus,
                      rewards: newRewards,
                    });
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              ),
            },
          ]}
        />
      ) : (
        <Card size="small">
          <Text type="secondary">No bonus rewards configured</Text>
        </Card>
      )}

      <Modal
        title="Configure Bonus Rewards"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveRewards}
        >
          <Form.Item
            name="rewards"
            label="Select Reward Items"
            rules={[{ required: true, message: 'Please select at least one reward' }]}
          >
            <Select
              mode="multiple"
              placeholder="Select reward items for first-time bonus"
              optionFilterProp="children"
              showSearch
              style={{ width: '100%' }}
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
              <Button type="primary" htmlType="submit">
                Save Rewards
              </Button>
            </Space>
          </Row>
        </Form>
      </Modal>
    </Card>
  );
}
