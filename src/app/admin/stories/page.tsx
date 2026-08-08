// app/admin/stories/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  DatePicker,
  Tag,
  Modal,
  Form,
  message,
  Statistic,
  Row,
  Col,
  Typography,
  Badge,
  Tooltip,
  Popconfirm,
  Tabs,
  Drawer,
  Upload,
  Image,
  Collapse,
  Timeline,
  Divider,
  Empty,
  Spin,
  Alert,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  BookOutlined,
  FileTextOutlined,
  UserOutlined,
  OrderedListOutlined,
  LinkOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  DragOutlined,
  MenuOutlined,
  SoundOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import { useStories, Story, StoryScene, StoryCharacter } from './hooks/useStories';
import theme from '@/theme/themeConfig';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

// Sub-components
const StoryStats: React.FC<{ stats: any; loading: boolean }> = ({ stats, loading }) => {
  if (!stats) return null;

  const statItems = [
    {
      title: 'Total Stories',
      value: stats.total,
      icon: <BookOutlined />,
      color: '#8B0000',
    },
    {
      title: 'With Entry Scene',
      value: stats.withEntryScene,
      icon: <LinkOutlined />,
      color: '#2E8B57',
    },
    {
      title: 'Total Scenes',
      value: stats.totalScenes,
      icon: <FileTextOutlined />,
      color: '#1E90FF',
    },
    {
      title: 'Total Characters',
      value: stats.totalCharacters,
      icon: <UserOutlined />,
      color: '#D4AF37',
    },
  ];

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      {statItems.map((item) => (
        <Col xs={24} sm={12} lg={6} key={item.title}>
          <Card loading={loading}>
            <Statistic
              title={
                <Space>
                  {item.icon}
                  <span>{item.title}</span>
                </Space>
              }
              value={item.value}
              valueStyle={{ color: item.color, fontSize: 28 }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

// Story Filter Component
const StoryFilters: React.FC<{
  filters: any;
  setFilters: (filters: any) => void;
  onRefresh: () => void;
  loading: boolean;
  onAddNew: () => void;
}> = ({ filters, setFilters, onRefresh, loading, onAddNew }) => {
  return (
    <Card style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={8}>
          <Input
            placeholder="Search stories..."
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            allowClear
          />
        </Col>
        <Col xs={12} md={4}>
          <Select
            placeholder="Entry Scene"
            style={{ width: '100%' }}
            value={filters.hasEntryScene}
            onChange={(value) => setFilters({ ...filters, hasEntryScene: value })}
            allowClear
          >
            <Option value={true}>Has Entry Scene</Option>
            <Option value={false}>No Entry Scene</Option>
          </Select>
        </Col>
        <Col xs={12} md={6}>
          <Select
            placeholder="Has Scenes"
            style={{ width: '100%' }}
            value={filters.hasScenes}
            onChange={(value) => setFilters({ ...filters, hasScenes: value })}
            allowClear
          >
            <Option value={true}>Has Scenes</Option>
            <Option value={false}>No Scenes</Option>
          </Select>
        </Col>
        <Col xs={24} md={6}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading}>
              Refresh
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>
              New Story
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

// Story Table Component
const StoryTable: React.FC<{
  stories: Story[];
  loading: boolean;
  onView: (story: Story) => void;
  onEdit: (story: Story) => void;
  onDelete: (id: string) => void;
}> = ({ stories, loading, onView, onEdit, onDelete }) => {
  const router = useRouter();

  const columns: ColumnsType<Story> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (_, record) => (
        <Space>
          <BookOutlined style={{ color: '#8B0000' }} />
          <Text strong>{record.title}</Text>
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => text || <Text type="secondary">No description</Text>,
    },
    {
      title: 'Entry Scene',
      dataIndex: 'entry_scene_id',
      key: 'entry_scene',
      render: (value) => (
        <Tag color={value ? '#2E8B57' : '#DC143C'}>
          {value ? '✅ Set' : '❌ Not Set'}
        </Tag>
      ),
    },
    {
      title: 'Scenes',
      dataIndex: 'scene_count',
      key: 'scenes',
      render: (count) => (
        <Badge count={count || 0} showZero color="#1E90FF" />
      ),
    },
    {
      title: 'Characters',
      dataIndex: 'character_count',
      key: 'characters',
      render: (count) => (
        <Badge count={count || 0} showZero color="#D4AF37" />
      ),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 300,
      render: (_, record) => (
        <Space>
          <Tooltip title="Manage Scenes">
            <Button
              type="primary"
              icon={<FileTextOutlined />}
              onClick={() => router.push(`/admin/stories/${record.id}/scenes`)}
              style={{ backgroundColor: '#2E8B57', borderColor: '#2E8B57' }}
            >
              Scenes
            </Button>
          </Tooltip>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete Story"
              description="Are you sure you want to delete this story? All related scenes and choices will also be deleted."
              onConfirm={() => onDelete(record.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={stories}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} stories`,
      }}
      scroll={{ x: 1200 }}
      locale={{
        emptyText: <Empty description="No stories found" />,
      }}
    />
  );
};

// Story Detail Drawer
const StoryDetailDrawer: React.FC<{
  visible: boolean;
  story: Story | null;
  scenes: StoryScene[];
  characters: StoryCharacter[];
  loading: boolean;
  onClose: () => void;
  onEdit: (story: Story) => void;
  onAddScene: (storyId: string) => void;
}> = ({ visible, story, scenes, characters, loading, onClose, onEdit, onAddScene }) => {
  if (!story) return null;

  const getCharacterName = (id: string) => {
    const char = characters.find(c => c.id === id);
    return char?.name || 'Unknown';
  };

  const getCharacterColor = (id: string) => {
    const char = characters.find(c => c.id === id);
    return char?.color || '#000';
  };

  return (
    <Drawer
      title={
        <Space>
          <BookOutlined style={{ color: '#8B0000' }} />
          <span>{story.title}</span>
        </Space>
      }
      placement="right"
      width={800}
      open={visible}
      onClose={onClose}
      extra={
        <Space>
          <Button icon={<EditOutlined />} onClick={() => onEdit(story)}>
            Edit Story
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => onAddScene(story.id)}>
            Add Scene
          </Button>
        </Space>
      }
    >
      <Spin spinning={loading}>
        <div style={{ marginBottom: 24 }}>
          <Text type="secondary">Description</Text>
          <Paragraph style={{ marginTop: 8 }}>
            {story.description || 'No description provided.'}
          </Paragraph>
        </div>

        <Divider />

        <div>
          <Space style={{ marginBottom: 16 }}>
            <OrderedListOutlined style={{ color: '#8B0000' }} />
            <Title level={5} style={{ margin: 0 }}>Scenes Timeline</Title>
            <Badge count={scenes.length} showZero color="#1E90FF" />
          </Space>

          {scenes.length === 0 ? (
            <Empty description="No scenes in this story yet" />
          ) : (
            <Timeline
              items={scenes.map((scene, index) => ({
                color: scene.id === story.entry_scene_id ? '#D4AF37' : '#1E90FF',
                dot: scene.id === story.entry_scene_id ? (
                  <LinkOutlined style={{ fontSize: 16 }} />
                ) : undefined,
                children: (
                  <Card size="small" style={{ marginBottom: 8 }}>
                    <Row gutter={[16, 8]}>
                      <Col span={24}>
                        <Space>
                          <Tag color="blue">Scene {scene.scene_order}</Tag>
                          {scene.id === story.entry_scene_id && (
                            <Tag color="gold">Entry Scene</Tag>
                          )}
                          <Tag color={getCharacterColor(scene.speaker_id)}>
                            {getCharacterName(scene.speaker_id)}
                          </Tag>
                        </Space>
                      </Col>
                      <Col span={24}>
                        <Text strong>Dialog:</Text>
                        <Paragraph ellipsis={{ rows: 2 }}>
                          {scene.dialog_text}
                        </Paragraph>
                      </Col>
                      <Col span={24}>
                        <Space>
                          {scene.background && (
                            <Tag icon={<PictureOutlined />}>
                              {scene.background}
                            </Tag>
                          )}
                          {scene.sound_effect && (
                            <Tag icon={<SoundOutlined />}>
                              {scene.sound_effect}
                            </Tag>
                          )}
                          {scene.choices && scene.choices.length > 0 && (
                            <Tag color="purple">
                              {scene.choices.length} Choices
                            </Tag>
                          )}
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                ),
              }))}
            />
          )}
        </div>
      </Spin>
    </Drawer>
  );
};

// Story Form Modal
const StoryFormModal: React.FC<{
  visible: boolean;
  editingStory: Story | null;
  loading: boolean;
  characters: StoryCharacter[];
  onClose: () => void;
  onSubmit: (data: any) => void;
}> = ({ visible, editingStory, loading, characters, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingStory) {
      form.setFieldsValue(editingStory);
    } else {
      form.resetFields();
    }
  }, [editingStory, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={
        <Space>
          {editingStory ? <EditOutlined /> : <PlusOutlined />}
          <span>{editingStory ? 'Edit Story' : 'Create New Story'}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={600}
      okText={editingStory ? 'Update' : 'Create'}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ entry_scene_id: null }}
      >
        <Form.Item
          name="title"
          label="Story Title"
          rules={[{ required: true, message: 'Please enter story title' }]}
        >
          <Input placeholder="Enter story title" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <TextArea
            placeholder="Enter story description"
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="entry_scene_id"
          label="Entry Scene (Optional)"
        >
          <Select
            placeholder="Select entry scene"
            allowClear
          >
            {characters.map((char) => (
              <Option key={char.id} value={char.id}>
                <Space>
                  <span style={{ color: char.color }}>●</span>
                  {char.name}
                </Space>
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Scene Form Modal
const SceneFormModal: React.FC<{
  visible: boolean;
  storyId: string;
  editingScene: StoryScene | null;
  loading: boolean;
  characters: StoryCharacter[];
  existingScenes: StoryScene[];
  onClose: () => void;
  onSubmit: (data: any) => void;
}> = ({ visible, storyId, editingScene, loading, characters, existingScenes, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingScene) {
      form.setFieldsValue({
        ...editingScene,
        speaker_id: editingScene.speaker_id,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        story_id: storyId,
        scene_order: existingScenes.length + 1,
        sound_effect: '',
      });
    }
  }, [editingScene, storyId, existingScenes.length, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={
        <Space>
          {editingScene ? <EditOutlined /> : <PlusOutlined />}
          <span>{editingScene ? 'Edit Scene' : 'Add New Scene'}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={700}
      okText={editingScene ? 'Update' : 'Create'}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="story_id" hidden>
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="scene_order"
              label="Scene Order"
              rules={[{ required: true, message: 'Enter scene order' }]}
            >
              <Input type="number" min={1} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="speaker_id"
              label="Speaker"
              rules={[{ required: true, message: 'Select speaker' }]}
            >
              <Select placeholder="Select character">
                {characters.map((char) => (
                  <Option key={char.id} value={char.id}>
                    <Space>
                      <span style={{ color: char.color }}>●</span>
                      {char.name}
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="dialog_text"
          label="Dialog Text"
          rules={[{ required: true, message: 'Enter dialog text' }]}
        >
          <TextArea
            placeholder="Enter the dialog text"
            rows={3}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="background"
              label="Background"
            >
              <Input placeholder="Background image path" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="sound_effect"
              label="Sound Effect"
            >
              <Input placeholder="Sound effect path" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

// Main Page Component
const StoryManagementPage: React.FC = () => {
  const {
    stories,
    loading,
    filters,
    setFilters,
    stats,
    characters,
    scenes,
    selectedStory,
    createStory,
    updateStory,
    deleteStory,
    fetchStoryDetails,
    createScene,
    updateScene,
    deleteScene,
    refresh,
  } = useStories();

  const [viewDrawerVisible, setViewDrawerVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [sceneModalVisible, setSceneModalVisible] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [editingScene, setEditingScene] = useState<StoryScene | null>(null);
  const [currentStoryId, setCurrentStoryId] = useState<string>('');

  // Handlers
  const handleAddNew = () => {
    setEditingStory(null);
    setFormModalVisible(true);
  };

  const handleEdit = (story: Story) => {
    setEditingStory(story);
    setFormModalVisible(true);
  };

  const handleView = async (story: Story) => {
    setCurrentStoryId(story.id);
    await fetchStoryDetails(story.id);
    setViewDrawerVisible(true);
  };

  const handleDelete = async (id: string) => {
    await deleteStory(id);
  };

  const handleStorySubmit = async (data: any) => {
    if (editingStory) {
      await updateStory(editingStory.id, data);
    } else {
      await createStory(data);
    }
    setFormModalVisible(false);
    setEditingStory(null);
  };

  const handleAddScene = (storyId: string) => {
    setCurrentStoryId(storyId);
    setEditingScene(null);
    setSceneModalVisible(true);
  };

  const handleSceneSubmit = async (data: any) => {
    if (editingScene) {
      await updateScene(editingScene.id, data);
    } else {
      await createScene(data);
    }
    setSceneModalVisible(false);
    setEditingScene(null);
    // Refresh story details
    await fetchStoryDetails(currentStoryId);
  };

  const handleCloseView = () => {
    setViewDrawerVisible(false);
    setCurrentStoryId('');
  };

  return (
    <div style={{ padding: 24, background: '#F5F5DC', minHeight: '100vh' }}>
      <Card>
        <Space style={{ marginBottom: 24 }}>
          <BookOutlined style={{ fontSize: 24, color: '#8B0000' }} />
          <Title level={2} style={{ margin: 0 }}>Story Management</Title>
        </Space>

        <StoryStats stats={stats} loading={loading} />

        <StoryFilters
          filters={filters}
          setFilters={setFilters}
          onRefresh={refresh}
          loading={loading}
          onAddNew={handleAddNew}
        />

        <StoryTable
          stories={stories}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      {/* Story Form Modal */}
      <StoryFormModal
        visible={formModalVisible}
        editingStory={editingStory}
        loading={loading}
        characters={characters}
        onClose={() => {
          setFormModalVisible(false);
          setEditingStory(null);
        }}
        onSubmit={handleStorySubmit}
      />

      {/* Scene Form Modal */}
      <SceneFormModal
        visible={sceneModalVisible}
        storyId={currentStoryId}
        editingScene={editingScene}
        loading={loading}
        characters={characters}
        existingScenes={scenes}
        onClose={() => {
          setSceneModalVisible(false);
          setEditingScene(null);
        }}
        onSubmit={handleSceneSubmit}
      />

      {/* Story Detail Drawer */}
      <StoryDetailDrawer
        visible={viewDrawerVisible}
        story={selectedStory}
        scenes={scenes}
        characters={characters}
        loading={loading}
        onClose={handleCloseView}
        onEdit={handleEdit}
        onAddScene={handleAddScene}
      />
    </div>
  );
};

export default StoryManagementPage;
