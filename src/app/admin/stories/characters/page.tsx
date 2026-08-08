// app/admin/stories/characters/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Upload,
  Avatar,
  ColorPicker,
  Radio,
  Switch,
  Tabs,
  Progress,
  List,
  Timeline,
  Collapse,
  Image,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  UserOutlined,
  TeamOutlined,
  FlagOutlined,
  HeartOutlined,
  SmileOutlined,
  FrownOutlined,
  MehOutlined,
  ArrowLeftOutlined,
  MenuOutlined,
  CopyOutlined,
  ExportOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
  CrownOutlined,
  StarOutlined,
  FireOutlined,
  ThunderboltOutlined,
  PictureOutlined,
  DeleteOutlined as DeleteIcon,
  BookOutlined,
  CalendarOutlined,
  BarChartOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { useStoryCharacters, StoryCharacter, getDefaultAvatarColor, getCharacterInitials } from '../hooks/useStoryCharacters';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;

// ============================================================
// Character Statistics Component
// ============================================================
const CharacterStatistics: React.FC<{ stats: any; loading: boolean }> = ({ stats, loading }) => {
  if (!stats) return null;

  const statItems = [
    {
      title: 'Total Characters',
      value: stats.total,
      icon: <UserOutlined />,
      color: '#8B0000',
      bgColor: '#FFF0F0',
      suffix: '',
    },
    {
      title: 'Su Quan',
      value: stats.totalSuQuan,
      icon: <CrownOutlined />,
      color: '#D4AF37',
      bgColor: '#FFFDF0',
      suffix: `/${stats.total}`,
    },
    {
      title: 'With Faction',
      value: stats.totalWithFaction,
      icon: <TeamOutlined />,
      color: '#2E8B57',
      bgColor: '#F0FFF4',
      suffix: `/${stats.total}`,
    },
    {
      title: 'With Emotions',
      value: stats.totalWithEmotions,
      icon: <SmileOutlined />,
      color: '#1E90FF',
      bgColor: '#F0F8FF',
      suffix: `/${stats.total}`,
    },
  ];

  return (
    <Card style={{ marginBottom: 16, borderRadius: 12 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <BarChartOutlined style={{ color: '#8B0000', fontSize: 20 }} />
          <Title level={4} style={{ margin: 0 }}>Character Overview</Title>
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
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
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
                  suffix={item.suffix}
                  loading={loading}
                />
              </div>
            </Col>
          ))}
        </Row>

        {/* Position Distribution */}
        {stats.positions && (
          <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
            <Col span={24}>
              <Card size="small" style={{ background: '#fafafa' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>Position Distribution</Text>
                  <Row gutter={[16, 16]}>
                    <Col xs={8}>
                      <div style={{ textAlign: 'center' }}>
                        <Tag color="#1E90FF" style={{ fontSize: 14, padding: '4px 12px' }}>
                          Left
                        </Tag>
                        <div style={{ fontSize: 20, fontWeight: 600, marginTop: 4 }}>
                          {stats.positions.left}
                        </div>
                      </div>
                    </Col>
                    <Col xs={8}>
                      <div style={{ textAlign: 'center' }}>
                        <Tag color="#D4AF37" style={{ fontSize: 14, padding: '4px 12px' }}>
                          Center
                        </Tag>
                        <div style={{ fontSize: 20, fontWeight: 600, marginTop: 4 }}>
                          {stats.positions.center}
                        </div>
                      </div>
                    </Col>
                    <Col xs={8}>
                      <div style={{ textAlign: 'center' }}>
                        <Tag color="#DC143C" style={{ fontSize: 14, padding: '4px 12px' }}>
                          Right
                        </Tag>
                        <div style={{ fontSize: 20, fontWeight: 600, marginTop: 4 }}>
                          {stats.positions.right}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Space>
              </Card>
            </Col>
          </Row>
        )}

        {/* Most Used Color */}
        {stats.mostUsedColor && (
          <Alert
            message={
              <Space>
                <span>Most Used Color: </span>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    backgroundColor: stats.mostUsedColor,
                    borderRadius: 4,
                    border: '1px solid #ddd',
                  }}
                />
                <span style={{ fontWeight: 600 }}>{stats.mostUsedColor}</span>
              </Space>
            }
            type="info"
            showIcon
            icon={<FlagOutlined />}
          />
        )}
      </Space>
    </Card>
  );
};

