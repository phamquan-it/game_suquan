// app/admin/achievements/components/AchievementRequirements.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Form,
  Input,
  InputNumber,
  Select,
  Popconfirm,
  message,
  Card,
  Typography,
  Divider,
  Tag,
  Modal,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SaveOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { AchievementRequirement, GameAction, RequirementWithReward } from '../types';
import { supabase } from '@/utils/supabase/client';

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface AchievementRequirementsProps {
  achievementId?: string;
  gameActions: GameAction[];
  readOnly?: boolean;
}

export const AchievementRequirements: React.FC<AchievementRequirementsProps> = ({
  achievementId,
  gameActions,
  readOnly = false,
}) => {
  const [requirements, setRequirements] = useState<RequirementWithReward[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<AchievementRequirement | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (achievementId) {
      fetchRequirements();
    }
  }, [achievementId]);

  const fetchRequirements = async () => {
    if (!achievementId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('achievement_requirements')
        .select(`
          *,
          rewards:achievement_rewards(*)
        `)
        .eq('achievement_id', achievementId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setRequirements(data || []);
    } catch (error) {
      console.error('Error fetching requirements:', error);
      message.error('Failed to load requirements');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: any) => {
    if (!achievementId) {
      message.warning('Please save the achievement first before adding requirements');
      return;
    }

    try {
      const requirementData = {
        achievement_id: achievementId,
        requirement_type: values.requirement_type,
        display_text: values.display_text,
        target: values.target || 1,
        sort_order: editingRequirement ? editingRequirement.sort_order : requirements.length,
      };

      let error;
      if (editingRequirement) {
        // Update existing requirement
        const { error: updateError } = await supabase
          .from('achievement_requirements')
          .update(requirementData)
          .eq('id', editingRequirement.id);
        error = updateError;
      } else {
        // Create new requirement
        const { error: insertError } = await supabase
          .from('achievement_requirements')
          .insert([requirementData]);
        error = insertError;
      }

      if (error) throw error;

      message.success(`Requirement ${editingRequirement ? 'updated' : 'added'} successfully`);
      setModalVisible(false);
      form.resetFields();
      setEditingRequirement(null);
      fetchRequirements();
    } catch (error) {
      console.error('Error saving requirement:', error);
      message.error('Failed to save requirement');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('achievement_requirements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      message.success('Requirement deleted successfully');
      fetchRequirements();
    } catch (error) {
      console.error('Error deleting requirement:', error);
      message.error('Failed to delete requirement');
    }
  };

  const handleMove = async (id: number, direction: 'up' | 'down') => {
    const currentIndex = requirements.findIndex(r => r.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === requirements.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const updatedRequirements = [...requirements];
    
    // Swap sort orders
    const tempSortOrder = updatedRequirements[currentIndex].sort_order;
    updatedRequirements[currentIndex].sort_order = updatedRequirements[newIndex].sort_order;
    updatedRequirements[newIndex].sort_order = tempSortOrder;

    // Update in database
    try {
      const updates = [
        supabase
          .from('achievement_requirements')
          .update({ sort_order: updatedRequirements[currentIndex].sort_order })
          .eq('id', updatedRequirements[currentIndex].id),
        supabase
          .from('achievement_requirements')
          .update({ sort_order: updatedRequirements[newIndex].sort_order })
          .eq('id', updatedRequirements[newIndex].id),
      ];

      await Promise.all(updates);
      setRequirements(updatedRequirements);
    } catch (error) {
      console.error('Error reordering requirements:', error);
      message.error('Failed to reorder requirements');
    }
  };

  const getActionLabel = (actionId: string) => {
    const action = gameActions.find(a => a.id === actionId);
    return action ? `${action.category} - ${action.description}` : actionId;
  };

  const columns = [
    {
      title: 'Order',
      dataIndex: 'sort_order',
      key: 'sort_order',
      width: 80,
      render: (_: any, record: AchievementRequirement) => (
        <Space>
          <Tooltip title="Move up">
            <Button
              type="text"
              icon={<ArrowUpOutlined />}
              size="small"
              disabled={record.sort_order === 0}
              onClick={() => handleMove(record.id, 'up')}
            />
          </Tooltip>
          <span>{record.sort_order + 1}</span>
          <Tooltip title="Move down">
            <Button
              type="text"
              icon={<ArrowDownOutlined />}
              size="small"
              disabled={record.sort_order === requirements.length - 1}
              onClick={() => handleMove(record.id, 'down')}
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: 'Requirement Type',
      dataIndex: 'requirement_type',
      key: 'requirement_type',
      render: (type: string) => (
        <Tag color="blue" className="capitalize">
          {type.replace(/_/g, ' ')}
        </Tag>
      ),
    },
    {
      title: 'Display Text',
      dataIndex: 'display_text',
      key: 'display_text',
      render: (text: string) => text || '-',
    },
    {
      title: 'Target',
      dataIndex: 'target',
      key: 'target',
      width: 100,
      align: 'right' as const,
      render: (target: number) => target.toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: AchievementRequirement) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingRequirement(record);
              form.setFieldsValue(record);
              setModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete requirement"
            description="Are you sure you want to delete this requirement?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const groupedByCategory = gameActions.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = [];
    }
    acc[action.category].push(action);
    return acc;
  }, {} as Record<string, GameAction[]>);

  return (
    <Card className="bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <Text strong className="text-lg">
          Requirements ({requirements.length})
        </Text>
        {!readOnly && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingRequirement(null);
              form.resetFields();
              setModalVisible(true);
            }}
            disabled={!achievementId}
          >
            Add Requirement
          </Button>
        )}
      </div>

      {!achievementId && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
          <Text type="warning">
            Please save the achievement first to add requirements
          </Text>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={requirements}
        loading={loading}
        rowKey="id"
        pagination={false}
        size="small"
        locale={{ emptyText: 'No requirements added yet' }}
      />

      <Modal
        title={editingRequirement ? 'Edit Requirement' : 'Add Requirement'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingRequirement(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{ target: 1 }}
        >
          <Form.Item
            name="requirement_type"
            label="Requirement Type"
            rules={[{ required: true, message: 'Please select requirement type' }]}
          >
            <Select
              placeholder="Select requirement type"
              showSearch
              optionFilterProp="children"
            >
              {Object.entries(groupedByCategory).map(([category, actions]) => (
                <Select.OptGroup label={category.toUpperCase()} key={category}>
                  {actions.map(action => (
                    <Option key={action.id} value={action.id}>
                      {action.description}
                      {action.repeatable && (
                        <Tag color="green" className="ml-2">
                          Repeatable
                        </Tag>
                      )}
                    </Option>
                  ))}
                </Select.OptGroup>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="display_text"
            label="Display Text"
            tooltip="Text shown to players (optional)"
          >
            <Input placeholder="e.g., Defeat 100 enemies" />
          </Form.Item>

          <Form.Item
            name="target"
            label="Target Value"
            rules={[{ required: true, message: 'Please enter target value' }]}
          >
            <InputNumber
              min={1}
              className="w-full"
              placeholder="Enter target number"
            />
          </Form.Item>

          <Divider />

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button
                onClick={() => {
                  setModalVisible(false);
                  setEditingRequirement(null);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                {editingRequirement ? 'Update' : 'Add'} Requirement
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
