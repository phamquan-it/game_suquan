// app/admin/stories/[story_id]/scenes/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
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
  Drawer,
  Divider,
  Empty,
  Spin,
  Alert,
  Dropdown,
  MenuProps,
  Switch,
  Slider,
  DatePicker,
  Upload,
  Image,
  Progress,
  List,
  Avatar,
  Timeline,
  Collapse,
  Tabs,
  Descriptions,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
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
  CopyOutlined,
  ExportOutlined,
  ImportOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  PlayCircleOutlined,
  StopOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
  BranchesOutlined,
  BookOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { StoryCharacter } from '../../hooks/useStories';
import { StoryScene, useStoryScenes } from '../../hooks/useStoryScenes';
import { useStory } from '../../hooks/useStory';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { confirm } = Modal;

// Scene Statistics Component
const SceneStatistics: React.FC<{ stats: any; loading: boolean; storyTitle: string }> = ({
  stats,
  loading,
  storyTitle,
}) => {
  if (!stats) return null;

  const statItems = [
    {
      title: 'Total Scenes',
      value: stats.total,
      icon: <FileTextOutlined />,
      color: '#8B0000',
      suffix: '',
    },
    {
      title: 'With Choices',
      value: stats.totalWithChoices,
      icon: <BranchesOutlined />,
      color: '#2E8B57',
      suffix: `/${stats.total}`,
    },
    {
      title: 'Unique Speakers',
      value: stats.totalSpeakers,
      icon: <UserOutlined />,
      color: '#1E90FF',
      suffix: '',
    },
    {
      title: 'Avg Scenes/Story',
      value: stats.avgScenesPerStory.toFixed(1),
      icon: <OrderedListOutlined />,
      color: '#D4AF37',
      suffix: '',
    },
  ];

  return (
    <Card style={{ marginBottom: 16 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <FileTextOutlined style={{ color: '#8B0000', fontSize: 20 }} />
          <Title level={4} style={{ margin: 0 }}>Scene Overview</Title>
          <Tag color="blue" icon={<BookOutlined />}>
            {storyTitle}
          </Tag>
        </Space>
        <Row gutter={[16, 16]}>
          {statItems.map((item) => (
            <Col xs={24} sm={12} lg={6} key={item.title}>
              <Statistic
                title={item.title}
                value={item.value}
                valueStyle={{ color: item.color, fontSize: 24 }}
                suffix={item.suffix}
                loading={loading}
                prefix={item.icon}
              />
            </Col>
          ))}
        </Row>
        {stats.mostUsedSpeaker && (
          <Alert
            message={`Most Used Speaker: ${stats.mostUsedSpeaker.name}`}
            description={`Appears in ${stats.mostUsedSpeaker.count} scenes`}
            type="info"
            showIcon
            icon={<UserOutlined />}
          />
        )}
      </Space>
    </Card>
  );
};

// Scene Filters Component
const SceneFilters: React.FC<{
  filters: any;
  setFilters: (filters: any) => void;
  onRefresh: () => void;
  loading: boolean;
  onAddNew: () => void;
  availableCharacters: StoryCharacter[];
  onBulkDelete: () => void;
  selectedRowKeys: React.Key[];
}> = ({
  filters,
  setFilters,
  onRefresh,
  loading,
  onAddNew,
  availableCharacters,
  onBulkDelete,
  selectedRowKeys,
}) => {
  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Row gutter={[12, 12]} align="middle">
        <Col xs={24} md={6}>
          <Input
            placeholder="Search dialog or background..."
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            allowClear
            size="middle"
          />
        </Col>
        <Col xs={12} md={4}>
          <Select
            placeholder="Speaker"
            style={{ width: '100%' }}
            value={filters.speakerId}
            onChange={(value) => setFilters({ ...filters, speakerId: value })}
            allowClear
            size="middle"
          >
            {availableCharacters.map((char) => (
              <Option key={char.id} value={char.id}>
                <Space>
                  <span style={{ color: char.color }}>●</span>
                  {char.name}
                </Space>
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={12} md={3}>
          <Select
            placeholder="Has Choices"
            style={{ width: '100%' }}
            value={filters.hasChoices}
            onChange={(value) => setFilters({ ...filters, hasChoices: value })}
            allowClear
            size="middle"
          >
            <Option value={true}>With Choices</Option>
            <Option value={false}>Without Choices</Option>
          </Select>
        </Col>
        <Col xs={12} md={3}>
          <Select
            placeholder="Background"
            style={{ width: '100%' }}
            value={filters.hasBackground}
            onChange={(value) => setFilters({ ...filters, hasBackground: value })}
            allowClear
            size="middle"
          >
            <Option value={true}>Has Background</Option>
            <Option value={false}>No Background</Option>
          </Select>
        </Col>
        <Col xs={12} md={3}>
          <Select
            placeholder="Sound Effect"
            style={{ width: '100%' }}
            value={filters.hasSoundEffect}
            onChange={(value) => setFilters({ ...filters, hasSoundEffect: value })}
            allowClear
            size="middle"
          >
            <Option value={true}>Has Sound</Option>
            <Option value={false}>No Sound</Option>
          </Select>
        </Col>
        <Col xs={24} md={5}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Tooltip title="Refresh">
              <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading} />
            </Tooltip>
            {selectedRowKeys.length > 0 && (
              <Popconfirm
                title="Delete Selected Scenes"
                description={`Are you sure you want to delete ${selectedRowKeys.length} scenes?`}
                onConfirm={onBulkDelete}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <Button danger icon={<DeleteOutlined />}>
                  Delete ({selectedRowKeys.length})
                </Button>
              </Popconfirm>
            )}
            <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>
              Add Scene
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

// Scene Table Component
const SceneTable: React.FC<{
  scenes: StoryScene[];
  loading: boolean;
  onView: (scene: StoryScene) => void;
  onEdit: (scene: StoryScene) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onReorder: (scenes: StoryScene[]) => void;
  selectedRowKeys: React.Key[];
  onSelectChange: (selectedRowKeys: React.Key[], selectedRows: StoryScene[]) => void;
}> = ({
  scenes,
  loading,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onReorder,
  selectedRowKeys,
  onSelectChange,
}) => {
  const router = useRouter();
      const params = useParams();
    const storyId = params.story_id as string;
  const columns: ColumnsType<StoryScene> = [
    {
      title: '#',
      dataIndex: 'scene_order',
      key: 'order',
      width: 60,
      render: (order: number) => (
        <Tag color="blue" style={{ minWidth: 30, textAlign: 'center' }}>
          {order}
        </Tag>
      ),
      sorter: (a, b) => a.scene_order - b.scene_order,
    },
    {
      title: 'Dialog',
      dataIndex: 'dialog_text',
      key: 'dialog',
      ellipsis: true,
      width: 200,
      render: (text: string) => (
        <Tooltip title={text}>
          <Text ellipsis>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Speaker',
      dataIndex: 'speaker',
      key: 'speaker',
      width: 120,
      render: (speaker: StoryCharacter) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: speaker?.color || '#ccc' }}>
            {speaker?.name?.[0] || '?'}
          </Avatar>
          <Text style={{ color: speaker?.color }}>{speaker?.name || 'Unknown'}</Text>
        </Space>
      ),
    },
    {
      title: 'Background',
      dataIndex: 'background',
      key: 'background',
      width: 100,
      render: (bg: string) => (
        bg ? (
          <Tooltip title={bg}>
            <Tag icon={<PictureOutlined />} color="purple">
              {bg.split('/').pop()}
            </Tag>
          </Tooltip>
        ) : (
          <Tag color="default">None</Tag>
        )
      ),
    },
    {
      title: 'Sound',
      dataIndex: 'sound_effect',
      key: 'sound',
      width: 100,
      render: (sound: string) => (
        sound && sound !== '' ? (
          <Tooltip title={sound}>
            <Tag icon={<SoundOutlined />} color="cyan">
              {sound.split('/').pop()}
            </Tag>
          </Tooltip>
        ) : (
          <Tag color="default">None</Tag>
        )
      ),
    },
    {
      title: 'Choices',
      dataIndex: 'choices',
      key: 'choices',
      width: 80,
      render: (choices: any[]) => (
        <Badge
          count={choices?.length || 0}
          showZero
          color={choices?.length > 0 ? '#2E8B57' : '#DC143C'}
        />
      ),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (date: string) => dayjs(date).format('MMM D, HH:mm'),
      sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_: any, record: StoryScene) => (
        <Space size="small">
            <Tooltip title="Manage Choices">
          <Button
            type="primary"
            size="small"
            icon={<BranchesOutlined />}
            onClick={() => router.push(`/admin/stories/${storyId}/scenes/${record.id}/story-choices`)}
            style={{
              backgroundColor: '#8B0000',
              borderColor: '#8B0000',
              minWidth: 70,
            }}
          >
            Choices
          </Button>
        </Tooltip>
          <Tooltip title="View Details">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Duplicate">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => onDuplicate(record.id)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete Scene"
              description="Are you sure you want to delete this scene?"
              onConfirm={() => onDelete(record.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Drag and drop reorder
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === index) return;

    const reorderedScenes = [...scenes];
    const [draggedItem] = reorderedScenes.splice(draggingIndex, 1);
    reorderedScenes.splice(index, 0, draggedItem);
    
    // Update order numbers
    const updatedScenes = reorderedScenes.map((scene, idx) => ({
      ...scene,
      scene_order: idx + 1,
    }));
    
    onReorder(updatedScenes);
    setDraggingIndex(index);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  return (
    <Table
      columns={columns}
      dataSource={scenes}
      rowKey="id"
      loading={loading}
      rowSelection={{
        selectedRowKeys,
        onChange: onSelectChange,
        selections: [
          Table.SELECTION_ALL,
          Table.SELECTION_INVERT,
          Table.SELECTION_NONE,
        ],
      }}
      pagination={{
        pageSize: 20,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} scenes`,
        pageSizeOptions: ['10', '20', '50', '100'],
      }}
      scroll={{ x: 1200 }}
      locale={{
        emptyText: (
          <Empty
            description="No scenes found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ),
      }}
      onRow={(record, index) => ({
        draggable: true,
        onDragStart: () => handleDragStart(index || 0),
        onDragOver: (e) => handleDragOver(e, index || 0),
        onDragEnd: handleDragEnd,
        style: {
          cursor: 'move',
          backgroundColor: draggingIndex === index ? '#f0f0f0' : 'transparent',
        },
      })}
    />
  );
};

// Scene Detail Drawer
const SceneDetailDrawer: React.FC<{
  visible: boolean;
  scene: StoryScene | null;
  loading: boolean;
  onClose: () => void;
  onEdit: (scene: StoryScene) => void;
}> = ({ visible, scene, loading, onClose, onEdit }) => {
  if (!scene) return null;

  return (
    <Drawer
      title={
        <Space>
          <FileTextOutlined style={{ color: '#8B0000' }} />
          <span>Scene #{scene.scene_order} Details</span>
        </Space>
      }
      placement="right"
      width={700}
      open={visible}
      onClose={onClose}
      extra={
        <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(scene)}>
          Edit Scene
        </Button>
      }
    >
      <Spin spinning={loading}>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Scene Order" span={2}>
            <Tag color="blue">{scene.scene_order}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Speaker" span={2}>
            <Space>
              <Avatar
                size="small"
                style={{ backgroundColor: scene.speaker?.color || '#ccc' }}
              >
                {scene.speaker?.name?.[0] || '?'}
              </Avatar>
              <Text style={{ color: scene.speaker?.color }}>
                {scene.speaker?.name || 'Unknown'}
              </Text>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Dialog" span={2}>
            <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {scene.dialog_text}
            </Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="Background">
            {scene.background ? (
              <Tag icon={<PictureOutlined />} color="purple">
                {scene.background}
              </Tag>
            ) : (
              <Tag color="default">None</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Sound Effect">
            {scene.sound_effect ? (
              <Tag icon={<SoundOutlined />} color="cyan">
                {scene.sound_effect}
              </Tag>
            ) : (
              <Tag color="default">None</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {dayjs(scene.created_at).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="Story">
            <LinkOutlined /> {scene.story?.title || 'Unknown'}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <div>
          <Space style={{ marginBottom: 16 }}>
            <BranchesOutlined style={{ color: '#8B0000' }} />
            <Title level={5} style={{ margin: 0 }}>Choices</Title>
            <Badge count={scene.choices?.length || 0} showZero color="#2E8B57" />
          </Space>

          {scene.choices && scene.choices.length > 0 ? (
            <Timeline
              items={scene.choices.map((choice) => ({
                color: choice.next_scene_id ? '#2E8B57' : '#DC143C',
                dot: choice.next_scene_id ? (
                  <CheckCircleOutlined />
                ) : (
                  <CloseCircleOutlined />
                ),
                children: (
                  <Card size="small" style={{ marginBottom: 8 }}>
                    <Row gutter={[8, 8]}>
                      <Col span={24}>
                        <Space>
                          <Tag color="purple">Choice {choice.choice_order}</Tag>
                          <Tag color={choice.next_scene_id ? 'green' : 'red'}>
                            {choice.next_scene_id ? 'Has Next Scene' : 'End Branch'}
                          </Tag>
                        </Space>
                      </Col>
                      <Col span={24}>
                        <Text strong>Text: </Text>
                        <Text>{choice.choice_text}</Text>
                      </Col>
                      <Col span={24}>
                        <Text strong>Effect: </Text>
                        <Text>{choice.effect_text}</Text>
                      </Col>
                      {choice.stats_change && Object.keys(choice.stats_change).length > 0 && (
                        <Col span={24}>
                          <Text strong>Stats Change: </Text>
                          <pre style={{ margin: 0, fontSize: 12 }}>
                            {JSON.stringify(choice.stats_change, null, 2)}
                          </pre>
                        </Col>
                      )}
                      {choice.next_scene && (
                        <Col span={24}>
                          <Alert
                            message="Next Scene"
                            description={`Scene #${choice.next_scene.scene_order}: ${choice.next_scene.dialog_text}`}
                            type="info"
                            icon={<LinkOutlined />}
                            showIcon
                          />
                        </Col>
                      )}
                    </Row>
                  </Card>
                ),
              }))}
            />
          ) : (
            <Empty description="No choices for this scene" />
          )}
        </div>
      </Spin>
    </Drawer>
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
        background: null,
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
              rules={[
                { required: true, message: 'Enter scene order' },
                { type: 'number', min: 1, message: 'Order must be at least 1' },
              ]}
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
          rules={[
            { required: true, message: 'Enter dialog text' },
            { max: 1000, message: 'Dialog must be less than 1000 characters' },
          ]}
        >
          <TextArea
            placeholder="Enter the dialog text"
            rows={3}
            showCount
            maxLength={1000}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="background"
              label="Background"
            >
              <Input placeholder="Background image path or URL" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="sound_effect"
              label="Sound Effect"
            >
              <Input placeholder="Sound effect path or URL" />
            </Form.Item>
          </Col>
        </Row>

        <Alert
          message="Note"
          description="You can add choices to this scene after creating it."
          type="info"
          showIcon
          icon={<QuestionCircleOutlined />}
        />
      </Form>
    </Modal>
  );
};

