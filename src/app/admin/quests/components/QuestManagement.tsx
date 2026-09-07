"use client"
// QuestManagement.tsx (Updated with Reward Management)
import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Card,
  Tag,
  Popconfirm,
  message,
  Tabs,
  Divider,
  Row,
  Col,
  Typography,
  Badge,
  Tooltip,
  Collapse,
  Descriptions,
  List,
  Empty,
  Radio,
  Switch,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  StarOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  FileTextOutlined,
  SettingOutlined,
  DownOutlined,
  RightOutlined,
  GiftOutlined,
  GoldOutlined,
  ExperimentOutlined,
  DeleteOutlined as DeleteIcon,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { GameAction, Quest, QuestCategory, QuestDifficulty, QuestStatus, QuestType, QuestReward, useQuests } from '../hooks/useQuest';
import { useCreateGameAction } from '../game_actions/useGameAction';
import type { CreateGameActionInput } from '../game_actions/types';

// Tùy chọn danh mục hành động (dùng cho modal tạo action)
const ACTION_CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: 'combat', label: 'Chiến đấu' },
  { value: 'exploration', label: 'Khám phá' },
  { value: 'social', label: 'Xã hội' },
  { value: 'crafting', label: 'Chế tạo' },
  { value: 'quest', label: 'Nhiệm vụ' },
  { value: 'economy', label: 'Kinh tế' },
  { value: 'magic', label: 'Phép thuật' },
  { value: 'stealth', label: 'Tàng hình' },
];

// Sinh ID không dấu từ mô tả (giữ dấu chấm, gạch dưới, gạch ngang)
const convertToSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s_.-]/g, '')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^-+|-+$/g, '');
};

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

// Category icons and colors
const categoryConfig: Record<QuestCategory, { icon: React.ReactNode; color: string; label: string }> = {
  main: { icon: <TrophyOutlined />, color: '#FF8C00', label: 'Chính' },
  daily: { icon: <ClockCircleOutlined />, color: '#2E8B57', label: 'Hàng ngày' },
  weekly: { icon: <StarOutlined />, color: '#FF8C00', label: 'Hàng tuần' },
  alliance: { icon: <TeamOutlined />, color: '#1E90FF', label: 'Liên minh' },
  event: { icon: <ThunderboltOutlined />, color: '#DC143C', label: 'Sự kiện' },
};

// Difficulty config
const difficultyConfig: Record<QuestDifficulty, { color: string; label: string }> = {
  easy: { color: '#2E8B57', label: 'Dễ' },
  medium: { color: '#FF8C00', label: 'Trung bình' },
  hard: { color: '#DC143C', label: 'Khó' },
  expert: { color: '#8B0000', label: 'Chuyên gia' },
};

// Quest type config
const questTypeLabels: Record<QuestType, string> = {
  login: 'Đăng nhập',
  pvp_battle: 'Chiến đấu PvP',
  pve_battle: 'Chiến đấu PvE',
  exploration: 'Khám phá',
  boss_hunt: 'Săn Boss',
  alliance: 'Liên minh',
  alliance_battle: 'Chiến đấu liên minh',
  crafting: 'Chế tạo',
  beauty: 'Làm đẹp',
};

// Reward type config
const rewardTypeConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  item: { icon: <GiftOutlined />, color: '#D4AF37', label: 'Vật phẩm' },
  currency: { icon: <GoldOutlined />, color: '#FF8C00', label: 'Tiền tệ' },
  exp: { icon: <ExperimentOutlined />, color: '#2E8B57', label: 'EXP' },
};

// Form item for requirement
interface RequirementFormItem {
  id?: string;
  requirement_type: string;
  target: number;
  meta: Record<string, unknown>;
}

// Form item for reward
interface RewardFormItem {
  id?: string;
  reward_type: 'item' | 'currency' | 'exp';
  item_id?: string | null;
  amount: number;
  currency_type?: string | null;
  experience_amount?: number | null;
  description?: string | null;
}

interface QuestManagementProps {
  onSelectQuest?: (quest: Quest) => void;
}

