// app/admin/stories/page.tsx
'use client';

import { useState } from 'react';
import { Card, Table, Button, Space, Modal, message, Typography, Tag, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Story, useStories, useStoryCrud } from './hooks/useStoriesCrud';
import Title from 'antd/es/typography/Title';
import SceneManager from './components/SceneManager';
import StoryForm from './components/StoryForm';
import type { ColumnsType } from 'antd/es/table';

export default function StoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isSceneManagerOpen, setIsSceneManagerOpen] = useState(false);

  const { data: stories, isLoading } = useStories();
  const { deleteStory } = useStoryCrud();

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xóa truyện',
      content: 'Bạn có chắc chắn muốn xóa truyện này? Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteStory.mutateAsync(id);
          message.success('Xóa truyện thành công');
        } catch (error) {
          message.error('Có lỗi xảy ra khi xóa truyện');
        }
      },
    });
  };

  const handleEdit = (story: Story) => {
    setEditingStory(story);
    setIsModalOpen(true);
  };

  const handleManageScenes = (story: Story) => {
    setSelectedStory(story);
    setIsSceneManagerOpen(true);
  };

  const columns: ColumnsType<Story> = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: '20%',
      render: (text: string) => (
        <Tooltip title={text}>
          <strong>{text.length > 30 ? `${text.substring(0, 30)}...` : text}</strong>
        </Tooltip>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: '35%',
      render: (text: string) => {
        const description = text || 'Chưa có mô tả';
        return (
          <Tooltip title={description}>
            <span style={{ color: description === 'Chưa có mô tả' ? '#999' : 'inherit' }}>
              {description.length > 60 ? `${description.substring(0, 60)}...` : description}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      width: '12%',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Cập nhật',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: '12%',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: '21%',
      align: 'right',
      fixed: 'right',
      render: (_: any, record: Story) => (
        <Space size="middle">
          <Tooltip title="Quản lý cảnh">
            <Button
              type="primary"
              ghost
              icon={<EyeOutlined />}
              onClick={() => handleManageScenes(record)}
              size="middle"
            >
            </Button>
          </Tooltip>
          <Tooltip title="Sửa truyện">
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="middle"
            >
            </Button>
          </Tooltip>
          <Tooltip title="Xóa truyện">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
              size="middle"
            >
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>Quản lý truyện</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingStory(null);
              setIsModalOpen(true);
            }}
            size="large"
          >
            Thêm truyện mới
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={stories}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} truyện`
          }}
          scroll={{ x: 1000 }}
          bordered
        />

        <StoryForm
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingStory(null);
          }}
          initialData={editingStory}
        />

        {selectedStory && (
          <SceneManager
            open={isSceneManagerOpen}
            onClose={() => {
              setIsSceneManagerOpen(false);
              setSelectedStory(null);
            }}
            story={selectedStory}
          />
        )}
      </Card>
    </div>
  );
}
