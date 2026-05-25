// components/admin/ChoiceManager.tsx
'use client';

import { useState } from 'react';
import { Modal, Table, Button, Space, Form, Input, InputNumber, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { StoryChoice, StoryScene, useStoryChoiceCrud, useStoryChoices } from '../hooks/useStoriesCrud';

interface ChoiceManagerProps {
  open: boolean;
  onClose: () => void;
  scene: StoryScene;
}

export default function ChoiceManager({ open, onClose, scene }: ChoiceManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingChoice, setEditingChoice] = useState<StoryChoice | null>(null);
  const [form] = Form.useForm();

  const { data: choices, isLoading } = useStoryChoices(scene.id);
  const { createChoice, updateChoice, deleteChoice } = useStoryChoiceCrud(scene.id);

  const handleDelete = async (id: string) => {
    try {
      await deleteChoice.mutateAsync(id);
      message.success('Xóa lựa chọn thành công');
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa lựa chọn');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingChoice) {
        await updateChoice.mutateAsync({
          id: editingChoice.id,
          payload: values,
        });
        message.success('Cập nhật lựa chọn thành công');
      } else {
        await createChoice.mutateAsync({
          ...values,
          scene_id: scene.id,
        });
        message.success('Tạo lựa chọn mới thành công');
      }
      setIsFormOpen(false);
      form.resetFields();
      setEditingChoice(null);
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  const columns = [
    {
      title: 'Thứ tự',
      dataIndex: 'choice_order',
      key: 'choice_order',
      width: 80,
    },
    {
      title: 'Văn bản lựa chọn',
      dataIndex: 'choice_text',
      key: 'choice_text',
    },
    {
      title: 'Hiệu ứng',
      dataIndex: 'effect_text',
      key: 'effect_text',
      render: (text: string) => text || 'Không có',
    },
    {
      title: 'Cảnh tiếp theo',
      dataIndex: 'next_scene_id',
      key: 'next_scene_id',
      render: (id: string) => id || 'Kết thúc',
    },
    {
      title: 'Thay đổi stats',
      dataIndex: 'stats_change',
      key: 'stats_change',
      render: (stats: any) => (
        <pre style={{ margin: 0, fontSize: 12 }}>
          {JSON.stringify(stats, null, 2)}
        </pre>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_: any, record: StoryChoice) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingChoice(record);
              form.setFieldsValue(record);
              setIsFormOpen(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa lựa chọn"
            description="Bạn có chắc chắn muốn xóa lựa chọn này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Modal
        title={`Quản lý lựa chọn - Cảnh ${scene.scene_order}`}
        open={open}
        onCancel={onClose}
        footer={null}
        width={1000}
      >
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingChoice(null);
              form.resetFields();
              form.setFieldsValue({
                choice_order: (choices?.length || 0) + 1,
                stats_change: {},
              });
              setIsFormOpen(true);
            }}
          >
            Thêm lựa chọn mới
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={choices}
          rowKey="id"
          loading={isLoading}
          pagination={false}
        />
      </Modal>

      <Modal
        title={editingChoice ? 'Sửa lựa chọn' : 'Thêm lựa chọn mới'}
        open={isFormOpen}
        onCancel={() => {
          setIsFormOpen(false);
          setEditingChoice(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        confirmLoading={createChoice.isPending || updateChoice.isPending}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="choice_order"
            label="Thứ tự"
            rules={[{ required: true, message: 'Vui lòng nhập thứ tự' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="choice_text"
            label="Văn bản lựa chọn"
            rules={[{ required: true, message: 'Vui lòng nhập văn bản' }]}
          >
            <Input.TextArea rows={2} placeholder="Nhập nội dung lựa chọn" />
          </Form.Item>

          <Form.Item
            name="effect_text"
            label="Văn bản hiệu ứng"
          >
            <Input.TextArea rows={2} placeholder="Mô tả hiệu ứng khi chọn" />
          </Form.Item>

          <Form.Item
            name="next_scene_id"
            label="ID cảnh tiếp theo"
            help="Để trống nếu đây là kết thúc"
          >
            <Input placeholder="Nhập ID của cảnh tiếp theo" />
          </Form.Item>

          <Form.Item
            name="stats_change"
            label="Thay đổi chỉ số (JSON)"
            rules={[
              {
                validator: async (_, value) => {
                  if (value && typeof value === 'string') {
                    try {
                      JSON.parse(value);
                    } catch {
                      throw new Error('Vui lòng nhập JSON hợp lệ');
                    }
                  }
                },
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder='{"health": 10, "mana": -5}'
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