// ============================================================
// Character Filters Component
// ============================================================
const CharacterFilters: React.FC<{
  filters: any;
  setFilters: (filters: any) => void;
  onRefresh: () => void;
  loading: boolean;
  onAddNew: () => void;
  availableFactions: { id: string; name: string }[];
  onBulkDelete: () => void;
  selectedRowKeys: React.Key[];
}> = ({
  filters,
  setFilters,
  onRefresh,
  loading,
  onAddNew,
  availableFactions,
  onBulkDelete,
  selectedRowKeys,
}) => {
  return (
    <Card size="small" style={{ marginBottom: 16, borderRadius: 12 }}>
      <Row gutter={[12, 12]} align="middle">
        <Col xs={24} md={4}>
          <Input
            placeholder="Search characters..."
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            allowClear
            size="middle"
          />
        </Col>
        <Col xs={12} md={3}>
          <Select
            placeholder="Faction"
            style={{ width: '100%' }}
            value={filters.factionId}
            onChange={(value) => setFilters({ ...filters, factionId: value })}
            allowClear
            size="middle"
          >
            {availableFactions.map((faction) => (
              <Option key={faction.id} value={faction.id}>
                <TeamOutlined /> {faction.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={12} md={3}>
          <Select
            placeholder="Position"
            style={{ width: '100%' }}
            value={filters.position}
            onChange={(value) => setFilters({ ...filters, position: value })}
            allowClear
            size="middle"
          >
            <Option value="left">Left</Option>
            <Option value="center">Center</Option>
            <Option value="right">Right</Option>
          </Select>
        </Col>
        <Col xs={12} md={2}>
          <Select
            placeholder="Su Quan"
            style={{ width: '100%' }}
            value={filters.isSuQuan}
            onChange={(value) => setFilters({ ...filters, isSuQuan: value })}
            allowClear
            size="middle"
          >
            <Option value={true}>Su Quan</Option>
            <Option value={false}>Non-Su Quan</Option>
          </Select>
        </Col>
        <Col xs={12} md={2}>
          <Select
            placeholder="Emotions"
            style={{ width: '100%' }}
            value={filters.hasEmotions}
            onChange={(value) => setFilters({ ...filters, hasEmotions: value })}
            allowClear
            size="middle"
          >
            <Option value={true}>Has Emotions</Option>
            <Option value={false}>No Emotions</Option>
          </Select>
        </Col>
        <Col xs={24} md={10}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }} wrap>
            <Tooltip title="Refresh">
              <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading} />
            </Tooltip>
            {selectedRowKeys.length > 0 && (
              <Popconfirm
                title="Delete Selected Characters"
                description={`Are you sure you want to delete ${selectedRowKeys.length} characters?`}
                onConfirm={onBulkDelete}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <Button danger icon={<DeleteIcon />}>
                  Delete ({selectedRowKeys.length})
                </Button>
              </Popconfirm>
            )}
            <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>
              Add Character
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

// ============================================================
// Character Table Component
// ============================================================
const CharacterTable: React.FC<{
  characters: StoryCharacter[];
  loading: boolean;
  onView: (character: StoryCharacter) => void;
  onEdit: (character: StoryCharacter) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  selectedRowKeys: React.Key[];
  onSelectChange: (selectedRowKeys: React.Key[], selectedRows: StoryCharacter[]) => void;
}> = ({
  characters,
  loading,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  selectedRowKeys,
  onSelectChange,
}) => {
  const router = useRouter();

  const columns: ColumnsType<StoryCharacter> = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar: string, record: StoryCharacter) => (
        <Avatar
          size={48}
          src={avatar}
          style={{ backgroundColor: record.color || getDefaultAvatarColor(record.name) }}
          icon={<UserOutlined />}
        >
          {!avatar && getCharacterInitials(record.name)}
        </Avatar>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: StoryCharacter) => (
        <Space>
          <Text strong style={{ fontSize: 16 }}>{text}</Text>
          {record.is_su_quan && (
            <Tooltip title="Su Quan Character">
              <CrownOutlined style={{ color: '#D4AF37', fontSize: 18 }} />
            </Tooltip>
          )}
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      width: 120,
      render: (color: string) => (
        <Space>
          <div
            style={{
              width: 30,
              height: 30,
              backgroundColor: color,
              borderRadius: '50%',
              border: '2px solid #ddd',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          />
          <Text style={{ fontSize: 12, color: '#666' }}>{color}</Text>
        </Space>
      ),
    },
    {
      title: 'Position',
      dataIndex: 'default_position',
      key: 'position',
      width: 100,
      render: (position: string) => {
        const config = {
          left: { color: '#1E90FF', icon: '←' },
          center: { color: '#D4AF37', icon: '⬤' },
          right: { color: '#DC143C', icon: '→' },
        };
        const pos = position as keyof typeof config;
        return (
          <Tag 
            color={config[pos]?.color || 'default'}
            style={{ fontSize: 13, padding: '4px 12px' }}
          >
            {config[pos]?.icon} {position.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Faction',
      dataIndex: 'faction',
      key: 'faction',
      width: 120,
      render: (faction: any) => (
        faction ? (
          <Tag icon={<TeamOutlined />} color="blue" style={{ padding: '4px 12px' }}>
            {faction.name}
          </Tag>
        ) : (
          <Tag color="default">None</Tag>
        )
      ),
    },
    {
      title: 'Emotions',
      dataIndex: 'emotion_states',
      key: 'emotions',
      width: 80,
      render: (emotions: any) => {
        const count = emotions ? Object.keys(emotions).length : 0;
        return (
          <Badge
            count={count}
            showZero
            color={count > 0 ? '#1E90FF' : '#d9d9d9'}
            style={{ 
              backgroundColor: count > 0 ? '#1E90FF' : '#d9d9d9',
              fontSize: 12,
            }}
          />
        );
      },
    },
    {
      title: 'Scenes',
      dataIndex: 'scene_count',
      key: 'scenes',
      width: 80,
      render: (count: number) => (
        <Badge
          count={count || 0}
          showZero
          color={count > 0 ? '#2E8B57' : '#d9d9d9'}
          style={{ 
            backgroundColor: count > 0 ? '#2E8B57' : '#d9d9d9',
            fontSize: 12,
          }}
        />
      ),
    },
    {
      title: 'Stories',
      dataIndex: 'story_count',
      key: 'stories',
      width: 80,
      render: (count: number) => (
        <Badge
          count={count || 0}
          showZero
          color={count > 0 ? '#D4AF37' : '#d9d9d9'}
          style={{ 
            backgroundColor: count > 0 ? '#D4AF37' : '#d9d9d9',
            fontSize: 12,
          }}
        />
      ),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 110,
      render: (date: string) => (
        <Tooltip title={dayjs(date).format('YYYY-MM-DD HH:mm:ss')}>
          <span>{dayjs(date).format('MMM D, YYYY')}</span>
        </Tooltip>
      ),
      sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 220,
      fixed: 'right',
      render: (_: any, record: StoryCharacter) => {
        const menuItems: MenuProps['items'] = [
          {
            key: 'view',
            icon: <EyeOutlined />,
            label: 'View Details',
            onClick: () => onView(record),
          },
          {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Edit Character',
            onClick: () => onEdit(record),
          },
          {
            key: 'duplicate',
            icon: <CopyOutlined />,
            label: 'Duplicate Character',
            onClick: () => onDuplicate(record.id),
          },
          { type: 'divider' },
          {
            key: 'delete',
            icon: <DeleteIcon />,
            label: 'Delete Character',
            danger: true,
            onClick: () => {
              Modal.confirm({
                title: 'Delete Character',
                content: 'Are you sure you want to delete this character?',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk: () => onDelete(record.id),
              });
            },
          },
        ];

        return (
          <Space size="small">
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
            <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
              <Button type="text" size="small" icon={<MenuOutlined />} />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={characters}
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
        pageSize: 15,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} characters`,
        pageSizeOptions: ['10', '15', '20', '50', '100'],
      }}
      scroll={{ x: 1400 }}
      locale={{
        emptyText: (
          <Empty
            description="No characters found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ),
      }}
      rowClassName={(record) => 
        record.is_su_quan ? 'su-quan-row' : ''
      }
    />
  );
};

// ============================================================
// Character Detail Drawer
// ============================================================
const CharacterDetailDrawer: React.FC<{
  visible: boolean;
  character: StoryCharacter | null;
  loading: boolean;
  onClose: () => void;
  onEdit: (character: StoryCharacter) => void;
}> = ({ visible, character, loading, onClose, onEdit }) => {
  if (!character) return null;

  const emotionIcons: Record<string, any> = {
    happy: <SmileOutlined style={{ color: '#2E8B57' }} />,
    sad: <FrownOutlined style={{ color: '#1E90FF' }} />,
    neutral: <MehOutlined style={{ color: '#D4AF37' }} />,
    angry: <FireOutlined style={{ color: '#DC143C' }} />,
    surprised: <ThunderboltOutlined style={{ color: '#FF8C00' }} />,
    love: <HeartOutlined style={{ color: '#FF1493' }} />,
  };

  return (
    <Drawer
      title={
        <Space>
          <Avatar
            size={48}
            src={character.avatar}
            style={{ backgroundColor: character.color }}
            icon={<UserOutlined />}
          >
            {!character.avatar && getCharacterInitials(character.name)}
          </Avatar>
          <span style={{ fontSize: 20, fontWeight: 600 }}>{character.name}</span>
          {character.is_su_quan && (
            <CrownOutlined style={{ color: '#D4AF37', fontSize: 24 }} />
          )}
        </Space>
      }
      placement="right"
      width={720}
      open={visible}
      onClose={onClose}
      extra={
        <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(character)}>
          Edit Character
        </Button>
      }
    >
      <Spin spinning={loading}>
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Name" span={2}>
            <Text strong style={{ fontSize: 18 }}>{character.name}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Avatar">
            {character.avatar ? (
              <Avatar size={64} src={character.avatar} />
            ) : (
              <Tag color="default">No Avatar</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Color">
            <Space>
              <div
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: character.color,
                  borderRadius: '50%',
                  border: '2px solid #ddd',
                }}
              />
              <Text>{character.color}</Text>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Position">
            <Tag
              color={
                character.default_position === 'left' ? '#1E90FF' :
                character.default_position === 'center' ? '#D4AF37' : '#DC143C'
              }
              style={{ fontSize: 14, padding: '4px 12px' }}
            >
              {character.default_position.toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Su Quan">
            {character.is_su_quan ? (
              <Tag icon={<CrownOutlined />} color="gold" style={{ padding: '4px 12px' }}>
                Yes
              </Tag>
            ) : (
              <Tag color="default">No</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Faction">
            {character.faction ? (
              <Tag icon={<TeamOutlined />} color="blue" style={{ padding: '4px 12px' }}>
                {character.faction.name}
              </Tag>
            ) : (
              <Tag color="default">None</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Scenes" span={2}>
            <Badge
              count={character.scene_count || 0}
              showZero
              color={character.scene_count??0 > 0 ? '#2E8B57' : '#d9d9d9'}
              style={{ fontSize: 16 }}
            />
            {(character.scene_count??0) > 0 && (
              <Text type="secondary" style={{ marginLeft: 8 }}>
                appearances across {character.story_count || 0} stories
              </Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Emotion States" span={2}>
            {character.emotion_states && Object.keys(character.emotion_states).length > 0 ? (
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                {Object.entries(character.emotion_states).map(([key, value]) => (
                  <Tag 
                    key={key} 
                    icon={emotionIcons[key] || <SmileOutlined />} 
                    color="blue"
                    style={{ padding: '4px 12px', fontSize: 14 }}
                  >
                    {key}: {String(value)}
                  </Tag>
                ))}
              </Space>
            ) : (
              <Text type="secondary">No emotion states defined</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {dayjs(character.created_at).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="ID">
            <Text copyable style={{ fontSize: 12 }}>{character.id}</Text>
          </Descriptions.Item>
        </Descriptions>

        {character.scene_count && character.scene_count > 0 && (
          <>
            <Divider />
            <Alert
              message="Character Usage"
              description={
                <div>
                  <p style={{ margin: 0 }}>
                    <UserOutlined /> Appears in <strong>{character.scene_count}</strong> scenes
                  </p>
                  <p style={{ margin: '4px 0 0 0' }}>
                    <BookOutlined /> Featured in <strong>{character.story_count}</strong> stories
                  </p>
                </div>
              }
              type="info"
              showIcon
            />
          </>
        )}
      </Spin>
    </Drawer>
  );
};

// ============================================================
// Character Form Modal
// ============================================================
const CharacterFormModal: React.FC<{
  visible: boolean;
  editingCharacter: StoryCharacter | null;
  loading: boolean;
  availableFactions: { id: string; name: string }[];
  onClose: () => void;
  onSubmit: (data: any) => void;
}> = ({ visible, editingCharacter, loading, availableFactions, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [emotionKeys, setEmotionKeys] = useState<string[]>([]);

  useEffect(() => {
    if (editingCharacter) {
      const emotionKeys = Object.keys(editingCharacter.emotion_states || {});
      setEmotionKeys(emotionKeys);
      form.setFieldsValue({
        ...editingCharacter,
        emotion_states: editingCharacter.emotion_states || {},
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        default_position: 'center',
        is_su_quan: false,
        emotion_states: {},
        color: '#8B0000',
      });
      setEmotionKeys([]);
    }
  }, [editingCharacter, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleAddEmotion = () => {
    const newKey = `emotion_${emotionKeys.length + 1}`;
    setEmotionKeys([...emotionKeys, newKey]);
    const currentEmotions = form.getFieldValue('emotion_states') || {};
    form.setFieldsValue({
      emotion_states: { ...currentEmotions, [newKey]: 50 },
    });
  };

  const handleRemoveEmotion = (key: string) => {
    setEmotionKeys(emotionKeys.filter(k => k !== key));
    const currentEmotions = form.getFieldValue('emotion_states') || {};
    delete currentEmotions[key];
    form.setFieldsValue({ emotion_states: currentEmotions });
  };

  return (
    <Modal
      title={
        <Space>
          {editingCharacter ? <EditOutlined /> : <PlusOutlined />}
          <span>{editingCharacter ? 'Edit Character' : 'Add New Character'}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={800}
      okText={editingCharacter ? 'Update' : 'Create'}
      okButtonProps={{ size: 'large' }}
      cancelButtonProps={{ size: 'large' }}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Character Name"
              rules={[
                { required: true, message: 'Enter character name' },
                { min: 2, message: 'Name must be at least 2 characters' },
                { max: 50, message: 'Name must be less than 50 characters' },
              ]}
            >
              <Input placeholder="Enter character name" size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="color"
              label="Character Color"
              rules={[{ required: true, message: 'Select character color' }]}
            >
              <Input 
                type="color" 
                style={{ height: 44, padding: 4, width: '100%', cursor: 'pointer' }} 
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="avatar"
              label="Avatar URL"
            >
              <Input placeholder="Enter avatar image URL" size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="default_position"
              label="Default Position"
              rules={[{ required: true, message: 'Select default position' }]}
            >
              <Select placeholder="Select position" size="large">
                <Option value="left">Left</Option>
                <Option value="center">Center</Option>
                <Option value="right">Right</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="faction_id"
              label="Faction (Optional)"
            >
              <Select placeholder="Select faction" allowClear size="large">
                {availableFactions.map((faction) => (
                  <Option key={faction.id} value={faction.id}>
                    <TeamOutlined /> {faction.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="is_su_quan"
              label="Su Quan Character"
              valuePropName="checked"
            >
              <Switch
                checkedChildren={<CrownOutlined />}
                unCheckedChildren={<UserOutlined />}
                size="default"
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Emotion States</Divider>

        <Form.Item label="Emotion States">
          <Space direction="vertical" style={{ width: '100%' }} size="small">
            {emotionKeys.map((key) => (
              <Row key={key} gutter={8} align="middle">
                <Col span={10}>
                  <Form.Item
                    name={['emotion_states', key]}
                    noStyle
                    rules={[{ required: true, message: 'Enter emotion name' }]}
                  >
                    <Input
                      placeholder="Emotion name (e.g., happy, sad)"
                      defaultValue={key}
                      onChange={(e) => {
                        const newKey = e.target.value;
                        if (newKey && newKey !== key) {
                          const currentEmotions = form.getFieldValue('emotion_states') || {};
                          const value = currentEmotions[key];
                          delete currentEmotions[key];
                          currentEmotions[newKey] = value;
                          setEmotionKeys(emotionKeys.map(k => k === key ? newKey : k));
                          form.setFieldsValue({ emotion_states: currentEmotions });
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    name={['emotion_states', key]}
                    noStyle
                    rules={[{ required: true, message: 'Enter value' }]}
                  >
                    <Input
                      type="number"
                      placeholder="Value (0-100)"
                      min={0}
                      max={100}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Button
                    danger
                    icon={<DeleteIcon />}
                    onClick={() => handleRemoveEmotion(key)}
                    size="small"
                  />
                </Col>
              </Row>
            ))}
            <Button type="dashed" onClick={handleAddEmotion} block icon={<PlusOutlined />}>
              Add Emotion State
            </Button>
          </Space>
        </Form.Item>

        <Alert
          message="Note"
          description="Characters can have emotion states that change during the story. These can be used to show different expressions or moods."
          type="info"
          showIcon
          icon={<QuestionCircleOutlined />}
        />
      </Form>
    </Modal>
  );
};

// ============================================================
// Character Monthly Growth Component
// ============================================================
const CharacterGrowthChart: React.FC<{ data: { month: string; count: number }[] }> = ({ data }) => {
  if (!data || data.length === 0) return null;

  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <Card size="small" style={{ marginTop: 16, borderRadius: 12 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <CalendarOutlined style={{ color: '#8B0000' }} />
          <Text strong>Character Growth (Last 12 Months)</Text>
        </Space>
        <Row gutter={[8, 8]}>
          {data.map((item, index) => (
            <Col key={item.month} xs={6} sm={4} md={3} lg={2}>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    height: Math.max(4, (item.count / Math.max(1, maxCount)) * 60),
                    backgroundColor: '#8B0000',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.5s',
                    minHeight: 4,
                    opacity: 0.7 + (item.count / Math.max(1, maxCount)) * 0.3,
                  }}
                />
                <div style={{ fontSize: 11, marginTop: 4, color: '#666' }}>
                  {item.month}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#8B0000' }}>
                  {item.count}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Space>
    </Card>
  );
};

// ============================================================
// Main Page Component
// ============================================================
const CharacterManagementPage: React.FC = () => {
  const router = useRouter();
  const {
    characters,
    loading,
    filters,
    setFilters,
    stats,
    availableFactions,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    deleteCharacters,
    duplicateCharacter,
    fetchCharacterDetails,
    refresh,
  } = useStoryCharacters();

  const [viewDrawerVisible, setViewDrawerVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<StoryCharacter | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<StoryCharacter | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Handlers
  const handleAddNew = () => {
    setEditingCharacter(null);
    setFormModalVisible(true);
  };

  const handleEdit = (character: StoryCharacter) => {
    setEditingCharacter(character);
    setFormModalVisible(true);
  };

  const handleView = async (character: StoryCharacter) => {
    const details = await fetchCharacterDetails(character.id);
    setSelectedCharacter(details || character);
    setViewDrawerVisible(true);
  };

  const handleDelete = async (id: string) => {
    await deleteCharacter(id);
  };

  const handleDuplicate = async (id: string) => {
    await duplicateCharacter(id);
  };

  const handleBulkDelete = async () => {
    const ids = selectedRowKeys.map(key => key.toString());
    await deleteCharacters(ids);
    setSelectedRowKeys([]);
  };

  const handleCharacterSubmit = async (data: any) => {
    if (editingCharacter) {
      await updateCharacter(editingCharacter.id, data);
    } else {
      await createCharacter(data);
    }
    setFormModalVisible(false);
    setEditingCharacter(null);
  };

  const handleCloseView = () => {
    setViewDrawerVisible(false);
    setSelectedCharacter(null);
  };

  const handleExport = () => {
    // Implement export functionality
    message.info('Export feature coming soon');
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
                <UserOutlined style={{ fontSize: 28, color: '#8B0000' }} />
                <div>
                  <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
                    Character Management
                  </Title>
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    Manage story characters and their attributes
                  </Text>
                </div>
              </Space>
            </Col>
            <Col xs={24} md={12} style={{ textAlign: 'right' }}>
              <Space wrap>
                <Tooltip title="Export Characters">
                  <Button icon={<ExportOutlined />} onClick={handleExport}>
                    Export
                  </Button>
                </Tooltip>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Statistics */}
        <CharacterStatistics stats={stats} loading={loading} />

        {/* Filters */}
        <CharacterFilters
          filters={filters}
          setFilters={setFilters}
          onRefresh={refresh}
          loading={loading}
          onAddNew={handleAddNew}
          availableFactions={availableFactions}
          onBulkDelete={handleBulkDelete}
          selectedRowKeys={selectedRowKeys}
        />

        {/* Faction Distribution */}

        {/* Character Growth Chart */}
        {stats?.charactersByMonth && stats.charactersByMonth.length > 0 && (
          <CharacterGrowthChart data={stats.charactersByMonth} />
        )}

        {/* Character Table */}
        <CharacterTable
          characters={characters}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={onSelectChange}
        />
      </Card>

      {/* Character Form Modal */}
      <CharacterFormModal
        visible={formModalVisible}
        editingCharacter={editingCharacter}
        loading={loading}
        availableFactions={availableFactions}
        onClose={() => {
          setFormModalVisible(false);
          setEditingCharacter(null);
        }}
        onSubmit={handleCharacterSubmit}
      />

      {/* Character Detail Drawer */}
      <CharacterDetailDrawer
        visible={viewDrawerVisible}
        character={selectedCharacter}
        loading={loading}
        onClose={handleCloseView}
        onEdit={handleEdit}
      />

      {/* Custom Styles */}
      <style jsx global>{`
        .su-quan-row {
          background-color: #FFFDF0 !important;
        }
        .su-quan-row:hover {
          background-color: #FFF8E0 !important;
        }
      `}</style>
    </div>
  );
};

export default CharacterManagementPage;