// Main Page Component
const StoryScenesManagementPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const storyId = params.story_id as string;

  const {
    scenes,
    loading,
    filters,
    setFilters,
    stats,
    availableCharacters,
    createScene,
    updateScene,
    deleteScene,
    deleteScenes,
    duplicateScene,
    reorderScenes,
    fetchSceneDetails,
    refresh,
  } = useStoryScenes({ storyId });

  const { story, loading: storyLoading, fetchStory } = useStory(storyId);

  const [viewDrawerVisible, setViewDrawerVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [editingScene, setEditingScene] = useState<StoryScene | null>(null);
  const [selectedScene, setSelectedScene] = useState<StoryScene | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Load story details
  useEffect(() => {
    if (storyId) {
      fetchStory();
    }
  }, [storyId]);

  // Handlers
  const handleAddNew = () => {
    setEditingScene(null);
    setFormModalVisible(true);
  };

  const handleEdit = (scene: StoryScene) => {
    setEditingScene(scene);
    setFormModalVisible(true);
  };

  const handleView = async (scene: StoryScene) => {
    const details = await fetchSceneDetails(scene.id);
    setSelectedScene(details || scene);
    setViewDrawerVisible(true);
  };

  const handleDelete = async (id: string) => {
    await deleteScene(id);
  };

  const handleDuplicate = async (id: string) => {
    await duplicateScene(id);
  };

  const handleReorder = async (reorderedScenes: StoryScene[]) => {
    const ids = reorderedScenes.map(scene => scene.id);
    await reorderScenes(ids);
  };

  const handleBulkDelete = async () => {
    const ids = selectedRowKeys.map(key => key.toString());
    await deleteScenes(ids);
    setSelectedRowKeys([]);
  };

  const handleSceneSubmit = async (data: any) => {
    if (editingScene) {
      await updateScene(editingScene.id, data);
    } else {
      await createScene(data);
    }
    setFormModalVisible(false);
    setEditingScene(null);
  };

  const handleCloseView = () => {
    setViewDrawerVisible(false);
    setSelectedScene(null);
  };

  const handleExport = async () => {
    // Implement export functionality
    message.info('Export feature coming soon');
  };

  // Table selection
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  return (
    <div style={{ padding: 24, background: '#F5F5DC', minHeight: '100vh' }}>
      <Card>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Row align="middle">
            <Col>
              <Space>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => router.back()}
                >
                  Back
                </Button>
                <Divider type="vertical" />
                <FileTextOutlined style={{ fontSize: 24, color: '#8B0000' }} />
                <div>
                  <Title level={2} style={{ margin: 0 }}>
                    Scene Management
                  </Title>
                  {story && (
                    <Text type="secondary">
                      Story: {story.title}
                      {story.description && ` - ${story.description}`}
                    </Text>
                  )}
                </div>
              </Space>
            </Col>
            <Col flex="auto" style={{ textAlign: 'right' }}>
              <Space>
                <Tooltip title="Export Scenes">
                  <Button icon={<ExportOutlined />} onClick={handleExport}>
                    Export
                  </Button>
                </Tooltip>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Statistics */}
        <SceneStatistics
          stats={stats}
          loading={loading}
          storyTitle={story?.title || 'Unknown Story'}
        />

        {/* Filters */}
        <SceneFilters
          filters={filters}
          setFilters={setFilters}
          onRefresh={refresh}
          loading={loading}
          onAddNew={handleAddNew}
          availableCharacters={availableCharacters}
          onBulkDelete={handleBulkDelete}
          selectedRowKeys={selectedRowKeys}
        />

        {/* Scene Table */}
        <SceneTable
          scenes={scenes}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onReorder={handleReorder}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={onSelectChange}
        />

        {/* Scene Order Distribution */}
        {stats?.sceneOrderDistribution && stats.sceneOrderDistribution.length > 0 && (
          <Card size="small" style={{ marginTop: 16 }}>
            <Space>
              <OrderedListOutlined />
              <Text strong>Scene Order Distribution</Text>
            </Space>
            <Row gutter={[8, 8]} style={{ marginTop: 8 }}>
              {stats.sceneOrderDistribution.map((item) => (
                <Col key={item.order}>
                  <Tag color="blue">
                    Order {item.order}: {item.count} scene{item.count > 1 ? 's' : ''}
                  </Tag>
                </Col>
              ))}
            </Row>
          </Card>
        )}
      </Card>

      {/* Scene Form Modal */}
      <SceneFormModal
        visible={formModalVisible}
        storyId={storyId}
        editingScene={editingScene}
        loading={loading}
        characters={availableCharacters}
        existingScenes={scenes}
        onClose={() => {
          setFormModalVisible(false);
          setEditingScene(null);
        }}
        onSubmit={handleSceneSubmit}
      />

      {/* Scene Detail Drawer */}
      <SceneDetailDrawer
        visible={viewDrawerVisible}
        scene={selectedScene}
        loading={loading}
        onClose={handleCloseView}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default StoryScenesManagementPage;
