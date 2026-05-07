"use client"
// QuestManagement.tsx
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
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { GameAction, Quest, QuestCategory, QuestDifficulty, QuestStatus, QuestType, useQuests } from '../hooks/useQuest';

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

// Form item for requirement
interface RequirementFormItem {
  id?: string;
  requirement_type: string;
  target: number;
  meta: Record<string, unknown>;
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
  } = useQuests();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [form] = Form.useForm();
  const [requirements, setRequirements] = useState<RequirementFormItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

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
      title: 'Cấp độ',
      key: 'level_range',
      width: 100,
      render: (_: unknown, record: Quest) => (
        <Text>{record.min_level} - {record.max_level}</Text>
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
    {
      key: 'all',
      label: 'Tất cả nhiệm vụ',
      children: null,
    },
    {
      key: 'daily',
      label: 'Hàng ngày',
      children: null,
    },
    {
      key: 'weekly',
      label: 'Hàng tuần',
      children: null,
    },
    {
      key: 'alliance',
      label: 'Liên minh',
      children: null,
    },
    {
      key: 'event',
      label: 'Sự kiện',
      children: null,
    },
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
        width={800}
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

          <Divider orientation="left">
            <Space>
              <SettingOutlined />
              Yêu cầu nhiệm vụ
              <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={addRequirement}>
                Thêm
              </Button>
            </Space>
          </Divider>

          {requirements.length === 0 ? (
            <Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: 16 }}>
              Chưa có yêu cầu nào. Nhấn "Thêm" để tạo yêu cầu cho nhiệm vụ.
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
        </Form>
      </Modal>
    </div>
  );
};

export default QuestManagement;
