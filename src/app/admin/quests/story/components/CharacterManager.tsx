// components/admin/CharacterManager.tsx
'use client';

import { useState } from 'react';
import { Modal, Table, Button, Space, Form, Input, Select, ColorPicker, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Position, StoryCharacter, useStoryCharacterCrud, useStoryCharacters } from '../hooks/useStoriesCrud';

const { Option } = Select;

interface CharacterManagerProps {
  open: boolean;
  onClose: () => void;
}

export default function CharacterManager({ open, onClose }: CharacterManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<StoryCharacter | null>(null);
  const [form] = Form.useForm();

  const { data: characters, isLoading } = useStoryCharacters();
  const { createCharacter, updateCharacter, deleteCharacter } = useStoryCharacterCrud();

  const handleDelete = async (id: string) => {
    try {
      await deleteCharacter.mutateAsync(id);
      message.success('Xóa nhân vật thành công');
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa nhân vật');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingCharacter) {
        await updateCharacter.mutateAsync({
          id: editingCharacter.id,
          payload: values,
        });
        message.success('Cập nhật nhân vật thành công');
      } else {
        await createCharacter.mutateAsync(values);
        message.success('Tạo nhân vật mới thành công');
      }
      setIsFormOpen(false);
      form.resetFields();
      setEditingCharacter(null);
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (url: string) => (
        <img src={url} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%' }} />
      ),
    },
    {
      title: 'Màu sắc',
      dataIndex: 'color',
      key: 'color',
      render: (color: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />
          <span>{color}</span>
        </div>
      ),
    },
    {
      title: 'Vị trí mặc định',
      dataIndex: 'default_position',
      key: 'default_position',
      render: (position: Position) => {
        const positionMap = { left: 'Trái', right: 'Phải', center: 'Giữa' };
        return positionMap[position];
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: StoryCharacter) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingCharacter(record);
              form.setFieldsValue(record);
              setIsFormOpen(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa nhân vật"
            description="Bạn có chắc chắn muốn xóa nhân vật này?"
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
        title="Quản lý nhân vật"
        open={open}
        onCancel={onClose}
        footer={null}
        width={900}
      >
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingCharacter(null);
              form.resetFields();
              setIsFormOpen(true);
            }}
          >
            Thêm nhân vật
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={characters}
          rowKey="id"
          loading={isLoading}
          pagination={false}
        />
      </Modal>

      <Modal
        title={editingCharacter ? 'Sửa nhân vật' : 'Thêm nhân vật mới'}
        open={isFormOpen}
        onCancel={() => {
          setIsFormOpen(false);
          setEditingCharacter(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        confirmLoading={createCharacter.isPending || updateCharacter.isPending}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Tên nhân vật"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input placeholder="Nhập tên nhân vật" />
          </Form.Item>

          <Form.Item
            name="avatar"
            label="URL Avatar"
            rules={[{ required: true, message: 'Vui lòng nhập URL avatar' }]}
          >
            <Input placeholder="https://example.com/avatar.jpg" />
          </Form.Item>

          <Form.Item
            name="color"
            label="Màu sắc đại diện"
            rules={[{ required: true, message: 'Vui lòng chọn màu' }]}
          >
            <ColorPicker format="hex" />
          </Form.Item>

          <Form.Item
            name="default_position"
            label="Vị trí mặc định"
            rules={[{ required: true, message: 'Vui lòng chọn vị trí' }]}
            initialValue="center"
          >
            <Select>
              <Option value="left">Trái</Option>
              <Option value="center">Giữa</Option>
              <Option value="right">Phải</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="faction_id"
            label="ID phe phái"
          >
            <Input placeholder="ID phe phái (tùy chọn)" />
          </Form.Item>

          <Form.Item
            name="is_su_quan"
            label="Là tư quan?"
            valuePropName="checked"
          >
            <Select placeholder="Chọn loại">
              <Option value={null}>Không xác định</Option>
              <Option value={true}>Có</Option>
              <Option value={false}>Không</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
