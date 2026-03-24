'use client';

import React from 'react';
import {
  Modal,
  Descriptions,
  Tag,
  Space,
  Typography,
  Divider,
  Card,
  Row,
  Col,
  Statistic,
  Tabs,
  Table,
  Avatar,
  Progress,
  Rate,
} from 'antd';
import {
  UserOutlined,
  ThunderboltOutlined,
  StarOutlined,
  FireOutlined,
  IeOutlined,
  HeartOutlined,
  RocketOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { GeneralWithRelations, RARITY_COLORS, ELEMENT_COLORS } from '../types/general.types';

const { Title, Text } = Typography;

interface GeneralDetailModalProps {
  open: boolean;
  onClose: () => void;
  general: GeneralWithRelations | null;
}

const GeneralDetailModal: React.FC<GeneralDetailModalProps> = ({
  open,
  onClose,
  general,
}) => {
  if (!general) return null;

  const calculatePower = () => {
    return Math.round(
      general.current_attack * 2.5 +
      general.current_defense * 2 +
      general.current_health * 1.5 +
      general.current_speed * 3 +
      general.current_intelligence * 2 +
      general.current_leadership * 2
    );
  };

  const getPowerRating = (power: number) => {
    if (power < 5000) return { text: 'Yếu', color: '#A9A9A9' };
    if (power < 10000) return { text: 'Trung bình', color: '#1E90FF' };
    if (power < 20000) return { text: 'Mạnh', color: '#800080' };
    if (power < 50000) return { text: 'Tinh anh', color: '#FFA500' };
    return { text: 'Huyền thoại', color: '#DC143C' };
  };

  const power = calculatePower();
  const powerRating = getPowerRating(power);

  const skillColumns = [
    {
      title: 'Kỹ năng',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space direction="vertical">
          <Text strong>{text}</Text>
          <Tag color={record.type === 'active' ? 'blue' : record.type === 'passive' ? 'green' : 'purple'}>
            {record.type === 'active' ? 'Chủ động' : record.type === 'passive' ? 'Bị động' : 'Tuyệt kỹ'}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Cấp',
      dataIndex: 'level',
      key: 'level',
      render: (level: number, record: any) => `${level}/${record.max_level}`,
    },
    {
      title: 'Hồi chiêu',
      dataIndex: 'cooldown',
      key: 'cooldown',
      render: (val: number) => val ? `${val}s` : '-',
    },
  ];

  const items = [
    {
      key: 'stats',
      label: 'Chỉ số chi tiết',
      children: (
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card size="small">
              <Statistic
                title="Tấn công"
                value={general.current_attack}
                prefix={<FireOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
              <Text type="secondary">Cơ bản: {general.base_attack}</Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Statistic
                title="Phòng thủ"
                value={general.current_defense}
                prefix={<IeOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
              <Text type="secondary">Cơ bản: {general.base_defense}</Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Statistic
                title="Máu"
                value={general.current_health}
                prefix={<HeartOutlined />}
                valueStyle={{ color: '#eb2f96' }}
              />
              <Text type="secondary">Cơ bản: {general.base_health}</Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Statistic
                title="Tốc độ"
                value={general.current_speed}
                prefix={<RocketOutlined />}
              />
              <Text type="secondary">Cơ bản: {general.base_speed}</Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Statistic
                title="Thông minh"
                value={general.current_intelligence}
                prefix={<StarOutlined />}
              />
              <Text type="secondary">Cơ bản: {general.base_intelligence}</Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Statistic
                title="Lãnh đạo"
                value={general.current_leadership}
                prefix={<TrophyOutlined />}
              />
              <Text type="secondary">Cơ bản: {general.base_leadership}</Text>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'skills',
      label: `Kỹ năng (${general.skills?.length || 0})`,
      children: (
        <Table
          columns={skillColumns}
          dataSource={general.skills || []}
          rowKey="id"
          pagination={false}
          size="small"
        />
      ),
    },
    {
      key: 'shards',
      label: `Mảnh tướng (${general.shard_rewards?.length || 0})`,
      children: (
        <Table
          columns={[
            {
              title: 'ID Phần thưởng',
              dataIndex: 'battle_reward_id',
              key: 'battle_reward_id',
            },
            {
              title: 'Số lượng mảnh',
              dataIndex: 'shard_quantity',
              key: 'shard_quantity',
            },
            {
              title: 'Tổng mảnh cần',
              dataIndex: 'total_shards_needed',
              key: 'total_shards_needed',
            },
            {
              title: 'Ngày tạo',
              dataIndex: 'created_at',
              key: 'created_at',
              render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
            },
          ]}
          dataSource={general.shard_rewards || []}
          rowKey="id"
          pagination={false}
          size="small"
        />
      ),
    },
  ];

  return (
    <Modal
      title={
        <Space>
          <Avatar
            src={general.thumbnail || general.image}
            size={40}
            shape="square"
            style={{
              border: `2px solid ${RARITY_COLORS[general.rarity]}`,
            }}
          >
            {general.name[0]}
          </Avatar>
          <Space direction="vertical" size={0}>
            <Title level={4} style={{ margin: 0, color: '#8B4513' }}>
              {general.name}
            </Title>
            {general.title && (
              <Text type="secondary" style={{ fontSize: 12 }}>{general.title}</Text>
            )}
          </Space>
        </Space>
      }
      open={open}
      onCancel={onClose}
      width={1000}
      footer={null}
    >
      <Descriptions bordered size="small" style={{ marginBottom: 20 }}>
        <Descriptions.Item label="ID">{general.id}</Descriptions.Item>
        <Descriptions.Item label="Độ hiếm">
          <Tag color={RARITY_COLORS[general.rarity]} style={{ color: '#fff' }}>
            {general.rarity.toUpperCase()}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Nguyên tố">
          <Tag color={ELEMENT_COLORS[general.element]} style={{ color: '#fff' }}>
            {general.element}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Loại">
          <Tag color="blue">{general.type}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={general.status === 'active' ? 'success' : 'default'}>
            {general.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Sao">
          <Rate disabled defaultValue={general.star_level} count={general.max_star_level} />
        </Descriptions.Item>
      </Descriptions>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Cấp độ"
              value={`${general.level}/${general.max_level}`}
              prefix={<ThunderboltOutlined />}
            />
            <Progress 
              percent={Math.round((general.level / general.max_level) * 100)} 
              size="small" 
              showInfo={false}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Kinh nghiệm"
              value={general.experience}
              suffix={`/ ${general.required_exp}`}
            />
            <Progress 
              percent={Math.round((general.experience / general.required_exp) * 100)} 
              size="small" 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Sức mạnh"
              value={power}
              valueStyle={{ color: powerRating.color }}
            />
            <Text style={{ color: powerRating.color }}>{powerRating.text}</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Thức tỉnh"
              value={general.awakening_level}
              suffix={`/ 10`}
            />
            <Statistic
              title="Liên kết"
              value={general.bond_level}
              suffix={`/ 10`}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
      </Row>

      {general.description && (
        <Card size="small" style={{ marginBottom: 20 }}>
          <Text italic>{general.description}</Text>
        </Card>
      )}

      <Tabs items={items} type="card" />

      {general.biography && (
        <>
          <Divider orientation="left">Tiểu sử</Divider>
          <Card>
            <Text>{general.biography}</Text>
          </Card>
        </>
      )}

      {general.voice_actor && (
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">Lồng tiếng: {general.voice_actor}</Text>
        </div>
      )}

      {general.last_used && (
        <div style={{ marginTop: 8 }}>
          <Text type="secondary">Lần cuối sử dụng: {new Date(general.last_used).toLocaleString('vi-VN')}</Text>
        </div>
      )}
    </Modal>
  );
};

export default GeneralDetailModal;
