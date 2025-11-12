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
  List,
  Avatar,
  Tabs
} from 'antd';
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  TeamOutlined,
  CrownOutlined,
  TrophyOutlined,
  EnvironmentOutlined,
  BarChartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Sword } from 'lucide-react';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Mock data - sẽ thay thế bằng API call
const mockAllianceData = {
  id: '1',
  name: 'Thiên Đàng',
  tag: 'THIEN',
  level: 10,
  members: 48,
  maxMembers: 50,
  leader: 'ThienMaHung',
  status: 'active',
  createdDate: '2023-01-15T00:00:00Z',
  totalPower: 45800000,
  victoryPoints: 125800,
  winRate: 82.5,
  territory: 245,
  description: 'Liên minh hùng mạnh bậc nhất server, chuyên về chiến thuật tấn công và chiếm lĩnh lãnh thổ. Thành lập với mục tiêu thống nhất toàn bộ bản đồ game.',
  requirements: {
    minLevel: 60,
    minPower: 800000,
    approvalRequired: true,
  },
  memberList: [
    { id: '1', username: 'ThienMaHung', role: 'Thủ Lĩnh', level: 85, power: 1250000, joinDate: '2023-01-15' },
    { id: '2', username: 'ThienKiemSu', role: 'Phó Thủ Lĩnh', level: 82, power: 1180000, joinDate: '2023-01-20' },
    { id: '3', username: 'ThienNoVu', role: 'Trưởng Lão', level: 80, power: 1050000, joinDate: '2023-02-05' },
    { id: '4', username: 'ThienCungThu', role: 'Trưởng Lão', level: 78, power: 980000, joinDate: '2023-02-10' },
    { id: '5', username: 'ThienChienBinh', role: 'Thành Viên Ưu Tú', level: 75, power: 920000, joinDate: '2023-03-01' },
  ],
  recentActivities: [
    { action: 'Chiếm được thành MainCity', user: 'ThienMaHung', time: '2 giờ trước' },
    { action: 'Đánh bại liên minh Long Môn', user: 'ThienKiemSu', time: '5 giờ trước' },
    { action: 'Nâng cấp đại bản doanh lên cấp 8', user: 'ThienNoVu', time: '1 ngày trước' },
    { action: 'Thành viên mới: ThienChienBinh', user: 'System', time: '2 ngày trước' },
    { action: 'Chiến thắng sự kiện Thập Đại Sứ Quân', user: 'ThienMaHung', time: '3 ngày trước' },
  ],
  warStatistics: {
    totalBattles: 1250,
    wins: 1032,
    losses: 218,
    territoryControl: 245,
    resourceProduction: 125000,
  }
};