const QuestManagement: React.FC<QuestManagementProps> = ({ onSelectQuest }) => {
  const {
    data: quests,
    actions,
    loading,
    createItem,
    updateItem,
    deleteItem,
    fetchData,
    fetchActions,
    addReward,
    removeReward,
  } = useQuests();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [form] = Form.useForm();
  const [requirements, setRequirements] = useState<RequirementFormItem[]>([]);
  const [rewards, setRewards] = useState<RewardFormItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  // State cho modal tạo game action
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [actionForm] = Form.useForm();
  const createActionMutation = useCreateGameAction();

  // Filter quests based on active tab
  const filteredQuests = useMemo(() => {
    if (activeTab === 'all') return quests;
    return quests.filter(q => q.category === activeTab);
  }, [quests, activeTab]);

  // Stats calculations
  const stats = useMemo(() => {
    const total = quests.length;
    const active = quests.filter(q => q.status === 'active').length;
    const byCategory: Record<QuestCategory, number> = {
      daily: 0,
      weekly: 0,
      alliance: 0,
      event: 0,
      main: 0
    };
    quests.forEach(q => {
      byCategory[q.category] = (byCategory[q.category] || 0) + 1;
    });
    return { total, active, byCategory };
  }, [quests]);

  // Open create modal
  const handleCreate = () => {
    setEditingQuest(null);
    form.resetFields();
    setRequirements([]);
    setRewards([]);
    setModalVisible(true);
  };

  // Open edit modal
  const handleEdit = (quest: Quest) => {
    setEditingQuest(quest);
    form.setFieldsValue({
      name: quest.name,
      description: quest.description,
      type: quest.type,
      category: quest.category,
      difficulty: quest.difficulty,
      status: quest.status,
      completion_limit: quest.completion_limit,
      min_level: quest.min_level,
      max_level: quest.max_level,
    });
    setRequirements(
      quest.requirements.map(r => ({
        id: r.id,
        requirement_type: r.requirement_type,
        target: r.target,
        meta: r.meta,
      }))
    );
    setRewards(
      quest.rewards.map(r => ({
        id: r.id,
        reward_type: r.reward_type,
        item_id: r.item_id,
        amount: r.amount,
        currency_type: r.currency_type,
        experience_amount: r.experience_amount,
        description: r.description,
      }))
    );
    setModalVisible(true);
  };

  // Handle save (create or update)
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const questData = {
        name: values.name,
        description: values.description || null,
        type: values.type as QuestType,
        category: values.category as QuestCategory,
        difficulty: values.difficulty as QuestDifficulty,
        status: values.status as QuestStatus,
        completion_limit: values.completion_limit || null,
        min_level: values.min_level || 1,
        max_level: values.max_level || 999,
        requirements: requirements.map(r => ({
          requirement_type: r.requirement_type,
          target: r.target,
          meta: r.meta || {},
        })),
        rewards: rewards.map(r => ({
          reward_type: r.reward_type,
          amount: r.amount,
          item_id: r.item_id || null,
          currency_type: r.currency_type || null,
          experience_amount: r.experience_amount || null,
          description: r.description || null,
        })),
      };

      if (editingQuest) {
        await updateItem({ id: editingQuest.id, ...questData });
        message.success('Cập nhật nhiệm vụ thành công');
      } else {
        await createItem(questData);
        message.success('Tạo nhiệm vụ thành công');
      }

      setModalVisible(false);
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Thao tác thất bại');
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      message.success('Xóa nhiệm vụ thành công');
    } catch (error) {
      message.error('Xóa nhiệm vụ thất bại');
    }
  };

  // Mở modal tạo action
  const handleOpenActionModal = () => {
    actionForm.resetFields();
    actionForm.setFieldsValue({
      repeatable: true,
      metadata: '{}',
    });
    setActionModalVisible(true);
  };

  // Tự động sinh ID từ mô tả khi chưa nhập
  const handleActionDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value;
    const currentId = actionForm.getFieldValue('id');
    if (!currentId || currentId === '') {
      actionForm.setFieldsValue({ id: convertToSlug(description) });
    }
  };

  // Xử lý tạo action
  const handleCreateAction = async () => {
    try {
      const values = await actionForm.validateFields();
      let actionId = values.id?.trim();
      if (!actionId) {
        actionId = convertToSlug(values.description);
      }

      const input: CreateGameActionInput = {
        id: actionId,
        description: values.description,
        category: values.category,
        repeatable: values.repeatable ?? true,
        metadata: values.metadata ? JSON.parse(values.metadata) : {},
      };

      await createActionMutation.mutateAsync(input);
      message.success('Tạo action thành công');
      setActionModalVisible(false);
      fetchActions(); // Làm mới danh sách action để hiển thị trong yêu cầu nhiệm vụ
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Không thể tạo action');
    }
  };

  // Handle delete reward
  const handleDeleteReward = async (questId: string, rewardId: string) => {
    try {
      await removeReward(questId, rewardId);
      message.success('Xóa phần thưởng thành công');
    } catch (error) {
      message.error('Xóa phần thưởng thất bại');
    }
  };

  // Add requirement
  const addRequirement = () => {
    setRequirements([
      ...requirements,
      {
        requirement_type: '',
        target: 1,
        meta: {},
      },
    ]);
  };

  // Remove requirement
  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  // Update requirement
  const updateRequirement = (index: number, field: keyof RequirementFormItem, value: any) => {
    const updated = [...requirements];
    updated[index] = { ...updated[index], [field]: value };
    setRequirements(updated);
  };

  // Add reward
  const addRewardItem = () => {
    setRewards([
      ...rewards,
      {
        reward_type: 'item',
        amount: 1,
        item_id: null,
        currency_type: null,
        experience_amount: null,
        description: null,
      },
    ]);
  };

  // Remove reward from form
  const removeRewardItem = (index: number) => {
    setRewards(rewards.filter((_, i) => i !== index));
  };

  // Update reward
  const updateReward = (index: number, field: keyof RewardFormItem, value: any) => {
    const updated = [...rewards];
    updated[index] = { ...updated[index], [field]: value };

    // Reset type-specific fields
    if (field === 'reward_type') {
      if (value === 'exp') {
        updated[index].experience_amount = 100;
        updated[index].item_id = null;
        updated[index].currency_type = null;
      } else if (value === 'item') {
        updated[index].item_id = null;
        updated[index].currency_type = null;
        updated[index].experience_amount = null;
      } else if (value === 'currency') {
        updated[index].currency_type = null;
        updated[index].item_id = null;
        updated[index].experience_amount = null;
      }
    }

    setRewards(updated);
  };

  // Expanded row render
  const expandedRowRender = (record: Quest) => {
    return (
      <div style={{ padding: '16px 24px', background: '#FAF8F0' }}>
        <Descriptions
          title="Chi tiết nhiệm vụ"
          bordered
          column={{ xs: 1, sm: 2, md: 2 }}
          size="small"
        >
          <Descriptions.Item label="Mô tả" span={2}>
            {record.description || 'Không có mô tả'}
          </Descriptions.Item>
          <Descriptions.Item label="Yêu cầu" span={2}>
            {record.requirements.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {record.requirements.map((req, idx) => (
                  <li key={idx}>
                    <strong>{req.requirement_type}:</strong> {req.target}
                    {req.meta && Object.keys(req.meta).length > 0 && (
                      <span style={{ color: '#666', marginLeft: 8 }}>
                        ({JSON.stringify(req.meta)})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              'Không có yêu cầu'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Phần thưởng" span={2}>
            {record.rewards.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {record.rewards.map((reward, idx) => (
                  <li key={idx}>
                    <Tag color={rewardTypeConfig[reward.reward_type]?.color} icon={rewardTypeConfig[reward.reward_type]?.icon}>
                      {rewardTypeConfig[reward.reward_type]?.label}
                    </Tag>
                    <strong>
                      {reward.reward_type === 'exp'
                        ? ` +${reward.experience_amount} EXP`
                        : reward.reward_type === 'currency'
                          ? ` +${reward.amount} ${reward.currency_type}`
                          : ` +${reward.amount} x ${reward.item_id}`
                      }
                    </strong>
                    {reward.description && <span style={{ color: '#666', marginLeft: 8 }}>({reward.description})</span>}
                  </li>
                ))}
              </ul>
            ) : (
              'Không có phần thưởng'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Giới hạn hoàn thành">
            {record.completion_limit || 'Không giới hạn'}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {record.created_at ? dayjs(record.created_at).format('DD/MM/YYYY HH:mm') : '--'}
          </Descriptions.Item>
          <Descriptions.Item label="Cập nhật lần cuối">
            {record.updated_at ? dayjs(record.updated_at).format('DD/MM/YYYY HH:mm') : '--'}
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  };

  // Table columns
  const columns = [
    {
      title: 'Tên nhiệm vụ',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      fixed: 'left' as const,
      render: (text: string, record: Quest) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: '#8B4513', fontSize: 14 }}>{text}</Text>
          {record.description && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.description.length > 80 ? `${record.description.substring(0, 80)}...` : record.description}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: QuestCategory) => (
        <Tag icon={categoryConfig[category]?.icon} color={categoryConfig[category]?.color}>
          {categoryConfig[category]?.label}
        </Tag>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 140,
      render: (type: QuestType) => (
        <Tag color="geekblue">{questTypeLabels[type]}</Tag>
      ),
    },
    {
      title: 'Độ khó',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 100,
      render: (difficulty: QuestDifficulty) => (
        <Tag color={difficultyConfig[difficulty]?.color}>
          {difficultyConfig[difficulty]?.label}
        </Tag>
      ),
    },
    {
      title: 'Phần thưởng',
      key: 'rewards',
      width: 200,
      render: (_: unknown, record: Quest) => (
        <Space direction="vertical" size={4}>
          {record.rewards.slice(0, 2).map((reward, idx) => (
            <Tag key={idx} color={rewardTypeConfig[reward.reward_type]?.color} icon={rewardTypeConfig[reward.reward_type]?.icon}>
              {reward.reward_type === 'exp'
                ? `${reward.experience_amount} EXP`
                : reward.reward_type === 'currency'
                  ? `${reward.amount} ${reward.currency_type}`
                  : `${reward.amount} item`
              }
            </Tag>
          ))}
          {record.rewards.length > 2 && (
            <Tag>+{record.rewards.length - 2} phần thưởng khác</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Yêu cầu',
      key: 'requirements',
      width: 100,
      render: (_: unknown, record: Quest) => (
        <Tooltip title={record.requirements.map(r => `${r.requirement_type}: ${r.target}`).join(', ')}>
          <Badge count={record.requirements.length} showZero color="#D4AF37">
            <Button size="small" type="text" icon={<FileTextOutlined />}>
              Chi tiết
            </Button>
          </Badge>
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: QuestStatus) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      fixed: 'right' as const,
      render: (_: unknown, record: Quest) => (
        <Space>
          <Button
            type="primary"
            ghost
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa nhiệm vụ"
            description="Bạn có chắc chắn muốn xóa nhiệm vụ này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Tab items for the Tabs component
  const tabItems = [
    { key: 'all', label: 'Tất cả nhiệm vụ', children: null },
    { key: 'main', label: 'Chính', children: null },
    { key: 'daily', label: 'Hàng ngày', children: null },
    { key: 'weekly', label: 'Hàng tuần', children: null },
    { key: 'alliance', label: 'Liên minh', children: null },
    { key: 'event', label: 'Sự kiện', children: null },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ textAlign: 'center', background: '#F1E8D6' }}>
            <TrophyOutlined style={{ fontSize: 32, color: '#D4AF37' }} />
            <Title level={4} style={{ margin: '8px 0 0', color: '#8B4513' }}>{stats.total}</Title>
            <Text type="secondary">Tổng số nhiệm vụ</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ textAlign: 'center', background: '#F1E8D6' }}>
            <StarOutlined style={{ fontSize: 32, color: '#2E8B57' }} />
            <Title level={4} style={{ margin: '8px 0 0', color: '#8B4513' }}>{stats.active}</Title>
            <Text type="secondary">Nhiệm vụ đang hoạt động</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ textAlign: 'center', background: '#F1E8D6' }}>
            <ClockCircleOutlined style={{ fontSize: 32, color: '#FF8C00' }} />
            <Title level={4} style={{ margin: '8px 0 0', color: '#8B4513' }}>{stats.byCategory.daily}</Title>
            <Text type="secondary">Nhiệm vụ hàng ngày</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ textAlign: 'center', background: '#F1E8D6' }}>
            <TeamOutlined style={{ fontSize: 32, color: '#1E90FF' }} />
            <Title level={4} style={{ margin: '8px 0 0', color: '#8B4513' }}>{stats.byCategory.alliance}</Title>
            <Text type="secondary">Nhiệm vụ liên minh</Text>
          </Card>
        </Col>
      </Row>

      {/* Header with actions */}
      <Card style={{ marginBottom: 24, borderRadius: 12 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0, color: '#8B0000' }}>
              <TrophyOutlined /> Quản lý nhiệm vụ
            </Title>
            <Text type="secondary">Quản lý nhiệm vụ và thử thách cho các chiến binh của bạn</Text>
          </Col>
          <Col>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={fetchData}>
                Làm mới
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
                style={{ background: '#8B0000', borderColor: '#8B0000' }}
              >
                Tạo nhiệm vụ
              </Button>
              <Button
                icon={<ThunderboltOutlined />}
                onClick={handleOpenActionModal}
                style={{ borderColor: '#D4AF37', color: '#8B4513' }}
              >
                Thêm action
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Tabs for filtering */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginBottom: 16 }}
      />

      {/* Quest Table */}
      <Card style={{ borderRadius: 12 }}>
        <Table
          columns={columns}
          dataSource={filteredQuests}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 'max-content' }}
          expandable={{
            expandedRowRender,
            expandedRowKeys,
            onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as string[]),
            expandIcon: ({ expanded, onExpand, record }) => (
              <Button
                type="text"
                icon={expanded ? <DownOutlined /> : <RightOutlined />}
                onClick={(e) => onExpand(record, e)}
                size="small"
              />
            ),
          }}
          onRow={(record) => ({
            onClick: () => onSelectQuest?.(record),
            style: { cursor: onSelectQuest ? 'pointer' : 'default' },
          })}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={
          <Space>
            {editingQuest ? <EditOutlined /> : <PlusOutlined />}
            <span>{editingQuest ? 'Sửa nhiệm vụ' : 'Tạo nhiệm vụ mới'}</span>
          </Space>
        }
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={900}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{ style: { background: '#8B0000' } }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'active',
            min_level: 1,
            max_level: 999,
          }}
        >
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="name"
                label="Tên nhiệm vụ"
                rules={[{ required: true, message: 'Vui lòng nhập tên nhiệm vụ' }]}
              >
                <Input placeholder="Nhập tên nhiệm vụ" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Không hoạt động</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Mô tả nhiệm vụ" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="category"
                label="Danh mục"
                rules={[{ required: true }]}
              >
                <Select>
                  {Object.entries(categoryConfig).map(([key, { label, icon }]) => (
                    <Option key={key} value={key}>
                      <Space>{icon}{label}</Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="type"
                label="Loại nhiệm vụ"
                rules={[{ required: true }]}
              >
                <Select>
                  {Object.entries(questTypeLabels).map(([key, label]) => (
                    <Option key={key} value={key}>{label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="difficulty"
                label="Độ khó"
                rules={[{ required: true }]}
              >
                <Select>
                  {Object.entries(difficultyConfig).map(([key, { label }]) => (
                    <Option key={key} value={key}>{label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="min_level" label="Cấp tối thiểu">
                <InputNumber min={1} max={999} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="max_level" label="Cấp tối đa">
                <InputNumber min={1} max={999} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="completion_limit" label="Giới hạn hoàn thành">
                <InputNumber min={1} placeholder="Không giới hạn" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          {/* Requirements Section */}
// Thay thế phần Requirements Section và Rewards Section trong Modal

          {/* Requirements Section */}
          <Divider orientation="left">
            <Space>
              <SettingOutlined />
              Yêu cầu nhiệm vụ
              <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={addRequirement}>
                Thêm yêu cầu
              </Button>
            </Space>
          </Divider>

          {requirements.length === 0 ? (
            <Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: 16 }}>
              Chưa có yêu cầu nào. Nhấn "Thêm yêu cầu" để tạo yêu cầu cho nhiệm vụ.
            </Text>
          ) : (
            <Collapse
              style={{ marginBottom: 12 }}
              defaultActiveKey={requirements.map((_, idx) => String(idx))}
              items={requirements.map((req, index) => ({
                key: String(index),
                label: (
                  <Space>
                    <span>Yêu cầu {index + 1}</span>
                    {req.requirement_type && (
                      <Tag color="gold">{req.requirement_type}</Tag>
                    )}
                  </Space>
                ),
                extra: (
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRequirement(index);
                    }}
                  >
                    Xóa
                  </Button>
                ),
                children: (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Loại yêu cầu" required>
                        <Select
                          value={req.requirement_type}
                          onChange={(val) => updateRequirement(index, 'requirement_type', val)}
                          placeholder="Chọn loại hành động"
                          showSearch
                        >
                          {actions.map((action: GameAction) => (
                            <Option key={action.id} value={action.id}>
                              {action.description}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Giá trị mục tiêu" required>
                        <InputNumber
                          value={req.target}
                          onChange={(val) => updateRequirement(index, 'target', val)}
                          min={1}
                          style={{ width: '100%' }}
                          placeholder="Số lượng mục tiêu"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                ),
              }))}
            />
          )}

          {/* Rewards Section */}
          <Divider orientation="left">
            <Space>
              <GiftOutlined />
              Phần thưởng
              <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={addRewardItem}>
                Thêm phần thưởng
              </Button>
            </Space>
          </Divider>

          {rewards.length === 0 ? (
            <Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: 16 }}>
              Chưa có phần thưởng nào. Nhấn "Thêm phần thưởng" để thêm quà cho nhiệm vụ.
            </Text>
          ) : (
            <Collapse
              style={{ marginBottom: 12 }}
              defaultActiveKey={rewards.map((_, idx) => String(idx))}
              items={rewards.map((reward, index) => ({
                key: String(index),
                label: (
                  <Space>
                    <span>Phần thưởng {index + 1}</span>
                    {reward.reward_type && (
                      <Tag color={rewardTypeConfig[reward.reward_type]?.color} icon={rewardTypeConfig[reward.reward_type]?.icon}>
                        {rewardTypeConfig[reward.reward_type]?.label}
                      </Tag>
                    )}
                  </Space>
                ),
                extra: (
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRewardItem(index);
                    }}
                  >
                    Xóa
                  </Button>
                ),
                children: (
                  <>
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item label="Loại phần thưởng" required>
                          <Radio.Group
                            value={reward.reward_type}
                            onChange={(e) => updateReward(index, 'reward_type', e.target.value)}
                          >
                            <Radio value="item">
                              <Space><GiftOutlined /> Vật phẩm</Space>
                            </Radio>
                            <Radio value="currency">
                              <Space><GoldOutlined /> Tiền tệ</Space>
                            </Radio>
                            <Radio value="exp">
                              <Space><ExperimentOutlined /> EXP</Space>
                            </Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                    </Row>

                    {reward.reward_type === 'item' && (
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item label="ID Vật phẩm" required>
                            <Input
                              value={reward.item_id || ''}
                              onChange={(e) => updateReward(index, 'item_id', e.target.value)}
                              placeholder="Nhập item_id (vd: gold_coin)"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="Số lượng" required>
                            <InputNumber
                              value={reward.amount}
                              onChange={(val) => updateReward(index, 'amount', val)}
                              min={1}
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    )}

                    {reward.reward_type === 'currency' && (
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item label="Loại tiền tệ" required>
                            <Select
                              value={reward.currency_type}
                              onChange={(val) => updateReward(index, 'currency_type', val)}
                              placeholder="Chọn loại tiền tệ"
                            >
                              <Option value="gold">Vàng</Option>
                              <Option value="diamond">Kim cương</Option>
                              <Option value="silver">Bạc</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="Số lượng" required>
                            <InputNumber
                              value={reward.amount}
                              onChange={(val) => updateReward(index, 'amount', val)}
                              min={1}
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    )}

                    {reward.reward_type === 'exp' && (
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item label="Số EXP" required>
                            <InputNumber
                              value={reward.experience_amount}
                              onChange={(val) => updateReward(index, 'experience_amount', val)}
                              min={1}
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    )}

                    <Form.Item label="Mô tả">
                      <Input
                        value={reward.description || ''}
                        onChange={(e) => updateReward(index, 'description', e.target.value)}
                        placeholder="Mô tả phần thưởng (không bắt buộc)"
                      />
                    </Form.Item>
                  </>
                ),
              }))}
            />
          )}
          {requirements.length === 0 ? (
            <Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: 16 }}>
              Chưa có yêu cầu nào. Nhấn "Thêm yêu cầu" để tạo yêu cầu cho nhiệm vụ.
            </Text>
          ) : (
            requirements.map((req, index) => (
              <Collapse key={index} style={{ marginBottom: 12 }} defaultActiveKey={['1']}>
                <Panel
                  key={'key' + index}
                  header={
                    <Space>
                      <span>Yêu cầu {index + 1}</span>
                      {req.requirement_type && (
                        <Tag color="gold">{req.requirement_type}</Tag>
                      )}
                    </Space>
                  }
                  extra={
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRequirement(index);
                      }}
                    >
                      Xóa
                    </Button>
                  }
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Loại yêu cầu" required>
                        <Select
                          value={req.requirement_type}
                          onChange={(val) => updateRequirement(index, 'requirement_type', val)}
                          placeholder="Chọn loại hành động"
                          showSearch
                        >
                          {actions.map((action: GameAction) => (
                            <Option key={action.id} value={action.id}>
                              {action.description}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Giá trị mục tiêu" required>
                        <InputNumber
                          value={req.target}
                          onChange={(val) => updateRequirement(index, 'target', val)}
                          min={1}
                          style={{ width: '100%' }}
                          placeholder="Số lượng mục tiêu"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Panel>
              </Collapse>
            ))
          )}

          {/* Rewards Section */}
          <Divider orientation="left">
            <Space>
              <GiftOutlined />
              Phần thưởng
              <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={addRewardItem}>
                Thêm phần thưởng
              </Button>
            </Space>
          </Divider>

          {rewards.length === 0 ? (
            <Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: 16 }}>
              Chưa có phần thưởng nào. Nhấn "Thêm phần thưởng" để thêm quà cho nhiệm vụ.
            </Text>
          ) : (
            rewards.map((reward, index) => (
              <Collapse key={index} style={{ marginBottom: 12 }} defaultActiveKey={['1']}>
                <Panel
                  key={'reward' + index}
                  header={
                    <Space>
                      <span>Phần thưởng {index + 1}</span>
                      {reward.reward_type && (
                        <Tag color={rewardTypeConfig[reward.reward_type]?.color} icon={rewardTypeConfig[reward.reward_type]?.icon}>
                          {rewardTypeConfig[reward.reward_type]?.label}
                        </Tag>
                      )}
                    </Space>
                  }
                  extra={
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRewardItem(index);
                      }}
                    >
                      Xóa
                    </Button>
                  }
                >
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item label="Loại phần thưởng" required>
                        <Radio.Group
                          value={reward.reward_type}
                          onChange={(e) => updateReward(index, 'reward_type', e.target.value)}
                        >
                          <Radio value="item">
                            <Space><GiftOutlined /> Vật phẩm</Space>
                          </Radio>
                          <Radio value="currency">
                            <Space><GoldOutlined /> Tiền tệ</Space>
                          </Radio>
                          <Radio value="exp">
                            <Space><ExperimentOutlined /> EXP</Space>
                          </Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>

                  {reward.reward_type === 'item' && (
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="ID Vật phẩm" required>
                          <Input
                            value={reward.item_id || ''}
                            onChange={(e) => updateReward(index, 'item_id', e.target.value)}
                            placeholder="Nhập item_id (vd: gold_coin)"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Số lượng" required>
                          <InputNumber
                            value={reward.amount}
                            onChange={(val) => updateReward(index, 'amount', val)}
                            min={1}
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}

                  {reward.reward_type === 'currency' && (
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="Loại tiền tệ" required>
                          <Select
                            value={reward.currency_type}
                            onChange={(val) => updateReward(index, 'currency_type', val)}
                            placeholder="Chọn loại tiền tệ"
                          >
                            <Option value="gold">Vàng</Option>
                            <Option value="diamond">Kim cương</Option>
                            <Option value="silver">Bạc</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Số lượng" required>
                          <InputNumber
                            value={reward.amount}
                            onChange={(val) => updateReward(index, 'amount', val)}
                            min={1}
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}

                  {reward.reward_type === 'exp' && (
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="Số EXP" required>
                          <InputNumber
                            value={reward.experience_amount}
                            onChange={(val) => updateReward(index, 'experience_amount', val)}
                            min={1}
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}

                  <Form.Item label="Mô tả">
                    <Input
                      value={reward.description || ''}
                      onChange={(e) => updateReward(index, 'description', e.target.value)}
                      placeholder="Mô tả phần thưởng (không bắt buộc)"
                    />
                  </Form.Item>
                </Panel>
              </Collapse>
            ))
          )}
        </Form>
      </Modal>

      {/* Modal tạo game action */}
      <Modal
        title={
          <Space>
            <ThunderboltOutlined />
            <span>Tạo action mới</span>
          </Space>
        }
        open={actionModalVisible}
        onOk={handleCreateAction}
        onCancel={() => setActionModalVisible(false)}
        width={600}
        okText="Tạo action"
        cancelText="Hủy"
        okButtonProps={{ loading: createActionMutation.isPending, style: { background: '#8B0000' } }}
      >
        <Form
          form={actionForm}
          layout="vertical"
          initialValues={{
            repeatable: true,
            metadata: '{}',
          }}
        >
          <Form.Item
            name="id"
            label="ID"
            tooltip="ID chỉ được chứa chữ cái, số, dấu gạch dưới (_), dấu gạch ngang (-) và dấu chấm (.). Để trống để tự động sinh từ mô tả."
          >
            <Input
              placeholder="Ví dụ: attack.enemy, move.forward (để trống để tự động sinh)"
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { required: true, message: 'Vui lòng nhập mô tả' },
              { min: 5, message: 'Mô tả phải có ít nhất 5 ký tự' },
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Nhập mô tả chi tiết về hành động trong game..."
              showCount
              maxLength={500}
              onChange={handleActionDescriptionChange}
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select placeholder="Chọn danh mục">
              {ACTION_CATEGORY_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="repeatable"
            label="Có thể lặp lại"
            valuePropName="checked"
          >
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>

          <Form.Item
            name="metadata"
            label="Siêu dữ liệu (JSON)"
            tooltip="Dữ liệu bổ sung cho hành động dưới dạng JSON"
            rules={[
              {
                validator: async (_, value) => {
                  if (!value || value.trim() === '') return Promise.resolve();
                  try {
                    JSON.parse(value);
                    return Promise.resolve();
                  } catch {
                    return Promise.reject('Định dạng JSON không hợp lệ');
                  }
                },
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder={`{\n  "xp_reward": 100,\n  "required_level": 5\n}`}
              style={{ fontFamily: 'monospace' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuestManagement;
