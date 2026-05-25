// components/admin/SceneManager.tsx
'use client';

import { useState } from 'react';
import { Modal, Table, Button, Space, Tag, message, Popconfirm, Tooltip, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BranchesOutlined, SoundOutlined, PictureOutlined } from '@ant-design/icons';
import { Story, StoryScene, useStorySceneCrud, useStoryScenes } from '../hooks/useStoriesCrud';
import SceneForm from './SceneForm';
import ChoiceManager from './ChoiceManager';
import type { ColumnsType } from 'antd/es/table';

interface SceneManagerProps {
  open: boolean;
  onClose: () => void;
  story: Story;
}

export default function SceneManager({ open, onClose, story }: SceneManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingScene, setEditingScene] = useState<StoryScene | null>(null);
  const [selectedScene, setSelectedScene] = useState<StoryScene | null>(null);
  const [isChoiceManagerOpen, setIsChoiceManagerOpen] = useState(false);

  const { data: scenes, isLoading } = useStoryScenes(story.id);
  const { deleteScene } = useStorySceneCrud(story.id);

  const handleDelete = async (id: string) => {
    try {
      await deleteScene.mutateAsync(id);
      message.success('Xóa cảnh thành công');
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa cảnh');
    }
  };

  const handleManageChoices = (scene: StoryScene) => {
    setSelectedScene(scene);
    setIsChoiceManagerOpen(true);
  };

  const columns: ColumnsType<StoryScene> = [
    {
      title: 'Thứ tự',
      dataIndex: 'scene_order',
      key: 'scene_order',
      width: 80,
      align: 'center',
      render: (order: number) => (
        <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
          #{order}
        </Tag>
      ),
    },
    {
      title: 'Nhân vật',
      dataIndex: ['speaker', 'name'],
      key: 'speaker',
      width: 150,
      render: (name: string, record: any) => (
        <Space>
          {record.speaker?.avatar ? (
            <img
              src={record.speaker.avatar}
              alt={name}
              style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f0f0f0' }} />
          )}
          <strong>{name || 'Không xác định'}</strong>
        </Space>
      ),
    },
    {
      title: 'Lời thoại',
      dataIndex: 'dialog_text',
      key: 'dialog_text',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text} placement="topLeft">
          <span>{text.length > 80 ? `${text.substring(0, 80)}...` : text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Media',
      key: 'media',
      width: 120,
      align: 'center',
      render: (_: any, record: StoryScene) => (
        <Space size="small">
          {record.background && (
            <Tooltip title="Có background">
              <PictureOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
            </Tooltip>
          )}
          {record.sound_effect && (
            <Tooltip title={`Âm thanh: ${record.sound_effect}`}>
              <SoundOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
            </Tooltip>
          )}
          {!record.background && !record.sound_effect && (
            <span style={{ color: '#ccc' }}>—</span>
          )}
        </Space>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 350,
      align: 'right',
      fixed: 'right',
      render: (_: any, record: StoryScene) => (
        <Space size="small" wrap>
          <Tooltip title="Quản lý lựa chọn">
            <Button
              type="primary"
              ghost
              icon={<BranchesOutlined />}
              onClick={() => handleManageChoices(record)}
              size="middle"
            >
              Lựa chọn
            </Button>
          </Tooltip>

          <Tooltip title="Sửa cảnh">
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingScene(record);
                setIsFormOpen(true);
              }}
              size="middle"
            >
              Sửa
            </Button>
          </Tooltip>

          <Tooltip title="Xóa cảnh">
            <Popconfirm
              title="Xóa cảnh"
              description="Bạn có chắc chắn muốn xóa cảnh này?"
              onConfirm={() => handleDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
              okType="danger"
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                size="middle"
              >
                Xóa
              </Button>
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Modal
        title={
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
            Quản lý cảnh - {story.title}
          </div>
        }
        open={open}
        onCancel={onClose}
        footer={null}
        width={1300}
        styles={{ body: { padding: '20px' } }}
      >
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Tag color="green" style={{ fontSize: '14px' }}>
              Tổng số: {scenes?.length || 0} cảnh
            </Tag>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingScene(null);
              setIsFormOpen(true);
            }}
            size="large"
          >
            Thêm cảnh mới
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={scenes}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 8,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} cảnh`,
            pageSizeOptions: ['5', '8', '10', '20']
          }}
          scroll={{ x: 1000 }}
          bordered
          rowClassName={(record, index) =>
            index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
          }
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ padding: '16px', background: '#fafafa', borderRadius: '8px' }}>
                <div style={{ marginBottom: 12 }}>
                  <strong style={{ fontSize: '16px' }}>📝 Nội dung đầy đủ:</strong>
                  <p style={{ marginTop: 8, lineHeight: 1.6 }}>{record.dialog_text}</p>
                </div>

                {record.background && (
                  <div style={{ marginTop: 12 }}>
                    <strong>🖼️ Background:</strong>
                    <div style={{ marginTop: 8 }}>
                      <Image
                        src={record.background}
                        alt="background"
                        width={200}
                        style={{ borderRadius: '8px', cursor: 'pointer' }}
                        preview={{ mask: 'Xem ảnh' }}
                      />
                    </div>
                  </div>
                )}

                {record.sound_effect && (
                  <div style={{ marginTop: 12 }}>
                    <strong>🔊 Hiệu ứng âm thanh:</strong>
                    <div style={{ marginTop: 4 }}>
                      <code>{record.sound_effect}</code>
                    </div>
                  </div>
                )}
              </div>
            ),
          }}
        />
      </Modal>

      <SceneForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingScene(null);
        }}
        storyId={story.id}
        initialData={editingScene}
        sceneOrder={scenes?.length || 0}
      />

      {selectedScene && (
        <ChoiceManager
          open={isChoiceManagerOpen}
          onClose={() => {
            setIsChoiceManagerOpen(false);
            setSelectedScene(null);
          }}
          scene={selectedScene}
        />
      )}

      <style jsx global>{`
        .table-row-light {
          background-color: #ffffff;
        }
        .table-row-dark {
          background-color: #fafafa;
        }
        .ant-table-cell:last-child {
          background-color: #f5f5f5;
          position: sticky;
          right: 0;
          box-shadow: -2px 0 8px rgba(0, 0, 0, 0.08);
        }
        .ant-btn-primary.ant-btn-background-ghost {
          border-color: #8B0000;
          color: #8B0000;
        }
        .ant-btn-primary.ant-btn-background-ghost:hover {
          background-color: #8B0000;
          color: white;
          transform: translateY(-1px);
        }
        .ant-btn-default:hover {
          border-color: #D4AF37;
          color: #8B4513;
          transform: translateY(-1px);
        }
        .ant-btn-danger:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(220, 20, 60, 0.2);
        }
      `}</style>
    </>
  );
}