export default function AllianceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const allianceId = params.id as string;

  const alliance = mockAllianceData; // Trong thực tế sẽ fetch từ API

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
          <div>
            <Title level={2} style={{ margin: 0, color: '#8B0000' }}>
              {alliance.name}
            </Title>
            <Text type="secondary">[{alliance.tag}] • Thủ lĩnh: {alliance.leader}</Text>
          </div>
          <Tag color="green">Đang hoạt động</Tag>
        </Space>

        <Space>
          <Button icon={<EditOutlined />}>Chỉnh sửa</Button>
          <Button type="primary" danger>Đình chỉ</Button>
        </Space>
      </Space>

      <Row gutter={[16, 16]}>
        {/* Thông tin cơ bản */}
        <Col xs={24} lg={8}>
          <Card title="Thông tin cơ bản" bordered={false}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="ID">{alliance.id}</Descriptions.Item>
              <Descriptions.Item label="Thẻ hiệu">
                <Tag color="blue">[{alliance.tag}]</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Cấp độ">
                <Tag color="gold" icon={<CrownOutlined />}>
                  Cấp {alliance.level}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Thủ lĩnh">
                <Text strong>{alliance.leader}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày thành lập">
                {new Date(alliance.createdDate).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Thành viên">
                <Space>
                  <TeamOutlined />
                  <Text strong>{alliance.members}</Text>
                  <Text type="secondary">/ {alliance.maxMembers}</Text>
                </Space>
                <Progress 
                  percent={Math.round((alliance.members / alliance.maxMembers) * 100)} 
                  size="small" 
                  showInfo={false}
                  style={{ marginTop: 4 }}
                />
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Yêu cầu gia nhập */}
          <Card title="Yêu cầu gia nhập" bordered={false} style={{ marginTop: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>Cấp độ tối thiểu: </Text>
                <Tag color="blue">Cấp {alliance.requirements.minLevel}+</Tag>
              </div>
              <div>
                <Text strong>Sức mạnh tối thiểu: </Text>
                <Tag color="orange">{(alliance.requirements.minPower / 1000000).toFixed(1)}M+</Tag>
              </div>
              <div>
                <Text strong>Phê duyệt: </Text>
                <Tag color={alliance.requirements.approvalRequired ? 'blue' : 'green'}>
                  {alliance.requirements.approvalRequired ? 'Cần phê duyệt' : 'Tự do gia nhập'}
                </Tag>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Thống kê chiến đấu */}
        <Col xs={24} lg={8}>
          <Card title="Thống kê chiến đấu" bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Statistic
                title="Tổng sức mạnh"
                value={alliance.totalPower}
                suffix="points"
                valueStyle={{ color: '#D4AF37' }}
              />
              
              <div>
                <Text strong>Tỷ lệ thắng</Text>
                <Progress 
                  percent={alliance.winRate} 
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
                    title="Điểm chiến thắng"
                    value={alliance.victoryPoints}
                    prefix={<TrophyOutlined />}
                    valueStyle={{ color: '#D4AF37' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Lãnh thổ"
                    value={alliance.territory}
                    prefix={<EnvironmentOutlined />}
                  />
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Tổng trận"
                    value={alliance.warStatistics.totalBattles}
                    prefix={<Sword />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Thắng / Thua"
                    value={alliance.warStatistics.wins}
                    suffix={`/ ${alliance.warStatistics.losses}`}
                    valueStyle={{ color: '#2E8B57' }}
                  />
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>

        {/* Mô tả */}
        <Col xs={24} lg={8}>
          <Card title="Giới thiệu" bordered={false}>
            <Paragraph>
              {alliance.description}
            </Paragraph>
            
            <div style={{ marginTop: 16 }}>
              <Text strong>Chiến thuật: </Text>
                <Tag color="red">Tấn công</Tag>
                <Tag color="blue">Chiếm lãnh thổ</Tag>
                <Tag color="green">Phối hợp</Tag>
            </div>

            <div style={{ marginTop: 16 }}>
              <Text strong>Hoạt động: </Text>
              <Text type="secondary">Hàng ngày</Text>
            </div>

            <div style={{ marginTop: 16 }}>
              <Text strong>Ngôn ngữ: </Text>
              <Text type="secondary">Tiếng Việt</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tabs for detailed information */}
      <Card style={{ marginTop: 16 }} bordered={false}>
        <Tabs defaultActiveKey="members">
          <TabPane tab="Thành viên" key="members">
            <List
              dataSource={alliance.memberList}
              renderItem={member => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ backgroundColor: '#8B0000' }}
                        icon={<UserOutlined />}
                      />
                    }
                    title={
                      <Space>
                        <Text strong>{member.username}</Text>
                        <Tag color={
                          member.role === 'Thủ Lĩnh' ? 'red' :
                          member.role === 'Phó Thủ Lĩnh' ? 'orange' :
                          member.role === 'Trưởng Lão' ? 'blue' : 'green'
                        }>
                          {member.role}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space>
                        <Tag color="gold">Lv.{member.level}</Tag>
                        <Tag color="orange">{(member.power / 1000000).toFixed(1)}M</Tag>
                        <Text type="secondary">
                          Tham gia: {new Date(member.joinDate).toLocaleDateString('vi-VN')}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </TabPane>

          <TabPane tab="Hoạt động gần đây" key="activities">
            <List
              dataSource={alliance.recentActivities}
              renderItem={activity => (
                <List.Item>
                  <List.Item.Meta
                    title={activity.action}
                    description={
                      <Space>
                        <Text type="secondary">bởi {activity.user}</Text>
                        <Text type="secondary">•</Text>
                        <Text type="secondary">{activity.time}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </TabPane>

          <TabPane tab="Thống kê chi tiết" key="statistics">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Card size="small">
                  <Statistic
                    title="Sản xuất tài nguyên/ngày"
                    value={alliance.warStatistics.resourceProduction}
                    valueStyle={{ color: '#2E8B57' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card size="small">
                  <Statistic
                    title="Tỷ lệ thắng trận liên minh"
                    value={82.5}
                    suffix="%"
                    valueStyle={{ color: '#D4AF37' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card size="small">
                  <Statistic
                    title="Thành viên online trung bình"
                    value={32}
                    suffix="/ngày"
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
