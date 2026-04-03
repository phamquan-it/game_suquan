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

interface AchievementRequirementsProps {
  achievementId?: string;
  gameActions: GameAction[];
  readOnly?: boolean;
  onRequirementSelected?: (requirement: AchievementRequirement) => void;
}

export const AchievementRequirements: React.FC<AchievementRequirementsProps> = ({
  achievementId,
  gameActions,
  readOnly = false,
  onRequirementSelected,
}) => {
  const [requirements, setRequirements] = useState<RequirementWithReward[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<AchievementRequirement | null>(null);
  const [selectedRowKey, setSelectedRowKey] = useState<number | null>(null);
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
        `).eq('achievement_id', achievementId);

      console.log('Fetched requirements:', data);

      if (error) throw error;
      setRequirements(data || []);
    } catch (error) {
      console.error('Error fetching requirements:', error);
      message.error('Không thể tải danh sách yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: any) => {
    if (!achievementId) {
      message.warning('Vui lòng lưu thành tích trước khi thêm yêu cầu');
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
        // Cập nhật yêu cầu hiện có
        const { error: updateError } = await supabase
          .from('achievement_requirements')
          .update(requirementData)
          .eq('id', editingRequirement.id);
        error = updateError;
      } else {
        // Thêm yêu cầu mới
        const { error: insertError } = await supabase
          .from('achievement_requirements')
          .insert([requirementData]);
        error = insertError;
      }

      if (error) throw error;

      message.success(`${editingRequirement ? 'Cập nhật' : 'Thêm'} yêu cầu thành công`);
      setModalVisible(false);
      form.resetFields();
      setEditingRequirement(null);
      fetchRequirements();
    } catch (error) {
      console.error('Error saving requirement:', error);
      message.error('Không thể lưu yêu cầu');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('achievement_requirements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      message.success('Xóa yêu cầu thành công');
      if (selectedRowKey === id) {
        setSelectedRowKey(null);
      }
      fetchRequirements();
    } catch (error) {
      console.error('Error deleting requirement:', error);
      message.error('Không thể xóa yêu cầu');
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

    // Hoán đổi thứ tự sắp xếp
    const tempSortOrder = updatedRequirements[currentIndex].sort_order;
    updatedRequirements[currentIndex].sort_order = updatedRequirements[newIndex].sort_order;
    updatedRequirements[newIndex].sort_order = tempSortOrder;

    // Cập nhật trong database
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
      message.success('Sắp xếp lại thứ tự thành công');
    } catch (error) {
      console.error('Error reordering requirements:', error);
      message.error('Không thể sắp xếp lại thứ tự');
    }
  };

  //  const getActionLabel = (actionId: string) => {
  //    const action = gameActions.find(a => a.id === actionId);
  //    return action ? `${action.category} - ${action.description}` : actionId;
  //  };
  //
  const handleRowClick = (record: AchievementRequirement) => {
    if (onRequirementSelected && !readOnly) {
      setSelectedRowKey(record.id);
      onRequirementSelected(record);
    }
  };

  const columns = [
    {
      title: 'Thứ tự',
      dataIndex: 'sort_order',
      key: 'sort_order',
      width: 100,
      render: (_: any, record: AchievementRequirement) => (
        <Space>
          <Tooltip title="Di chuyển lên">
            <Button
              type="text"
              icon={<ArrowUpOutlined />}
              size="small"
              disabled={record.sort_order === 0}
              onClick={(e) => {
                e.stopPropagation();
                handleMove(record.id, 'up');
              }}
            />
          </Tooltip>
          <span>{Number(record.sort_order) + 1}</span>
          <Tooltip title="Di chuyển xuống">
            <Button
              type="text"
              icon={<ArrowDownOutlined />}
              size="small"
              disabled={record.sort_order === requirements.length - 1}
              onClick={(e) => {
                e.stopPropagation();
                handleMove(record.id, 'down');
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: 'Loại yêu cầu',
      dataIndex: 'requirement_type',
      key: 'requirement_type',
      render: (type: string) => (
        <Tag color="blue" className="capitalize">
          {type.replace(/_/g, ' ')}
        </Tag>
      ),
    },
    {
      title: 'Văn bản hiển thị',
      dataIndex: 'display_text',
      key: 'display_text',
      render: (text: string) => text || '-',
    },
    {
      title: 'Mục tiêu',
      dataIndex: 'target',
      key: 'target',
      width: 100,
      align: 'right' as const,
      render: (target: number) => target.toLocaleString(),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_: any, record: AchievementRequirement) => (
        <Space onClick={(e) => e.stopPropagation()}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingRequirement(record);
              form.setFieldsValue(record);
              setModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa yêu cầu"
            description="Bạn có chắc chắn muốn xóa yêu cầu này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              Xóa
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

  // Thêm rowSelection để hỗ trợ chọn dòng
  const rowSelection = onRequirementSelected ? {
    type: 'radio' as const,
    selectedRowKeys: selectedRowKey ? [selectedRowKey] : [],
    onChange: (selectedRowKeys: React.Key[], selectedRows: AchievementRequirement[]) => {
      if (selectedRows.length > 0) {
        setSelectedRowKey(selectedRows[0].id);
        onRequirementSelected(selectedRows[0]);
      }
    },
  } : undefined;

  return (
    <Card className="bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <Text strong className="text-lg">
          Yêu cầu ({requirements.length})
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
            Thêm yêu cầu
          </Button>
        )}
      </div>

      {!achievementId && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
          <Text type="warning">
            Vui lòng lưu thành tích trước khi thêm yêu cầu
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
        locale={{ emptyText: 'Chưa có yêu cầu nào được thêm' }}
        rowSelection={rowSelection}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: onRequirementSelected ? 'pointer' : 'default' },
          className: selectedRowKey === record.id ? 'bg-blue-50' : '',
        })}
      />

      <Modal
        title={editingRequirement ? 'Chỉnh sửa yêu cầu' : 'Thêm yêu cầu'}
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
            label="Loại yêu cầu"
            rules={[{ required: true, message: 'Vui lòng chọn loại yêu cầu' }]}
          >
            <Select
              placeholder="Chọn loại yêu cầu"
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
                          Có thể lặp lại
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
            label="Văn bản hiển thị"
            tooltip="Văn bản hiển thị cho người chơi (tùy chọn)"
          >
            <Input placeholder="Ví dụ: Đánh bại 100 kẻ thù" />
          </Form.Item>

          <Form.Item
            name="target"
            label="Giá trị mục tiêu"
            rules={[{ required: true, message: 'Vui lòng nhập giá trị mục tiêu' }]}
          >
            <InputNumber
              min={1}
              className="w-full"
              placeholder="Nhập số lượng mục tiêu"
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
                icon={<CloseOutlined />}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                {editingRequirement ? 'Cập nhật' : 'Thêm'} yêu cầu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
