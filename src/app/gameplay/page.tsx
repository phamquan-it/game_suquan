"use client"
// pages/gameplay-page.tsx
import React, { useState } from 'react';
import {
  Layout,
  Card,
  Row,
  Col,
  Divider,
  Typography,
  Space,
  Tag,
  Button,
  List,
  Steps,
  Progress,
  Tabs,
  Timeline,
  Collapse,
  Badge,
  Statistic,
  Modal,
} from 'antd';
import {
  Crown,
  Sword,
  Users,
  Target,
  Zap,
  BookOpen,
  Play,
  Award,
  Clock,
  Star,
  TrendingUp,
  Compass,
  Castle,
} from 'lucide-react';

const { Title, Paragraph, Text } = Typography;
const { Header, Footer, Content } = Layout;

const GameplayPage = () => {
  const [activeFeatureTab, setActiveFeatureTab] = useState('combat');
  const [selectedGuide, setSelectedGuide] = useState<any>(null);
  const [isGuideModalVisible, setIsGuideModalVisible] = useState(false);

  const gameplayFeatures = [
    {
      key: 'combat',
      title: 'Chiến Đấu & Chiến Thuật',
      icon: <Sword />,
      color: '#8B0000',
      features: [
        {
          title: 'Hệ Thống Chiến Trận Thời Gian Thực',
          description: 'Chỉ huy quân đội theo thời gian thực với các chiến thuật đa dạng',
          details: ['3 loại quân chính: Bộ binh, Kỵ binh, Cung thủ', 'Hơn 20 đơn vị quân đội đặc biệt', 'Chiến thuật phối hợp quân chủng', 'Tận dụng địa hình chiến lược'],
          image: '/api/placeholder/400/250'
        },
        {
          title: 'Tướng Lĩnh & Kỹ Năng Đặc Biệt',
          description: 'Mỗi sứ quân sở hữu kỹ năng độc nhất ảnh hưởng đến cục diện chiến trường',
          details: ['12 tướng lĩnh với kỹ năng riêng biệt', 'Cây kỹ năng có thể nâng cấp', 'Kỹ năng combo khi phối hợp', 'Chiến thuật theo mùa và thời tiết'],
          image: '/api/placeholder/400/250'
        }
      ]
    },
    {
      key: 'strategy',
      title: 'Chiến Lược & Quản Lý',
      icon: <Crown />,
      color: '#D4AF37',
      features: [
        {
          title: 'Xây Dựng & Phát Triển Thành Trì',
          description: 'Xây dựng căn cứ vững chắc và phát triển kinh tế để hậu thuẫn chiến tranh',
          details: ['15 loại công trình khác nhau', 'Hệ thống nghiên cứu công nghệ', 'Quản lý tài nguyên hiệu quả', 'Nâng cấp phòng thủ thành trì'],
          image: '/api/placeholder/400/250'
        },
        {
          title: 'Ngoại Giao & Liên Minh',
          description: 'Sử dụng ngoại giao khôn khéo để xây dựng liên minh hoặc chia rẽ kẻ thù',
          details: ['Hệ thống quan hệ ngoại giao', 'Cơ chế liên minh và phản bội', 'Thương lượng và thỏa thuận', 'Gián điệp và phá hoại ngầm'],
          image: '/api/placeholder/400/250'
        }
      ]
    },
    {
      key: 'economy',
      title: 'Kinh Tế & Phát Triển',
      icon: <TrendingUp />,
      color: '#2E8B57',
      features: [
        {
          title: 'Hệ Thống Kinh Tế Phức Tạp',
          description: 'Quản lý nền kinh tế với nhiều nguồn tài nguyên và thương mại',
          details: ['6 loại tài nguyên chính', 'Mạng lưới thương mại giữa các vùng', 'Thuế và quản lý ngân sách', 'Đầu tư phát triển hạ tầng'],
          image: '/api/placeholder/400/250'
        },
        {
          title: 'Công Nghệ & Nghiên Cứu',
          description: 'Nghiên cứu công nghệ mới để nâng cao sức mạnh quân sự và kinh tế',
          details: ['4 nhánh công nghệ chính', 'Cây nghiên cứu đa dạng', 'Chuyển giao công nghệ', 'Bí kíp và sách lược quân sự'],
          image: '/api/placeholder/400/250'
        }
      ]
    }
  ];

  const beginnerGuides = [
    {
      id: 1,
      title: 'Hướng Dẫn Tân Thủ - 5 Bước Đầu Tiên',
      level: 'Cơ Bản',
      duration: '10 phút',
      steps: [
        'Chọn sứ quân phù hợp với phong cách',
        'Xây dựng căn cứ ban đầu',
        'Tuyển mộ và huấn luyện quân đội',
        'Khám phá bản đồ và tài nguyên',
        'Tham gia sự kiện đầu tiên'
      ],
      rewards: ['1000 Vàng', 'Vật phẩm hiếm', 'Trang bị khởi đầu']
    },
    {
      id: 2,
      title: 'Chiến Thuật Xây Dựng Thành Trì Hiệu Quả',
      level: 'Trung Cấp',
      duration: '15 phút',
      steps: [
        'Bố trí công trình phòng thủ',
        'Tối ưu hóa sản xuất tài nguyên',
        'Xây dựng mạng lưới thương mại',
        'Nâng cấp công trình then chốt',
        'Phòng thủ chống lại tấn công'
      ],
      rewards: ['Công thức xây dựng', 'Tài nguyên quý', 'Bản đồ vị trí']
    },
    {
      id: 3,
      title: 'Nghệ Thuật Chiến Tranh - Bí Kíp Chiến Thắng',
      level: 'Nâng Cao',
      duration: '20 phút',
      steps: [
        'Phân tích điểm mạnh yếu đối thủ',
        'Sử dụng địa hình chiến lược',
        'Kết hợp các loại quân hiệu quả',
        'Chiến thuật tấn công bất ngờ',
        'Quản lý hậu cần và tiếp viện'
      ],
      rewards: ['Binh thư yếu lược', 'Vật phẩm epic', 'Danh hiệu đặc biệt']
    }
  ];

  const progressionSystem = [
    {
      stage: 'Khởi Đầu',
      level: '1-10',
      focus: 'Làm quen và xây dựng căn bản',
      rewards: ['Quân đội cơ bản', 'Công trình level 1', 'Kỹ năng khởi đầu'],
      color: '#2E8B57'
    },
    {
      stage: 'Phát Triển',
      level: '11-30',
      focus: 'Mở rộng lãnh thổ và quyền lực',
      rewards: ['Quân đội trung cấp', 'Công trình level 2-3', 'Kỹ năng nâng cao'],
      color: '#D4AF37'
    },
    {
      stage: 'Bá Chủ',
      level: '31-50',
      focus: 'Thống nhất và cai trị',
      rewards: ['Quân đội tinh nhuệ', 'Công trình level 4-5', 'Kỹ năng đặc biệt'],
      color: '#8B0000'
    }
  ];

  const openGuideDetail = (guide: any) => {
    setSelectedGuide(guide);
    setIsGuideModalVisible(true);
  };

  const GameplayFeatureCard = ({ feature }: { feature: any }) => (
    <Card
      style={{
        border: `2px solid ${feature.color}`,
        borderRadius: '12px',
        background: 'white',
        marginBottom: '16px'
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Space>
          <div style={{ color: feature.color }}>
            {feature.icon}
          </div>
          <Title level={4} style={{ color: feature.color, margin: 0 }}>
            {feature.title}
          </Title>
        </Space>

        <Paragraph style={{ color: '#666', margin: 0 }}>
          {feature.description}
        </Paragraph>

        <Row gutter={[16, 16]}>
          {feature.features.map((item: any, index: number) => (
            <Col key={index} xs={24} lg={12}>
              <Card
                size="small"
                style={{
                  border: `1px solid ${feature.color}`,
                  background: 'rgba(255, 255, 255, 0.8)'
                }}
                  styles={{ body: { padding: '16px' } }}
              >
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                  <Title level={5} style={{ color: feature.color, margin: 0 }}>
                    {item.title}
                  </Title>

                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {item.description}
                  </Text>

                  <List
                    size="small"
                    dataSource={item.details}
                    renderItem={(detail: string) => (
                      <List.Item style={{ padding: '4px 0' }}>
                        <Space>
                          <div style={{
                            width: '6px',
                            height: '6px',
                            background: feature.color,
                            borderRadius: '50%'
                          }} />
                          <Text style={{ fontSize: '12px' }}>{detail}</Text>
                        </Space>
                      </List.Item>
                    )}
                  />
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Space>
    </Card>
  );

  const GuideCard = ({ guide }: { guide: any }) => (
    <Card
      hoverable
      style={{
        border: '2px solid #D4AF37',
        borderRadius: '12px',
        background: 'white',
        height: '100%'
      }}
      onClick={() => openGuideDetail(guide)}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Badge.Ribbon
          text={guide.level}
          color={
            guide.level === 'Cơ Bản' ? '#2E8B57' :
            guide.level === 'Trung Cấp' ? '#D4AF37' : '#8B0000'
          }
        >
          <div></div>
        </Badge.Ribbon>

        <Title level={4} style={{ color: '#8B0000', margin: 0, minHeight: '64px' }}>
          {guide.title}
        </Title>

        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Clock size={14} style={{ color: '#8B4513' }} />
            <Text type="secondary" style={{ fontSize: '12px' }}>{guide.duration}</Text>
          </Space>
          <Tag color="#CD7F32" style={{ margin: 0, fontSize: '10px' }}>
            {guide.steps.length} bước
          </Tag>
        </Space>

        <Progress
          percent={33}
          size="small"
          strokeColor={{
            '0%': '#D4AF37',
            '100%': '#8B0000',
          }}
          format={() => 'Bắt đầu học'}
        />

        <Button
          type="primary"
          size="small"
          block
          style={{
            background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
            border: 'none',
            color: '#8B0000',
            fontWeight: 'bold'
          }}
          icon={<Play size={12} />}
        >
          Bắt Đầu Hướng Dẫn
        </Button>
      </Space>
    </Card>
  );

  return (
    <Layout style={{ background: 'linear-gradient(135deg, #F5F5DC 0%, #F1E8D6 100%)', minHeight: '100vh' }}>
      {/* Header */}
      <Header style={{
        background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.95) 0%, rgba(0, 51, 102, 0.95) 100%)',
        borderBottom: '3px solid #D4AF37'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #8B0000, #D4AF37)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #D4AF37'
            }}>
              <Sword size={20} color="#FFFFFF" />
            </div>
            <Title level={3} style={{
              margin: 0,
              color: '#D4AF37',
              background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}>
              LỐI CHƠI & CHIẾN THUẬT
            </Title>
          </div>

          <Space>
            <Button type="link" style={{ color: '#D4AF37', fontWeight: '600' }}>Tính Năng</Button>
            <Button type="link" style={{ color: '#D4AF37', fontWeight: '600' }}>Hướng Dẫn</Button>
            <Button type="link" style={{ color: '#D4AF37', fontWeight: '600' }}>Tiến Trình</Button>
          </Space>
        </div>
      </Header>

      <Content style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Hero Section */}
          <Card
            style={{
              background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.9), rgba(0, 51, 102, 0.9))',
              border: '3px solid #D4AF37',
              borderRadius: '20px',
              marginBottom: '40px',
              color: 'white'
            }}
          >
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} lg={16}>
                <Space direction="vertical" size="large">
                  <div>
                    <Tag color="gold" style={{ color: '#8B0000', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
                      NGHỆ THUẬT CHIẾN TRANH
                    </Tag>
                    <Title level={1} style={{ color: '#D4AF37', margin: 0, fontSize: '3rem' }}>
                      Lối Chơi Đỉnh Cao 12 Sứ Quân
                    </Title>
                  </div>

                  <Paragraph style={{
                    color: 'white',
                    fontSize: '1.1rem',
                    lineHeight: '1.6'
                  }}>
                    Khám phá hệ thống gameplay phức tạp và sâu sắc, nơi chiến thuật, ngoại giao và quản lý
                    hòa quyện tạo nên trải nghiệm chiến tranh thời loạn đầy chân thực. Lựa chọn con đường
                    của riêng bạn để trở thành người thống nhất đất nước!
                  </Paragraph>

                  <Space>
                    <Button
                      type="primary"
                      icon={<Play size={16} />}
                      style={{
                        background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                        border: 'none',
                        fontWeight: 'bold',
                        color: '#8B0000'
                      }}
                    >
                      Xem Video Gameplay
                    </Button>
                    <Button
                      icon={<BookOpen size={16} />}
                      style={{
                        background: 'rgba(212, 175, 55, 0.2)',
                        border: '1px solid #D4AF37',
                        color: '#D4AF37'
                      }}
                    >
                      Hướng Dẫn Chi Tiết
                    </Button>
                  </Space>
                </Space>
              </Col>

              <Col xs={24} lg={8}>
                <div style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '2px solid #D4AF37',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center'
                }}>
                  <Title level={4} style={{ color: '#D4AF37', marginBottom: '16px' }}>
                    <Award style={{ marginRight: '8px' }} />
                    Thống Kê Lối Chơi
                  </Title>
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Statistic
                      title="Loại Quân Đội"
                      value={20}
                      valueStyle={{ color: '#D4AF37' }}
                      prefix={<Sword size={16} />}
                    />
                    <Statistic
                      title="Công Trình"
                      value={15}
                      valueStyle={{ color: '#D4AF37' }}
                      prefix={<Castle size={16} />}
                    />
                    <Statistic
                      title="Chiến Thuật"
                      value={50}
                      valueStyle={{ color: '#D4AF37' }}
                      prefix={<Target size={16} />}
                    />
                    <Statistic
                      title="Kỹ Năng"
                      value={120}
                      valueStyle={{ color: '#D4AF37' }}
                      prefix={<Zap size={16} />}
                    />
                  </Space>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Gameplay Features */}
          <Title level={2} style={{ color: '#8B0000', marginBottom: '32px', textAlign: 'center' }}>
            <Sword style={{ marginRight: '12px' }} />
            Tính Năng Lối Chơi Chính
          </Title>

          <Tabs
            activeKey={activeFeatureTab}
            onChange={setActiveFeatureTab}
            items={gameplayFeatures.map(feature => ({
              key: feature.key,
              label: (
                <Space>
                  <div style={{ color: feature.color }}>
                    {feature.icon}
                  </div>
                  <Text strong style={{ color: feature.color }}>
                    {feature.title}
                  </Text>
                </Space>
              ),
              children: <GameplayFeatureCard feature={feature} />
            }))}
            style={{ marginBottom: '40px' }}
          />

          {/* Beginner Guides */}
          <Title level={2} style={{ color: '#8B0000', marginBottom: '32px', textAlign: 'center' }}>
            <BookOpen style={{ marginRight: '12px' }} />
            Hướng Dẫn Cho Người Mới
          </Title>

          <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
            {beginnerGuides.map(guide => (
              <Col key={guide.id} xs={24} md={12} lg={8}>
                <GuideCard guide={guide} />
              </Col>
            ))}
          </Row>

          {/* Progression System */}
          <Card
            style={{
              border: '3px solid #D4AF37',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #FFFFFF, #F5F5DC)',
              marginBottom: '40px'
            }}
          >
            <Title level={2} style={{ color: '#8B0000', marginBottom: '32px', textAlign: 'center' }}>
              <TrendingUp style={{ marginRight: '12px' }} />
              Hệ Thống Tiến Trình
            </Title>

            <Steps
              current={1}
              items={progressionSystem.map((stage, index) => ({
                title: (
                  <Space direction="vertical" size={0}>
                    <Text strong style={{ color: stage.color, fontSize: '16px' }}>
                      {stage.stage}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Cấp {stage.level}
                    </Text>
                  </Space>
                ),
                description: (
                  <Space direction="vertical" size="small" style={{ marginTop: '12px' }}>
                    <Text style={{ color: '#666', fontSize: '12px' }}>
                      {stage.focus}
                    </Text>
                    <List
                      size="small"
                      dataSource={stage.rewards}
                      renderItem={(reward) => (
                        <List.Item style={{ padding: '2px 0' }}>
                          <Space>
                            <Star size={10} style={{ color: stage.color }} />
                            <Text style={{ fontSize: '11px' }}>{reward}</Text>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </Space>
                ),
                icon: (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: stage.color,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </div>
                )
              }))}
            />
          </Card>

          {/* Quick Tips */}
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <Zap style={{ color: '#8B0000' }} />
                    <Text strong>Mẹo Chiến Thuật Nhanh</Text>
                  </Space>
                }
                style={{ border: '2px solid #D4AF37', borderRadius: '12px' }}
              >
                <Timeline>
                  <Timeline.Item color="#8B0000" dot={<Sword size={16} />}>
                    <Space direction="vertical" size={0}>
                      <Text strong>Đa dạng hóa quân đội</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Kết hợp các loại quân để tạo sức mạnh tổng hợp
                      </Text>
                    </Space>
                  </Timeline.Item>
                  <Timeline.Item color="#D4AF37" dot={<Castle size={16} />}>
                    <Space direction="vertical" size={0}>
                      <Text strong>Ưu tiên phòng thủ</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Xây dựng thành trì vững chắc trước khi tấn công
                      </Text>
                    </Space>
                  </Timeline.Item>
                  <Timeline.Item color="#2E8B57" dot={<Users size={16} />}>
                    <Space direction="vertical" size={0}>
                      <Text strong>Xây dựng liên minh</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Hợp tác chiến lược quan trọng hơn đơn độc chiến đấu
                      </Text>
                    </Space>
                  </Timeline.Item>
                  <Timeline.Item color="#CD7F32" dot={<Compass size={16} />}>
                    <Space direction="vertical" size={0}>
                      <Text strong>Khám phá bản đồ</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Tận dụng địa hình và tài nguyên thiên nhiên
                      </Text>
                    </Space>
                  </Timeline.Item>
                </Timeline>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <Target style={{ color: '#8B0000' }} />
                    <Text strong>Chiến Lược Hiệu Quả</Text>
                  </Space>
                }
                style={{ border: '2px solid #D4AF37', borderRadius: '12px' }}
              >
                <Collapse
                  ghost
                  items={[
                    {
                      key: '1',
                      label: 'Chiến thuật "Vây thành diệt viện"',
                      children: 'Bao vây thành trì đối phương và tiêu diệt quân tiếp viện'
                    },
                    {
                      key: '2',
                      label: 'Chiến thuật "Thanh dã"',
                      children: 'Triệt nguồn lương thực và tiêu hao sinh lực địch'
                    },
                    {
                      key: '3',
                      label: 'Chiến thuật "Dĩ dật đãi lao"',
                      children: 'Lấy tĩnh chế động, lấy ít địch nhiều'
                    },
                    {
                      key: '4',
                      label: 'Chiến thuật "Mỹ nhân kế"',
                      children: 'Sử dụng ngoại giao và mưu kế để phân hóa kẻ thù'
                    }
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </Content>

      {/* Footer */}
      <Footer style={{
        background: '#003366',
        color: '#D4AF37',
        padding: '40px 20px',
        borderTop: '3px solid #D4AF37',
        marginTop: '60px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <Space direction="vertical" size="large">
            <Title level={4} style={{ color: '#D4AF37', margin: 0 }}>
              12 SỨ QUÂN - BINH PHÁP & CHIẾN THUẬT
            </Title>
            <Paragraph style={{ color: 'rgba(212, 175, 55, 0.8)', margin: 0 }}>
              Làm chủ nghệ thuật chiến tranh và trở thành người thống nhất vĩ đại
            </Paragraph>
          </Space>

          <Divider style={{ borderColor: '#D4AF37', margin: '30px 0' }} />

          <Text style={{ color: 'rgba(212, 175, 55, 0.6)' }}>
            © 2024 12 Sứ Quân. Tất cả quyền được bảo lưu.
          </Text>
        </div>
      </Footer>

      {/* Guide Detail Modal */}
      <Modal
        title={selectedGuide ? selectedGuide.title : ''}
        open={isGuideModalVisible}
        onCancel={() => setIsGuideModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedGuide && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Tag color={
                selectedGuide.level === 'Cơ Bản' ? '#2E8B57' :
                selectedGuide.level === 'Trung Cấp' ? '#D4AF37' : '#8B0000'
              }>
                {selectedGuide.level}
              </Tag>
              <Space>
                <Clock size={14} style={{ color: '#8B4513' }} />
                <Text type="secondary">{selectedGuide.duration}</Text>
              </Space>
            </Space>

            <Steps
              direction="vertical"
              current={0}
              items={selectedGuide.steps.map((step: string, index: number) => ({
                title: step,
                description: `Bước ${index + 1} trong quá trình học tập`
              }))}
            />

            <Card
              size="small"
              title="Phần Thưởng Hoàn Thành"
              style={{ border: '1px solid #D4AF37' }}
            >
              <Space wrap>
                {selectedGuide.rewards.map((reward: string, index: number) => (
                  <Tag key={index} color="gold" style={{ color: '#8B0000', fontWeight: 'bold' }}>
                    {reward}
                  </Tag>
                ))}
              </Space>
            </Card>

            <Space style={{ width: '100%', justifyContent: 'center' }}>
              <Button
                type="primary"
                size="large"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                  border: 'none',
                  fontWeight: 'bold',
                  color: '#8B0000'
                }}
                icon={<Play size={16} />}
              >
                Bắt Đầu Học Ngay
              </Button>
            </Space>
          </Space>
        )}
      </Modal>
    </Layout>
  );
};

export default GameplayPage;
