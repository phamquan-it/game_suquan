'use client';

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
  Tabs,
  Spin
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  TeamOutlined,
  CrownOutlined,
  TrophyOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAllianceDetail } from '../hooks/useAllianceDetail';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

export default function AllianceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const allianceId = params.id as string;

  const { data: alliance, loading } = useAllianceDetail(allianceId);

  if (loading || !alliance) {
    return <Spin style={{ display: 'block', margin: '100px auto' }} />;
  }

  return (
    <div>
      {/* Header */}
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 24 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
            Quay lại
          </Button>

          <div>
            <Title level={2} style={{ margin: 0, color: '#8B0000' }}>
              {alliance.name}
            </Title>
            <Text type="secondary">
              [{alliance.tag}] • Thủ lĩnh: {alliance.leaderInfo?.username || 'N/A'}
            </Text>
          </div>

          <Tag color={alliance.status === 'active' ? 'green' : 'red'}>
            {alliance.status}
          </Tag>
        </Space>

        <Space>
          <Button icon={<EditOutlined />}>Chỉnh sửa</Button>
          <Button type="primary" danger>Đình chỉ</Button>
        </Space>
      </Space>

      <Row gutter={[16, 16]}>
        {/* Thông tin cơ bản */}
        <Col xs={24} lg={8}>
          <Card title="Thông tin cơ bản" variant='borderless'>
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
                <Text strong>{alliance.leaderInfo?.username}</Text>
              </Descriptions.Item>

              <Descriptions.Item label="Ngày thành lập">
                {new Date(alliance.created_date).toLocaleDateString('vi-VN')}
              </Descriptions.Item>

              <Descriptions.Item label="Thành viên">
                <Space>
                  <TeamOutlined />
                  <Text strong>{alliance.members}</Text>
                  <Text type="secondary">/ {alliance.max_members}</Text>
                </Space>

                <Progress
                  percent={Math.round((alliance.members / alliance.max_members) * 100)}
                  size="small"
                  showInfo={false}
                  style={{ marginTop: 4 }}
                />
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Yêu cầu gia nhập */}
          <Card title="Yêu cầu gia nhập" variant='borderless' style={{ marginTop: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>Cấp độ tối thiểu: </Text>
                <Tag color="blue">Cấp {alliance.requirements?.minLevel}+</Tag>
              </div>

              <div>
                <Text strong>Sức mạnh tối thiểu: </Text>
                <Tag color="orange">
                  {(alliance.requirements?.minPower / 1_000_000).toFixed(1)}M+
                </Tag>
              </div>

              <div>
                <Text strong>Phê duyệt: </Text>
                <Tag color={alliance.requirements?.approvalRequired ? 'blue' : 'green'}>
                  {alliance.requirements?.approvalRequired ? 'Cần phê duyệt' : 'Tự do'}
                </Tag>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Thống kê */}
        <Col xs={24} lg={8}>
          <Card title="Thống kê chiến đấu" variant='borderless'>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Statistic
                title="Tổng sức mạnh"
                value={alliance.total_power}
                suffix="points"
              />

              <div>
                <Text strong>Tỷ lệ thắng</Text>
                <Progress percent={Number(alliance.win_rate)} />
              </div>

              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Điểm chiến thắng"
                    value={alliance.victory_points}
                    prefix={<TrophyOutlined />}
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
            </Space>
          </Card>
        </Col>

        {/* Mô tả */}
        <Col xs={24} lg={8}>
          <Card title="Giới thiệu" variant='borderless'>
            <Paragraph>{alliance.description}</Paragraph>
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Card style={{ marginTop: 16 }} variant='borderless'>
        <Tabs defaultActiveKey="members">
          <TabPane tab="Thành viên" key="members">
            <List
              dataSource={alliance.membersList.map((m: any) => ({
                id: m.player.id,
                username: m.player.username,
                role: m.role,
                level: m.player.level,
                power: m.player.power,
                joinDate: m.joined_at,
              }))}
              renderItem={(member) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar icon={<UserOutlined />} />
                    }
                    title={
                      <Space>
                        <Text strong>{member.username}</Text>
                        <Tag>{member.role}</Tag>
                      </Space>
                    }
                    description={
                      <Space>
                        <Tag>Lv.{member.level}</Tag>
                        <Tag>{(member.power / 1_000_000).toFixed(1)}M</Tag>
                        <Text type="secondary">
                          {new Date(member.joinDate).toLocaleDateString('vi-VN')}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </TabPane>

          <TabPane tab="Thống kê" key="stats">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="Win rate" value={alliance.win_rate} suffix="%" />
              </Col>
              <Col span={12}>
                <Statistic title="Members" value={alliance.members} />
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
