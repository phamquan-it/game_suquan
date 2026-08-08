// app/admin/stories/[story_id]/scenes/[scene_id]/story-choices/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
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
  DatePicker,
  Descriptions,
  Timeline,
  Upload,
  Progress,
  List,
  Avatar,
  Collapse,
  Tabs,
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
  ArrowLeftOutlined,
  MenuOutlined,
  SoundOutlined,
  PictureOutlined,
  CopyOutlined,
  ExportOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
  BranchesOutlined,
  TrophyOutlined,
  FlagOutlined,
  ThunderboltOutlined,
  SaveOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { useStoryChoices, StoryChoice, StoryScene, Boss, Quest } from '../../../../hooks/useStoryChoices';
import { useStoryScene } from '../../../../hooks/useStoryScene';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// ============================================================
// Choice Statistics Component
// ============================================================
const ChoiceStatistics: React.FC<{ stats: any; loading: boolean; sceneInfo?: StoryScene }> = ({
  stats,
  loading,
  sceneInfo,
}) => {
  if (!stats) return null;

  const statItems = [
    {
      title: 'Total Choices',
      value: stats.total,
      icon: <BranchesOutlined />,
      color: '#8B0000',
      bgColor: '#FFF0F0',
    },
    {
      title: 'With Next Scene',
      value: stats.totalWithNextScene,
      icon: <LinkOutlined />,
      color: '#2E8B57',
      bgColor: '#F0FFF4',
    },
    {
      title: 'With Boss',
      value: stats.totalWithBoss,
      icon: <TrophyOutlined />,
      color: '#DC143C',
      bgColor: '#FFF0F0',
    },
    {
      title: 'With Quests',
      value: stats.totalWithQuests,
      icon: <FlagOutlined />,
      color: '#D4AF37',
      bgColor: '#FFFDF0',
    },
  ];

  return (
    <Card style={{ marginBottom: 16, borderRadius: 12 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <BranchesOutlined style={{ color: '#8B0000', fontSize: 20 }} />
          <Title level={4} style={{ margin: 0 }}>Choice Overview</Title>
          {sceneInfo && (
            <Tag color="blue" icon={<FileTextOutlined />}>
              Scene #{sceneInfo.scene_order}: {sceneInfo.dialog_text.substring(0, 30)}...
            </Tag>
          )}
        </Space>
        <Row gutter={[16, 16]}>
          {statItems.map((item) => (
            <Col xs={24} sm={12} lg={6} key={item.title}>
              <div
                style={{
                  background: item.bgColor,
                  padding: '16px 20px',
                  borderRadius: 8,
                  border: '1px solid #f0f0f0',
                }}
              >
                <Statistic
                  title={
                    <Space>
                      {item.icon}
                      <span style={{ fontSize: 14 }}>{item.title}</span>
                    </Space>
                  }
                  value={item.value}
                  valueStyle={{ color: item.color, fontSize: 28, fontWeight: 600 }}
                  loading={loading}
                />
              </div>
            </Col>
          ))}
        </Row>
        {stats.averageChoicesPerScene > 0 && (
          <Alert
            message={`Average ${stats.averageChoicesPerScene.toFixed(1)} choices per scene`}
            description={`Max: ${stats.maxChoicesInScene} | Min: ${stats.minChoicesInScene}`}
            type="info"
            showIcon
            icon={<OrderedListOutlined />}
          />
        )}
      </Space>
    </Card>
  );
};

// ============================================================
// Choice Filters Component
// ============================================================
const ChoiceFilters: React.FC<{
  filters: any;
  setFilters: (filters: any) => void;
  onRefresh: () => void;
  loading: boolean;
  onAddNew: () => void;
  availableBosses: Boss[];
  availableQuests: Quest[];
  onBulkDelete: () => void;
  selectedRowKeys: React.Key[];
}> = ({
  filters,
  setFilters,
  onRefresh,
  loading,
  onAddNew,
  availableBosses,
  availableQuests,
  onBulkDelete,
  selectedRowKeys,
}) => {
  return (
    <Card size="small" style={{ marginBottom: 16, borderRadius: 12 }}>
      <Row gutter={[12, 12]} align="middle">
        <Col xs={24} md={5}>
          <Input
            placeholder="Search choices..."
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            allowClear
            size="middle"
          />
        </Col>
        <Col xs={12} md={3}>
          <Select
            placeholder="Has Next Scene"
            style={{ width: '100%' }}
            value={filters.hasNextScene}
            onChange={(value) => setFilters({ ...filters, hasNextScene: value })}
            allowClear
            size="middle"
          >
            <Option value={true}>Has Next Scene</Option>
            <Option value={false}>No Next Scene</Option>
          </Select>
        </Col>
        <Col xs={12} md={3}>
          <Select
            placeholder="Has Boss"
            style={{ width: '100%' }}
            value={filters.hasBoss}
            onChange={(value) => setFilters({ ...filters, hasBoss: value })}
            allowClear
            size="middle"
          >
            <Option value={true}>Has Boss</Option>
            <Option value={false}>No Boss</Option>
          </Select>
        </Col>
        <Col xs={12} md={3}>
          <Select
            placeholder="Has Quests"
            style={{ width: '100%' }}
            value={filters.hasQuests}
            onChange={(value) => setFilters({ ...filters, hasQuests: value })}
            allowClear
            size="middle"
          >
            <Option value={true}>Has Quests</Option>
            <Option value={false}>No Quests</Option>
          </Select>
        </Col>
        <Col xs={12} md={3}>
          <Select
            placeholder="Order"
            style={{ width: '100%' }}
            value={filters.orderFrom}
            onChange={(value) => setFilters({ ...filters, orderFrom: value })}
            allowClear
            size="middle"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <Option key={num} value={num}>Order {num}</Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} md={7}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }} wrap>
            <Tooltip title="Refresh">
              <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading} />
            </Tooltip>
            {selectedRowKeys.length > 0 && (
              <Popconfirm
                title="Delete Selected Choices"
                description={`Are you sure you want to delete ${selectedRowKeys.length} choices?`}
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
              Add Choice
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

// ============================================================
// Choice Table Component
// ============================================================
const ChoiceTable: React.FC<{
  choices: StoryChoice[];
  loading: boolean;
  onView: (choice: StoryChoice) => void;
  onEdit: (choice: StoryChoice) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onReorder: (choices: StoryChoice[]) => void;
  selectedRowKeys: React.Key[];
  onSelectChange: (selectedRowKeys: React.Key[], selectedRows: StoryChoice[]) => void;
  onValidate: (id: string) => void;
  onFindPath: (id: string) => void;
  validationResults: Map<string, { valid: boolean; message: string }>;
}> = ({
  choices,
  loading,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onReorder,
  selectedRowKeys,
  onSelectChange,
  onValidate,
  onFindPath,
  validationResults,
}) => {
  const router = useRouter();
  const params = useParams();
  const storyId = params.story_id as string;
  const sceneId = params.scene_id as string;

  const columns: ColumnsType<StoryChoice> = [
    {
      title: '#',
      dataIndex: 'choice_order',
      key: 'order',
      width: 70,
      render: (order: number) => (
        <Tag color="purple" style={{ minWidth: 30, textAlign: 'center', fontWeight: 600 }}>
          {order}
        </Tag>
      ),
      sorter: (a, b) => a.choice_order - b.choice_order,
    },
    {
      title: 'Choice Text',
      dataIndex: 'choice_text',
      key: 'text',
      ellipsis: true,
      width: 200,
      render: (text: string, record: StoryChoice) => (
        <Space>
          <Text ellipsis strong>{text}</Text>
          {validationResults.has(record.id) && (
            <Tooltip title={validationResults.get(record.id)?.message}>
              {validationResults.get(record.id)?.valid ? (
                <CheckCircleOutlined style={{ color: '#2E8B57' }} />
              ) : (
                <CloseCircleOutlined style={{ color: '#DC143C' }} />
              )}
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: 'Effect',
      dataIndex: 'effect_text',
      key: 'effect',
      ellipsis: true,
      width: 150,
      render: (text: string) => (
        <Tooltip title={text}>
          <Text type="secondary" ellipsis>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Next Scene',
      dataIndex: 'next_scene',
      key: 'next_scene',
      width: 120,
      render: (nextScene: any) => (
        nextScene ? (
          <Tooltip title={`Scene #${nextScene.scene_order}: ${nextScene.dialog_text}`}>
            <Tag icon={<LinkOutlined />} color="green">
              Scene {nextScene.scene_order}
            </Tag>
          </Tooltip>
        ) : (
          <Tag color="default">End</Tag>
        )
      ),
    },
    {
      title: 'Boss',
      dataIndex: 'boss',
      key: 'boss',
      width: 100,
      render: (boss: any) => (
        boss ? (
          <Tag icon={<TrophyOutlined />} color="red">
            {boss.name}
          </Tag>
        ) : (
          <Tag color="default">None</Tag>
        )
      ),
    },
    {
      title: 'Quests',
      dataIndex: 'quests',
      key: 'quests',
      width: 80,
      render: (quests: any[]) => (
        <Badge
          count={quests?.length || 0}
          showZero
          color={quests?.length > 0 ? '#D4AF37' : '#d9d9d9'}
        />
      ),
    },
    {
      title: 'Stats Change',
      dataIndex: 'stats_change',
      key: 'stats_change',
      width: 100,
      render: (statsChange: Record<string, any>) => {
        const keys = Object.keys(statsChange || {});
        return keys.length > 0 ? (
          <Tooltip title={JSON.stringify(statsChange, null, 2)}>
            <Tag color="blue">{keys.length} changes</Tag>
          </Tooltip>
        ) : (
          <Tag color="default">None</Tag>
        );
      },
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
      width: 280,
      fixed: 'right',
      render: (_: any, record: StoryChoice) => {
        const menuItems: MenuProps['items'] = [
          {
            key: 'validate',
            icon: <CheckCircleOutlined />,
            label: 'Validate Choice',
            onClick: () => onValidate(record.id),
          },
          {
            key: 'path',
            icon: <LinkOutlined />,
            label: 'Find Path',
            onClick: () => onFindPath(record.id),
          },
          { type: 'divider' },
          {
            key: 'view',
            icon: <EyeOutlined />,
            label: 'View Details',
            onClick: () => onView(record),
          },
          {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Edit Choice',
            onClick: () => onEdit(record),
          },
          {
            key: 'duplicate',
            icon: <CopyOutlined />,
            label: 'Duplicate Choice',
            onClick: () => onDuplicate(record.id),
          },
          { type: 'divider' },
          {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Delete Choice',
            danger: true,
            onClick: () => {
              Modal.confirm({
                title: 'Delete Choice',
                content: 'Are you sure you want to delete this choice?',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk: () => onDelete(record.id),
              });
            },
          },
        ];

        return (
          <Space size="small" wrap>
            <Tooltip title="View Choices">
              <Button
                type="primary"
                size="small"
                icon={<BranchesOutlined />}
                onClick={() => router.push(`/admin/stories/${storyId}/scenes/${sceneId}/story-choices`)}
                style={{ 
                  backgroundColor: '#8B0000', 
                  borderColor: '#8B0000',
                  minWidth: 70,
                }}
              >
                Choices
              </Button>
            </Tooltip>
            <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
              <Button type="text" size="small" icon={<MenuOutlined />} />
            </Dropdown>
          </Space>
        );
      },
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

    const reorderedChoices = [...choices];
    const [draggedItem] = reorderedChoices.splice(draggingIndex, 1);
    reorderedChoices.splice(index, 0, draggedItem);
    
    const updatedChoices = reorderedChoices.map((choice, idx) => ({
      ...choice,
      choice_order: idx + 1,
    }));
    
    onReorder(updatedChoices);
    setDraggingIndex(index);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  return (
    <Table
      columns={columns}
      dataSource={choices}
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
        showTotal: (total) => `Total ${total} choices`,
        pageSizeOptions: ['10', '20', '50', '100'],
      }}
      scroll={{ x: 1600 }}
      locale={{
        emptyText: (
          <Empty
            description="No choices found for this scene"
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

// ============================================================
// Choice Detail Drawer
// ============================================================
const ChoiceDetailDrawer: React.FC<{
  visible: boolean;
  choice: StoryChoice | null;
  loading: boolean;
  onClose: () => void;
  onEdit: (choice: StoryChoice) => void;
}> = ({ visible, choice, loading, onClose, onEdit }) => {
  if (!choice) return null;

  return (
    <Drawer
      title={
        <Space>
          <BranchesOutlined style={{ color: '#8B0000' }} />
          <span>Choice #{choice.choice_order} Details</span>
        </Space>
      }
      placement="right"
      width={720}
      open={visible}
      onClose={onClose}
      extra={
        <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(choice)}>
          Edit Choice
        </Button>
      }
    >
      <Spin spinning={loading}>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Order" span={2}>
            <Tag color="purple" style={{ fontSize: 16 }}>{choice.choice_order}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Choice Text" span={2}>
            <Paragraph style={{ margin: 0, fontSize: 16 }}>{choice.choice_text}</Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="Effect" span={2}>
            <Paragraph style={{ margin: 0 }}>{choice.effect_text}</Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="Next Scene">
            {choice.next_scene ? (
              <Tag icon={<LinkOutlined />} color="green" style={{ fontSize: 14 }}>
                Scene #{choice.next_scene.scene_order}
              </Tag>
            ) : (
              <Tag color="default">End of Branch</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Boss">
            {choice.boss ? (
              <Tag icon={<TrophyOutlined />} color="red" style={{ fontSize: 14 }}>
                {choice.boss.name}
              </Tag>
            ) : (
              <Tag color="default">None</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Stats Change" span={2}>
            {choice.stats_change && Object.keys(choice.stats_change).length > 0 ? (
              <div style={{ background: '#f5f5f5', padding: 8, borderRadius: 4 }}>
                <pre style={{ margin: 0, fontSize: 12 }}>
                  {JSON.stringify(choice.stats_change, null, 2)}
                </pre>
              </div>
            ) : (
              <Text type="secondary">No stat changes</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Quests" span={2}>
            {choice.quests && choice.quests.length > 0 ? (
              <Space direction="vertical" style={{ width: '100%' }}>
                {choice.quests.map((q, index) => (
                  <Tag key={index} icon={<FlagOutlined />} color="gold" style={{ fontSize: 14 }}>
                    {q.quest?.name || q.quest_id}
                  </Tag>
                ))}
              </Space>
            ) : (
              <Text type="secondary">No quests associated</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {dayjs(choice.created_at).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="ID">
            <Text copyable>{choice.id}</Text>
          </Descriptions.Item>
        </Descriptions>

        {choice.next_scene && (
          <>
            <Divider />
            <Alert
              message="Next Scene Preview"
              description={
                <div>
                  <Text strong>Scene #{choice.next_scene.scene_order}</Text>
                  <Paragraph style={{ marginTop: 8 }}>
                    {choice.next_scene.dialog_text}
                  </Paragraph>
                  {choice.next_scene.speaker_id && (
                    <Tag color="blue">Speaker: {choice.next_scene.speaker_id}</Tag>
                  )}
                  {choice.next_scene.background && (
                    <Tag icon={<PictureOutlined />}>{choice.next_scene.background}</Tag>
                  )}
                  {choice.next_scene.sound_effect && (
                    <Tag icon={<SoundOutlined />}>{choice.next_scene.sound_effect}</Tag>
                  )}
                </div>
              }
              type="info"
              icon={<LinkOutlined />}
              showIcon
            />
          </>
        )}
      </Spin>
    </Drawer>
  );
};

// ============================================================
// Choice Form Modal
// ============================================================
const ChoiceFormModal: React.FC<{
  visible: boolean;
  sceneId: string;
  editingChoice: StoryChoice | null;
  loading: boolean;
  availableScenes: StoryScene[];
  availableBosses: Boss[];
  availableQuests: Quest[];
  existingChoices: StoryChoice[];
  onClose: () => void;
  onSubmit: (data: any) => void;
}> = ({
  visible,
  sceneId,
  editingChoice,
  loading,
  availableScenes,
  availableBosses,
  availableQuests,
  existingChoices,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [statsChangeKeys, setStatsChangeKeys] = useState<string[]>([]);

  useEffect(() => {
    if (editingChoice) {
      const statsKeys = Object.keys(editingChoice.stats_change || {});
      setStatsChangeKeys(statsKeys);
      form.setFieldsValue({
        ...editingChoice,
        quest_ids: editingChoice.quests?.map(q => q.quest_id) || [],
        stats_change: editingChoice.stats_change || {},
      });
    } else {
      form.resetFields();
      const nextOrder = existingChoices.length + 1;
      form.setFieldsValue({
        scene_id: sceneId,
        choice_order: nextOrder,
        stats_change: {},
        quest_ids: [],
        next_scene_id: null,
        boss_id: null,
      });
      setStatsChangeKeys([]);
    }
  }, [editingChoice, sceneId, existingChoices.length, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleAddStatsChange = () => {
    const newKey = `stat_${statsChangeKeys.length + 1}`;
    setStatsChangeKeys([...statsChangeKeys, newKey]);
    const currentStats = form.getFieldValue('stats_change') || {};
    form.setFieldsValue({
      stats_change: { ...currentStats, [newKey]: 0 },
    });
  };

  const handleRemoveStatsChange = (key: string) => {
    setStatsChangeKeys(statsChangeKeys.filter(k => k !== key));
    const currentStats = form.getFieldValue('stats_change') || {};
    delete currentStats[key];
    form.setFieldsValue({ stats_change: currentStats });
  };

  return (
    <Modal
      title={
        <Space>
          {editingChoice ? <EditOutlined /> : <PlusOutlined />}
          <span>{editingChoice ? 'Edit Choice' : 'Add New Choice'}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={800}
      okText={editingChoice ? 'Update' : 'Create'}
      okButtonProps={{ size: 'large' }}
      cancelButtonProps={{ size: 'large' }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="scene_id" hidden>
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="choice_order"
              label="Choice Order"
              rules={[
                { required: true, message: 'Enter choice order' },
                { type: 'number', min: 1, message: 'Order must be at least 1' },
              ]}
            >
              <Input type="number" min={1} placeholder="Enter order number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="next_scene_id"
              label="Next Scene (Optional)"
            >
              <Select placeholder="Select next scene" allowClear>
                {availableScenes
                  .filter(scene => scene.id !== sceneId)
                  .map((scene) => (
                    <Option key={scene.id} value={scene.id}>
                      Scene #{scene.scene_order}: {scene.dialog_text.substring(0, 30)}...
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="choice_text"
          label="Choice Text"
          rules={[
            { required: true, message: 'Enter choice text' },
            { max: 200, message: 'Choice text must be less than 200 characters' },
          ]}
        >
          <TextArea
            placeholder="Enter the choice text (e.g., 'Fight the dragon')"
            rows={2}
            showCount
            maxLength={200}
          />
        </Form.Item>

        <Form.Item
          name="effect_text"
          label="Effect Description"
          rules={[
            { required: true, message: 'Enter effect description' },
            { max: 500, message: 'Effect must be less than 500 characters' },
          ]}
        >
          <TextArea
            placeholder="Describe what happens when this choice is selected"
            rows={2}
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="boss_id"
              label="Boss (Optional)"
            >
              <Select placeholder="Select boss" allowClear>
                {availableBosses.map((boss) => (
                  <Option key={boss.id} value={boss.id}>
                    <Space>
                      <TrophyOutlined />
                      {boss.name}
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="quest_ids"
              label="Quests (Optional)"
            >
              <Select
                placeholder="Select quests"
                mode="multiple"
                allowClear
                optionLabelProp="label"
              >
                {availableQuests.map((quest) => (
                  <Option key={quest.id} value={quest.id} label={quest.name}>
                    <Space>
                      <FlagOutlined />
                      {quest.name}
                      <Tag color={quest.category === 'main' ? 'red' : 'blue'}>
                        {quest.category}
                      </Tag>
                      <Tag color="orange">{quest.difficulty}</Tag>
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Stats Changes</Divider>

        <Form.Item label="Stats Changes">
          <Space direction="vertical" style={{ width: '100%' }}>
            {statsChangeKeys.map((key) => (
              <Row key={key} gutter={8} align="middle">
                <Col span={10}>
                  <Form.Item
                    name={['stats_change', key]}
                    noStyle
                    rules={[{ required: true, message: 'Enter stat change value' }]}
                  >
                    <Input
                      placeholder="Stat name"
                      defaultValue={key}
                      onChange={(e) => {
                        const newKey = e.target.value;
                        if (newKey && newKey !== key) {
                          const currentStats = form.getFieldValue('stats_change') || {};
                          const value = currentStats[key];
                          delete currentStats[key];
                          currentStats[newKey] = value;
                          setStatsChangeKeys(statsChangeKeys.map(k => k === key ? newKey : k));
                          form.setFieldsValue({ stats_change: currentStats });
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    name={['stats_change', key]}
                    noStyle
                    rules={[{ required: true, message: 'Enter value' }]}
                  >
                    <Input type="number" placeholder="Value" />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveStatsChange(key)}
                    size="small"
                  />
                </Col>
              </Row>
            ))}
            <Button type="dashed" onClick={handleAddStatsChange} block icon={<PlusOutlined />}>
              Add Stats Change
            </Button>
          </Space>
        </Form.Item>

        <Alert
          message="Note"
          description="Choices create branching paths in your story. Each choice can lead to a different scene, trigger a boss fight, or reward players with quests."
          type="info"
          showIcon
          icon={<QuestionCircleOutlined />}
        />
      </Form>
    </Modal>
  );
};

// ============================================================
// Main Page Component
// ============================================================
const StoryChoicesManagementPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const storyId = params.story_id as string;
  const sceneId = params.scene_id as string;

  const {
    choices,
    loading,
    filters,
    setFilters,
    stats,
    availableScenes,
    availableBosses,
    availableQuests,
    createChoice,
    updateChoice,
    deleteChoice,
    deleteChoices,
    validateChoiceChain,
    duplicateChoice,
    reorderChoices,
    fetchChoiceDetails,
    exportChoices,
    refresh,
  } = useStoryChoices({ sceneId });

  const { scene, loading: sceneLoading, fetchScene } = useStoryScene(sceneId);

  const [viewDrawerVisible, setViewDrawerVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [editingChoice, setEditingChoice] = useState<StoryChoice | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<StoryChoice | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [validationResults, setValidationResults] = useState<Map<string, { valid: boolean; message: string }>>(new Map());

  // Load scene details
  useEffect(() => {
    if (sceneId) {
      fetchScene();
    }
  }, [sceneId]);

  // Handlers
  const handleAddNew = () => {
    setEditingChoice(null);
    setFormModalVisible(true);
  };

  const handleEdit = (choice: StoryChoice) => {
    setEditingChoice(choice);
    setFormModalVisible(true);
  };

  const handleView = async (choice: StoryChoice) => {
    const details = await fetchChoiceDetails(choice.id);
    setSelectedChoice(details || choice);
    setViewDrawerVisible(true);
  };

  const handleDelete = async (id: string) => {
    await deleteChoice(id);
  };

  const handleDuplicate = async (id: string) => {
    await duplicateChoice(id);
  };

  const handleReorder = async (reorderedChoices: StoryChoice[]) => {
    const ids = reorderedChoices.map(choice => choice.id);
    await reorderChoices(ids);
  };

  const handleBulkDelete = async () => {
    const ids = selectedRowKeys.map(key => key.toString());
    await deleteChoices(ids);
    setSelectedRowKeys([]);
  };

  const handleChoiceSubmit = async (data: any) => {
    if (editingChoice) {
      await updateChoice(editingChoice.id, data);
    } else {
      await createChoice(data);
    }
    setFormModalVisible(false);
    setEditingChoice(null);
  };

  const handleCloseView = () => {
    setViewDrawerVisible(false);
    setSelectedChoice(null);
  };

  const handleExport = async () => {
    const data = await exportChoices(sceneId);
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `choices_scene_${sceneId}_${dayjs().format('YYYY-MM-DD_HH-mm')}.json`;
      a.click();
      URL.revokeObjectURL(url);
      message.success('Choices exported successfully');
    }
  };

  // Validate all choices
  const handleValidateAll = async () => {
    if (choices.length === 0) {
      message.info('No choices to validate');
      return;
    }

    Modal.info({
      title: 'Choice Chain Validation',
      content: 'Validating all choice chains...',
      icon: <CheckCircleOutlined />,
      okText: 'Close',
      onOk: async () => {
        setValidationResults(new Map());
        
        let validCount = 0;
        let invalidCount = 0;
        const results = new Map();

        for (const choice of choices) {
          const result = await validateChoiceChain(choice.id);
          results.set(choice.id, {
            valid: result.valid,
            message: result.message,
          });
          
          if (result.valid) {
            validCount++;
          } else {
            invalidCount++;
          }
        }

        setValidationResults(results);

        Modal.success({
          title: 'Validation Complete',
          content: (
            <div>
              <p>
                <CheckCircleOutlined style={{ color: '#2E8B57' }} /> Valid: {validCount}
              </p>
              <p>
                <CloseCircleOutlined style={{ color: '#DC143C' }} /> Invalid: {invalidCount}
              </p>
              {invalidCount > 0 && (
                <Alert
                  message="Some choices have issues"
                  description="Check the table below for details"
                  type="warning"
                  showIcon
                />
              )}
            </div>
          ),
          okText: 'Close',
        });
      },
    });
  };

  // Validate single choice
  const handleValidateSingle = async (choiceId: string) => {
    const result = await validateChoiceChain(choiceId);
    
    if (result.valid) {
      Modal.success({
        title: 'Validation Passed',
        content: (
          <div>
            <p><CheckCircleOutlined style={{ color: '#2E8B57' }} /> Choice chain is valid</p>
            <p><Text type="secondary">{result.message}</Text></p>
            {result.chain && (
              <div>
                <Text strong>Path: </Text>
                <Space wrap>
                  {result.chain.map((id, index) => (
                    <React.Fragment key={id}>
                      <Tag color="blue">Choice {index + 1}</Tag>
                      {index < result.chain!.length - 1 && <span>→</span>}
                    </React.Fragment>
                  ))}
                </Space>
              </div>
            )}
          </div>
        ),
        okText: 'Close',
      });
    } else {
      Modal.error({
        title: 'Validation Failed',
        content: (
          <div>
            <p><CloseCircleOutlined style={{ color: '#DC143C' }} /> {result.message}</p>
            {result.chain && (
              <div>
                <Text strong>Chain: </Text>
                <Space wrap>
                  {result.chain.map((id, index) => (
                    <React.Fragment key={id}>
                      <Tag color="red">Choice {index + 1}</Tag>
                      {index < result.chain!.length - 1 && <span>→</span>}
                    </React.Fragment>
                  ))}
                </Space>
                <Alert
                  message="Circular reference detected!"
                  description="The choice chain creates a loop. Please check your choices."
                  type="error"
                  showIcon
                  style={{ marginTop: 8 }}
                />
              </div>
            )}
          </div>
        ),
        okText: 'Close',
      });
    }
  };

  // Find choice chain path
  const handleFindPath = async (choiceId: string) => {
    const result = await validateChoiceChain(choiceId);
    
    if (result.chain) {
      Modal.info({
        title: 'Choice Path',
        content: (
          <div>
            <Text strong>Path from Choice #{choices.find(c => c.id === choiceId)?.choice_order}</Text>
            <div style={{ marginTop: 16 }}>
              <Timeline
                items={result.chain.map((id, index) => {
                  const choice = choices.find(c => c.id === id);
                  return {
                    color: index === result.chain!.length - 1 ? 'green' : 'blue',
                    children: (
                      <div>
                        <Text strong>Choice #{choice?.choice_order || index + 1}</Text>
                        <div><Text type="secondary">{choice?.choice_text || 'Unknown'}</Text></div>
                        {index < result.chain!.length - 1 && (
                          <Tag icon={<LinkOutlined />} color="green" style={{ marginTop: 4 }}>
                            Leads to next
                          </Tag>
                        )}
                        {index === result.chain!.length - 1 && (
                          <Tag icon={<FlagOutlined />} color="gold" style={{ marginTop: 4 }}>
                            End of chain
                          </Tag>
                        )}
                      </div>
                    ),
                  };
                })}
              />
            </div>
            <Divider />
            <Alert
              message={`Chain length: ${result.chain.length} choices`}
              description={result.valid ? 'Valid chain' : 'Invalid chain - circular reference detected'}
              type={result.valid ? 'success' : 'error'}
              showIcon
            />
          </div>
        ),
        okText: 'Close',
        width: 600,
      });
    }
  };

  // Table selection
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // Navigation
  const handleBack = () => {
    router.back();
  };

  return (
    <div style={{ padding: 24, background: '#F5F5DC', minHeight: '100vh' }}>
      <Card style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Row align="middle" gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Space>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={handleBack}
                  size="large"
                >
                  Back
                </Button>
                <Divider type="vertical" style={{ height: 32 }} />
                <BranchesOutlined style={{ fontSize: 28, color: '#8B0000' }} />
                <div>
                  <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
                    Choice Management
                  </Title>
                  {scene && (
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      Scene #{scene.scene_order}: {scene.dialog_text}
                    </Text>
                  )}
                </div>
              </Space>
            </Col>
            <Col xs={24} md={12} style={{ textAlign: 'right' }}>
              <Space wrap>
                <Tooltip title="Export Choices">
                  <Button icon={<ExportOutlined />} onClick={handleExport}>
                    Export
                  </Button>
                </Tooltip>
                <Tooltip title="Validate All Choices">
                  <Button 
                    icon={<CheckCircleOutlined />} 
                    onClick={handleValidateAll}
                    style={{ borderColor: '#2E8B57', color: '#2E8B57' }}
                  >
                    Validate All
                  </Button>
                </Tooltip>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Statistics */}
        <ChoiceStatistics
          stats={stats}
          loading={loading}
          sceneInfo={scene || undefined}
        />

        {/* Filters */}
        <ChoiceFilters
          filters={filters}
          setFilters={setFilters}
          onRefresh={refresh}
          loading={loading}
          onAddNew={handleAddNew}
          availableBosses={availableBosses}
          availableQuests={availableQuests}
          onBulkDelete={handleBulkDelete}
          selectedRowKeys={selectedRowKeys}
        />

        {/* Validation Results Summary */}
        {validationResults.size > 0 && (
          <Card size="small" style={{ marginBottom: 16, backgroundColor: '#fafafa', borderRadius: 8 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Validation Results</Text>
              <Row gutter={[8, 8]}>
                {Array.from(validationResults.entries()).map(([id, result]) => {
                  const choice = choices.find(c => c.id === id);
                  return (
                    <Col key={id}>
                      <Tooltip title={result.message}>
                        <Tag 
                          color={result.valid ? 'success' : 'error'}
                          icon={result.valid ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                          style={{ padding: '4px 12px', fontSize: 13 }}
                        >
                          Choice #{choice?.choice_order || '?'} {result.valid ? '✅' : '❌'}
                        </Tag>
                      </Tooltip>
                    </Col>
                  );
                })}
              </Row>
            </Space>
          </Card>
        )}

        {/* Choice Table */}
        <ChoiceTable
          choices={choices}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onReorder={handleReorder}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={onSelectChange}
          onValidate={handleValidateSingle}
          onFindPath={handleFindPath}
          validationResults={validationResults}
        />
      </Card>

      {/* Choice Form Modal */}
      <ChoiceFormModal
        visible={formModalVisible}
        sceneId={sceneId}
        editingChoice={editingChoice}
        loading={loading}
        availableScenes={availableScenes}
        availableBosses={availableBosses}
        availableQuests={availableQuests}
        existingChoices={choices}
        onClose={() => {
          setFormModalVisible(false);
          setEditingChoice(null);
        }}
        onSubmit={handleChoiceSubmit}
      />

      {/* Choice Detail Drawer */}
      <ChoiceDetailDrawer
        visible={viewDrawerVisible}
        choice={selectedChoice}
        loading={loading}
        onClose={handleCloseView}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default StoryChoicesManagementPage;
