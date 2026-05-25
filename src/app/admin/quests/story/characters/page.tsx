// app/admin/characters/page.tsx
'use client';

import { useState } from 'react';
import { Card, Button, Table, Space, Tag, message, Popconfirm, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Position, StoryCharacter, useStoryCharacterCrud, useStoryCharacters } from '../hooks/useStoriesCrud';
import CharacterForm from './components/CharacterForm';

const { Title } = Typography;

export default function CharactersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<StoryCharacter | null>(null);

  const { data: characters, isLoading } = useStoryCharacters();
  const { deleteCharacter } = useStoryCharacterCrud();

  const handleDelete = async (id: string) => {
    try {
      await deleteCharacter.mutateAsync(id);
      message.success('Xóa nhân vật thành công');
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa nhân vật');
    }
  };

  const positionMap: Record<Position, string> = {
    left: 'Trái',
    right: 'Phải',
    center: 'Giữa',
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (url: string) => (
        <img src={url} alt="avatar" style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }} />
      ),
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: StoryCharacter) => (
        <Space>
          <strong>{text}</strong>
          {record.is_su_quan && <Tag color="gold">Tư quan</Tag>}
        </Space>
      ),
    },
    {
      title: 'Màu sắc',
      dataIndex: 'color',
      key: 'color',
      render: (color: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, backgroundColor: color, borderRadius: 4, border: '1px solid #ddd' }} />
          <span>{color}</span>
        </div>
      ),
    },
    {
      title: 'Vị trí mặc định',
      dataIndex: 'default_position',
      key: 'default_position',
      render: (position: Position) => positionMap[position],
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
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
              setIsModalOpen(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa nhân vật"
            description={`Bạn có chắc chắn muốn xóa nhân vật "${record.name}"?`}
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
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
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <Title level={2}>Quản lý nhân vật</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingCharacter(null);
              setIsModalOpen(true);
            }}
          >
            Thêm nhân vật mới
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={characters}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />

        <CharacterForm
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCharacter(null);
          }}
          initialData={editingCharacter}
        />
      </Card>
    </div>
  );
}
