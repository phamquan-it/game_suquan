'use client';

import React, { useState } from 'react';
import { Table, Button, Space, InputNumber, Select, Input, Popconfirm, Modal, Form } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuestRequirements, useCreateRequirement, useUpdateRequirement, useDeleteRequirement } from '../hooks/useQuestRequirements';
import { RequirementFormData } from '../types/quest.types';

const { Option } = Select;

interface QuestRequirementsProps {
  questId: string;
}

export const QuestRequirements: React.FC<QuestRequirementsProps> = ({ questId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<any>(null);
  const [form] = Form.useForm();

  const { data: requirements, isLoading } = useQuestRequirements(questId);
  const createRequirement = useCreateRequirement();
  const updateRequirement = useUpdateRequirement();
  const deleteRequirement = useDeleteRequirement();

  // Mock data for requirement types - replace with actual game_actions query
  const requirementTypes = [
    { id: 'login', name: 'Đăng nhập' },
    { id: 'pvp_win', name: 'Thắng PvP' },
    { id: 'pve_kill', name: 'Tiêu diệt quái' },
    { id: 'collect_item', name: 'Thu thập vật phẩm' },
    { id: 'reach_level', name: 'Đạt cấp độ' },
    { id: 'alliance_contribute', name: 'Đóng góp bang hội' },
  ];

  const handleAdd = () => {
    setEditingRequirement(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingRequirement(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingRequirement) {
        await updateRequirement.mutateAsync({
          id: editingRequirement.id,
          quest_id: questId,
          ...values
        });
      } else {
        await createRequirement.mutateAsync({
          ...values,
          quest_id: questId
        });
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Submit failed:', error);
    }
  };

  const columns = [
    {
      title: 'Loại yêu cầu',
      dataIndex: 'requirement_type',
      key: 'requirement_type',
      render: (type: string) => {
        const reqType = requirementTypes.find(rt => rt.id === type);
        return reqType?.name || type;
      },
    },
    {
      title: 'Chỉ tiêu',
      dataIndex: 'target',
      key: 'target',
    },
    {
      title: 'Dữ liệu bổ sung',
      dataIndex: 'meta',
      key: 'meta',
      render: (meta: any) => meta ? JSON.stringify(meta) : '-',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Xóa yêu cầu"
            description="Bạn có chắc chắn muốn xóa yêu cầu này?"
            onConfirm={() => deleteRequirement.mutateAsync({ id: record.id, quest_id: questId })}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="bg-imperialRed"
        >
          Thêm yêu cầu
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={requirements}
        rowKey="id"
        loading={isLoading}
        pagination={false}
      />

      <Modal
        title={editingRequirement ? 'Chỉnh sửa yêu cầu' : 'Thêm yêu cầu mới'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        confirmLoading={createRequirement.isPending || updateRequirement.isPending}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="requirement_type"
            label="Loại yêu cầu"
            rules={[{ required: true }]}
          >
            <Select placeholder="Chọn loại yêu cầu">
              {requirementTypes.map(type => (
                <Option key={type.id} value={type.id}>{type.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="target"
            label="Chỉ tiêu"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>

          <Form.Item
            name="meta"
            label="Dữ liệu bổ sung (JSON)"
          >
            <Input.TextArea
              rows={4}
              placeholder='{"item_id": "item_123", "location": "dungeon_1"}'
              onChange={(e) => {
                try {
                  if (e.target.value) {
                    JSON.parse(e.target.value);
                  }
                } catch (error) {
                  e.target.style.borderColor = 'red';
                }
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
