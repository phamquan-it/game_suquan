"use client"
// pages/policy-page.tsx
import React, { useState } from 'react';
import {
  Layout,
  Card,
  Row,
  Col,
  Avatar,
  Divider,
  Typography,
  Space,
  Tag,
  Button,
  List,
  Collapse,
  Timeline,
  message,
  Steps,
  Statistic,
  Modal,
  Tabs,
  Badge,
  Progress,
  Tooltip,
  Switch,
  Alert,
  Grid
} from 'antd';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Download,
  Print,
  Calendar,
  Clock,
  User,
  Users,
  FileText,
  CheckCircle,
  AlertTriangle,
  Info,
  BookOpen,
  Crown,
  Scale,
  Heart,
  Share2,
  Bookmark,
  ArrowRight,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { Step } = Steps;
const { useBreakpoint } = Grid;
const { Header, Footer, Content } = Layout;

const PolicyPage = () => {
  const screens = useBreakpoint();
  const [activePolicyTab, setActivePolicyTab] = useState('privacy');
  const [acceptAll, setAcceptAll] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [isConsentModalVisible, setIsConsentModalVisible] = useState(false);

  const policyCategories = [
    {
      key: 'privacy',
      name: 'Bảo Mật',
      icon: <Lock size={18} />,
      color: '#8B0000',
      description: 'Bảo vệ thông tin cá nhân và dữ liệu người dùng'
    },
    {
      key: 'terms',
      name: 'Điều Khoản',
      icon: <FileText size={18} />,
      color: '#D4AF37',
      description: 'Quy định sử dụng dịch vụ và ứng xử trong game'
    },
    {
      key: 'cookies',
      name: 'Cookies',
      icon: <Shield size={18} />,
      color: '#003366',
      description: 'Quản lý cookie và công nghệ theo dõi'
    },
    {
      key: 'community',
      name: 'Cộng Đồng',
      icon: <Users size={18} />,
      color: '#2E8B57',
      description: 'Chính sách ứng xử và quy tắc cộng đồng'
    },
    {
      key: 'refund',
      name: 'Hoàn Tiền',
      icon: <Scale size={18} />,
      color: '#CD7F32',
      description: 'Chính sách hoàn tiền và giải quyết tranh chấp'
    }
  ];

  const privacyPolicy = {
    lastUpdated: '15/01/2024',
    version: 'v2.1',
    sections: [
      {
        title: 'Thu Thập Thông Tin',
        icon: <User size={16} />,
        content: {
          summary: 'Chúng tôi thu thập thông tin cần thiết để cung cấp và cải thiện dịch vụ',
          details: [
            'Thông tin tài khoản: tên, email, số điện thoại',
            'Dữ liệu game: nhân vật, lịch sử giao dịch, thành tích',
            'Thông tin thiết bị: IP, loại thiết bị, hệ điều hành',
            'Dữ liệu sử dụng: thời gian chơi, tương tác trong game'
          ],
          required: true
        }
      },
      {
        title: 'Sử Dụng Thông Tin',
        icon: <Eye size={16} />,
        content: {
          summary: 'Thông tin được sử dụng để cung cấp dịch vụ và trải nghiệm tốt nhất',
          details: [
            'Cung cấp và duy trì dịch vụ game',
            'Cá nhân hóa trải nghiệm người chơi',
            'Phát triển tính năng mới và cải tiến',
            'Giao tiếp và hỗ trợ người dùng',
            'Phân tích và nghiên cứu thị trường'
          ],
          required: true
        }
      },
      {
        title: 'Chia Sẻ Thông Tin',
        icon: <Share2 size={16} />,
        content: {
          summary: 'Chúng tôi không bán thông tin cá nhân cho bên thứ ba',
          details: [
            'Chỉ chia sẻ với nhà cung cấp dịch vụ cần thiết',
            'Tuân thủ yêu cầu pháp lý và cơ quan nhà nước',
            'Trong trường hợp sáp nhập hoặc chuyển nhượng',
            'Với sự đồng ý rõ ràng từ người dùng'
          ],
          required: true
        }
      },
      {
        title: 'Bảo Vệ Dữ Liệu',
        icon: <Shield size={16} />,
        content: {
          summary: 'Áp dụng các biện pháp bảo mật tiên tiến để bảo vệ dữ liệu',
          details: [
            'Mã hóa dữ liệu nhạy cảm',
            'Kiểm soát truy cập nghiêm ngặt',
            'Giám sát an ninh 24/7',
            'Đào tạo nhân viên về bảo mật',
            'Tuân thủ tiêu chuẩn quốc tế'
          ],
          required: true
        }
      }
    ]
  };

  const cookiePolicy = {
    types: [
      {
        name: 'Cookie Thiết Yếu',
        purpose: 'Vận hành dịch vụ cơ bản',
        duration: 'Phiên',
        controllable: false,
        examples: ['Xác thực đăng nhập', 'Giỏ hàng', 'Bảo mật']
      },
      {
        name: 'Cookie Hiệu Suất',
        purpose: 'Phân tích và cải thiện trải nghiệm',
        duration: '2 năm',
        controllable: true,
        examples: ['Google Analytics', 'Phân tích hành vi', 'Tối ưu hóa']
      },
      {
        name: 'Cookie Chức Năng',
        purpose: 'Ghi nhớ tùy chọn người dùng',
        duration: '1 năm',
        controllable: true,
        examples: ['Ngôn ngữ', 'Cài đặt hiển thị', 'Tùy chọn cá nhân']
      },
      {
        name: 'Cookie Quảng Cáo',
        purpose: 'Hiển thị quảng cáo phù hợp',
        duration: '90 ngày',
        controllable: true,
        examples: ['Facebook Pixel', 'Google Ads', 'Retargeting']
      }
    ],
    controls: [
      'Truy cập Cài đặt Cookie trong tài khoản',
      'Sử dụng công cụ quản lý cookie của trình duyệt',
      'Liên hệ bộ phận hỗ trợ để điều chỉnh',
      'Từ chối thông qua banner cookie'
    ]
  };

  const complianceStandards = [
    {
      standard: 'GDPR',
      region: 'Châu Âu',
      status: 'Tuân thủ đầy đủ',
      color: 'green',
      requirements: ['Quyền truy cập dữ liệu', 'Quyền được quên', 'Báo cáo vi phạm']
    },
    {
      standard: 'CCPA',
      region: 'California',
      status: 'Tuân thủ',
      color: 'blue',
      requirements: ['Quyền từ chối bán', 'Minh bạch thu thập', 'Truy cập thông tin']
    },
    {
      standard: 'PIPL',
      region: 'Trung Quốc',
      status: 'Đang triển khai',
      color: 'orange',
      requirements: ['Đồng ý rõ ràng', 'Anonymization', 'Bảo vệ dữ liệu nhạy cảm']
    },
    {
      standard: 'LGPD',
      region: 'Brazil',
      status: 'Tuân thủ',
      color: 'green',
      requirements: ['Xử lý hợp pháp', 'Mục đích cụ thể', 'Bảo mật dữ liệu']
    }
  ];

  const policyHistory = [
    {
      version: 'v2.1',
      date: '15/01/2024',
      changes: [
        'Cập nhật theo Luật Bảo vệ dữ liệu cá nhân mới',
        'Bổ sung chính sách cookie chi tiết',
        'Thêm quyền kiểm soát dữ liệu cho người dùng',
        'Cập nhật tiêu chuẩn bảo mật quốc tế'
      ],
      significant: true
    },
    {
      version: 'v2.0',
      date: '01/12/2023',
      changes: [
        'Tích hợp tính năng liên minh mới',
        'Cập nhật chính sách thanh toán',
        'Bổ sung quy tắc ứng xử cộng đồng',
        'Cải tiến chính sách hoàn tiền'
      ],
      significant: false
    },
    {
      version: 'v1.9',
      date: '15/10/2023',
      changes: [
        'Sửa đổi điều khoản tài khoản',
        'Cập nhật chính sách bảo mật',
        'Thêm quy định về nội dung stream',
        'Điều chỉnh chính sách khiếu nại'
      ],
      significant: false
    }
  ];

  const userRights = [
    {
      right: 'Quyền Truy Cập',
      description: 'Yêu cầu sao kê thông tin cá nhân đang được lưu trữ',
      icon: <Eye size={16} />,
      color: '#8B0000'
    },
    {
      right: 'Quyền Sửa Đổi',
      description: 'Chỉnh sửa thông tin không chính xác hoặc không đầy đủ',
      icon: <FileText size={16} />,
      color: '#D4AF37'
    },
    {
      right: 'Quyền Xóa',
      description: 'Yêu cầu xóa thông tin cá nhân trong một số trường hợp',
      icon: <EyeOff size={16} />,
      color: '#003366'
    },
    {
      right: 'Quyền Từ Chối',
      description: 'Từ chối xử lý dữ liệu cho mục đích tiếp thị',
      icon: <Shield size={16} />,
      color: '#2E8B57'
    },
    {
      right: 'Quyền Di Chuyển',
      description: 'Nhận dữ liệu ở định dạng có thể chuyển giao',
      icon: <Download size={16} />,
      color: '#CD7F32'
    }
  ];

  const handleAcceptAll = (checked: boolean) => {
    setAcceptAll(checked);
    if (checked) {
      setIsConsentModalVisible(true);
    }
  };

  const PolicySectionCard = ({ section }: { section: any }) => (
    <Card
      style={{
        border: `2px solid ${section.content.required ? '#8B0000' : '#D4AF37'}`,
        borderRadius: '12px',
        background: 'white',
        marginBottom: '16px'
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <div style={{ color: section.content.required ? '#8B0000' : '#D4AF37' }}>
              {section.icon}
            </div>
            <Title level={4} style={{ color: '#8B0000', margin: 0 }}>
              {section.title}
            </Title>
          </Space>
          {section.content.required && (
            <Tag color="red" style={{ fontWeight: 'bold' }}>
              BẮT BUỘC
            </Tag>
          )}
        </Space>

        <Paragraph style={{ color: '#666', fontWeight: '500' }}>
          {section.content.summary}
        </Paragraph>

        <List
          size="small"
          dataSource={section.content.details}
          renderItem={(item: string) => (
            <List.Item>
              <Space>
                <CheckCircle size={14} style={{ color: '#52c41a' }} />
                <Text>{item}</Text>
              </Space>
            </List.Item>
          )}
        />
      </Space>
    </Card>
  );

  const CookieTypeCard = ({ cookie }: { cookie: any }) => (
    <Card
      size="small"
      style={{
        border: `1px solid ${cookie.controllable ? '#D4AF37' : '#8B0000'}`,
        marginBottom: '12px'
      }}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={6}>
          <Space direction="vertical" size={0}>
            <Text strong style={{ color: '#8B0000' }}>
              {cookie.name}
            </Text>
            <Tag color={cookie.controllable ? 'blue' : 'red'} style={{ fontSize: '10px' }}>
              {cookie.controllable ? 'Có thể tắt' : 'Bắt buộc'}
            </Tag>
          </Space>
        </Col>
        <Col xs={24} md={6}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {cookie.purpose}
          </Text>
        </Col>
        <Col xs={12} md={4}>
          <Text style={{ fontSize: '12px' }}>{cookie.duration}</Text>
        </Col>
        <Col xs={12} md={8}>
          <Space wrap size={[4, 4]}>
            {cookie.examples.map((example: string, index: number) => (
              <Tag key={index} color="default" style={{ fontSize: '10px', margin: 0 }}>
                {example}
              </Tag>
            ))}
          </Space>
        </Col>
      </Row>
    </Card>
  );

  const UserRightCard = ({ right }: { right: any }) => (
    <Card
      hoverable
      style={{
        border: `2px solid ${right.color}`,
        borderRadius: '12px',
        background: 'white',
        height: '100%'
      }}
      bodyStyle={{ padding: '16px' }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Space>
          <div style={{
            width: '40px',
            height: '40px',
            background: right.color,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            {right.icon}
          </div>
          <Space direction="vertical" size={0}>
            <Title level={5} style={{ color: right.color, margin: 0 }}>
              {right.right}
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {right.description}
            </Text>
          </Space>
        </Space>

        <Button 
          type="link" 
          size="small" 
          style={{ color: right.color, padding: 0 }}
        >
          Thực hiện quyền <ChevronRight size={14} />
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
              <Shield size={20} color="#FFFFFF" />
            </div>
            <Title level={3} style={{
              margin: 0,
              color: '#D4AF37',
              background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}>
              CHÍNH SÁCH & BẢO MẬT
            </Title>
          </div>

          <Space>
            <Button type="link" style={{ color: '#D4AF37', fontWeight: '600' }}>Bảo Mật</Button>
            <Button type="link" style={{ color: '#D4AF37', fontWeight: '600' }}>Điều Khoản</Button>
            <Button type="link" style={{ color: '#D4AF37', fontWeight: '600' }}>Cookie</Button>
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
                      MINH BẠCH & BẢO VỆ
                    </Tag>
                    <Title level={1} style={{ color: '#D4AF37', margin: 0, fontSize: '3rem' }}>
                      Chính Sách Bảo Mật Toàn Diện
                    </Title>
                  </div>
                  
                  <Paragraph style={{ 
                    color: 'white', 
                    fontSize: '1.1rem',
                    lineHeight: '1.6'
                  }}>
                    Cam kết bảo vệ quyền riêng tư và dữ liệu người dùng. Chúng tôi tuân thủ nghiêm ngặt 
                    các tiêu chuẩn bảo mật quốc tế và luật pháp địa phương để đảm bảo thông tin của bạn 
                    luôn được an toàn.
                  </Paragraph>

                  <Space>
                    <Button 
                      type="primary"
                      icon={<BookOpen size={16} />}
                      style={{
                        background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                        border: 'none',
                        fontWeight: 'bold',
                        color: '#8B0000'
                      }}
                    >
                      Đọc Chính Sách Đầy Đủ
                    </Button>
                    <Button 
                      icon={<Download size={16} />}
                      style={{
                        background: 'rgba(212, 175, 55, 0.2)',
                        border: '1px solid #D4AF37',
                        color: '#D4AF37'
                      }}
                    >
                      Tải PDF
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
                    <Info style={{ marginRight: '8px' }} />
                    Thông Tin Chính Sách
                  </Title>
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Statistic
                      title="Phiên Bản Hiện Tại"
                      value={privacyPolicy.version}
                      valueStyle={{ color: '#D4AF37' }}
                      prefix={<FileText size={16} />}
                    />
                    <Statistic
                      title="Cập Nhật Cuối"
                      value={privacyPolicy.lastUpdated}
                      valueStyle={{ color: '#D4AF37' }}
                      prefix={<Calendar size={16} />}
                    />
                    <Statistic
                      title="Tiêu Chuẩn Tuân Thủ"
                      value={complianceStandards.length}
                      valueStyle={{ color: '#D4AF37' }}
                      prefix={<CheckCircle size={16} />}
                    />
                  </Space>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Quick Consent */}
          <Card style={{ border: '2px solid #D4AF37', borderRadius: '12px', marginBottom: '24px' }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={16}>
                <Space direction="vertical" size="small">
                  <Text strong style={{ color: '#8B0000', fontSize: '16px' }}>
                    Quản Lý Sự Đồng Ý Của Bạn
                  </Text>
                  <Text type="secondary">
                    Kiểm soát cách chúng tôi thu thập và sử dụng dữ liệu của bạn
                  </Text>
                </Space>
              </Col>
              <Col xs={24} md={8}>
                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                  <Switch
                    checked={acceptAll}
                    onChange={handleAcceptAll}
                    checkedChildren="Đồng ý tất cả"
                    unCheckedChildren="Tùy chỉnh"
                    style={{ background: acceptAll ? '#52c41a' : '#D4AF37' }}
                  />
                </Space>
              </Col>
            </Row>
          </Card>

          <Row gutter={[24, 24]}>
            {/* Main Policy Content */}
            <Col xs={24} lg={16}>
              <Card
                style={{
                  border: '3px solid #D4AF37',
                  borderRadius: '16px',
                  background: 'white'
                }}
              >
                <Tabs
                  activeKey={activePolicyTab}
                  onChange={setActivePolicyTab}
                  items={policyCategories.map(category => ({
                    key: category.key,
                    label: (
                      <Space>
                        <div style={{ color: category.color }}>
                          {category.icon}
                        </div>
                        <Text style={{ color: category.color, fontWeight: 600 }}>
                          {category.name}
                        </Text>
                      </Space>
                    ),
                    children: (
                      <Space direction="vertical" style={{ width: '100%' }} size="large">
                        {/* Policy Header */}
                        <div style={{ 
                          padding: '20px', 
                          background: 'linear-gradient(135deg, #F5F5DC, #F1E8D6)',
                          borderRadius: '8px',
                          border: `2px solid ${category.color}`
                        }}>
                          <Space direction="vertical" style={{ width: '100%' }} size="small">
                            <Title level={3} style={{ color: category.color, margin: 0 }}>
                              {category.name}
                            </Title>
                            <Text style={{ color: '#666' }}>
                              {category.description}
                            </Text>
                            <Space>
                              <Tag color={category.color} style={{ color: 'white' }}>
                                {privacyPolicy.version}
                              </Tag>
                              <Tag color="default">
                                Cập nhật: {privacyPolicy.lastUpdated}
                              </Tag>
                            </Space>
                          </Space>
                        </div>

                        {/* Privacy Policy Sections */}
                        {category.key === 'privacy' && (
                          <Space direction="vertical" style={{ width: '100%' }}>
                            {privacyPolicy.sections.map((section, index) => (
                              <PolicySectionCard key={index} section={section} />
                            ))}
                          </Space>
                        )}

                        {/* Cookie Policy */}
                        {category.key === 'cookies' && (
                          <Space direction="vertical" style={{ width: '100%' }} size="large">
                            <Alert
                              message="Quản Lý Cookie"
                              description="Bạn có thể quản lý cài đặt cookie thông qua trình duyệt hoặc công cụ của chúng tôi"
                              type="info"
                              showIcon
                            />
                            
                            <Title level={4}>Các Loại Cookie Chúng Tôi Sử Dụng</Title>
                            {cookiePolicy.types.map((cookie, index) => (
                              <CookieTypeCard key={index} cookie={cookie} />
                            ))}

                            <Title level={4}>Cách Kiểm Soát Cookie</Title>
                            <List
                              size="small"
                              dataSource={cookiePolicy.controls}
                              renderItem={(control: string) => (
                                <List.Item>
                                  <Space>
                                    <CheckCircle size={14} style={{ color: '#52c41a' }} />
                                    <Text>{control}</Text>
                                  </Space>
                                </List.Item>
                              )}
                            />
                          </Space>
                        )}

                        {/* Technical Details Toggle */}
                        <div style={{ textAlign: 'center', marginTop: '24px' }}>
                          <Button
                            type="link"
                            icon={showTechnicalDetails ? <EyeOff size={16} /> : <Eye size={16} />}
                            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                            style={{ color: '#8B0000' }}
                          >
                            {showTechnicalDetails ? 'Ẩn chi tiết kỹ thuật' : 'Hiển thị chi tiết kỹ thuật'}
                          </Button>
                        </div>

                        {showTechnicalDetails && (
                          <Card
                            style={{
                              border: '1px solid #D4AF37',
                              background: 'rgba(212, 175, 55, 0.05)'
                            }}
                          >
                            <Title level={5}>Chi Tiết Kỹ Thuật</Title>
                            <Paragraph style={{ fontSize: '12px', color: '#666' }}>
                              • Mã hóa: AES-256 cho dữ liệu nhạy cảm<br/>
                              • Lưu trữ: Máy chủ an toàn với chứng chỉ SSL<br/>
                              • Truy cập: Kiểm soát theo nguyên tắc least privilege<br/>
                              • Sao lưu: Hệ thống backup tự động hàng ngày<br/>
                              • Giám sát: Hệ thống phát hiện xâm nhập 24/7
                            </Paragraph>
                          </Card>
                        )}
                      </Space>
                    )
                  }))}
                />
              </Card>
            </Col>

            {/* Sidebar */}
            <Col xs={24} lg={8}>
              {/* User Rights */}
              <Card
                style={{
                  border: '2px solid #D4AF37',
                  borderRadius: '12px',
                  marginBottom: '24px'
                }}
                title={
                  <Space>
                    <Scale style={{ color: '#8B0000' }} />
                    <Text strong>Quyền Của Bạn</Text>
                  </Space>
                }
              >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  {userRights.map((right, index) => (
                    <UserRightCard key={index} right={right} />
                  ))}
                </Space>
              </Card>

              {/* Compliance Standards */}
              <Card
                style={{
                  border: '2px solid #D4AF37',
                  borderRadius: '12px',
                  marginBottom: '24px'
                }}
                title={
                  <Space>
                    <CheckCircle style={{ color: '#8B0000' }} />
                    <Text strong>Tiêu Chuẩn Tuân Thủ</Text>
                  </Space>
                }
              >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  {complianceStandards.map((standard, index) => (
                    <Card
                      key={index}
                      size="small"
                      style={{
                        border: `1px solid ${standard.color}`,
                        borderLeft: `4px solid ${standard.color}`
                      }}
                    >
                      <Space direction="vertical" style={{ width: '100%' }} size="small">
                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                          <Text strong style={{ color: '#8B0000' }}>
                            {standard.standard}
                          </Text>
                          <Tag color={standard.color}>{standard.status}</Tag>
                        </Space>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {standard.region}
                        </Text>
                        <List
                          size="small"
                          dataSource={standard.requirements}
                          renderItem={(req: string) => (
                            <List.Item style={{ padding: '2px 0' }}>
                              <Text style={{ fontSize: '10px' }}>• {req}</Text>
                            </List.Item>
                          )}
                        />
                      </Space>
                    </Card>
                  ))}
                </Space>
              </Card>

              {/* Policy History */}
              <Card
                style={{
                  border: '2px solid #D4AF37',
                  borderRadius: '12px'
                }}
                title={
                  <Space>
                    <Clock style={{ color: '#8B0000' }} />
                    <Text strong>Lịch Sử Cập Nhật</Text>
                  </Space>
                }
              >
                <Timeline>
                  {policyHistory.map((update, index) => (
                    <Timeline.Item
                      key={index}
                      color={update.significant ? '#8B0000' : '#D4AF37'}
                      dot={update.significant ? <Crown size={14} /> : <FileText size={14} />}
                    >
                      <Space direction="vertical" size={0}>
                        <Space>
                          <Text strong style={{ color: '#8B0000' }}>
                            {update.version}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {update.date}
                          </Text>
                        </Space>
                        <List
                          size="small"
                          dataSource={update.changes}
                          renderItem={(change: string) => (
                            <List.Item style={{ padding: '2px 0' }}>
                              <Text style={{ fontSize: '11px' }}>• {change}</Text>
                            </List.Item>
                          )}
                        />
                      </Space>
                    </Timeline.Item>
                  ))}
                </Timeline>
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
              12 SỨ QUÂN - CHÍNH SÁCH MINH BẠCH
            </Title>
            <Paragraph style={{ color: 'rgba(212, 175, 55, 0.8)', margin: 0 }}>
              Cam kết bảo vệ quyền riêng tư và dữ liệu của người dùng
            </Paragraph>
          </Space>
          
          <Divider style={{ borderColor: '#D4AF37', margin: '30px 0' }} />
          
          <Text style={{ color: 'rgba(212, 175, 55, 0.6)' }}>
            © 2024 12 Sứ Quân. Tất cả quyền được bảo lưu. | 
            <Button type="link" style={{ color: '#D4AF37', padding: '0 8px' }}>Liên Hệ DPO</Button>
            <Button type="link" style={{ color: '#D4AF37', padding: '0 8px' }}>Khiếu Nại</Button>
            <Button type="link" style={{ color: '#D4AF37', padding: '0 8px' }}>Báo Cáo Lỗi</Button>
          </Text>
        </div>
      </Footer>

      {/* Consent Management Modal */}
      <Modal
        title={
          <Space>
            <Shield style={{ color: '#8B0000' }} />
            <Text strong>Quản Lý Sự Đồng Ý</Text>
          </Space>
        }
        open={isConsentModalVisible}
        onCancel={() => setIsConsentModalVisible(false)}
        footer={null}
        width={700}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Alert
            message="Kiểm soát quyền riêng tư của bạn"
            description="Bạn có thể thay đổi cài đặt này bất kỳ lúc nào thông qua trang Chính sách"
            type="info"
            showIcon
          />

          <Card title="Cài Đặt Cookie">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {cookiePolicy.types.map((cookie, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  border: '1px solid #F1E8D6',
                  borderRadius: '6px'
                }}>
                  <Space direction="vertical" size={0}>
                    <Text strong>{cookie.name}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {cookie.purpose}
                    </Text>
                  </Space>
                  <Switch
                    defaultChecked={!cookie.controllable}
                    disabled={!cookie.controllable}
                    size="small"
                  />
                </div>
              ))}
            </Space>
          </Card>

          <Card title="Quyền Dữ Liệu">
            <List
              size="small"
              dataSource={userRights}
              renderItem={(right) => (
                <List.Item
                  actions={[
                    <Button type="link" size="small" key={1} style={{ color: '#8B0000' }}>
                      Thực hiện
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={right.right}
                    description={right.description}
                  />
                </List.Item>
              )}
            />
          </Card>

          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Button onClick={() => setIsConsentModalVisible(false)}>
              Hủy
            </Button>
            <Button
              type="primary"
              style={{
                background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                border: 'none',
                fontWeight: 'bold',
                color: '#8B0000'
              }}
              onClick={() => {
                setIsConsentModalVisible(false);
                message.success('Cài đặt đồng ý đã được lưu thành công!');
              }}
            >
              Lưu Cài Đặt
            </Button>
          </Space>
        </Space>
      </Modal>
    </Layout>
  );
};

export default PolicyPage;
