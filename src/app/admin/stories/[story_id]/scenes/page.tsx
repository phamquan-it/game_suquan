// app/admin/stories/[story_id]/scenes/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  Button,
  Space,
  message,
  Statistic,
  Row,
  Col,
  Typography,
  Badge,
  Tooltip,
  Drawer,
  Divider,
  Empty,
  Spin,
  Alert,
  Avatar,
  Timeline,
  Collapse,
  Tabs,
  Descriptions,
  Checkbox,
  Tag,
} from 'antd';
import {
  EditOutlined,
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
  CheckCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
  BranchesOutlined,
  BookOutlined,
  FlagOutlined,
  WarningOutlined,
  TagOutlined,
  FontSizeOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { StoryCharacter } from '../../hooks/useStories';
import { StoryScene, useStoryScenes, TypingStyle, TYPING_STYLES } from '../../hooks/useStoryScenes';
import { useStory } from '../../hooks/useStory';
import { SceneFilters } from './components/scene_filter';
import { SceneTable } from './components/scene_table';
import { SceneFormModal } from './components/scene_form_modal';
import { SceneDetailDrawer } from './components/scene_detail_drawer';

const { Title, Text, Paragraph } = Typography;

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
    {
      title: 'End Story Scenes',
      value: stats.totalEndStoryScenes || 0,
      icon: <FlagOutlined />,
      color: '#FF4500',
      suffix: `/${stats.total}`,
    },
    {
      title: 'Failed Story Scenes',
      value: stats.totalFailedStoryScenes || 0,
      icon: <WarningOutlined />,
      color: '#DC143C',
      suffix: `/${stats.total}`,
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
        {stats.typingStyleDistribution && stats.typingStyleDistribution.length > 0 && (
          <div>
            <Text strong>Typing Style Distribution: </Text>
            <Space size={[0, 4]} wrap>
              {stats.typingStyleDistribution.map((item: any) => (
                <Tag key={item.style} color="cyan">
                  {item.style}: {item.count}
                </Tag>
              ))}
            </Space>
          </div>
        )}
      </Space>
    </Card>
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
              {stats.sceneOrderDistribution.map((item: any) => (
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
