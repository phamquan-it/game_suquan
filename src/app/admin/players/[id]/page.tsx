'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Tag, 
  Space, 
  Button, 
  Descriptions, 
  Statistic,
  Progress,
  Timeline 
} from 'antd';
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  GiftOutlined,
  MessageOutlined 
} from '@ant-design/icons';
import { Ban } from 'lucide-react';

const { Title, Text } = Typography;

// Mock data - sẽ thay thế bằng API call
const mockPlayerData = {
  id: '1',
  username: 'ThienMaHung',
  email: 'thienma@example.com',
  level: 85,
  power: 1250000,
  alliance: 'ThienDang',
  status: 'online',
  lastLogin: '2024-01-15T10:30:00Z',
  registrationDate: '2023-05-10T14:20:00Z',
  ipAddress: '192.168.1.100',
  country: 'VN',
  violations: 0,
  title: 'Đại Tướng Quân',
  specialization: 'Kỵ Binh',
  victoryPoints: 12500,
  winRate: 78.5,
  battles: 1250,
  wins: 980,
  territory: 45,
  playTime: '1,250 giờ',
  currentRank: 45,
  highestRank: 12,
  joinDate: '2023-05-10',
  lastIp: '192.168.1.100',
  device: 'Mobile Android',
};

export default function PlayerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const playerId = params.id as string;

  const player = mockPlayerData; // Trong thực tế sẽ fetch từ API

  const activityTimeline = [
    {
      color: 'green',
      children: 'Đăng nhập vào game',
      time: '10:30 AM',
    },
    {
      color: 'blue',
      children: 'Tham gia trận chiến liên minh',
      time: '09:45 AM',
    },
    {
      color: 'purple',
      children: 'Nâng cấp thành phố chính lên cấp 8',
      time: '08:20 AM',
    },
    {
      color: 'orange',
      children: 'Nhận quà hàng ngày',
      time: '07:15 AM',
    },
  ];

  return (
    <div>
      {/* Header */}
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 24 }}>
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => router.back()}
          >
            Quay lại
          </Button>
          <Title level={2} style={{ margin: 0, color: '#8B0000' }}>
            {player.username}
          </Title>
          <Tag color="green">Đang online</Tag>
        </Space>

        <Space>
          <Button icon={<EditOutlined />}>Chỉnh sửa</Button>
          <Button icon={<Ban />} danger>Cấm tài khoản</Button>
          <Button icon={<GiftOutlined />}>Gửi quà</Button>
          <Button icon={<MessageOutlined />}>Nhắn tin</Button>
        </Space>
      </Space>

      <Row gutter={[16, 16]}>
        {/* Thông tin cơ bản */}
        <Col xs={24} lg={8}>
          <Card title="Thông tin cơ bản" bordered={false}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="ID">{player.id}</Descriptions.Item>
              <Descriptions.Item label="Email">{player.email}</Descriptions.Item>
              <Descriptions.Item label="Cấp độ">
                <Tag color="gold">Lv.{player.level}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Chức vụ">
                <Tag color="red">{player.title}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Chuyên môn">
                <Tag color="blue">{player.specialization}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Liên minh">
                <Tag color="green">{player.alliance}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tham gia">
                {new Date(player.registrationDate).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Đăng nhập cuối">
                {new Date(player.lastLogin).toLocaleString('vi-VN')}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Thống kê chiến đấu */}
        <Col xs={24} lg={8}>
          <Card title="Thống kê chiến đấu" bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Statistic
                title="Sức mạnh"
                value={player.power}
                suffix="points"
                valueStyle={{ color: '#8B0000' }}
              />
              
              <div>
                <Text strong>Tỷ lệ thắng</Text>
                <Progress 
                  percent={player.winRate} 
                  strokeColor={{
                    '0%': '#DC143C',
                    '50%': '#D4AF37',
                    '100%': '#2E8B57',
                  }}
                  format={percent => `${percent}%`}
                />
              </div>

              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Tổng trận"
                    value={player.battles}
                    prefix="⚔️"
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Chiến thắng"
                    value={player.wins}
                    prefix="🏆"
                    valueStyle={{ color: '#2E8B57' }}
                  />
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Điểm chiến thắng"
                    value={player.victoryPoints}
                    valueStyle={{ color: '#D4AF37' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Lãnh thổ"
                    value={player.territory}
                    prefix="🏰"
                  />
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>

        {/* Hoạt động gần đây */}
        <Col xs={24} lg={8}>
          <Card title="Hoạt động gần đây" bordered={false}>
            <Timeline items={activityTimeline} />
          </Card>
        </Col>
      </Row>

      {/* Thông tin hệ thống */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="Thông tin hệ thống" bordered={false}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Thời gian chơi"
                  value={player.playTime}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Xếp hạng hiện tại"
                  value={player.currentRank}
                  suffix={`/ ${player.highestRank} (cao nhất)`}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="IP cuối cùng"
                  value={player.lastIp}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Thiết bị"
                  value={player.device}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Số vi phạm"
                  value={player.violations}
                  valueStyle={{ 
                    color: player.violations === 0 ? '#2E8B57' : 
                           player.violations <= 2 ? '#FF8C00' : '#DC143C' 
                  }}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Trạng thái tài khoản"
                  value="Hoạt động bình thường"
                  valueStyle={{ color: '#2E8B57' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
