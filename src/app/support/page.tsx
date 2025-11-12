"use client"
// pages/support-page.tsx
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
  Input,
  Select,
  Steps,
  Statistic,
  Modal,
  Form,
  message,
  Tabs,
  Badge,
} from 'antd';
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  User,
  FileText,
  Search,
  Filter,
  BookOpen,
  Shield,
  Bug,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Star,
  Send,
  Paperclip,
  CheckCircle,
  AlertTriangle,
  Zap,
  Users,
  Award
} from 'lucide-react';
import { EyeOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { TextArea, Search: AntSearch } = Input;
const { Option } = Select;
const { Header, Footer, Content } = Layout;

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTicketModalVisible, setIsTicketModalVisible] = useState(false);
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [form] = Form.useForm();

  const supportCategories = [
    { key: 'all', name: 'Tất Cả', icon: <HelpCircle size={16} />, color: '#8B0000' },
    { key: 'account', name: 'Tài Khoản', icon: <User size={16} />, color: '#D4AF37' },
    { key: 'technical', name: 'Kỹ Thuật', icon: <Bug size={16} />, color: '#003366' },
    { key: 'billing', name: 'Thanh Toán', icon: <Shield size={16} />, color: '#2E8B57' },
    { key: 'gameplay', name: 'Lối Chơi', icon: <Award size={16} />, color: '#CD7F32' },
    { key: 'report', name: 'Báo Cáo', icon: <AlertTriangle size={16} />, color: '#DC143C' }
  ];

  const faqData = [
    {
      category: 'account',
      question: 'Làm thế nào để khôi phục tài khoản bị mất?',
      answer: 'Bạn có thể khôi phục tài khoản bằng cách sử dụng tính năng "Quên mật khẩu" trên trang đăng nhập, hoặc liên hệ trực tiếp với đội ngũ hỗ trợ qua email support@12suquan.game',
      helpful: 125,
      views: 890
    },
    {
      category: 'technical',
      question: 'Game bị lag hoặc giật, tôi nên làm gì?',
      answer: 'Hãy thử các bước sau: 1. Kiểm tra kết nối internet 2. Đóng các ứng dụng nền 3. Clear cache game 4. Cập nhật phiên bản mới nhất. Nếu vẫn tiếp tục, hãy gửi báo cáo kỹ thuật cho chúng tôi.',
      helpful: 89,
      views: 567
    },
    {
      category: 'gameplay',
      question: 'Làm thế nào để tham gia liên minh?',
      answer: 'Bạn có thể tham gia liên minh bằng cách: 1. Vào mục Liên Minh 2. Tìm kiếm liên minh phù hợp 3. Gửi đơn xin tham gia 4. Chờ trưởng liên minh chấp nhận. Cần đạt cấp 15 để mở khóa tính năng này.',
      helpful: 234,
      views: 1200
    },
    {
      category: 'billing',
      question: 'Tôi bị trừ tiền nhưng không nhận được vật phẩm?',
      answer: 'Vui lòng kiểm tra lại lịch sử giao dịch và đợi 5-10 phút. Nếu vẫn chưa nhận được, hãy cung cấp mã giao dịch và thông tin tài khoản cho đội ngũ hỗ trợ. Chúng tôi sẽ giải quyết trong 24h.',
      helpful: 67,
      views: 345
    },
    {
      category: 'technical',
      question: 'Lỗi đăng nhập "Tài khoản đang được sử dụng ở thiết bị khác"?',
      answer: 'Điều này xảy ra khi tài khoản của bạn đang đăng nhập trên nhiều thiết bị. Hãy đảm bảo bạn đã đăng xuất đúng cách. Nếu cần, có thể đăng xuất toàn bộ từ xa qua trang quản lý tài khoản.',
      helpful: 156,
      views: 789
    },
    {
      category: 'gameplay',
      question: 'Cách nào để nâng cấp thành trì nhanh nhất?',
      answer: 'Để nâng cấp thành trì hiệu quả: 1. Tập trung vào nhà chính 2. Tối ưu hóa sản xuất tài nguyên 3. Tham gia sự kiện để nhận vật phẩm tăng tốc 4. Liên minh hỗ trợ lẫn nhau.',
      helpful: 189,
      views: 956
    }
  ];

  const supportTickets = [
    {
      id: 'TK-2024-001',
      title: 'Lỗi không thể đăng nhập',
      category: 'technical',
      status: 'resolved',
      priority: 'high',
      created: '2024-01-15',
      updated: '2024-01-16',
      agent: 'Nguyễn Văn A'
    },
    {
      id: 'TK-2024-002',
      title: 'Thắc mắc về chính sách hoàn tiền',
      category: 'billing',
      status: 'in-progress',
      priority: 'medium',
      created: '2024-01-18',
      updated: '2024-01-18',
      agent: 'Trần Thị B'
    },
    {
      id: 'TK-2024-003',
      title: 'Báo cáo người chơi vi phạm',
      category: 'report',
      status: 'new',
      priority: 'high',
      created: '2024-01-20',
      updated: '2024-01-20',
      agent: 'Chưa phân công'
    }
  ];

  const supportAgents = [
    {
      name: 'Nguyễn Văn A',
      role: 'Chuyên viên Kỹ thuật',
      avatar: '/api/placeholder/60/60',
      rating: 4.9,
      solved: 1247,
      specialty: ['Lỗi game', 'Hiệu suất', 'Kết nối'],
      online: true
    },
    {
      name: 'Trần Thị B',
      role: 'Chuyên viên Tài khoản',
      avatar: '/api/placeholder/60/60',
      rating: 4.8,
      solved: 892,
      specialty: ['Tài khoản', 'Bảo mật', 'Phục hồi'],
      online: true
    },
    {
      name: 'Lê Văn C',
      role: 'Chuyên viên Thanh toán',
      avatar: '/api/placeholder/60/60',
      rating: 4.7,
      solved: 756,
      specialty: ['Giao dịch', 'Hoàn tiền', 'Khuyến mãi'],
      online: false
    }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleTicketSubmit = (values: any) => {
    console.log('Ticket submitted:', values);
    message.success('Yêu cầu hỗ trợ đã được gửi thành công! Chúng tôi sẽ phản hồi trong 24h.');
    setIsTicketModalVisible(false);
    form.resetFields();
  };

  const handleFeedbackSubmit = (values: any) => {
    console.log('Feedback submitted:', values);
    message.success('Cảm ơn phản hồi của bạn!');
    setIsFeedbackModalVisible(false);
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      'new': { color: 'blue', text: 'Mới' },
      'in-progress': { color: 'orange', text: 'Đang xử lý' },
      'resolved': { color: 'green', text: 'Đã giải quyết' },
      'closed': { color: 'gray', text: 'Đã đóng' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getPriorityTag = (priority: string) => {
    const priorityConfig = {
      'low': { color: 'green', text: 'Thấp' },
      'medium': { color: 'orange', text: 'Trung bình' },
      'high': { color: 'red', text: 'Cao' },
      'urgent': { color: 'purple', text: 'Khẩn cấp' }
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const FAQCard = ({ faq, index }: { faq: any, index: number }) => (
    <Card
      style={{
        border: '2px solid #D4AF37',
        borderRadius: '12px',
        background: 'white',
        marginBottom: '16px'
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Tag 
            color={supportCategories.find(cat => cat.key === faq.category)?.color}
            style={{ 
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            {supportCategories.find(cat => cat.key === faq.category)?.name}
          </Tag>
          <Space>
            <Space size="small">
              <ThumbsUp size={14} style={{ color: '#52c41a' }} />
              <Text type="secondary" style={{ fontSize: '12px' }}>{faq.helpful}</Text>
            </Space>
            <Space size="small">
              <EyeOutlined size={14} style={{ color: '#8B4513' }} />
              <Text type="secondary" style={{ fontSize: '12px' }}>{faq.views}</Text>
            </Space>
          </Space>
        </Space>

        <Title level={5} style={{ color: '#8B0000', margin: 0 }}>
          {faq.question}
        </Title>

        <Paragraph style={{ color: '#666', margin: 0 }}>
          {faq.answer}
        </Paragraph>

        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Button type="link" size="small" style={{ padding: 0, color: '#8B0000' }}>
            <ThumbsUp size={14} style={{ marginRight: '4px' }} />
            Hữu ích
          </Button>
          <Button type="link" size="small" style={{ padding: 0, color: '#8B4513' }}>
            <ThumbsDown size={14} style={{ marginRight: '4px' }} />
            Không hữu ích
          </Button>
        </Space>
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
              <HelpCircle size={20} color="#FFFFFF" />
            </div>
            <Title level={3} style={{
              margin: 0,
              color: '#D4AF37',
              background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}>
              TRUNG TÂM HỖ TRỢ
            </Title>
          </div>

          <Space>
            <Button type="link" style={{ color: '#D4AF37', fontWeight: '600' }}>FAQ</Button>
            <Button type="link" style={{ color: '#D4AF37', fontWeight: '600' }}>Liên Hệ</Button>
            <Button type="link" style={{ color: '#D4AF37', fontWeight: '600' }}>Yêu Cầu</Button>
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
                      HỖ TRỢ 24/7
                    </Tag>
                    <Title level={1} style={{ color: '#D4AF37', margin: 0, fontSize: '3rem' }}>
                      Chúng Tôi Luôn Ở Đây Để Giúp Bạn
                    </Title>
                  </div>
                  
                  <Paragraph style={{ 
                    color: 'white', 
                    fontSize: '1.1rem',
                    lineHeight: '1.6'
                  }}>
                    Đội ngũ hỗ trợ 12 Sứ Quân luôn sẵn sàng giải đáp mọi thắc mắc và hỗ trợ bạn 
                    trong suốt hành trình chinh phục. Tìm câu trả lời nhanh hoặc liên hệ trực tiếp 
                    với chuyên viên của chúng tôi.
                  </Paragraph>

                  <Space>
                    <Button 
                      type="primary"
                      icon={<MessageCircle size={16} />}
                      style={{
                        background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                        border: 'none',
                        fontWeight: 'bold',
                        color: '#8B0000'
                      }}
                      onClick={() => setIsTicketModalVisible(true)}
                    >
                      Gửi Yêu Cầu Hỗ Trợ
                    </Button>
                    <Button 
                      icon={<Phone size={16} />}
                      style={{
                        background: 'rgba(212, 175, 55, 0.2)',
                        border: '1px solid #D4AF37',
                        color: '#D4AF37'
                      }}
                    >
                      Gọi Ngay: 1900 1234
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
                    <Zap style={{ marginRight: '8px' }} />
                    Thống Kê Hỗ Trợ
                  </Title>
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Statistic
                      title="Yêu Cầu Đã Xử Lý"
                      value={2895}
                      valueStyle={{ color: '#D4AF37' }}
                      prefix={<CheckCircle size={16} />}
                    />
                    <Statistic
                      title="Thời Gian Phản Hồi"
                      value="2.4"
                      suffix="giờ"
                      valueStyle={{ color: '#D4AF37' }}
                      prefix={<Clock size={16} />}
                    />
                    <Statistic
                      title="Đánh Giá Tích Cực"
                      value={98}
                      suffix="%"
                      valueStyle={{ color: '#D4AF37' }}
                      prefix={<ThumbsUp size={16} />}
                    />
                  </Space>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Quick Actions */}
          <Row gutter={[16, 16]} style={{ marginBottom: '40px' }}>
            <Col xs={24} sm={8}>
              <Card
                hoverable
                style={{
                  border: '2px solid #8B0000',
                  borderRadius: '12px',
                  textAlign: 'center',
                  background: 'white'
                }}
                onClick={() => setActiveTab('faq')}
              >
                <Space direction="vertical" size="middle">
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: '#8B0000',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    color: 'white'
                  }}>
                    <BookOpen size={24} />
                  </div>
                  <Title level={4} style={{ color: '#8B0000', margin: 0 }}>
                    Câu Hỏi Thường Gặp
                  </Title>
                  <Text type="secondary">
                    Tìm câu trả lời nhanh cho các vấn đề phổ biến
                  </Text>
                </Space>
              </Card>
            </Col>

            <Col xs={24} sm={8}>
              <Card
                hoverable
                style={{
                  border: '2px solid #D4AF37',
                  borderRadius: '12px',
                  textAlign: 'center',
                  background: 'white'
                }}
                onClick={() => setIsTicketModalVisible(true)}
              >
                <Space direction="vertical" size="middle">
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: '#D4AF37',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    color: '#8B0000'
                  }}>
                    <MessageCircle size={24} />
                  </div>
                  <Title level={4} style={{ color: '#D4AF37', margin: 0 }}>
                    Gửi Yêu Cầu
                  </Title>
                  <Text type="secondary">
                    Liên hệ trực tiếp với đội ngũ hỗ trợ
                  </Text>
                </Space>
              </Card>
            </Col>

            <Col xs={24} sm={8}>
              <Card
                hoverable
                style={{
                  border: '2px solid #003366',
                  borderRadius: '12px',
                  textAlign: 'center',
                  background: 'white'
                }}
                onClick={() => setIsFeedbackModalVisible(true)}
              >
                <Space direction="vertical" size="middle">
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: '#003366',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    color: 'white'
                  }}>
                    <Lightbulb size={24} />
                  </div>
                  <Title level={4} style={{ color: '#003366', margin: 0 }}>
                    Góp Ý & Phản Hồi
                  </Title>
                  <Text type="secondary">
                    Giúp chúng tôi cải thiện dịch vụ
                  </Text>
                </Space>
              </Card>
            </Col>
          </Row>

          {/* Main Content */}
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Card
                style={{
                  border: '3px solid #D4AF37',
                  borderRadius: '16px',
                  background: 'white'
                }}
              >
                <Tabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  items={[
                    {
                      key: 'faq',
                      label: (
                        <Space>
                          <BookOpen size={16} />
                          <Text strong>Câu Hỏi Thường Gặp</Text>
                        </Space>
                      ),
                      children: (
                        <Space direction="vertical" style={{ width: '100%' }} size="large">
                          {/* Search and Filter */}
                          <Card style={{ border: '1px solid #D4AF37', background: '#F5F5DC' }}>
                            <Row gutter={[16, 16]} align="middle">
                              <Col xs={24} md={12}>
                                <AntSearch
                                  placeholder="Tìm kiếm câu hỏi..."
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  style={{ width: '100%' }}
                                  prefix={<Search size={16} />}
                                />
                              </Col>
                              <Col xs={24} md={12}>
                                <Select
                                  value={selectedCategory}
                                  onChange={setSelectedCategory}
                                  style={{ width: '100%' }}
                                  suffixIcon={<Filter size={14} />}
                                >
                                  {supportCategories.map(category => (
                                    <Option key={category.key} value={category.key}>
                                      <Space>
                                        <div style={{ color: category.color }}>
                                          {category.icon}
                                        </div>
                                        {category.name}
                                      </Space>
                                    </Option>
                                  ))}
                                </Select>
                              </Col>
                            </Row>
                          </Card>

                          {/* FAQ List */}
                          <Space direction="vertical" style={{ width: '100%' }}>
                            {filteredFAQs.map((faq, index) => (
                              <FAQCard key={index} faq={faq} index={index} />
                            ))}
                          </Space>

                          {filteredFAQs.length === 0 && (
                            <Card style={{ textAlign: 'center', border: '2px dashed #D4AF37', background: 'transparent' }}>
                              <Space direction="vertical" size="large">
                                <HelpCircle size={48} style={{ color: '#8B0000', opacity: 0.5 }} />
                                <Title level={4} style={{ color: '#8B0000' }}>
                                  Không tìm thấy câu hỏi phù hợp
                                </Title>
                                <Text type="secondary">
                                  Hãy thử điều chỉnh từ khóa tìm kiếm hoặc gửi yêu cầu hỗ trợ trực tiếp
                                </Text>
                                <Button 
                                  type="primary"
                                  onClick={() => setIsTicketModalVisible(true)}
                                >
                                  Gửi Yêu Cầu Hỗ Trợ
                                </Button>
                              </Space>
                            </Card>
                          )}
                        </Space>
                      )
                    },
                    {
                      key: 'tickets',
                      label: (
                        <Space>
                          <FileText size={16} />
                          <Text strong>Yêu Cầu Của Tôi</Text>
                          <Badge count={supportTickets.length} style={{ background: '#8B0000' }} />
                        </Space>
                      ),
                      children: (
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                          {supportTickets.map(ticket => (
                            <Card
                              key={ticket.id}
                              size="small"
                              style={{ border: '1px solid #D4AF37' }}
                            >
                              <Row gutter={[16, 16]} align="middle">
                                <Col xs={24} md={8}>
                                  <Space direction="vertical" size={0}>
                                    <Text strong style={{ color: '#8B0000' }}>
                                      {ticket.title}
                                    </Text>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                      {ticket.id}
                                    </Text>
                                  </Space>
                                </Col>
                                <Col xs={12} md={4}>
                                  {getStatusTag(ticket.status)}
                                </Col>
                                <Col xs={12} md={4}>
                                  {getPriorityTag(ticket.priority)}
                                </Col>
                                <Col xs={12} md={4}>
                                  <Text style={{ fontSize: '12px' }}>
                                    {ticket.created}
                                  </Text>
                                </Col>
                                <Col xs={12} md={4}>
                                  <Button type="link" size="small" style={{ color: '#8B0000' }}>
                                    Xem chi tiết
                                  </Button>
                                </Col>
                              </Row>
                            </Card>
                          ))}
                        </Space>
                      )
                    }
                  ]}
                />
              </Card>
            </Col>

            {/* Sidebar */}
            <Col xs={24} lg={8}>
              {/* Support Agents */}
              <Card
                style={{
                  border: '2px solid #D4AF37',
                  borderRadius: '12px',
                  marginBottom: '24px'
                }}
                title={
                  <Space>
                    <Users style={{ color: '#8B0000' }} />
                    <Text strong>Đội Ngũ Hỗ Trợ</Text>
                  </Space>
                }
              >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  {supportAgents.map((agent, index) => (
                    <Card
                      key={index}
                      size="small"
                      style={{
                        border: `1px solid ${agent.online ? '#2E8B57' : '#CD7F32'}`,
                        background: 'white'
                      }}
                    >
                      <Space>
                        <Badge dot color={agent.online ? '#52c41a' : '#faad14'}>
                          <Avatar src={agent.avatar} size={40} />
                        </Badge>
                        <Space direction="vertical" size={0}>
                          <Space>
                            <Text strong style={{ color: '#8B0000' }}>
                              {agent.name}
                            </Text>
                            <Tag color="blue">
                              {agent.rating} <Star size={10} fill="currentColor" />
                            </Tag>
                          </Space>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {agent.role}
                          </Text>
                          <Space wrap size={[4, 4]} style={{ marginTop: '4px' }}>
                            {agent.specialty.map(spec => (
                              <Tag key={spec} color="default" style={{ fontSize: '10px', margin: 0 }}>
                                {spec}
                              </Tag>
                            ))}
                          </Space>
                        </Space>
                      </Space>
                    </Card>
                  ))}
                </Space>
              </Card>

              {/* Contact Information */}
              <Card
                style={{
                  border: '2px solid #D4AF37',
                  borderRadius: '12px',
                  marginBottom: '24px'
                }}
                title={
                  <Space>
                    <Phone style={{ color: '#8B0000' }} />
                    <Text strong>Thông Tin Liên Hệ</Text>
                  </Space>
                }
              >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <Space>
                    <Phone size={16} style={{ color: '#8B0000' }} />
                    <Text strong>Hotline:</Text>
                    <Text>1900 1234</Text>
                  </Space>
                  <Space>
                    <Mail size={16} style={{ color: '#8B0000' }} />
                    <Text strong>Email:</Text>
                    <Text>support@12suquan.game</Text>
                  </Space>
                  <Space>
                    <Clock size={16} style={{ color: '#8B0000' }} />
                    <Text strong>Thời gian:</Text>
                    <Text>24/7</Text>
                  </Space>
                  <Space align="start">
                    <HelpCircle size={16} style={{ color: '#8B0000' }} />
                    <Text strong>Phản hồi trong:</Text>
                    <Text>2-4 giờ</Text>
                  </Space>
                </Space>
              </Card>

              {/* Support Process */}
              <Card
                style={{
                  border: '2px solid #D4AF37',
                  borderRadius: '12px'
                }}
                title={
                  <Space>
                    <Zap style={{ color: '#8B0000' }} />
                    <Text strong>Quy Trình Hỗ Trợ</Text>
                  </Space>
                }
              >
                <Steps
                  direction="vertical"
                  size="small"
                  current={1}
                  items={[
                    {
                      title: 'Gửi yêu cầu',
                      description: 'Điền form hoặc gọi hotline'
                    },
                    {
                      title: 'Tiếp nhận',
                      description: 'Phân loại và phân công'
                    },
                    {
                      title: 'Xử lý',
                      description: 'Chuyên viên hỗ trợ trực tiếp'
                    },
                    {
                      title: 'Hoàn tất',
                      description: 'Xác nhận và đánh giá'
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
              12 SỨ QUÂN - TRUNG TÂM HỖ TRỢ
            </Title>
            <Paragraph style={{ color: 'rgba(212, 175, 55, 0.8)', margin: 0 }}>
              Chúng tôi cam kết mang đến trải nghiệm hỗ trợ tốt nhất cho người chơi
            </Paragraph>
          </Space>
          
          <Divider style={{ borderColor: '#D4AF37', margin: '30px 0' }} />
          
          <Text style={{ color: 'rgba(212, 175, 55, 0.6)' }}>
            © 2024 12 Sứ Quân. Tất cả quyền được bảo lưu.
          </Text>
        </div>
      </Footer>

      {/* Support Ticket Modal */}
      <Modal
        title={
          <Space>
            <MessageCircle style={{ color: '#8B0000' }} />
            <Text strong>Gửi Yêu Cầu Hỗ Trợ</Text>
          </Space>
        }
        open={isTicketModalVisible}
        onCancel={() => setIsTicketModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleTicketSubmit}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="category"
                  label="Danh mục"
                  rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                >
                  <Select placeholder="Chọn danh mục">
                    {supportCategories.filter(cat => cat.key !== 'all').map(category => (
                      <Option key={category.key} value={category.key}>
                        <Space>
                          <div style={{ color: category.color }}>
                            {category.icon}
                          </div>
                          {category.name}
                        </Space>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="priority"
                  label="Mức độ ưu tiên"
                  rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên' }]}
                >
                  <Select placeholder="Chọn mức độ ưu tiên">
                    <Option value="low">Thấp</Option>
                    <Option value="medium">Trung bình</Option>
                    <Option value="high">Cao</Option>
                    <Option value="urgent">Khẩn cấp</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            >
              <Input placeholder="Mô tả ngắn gọn vấn đề" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả chi tiết"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả chi tiết' }]}
            >
              <TextArea
                rows={6}
                placeholder="Mô tả chi tiết vấn đề bạn gặp phải, bao gồm các bước tái hiện lỗi..."
              />
            </Form.Item>

            <Form.Item name="attachment" label="Tệp đính kèm">
              <Button icon={<Paperclip size={16} />}>
                Đính kèm tệp
              </Button>
            </Form.Item>

            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Button onClick={() => setIsTicketModalVisible(false)}>
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<Send size={16} />}
                style={{
                  background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                  border: 'none',
                  fontWeight: 'bold',
                  color: '#8B0000'
                }}
              >
                Gửi Yêu Cầu
              </Button>
            </Space>
          </Space>
        </Form>
      </Modal>

      {/* Feedback Modal */}
      <Modal
        title={
          <Space>
            <Lightbulb style={{ color: '#8B0000' }} />
            <Text strong>Góp Ý & Phản Hồi</Text>
          </Space>
        }
        open={isFeedbackModalVisible}
        onCancel={() => setIsFeedbackModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          layout="vertical"
          onFinish={handleFeedbackSubmit}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Form.Item
              name="type"
              label="Loại phản hồi"
              rules={[{ required: true, message: 'Vui lòng chọn loại phản hồi' }]}
            >
              <Select placeholder="Chọn loại phản hồi">
                <Option value="suggestion">Đề xuất cải tiến</Option>
                <Option value="bug">Báo cáo lỗi</Option>
                <Option value="complaint">Khiếu nại</Option>
                <Option value="compliment">Khen ngợi</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="feedback"
              label="Nội dung phản hồi"
              rules={[{ required: true, message: 'Vui lòng nhập nội dung phản hồi' }]}
            >
              <TextArea
                rows={4}
                placeholder="Chia sẻ ý kiến của bạn để chúng tôi có thể cải thiện dịch vụ tốt hơn..."
              />
            </Form.Item>

            <Form.Item name="rating" label="Đánh giá tổng thể">
              <Space>
                {[1, 2, 3, 4, 5].map(star => (
                  <Button
                    key={star}
                    type="text"
                    icon={<Star size={20} fill={star <= 4 ? '#FFD700' : 'none'} />}
                    style={{ color: '#FFD700' }}
                  />
                ))}
              </Space>
            </Form.Item>

            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Button onClick={() => setIsFeedbackModalVisible(false)}>
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                  border: 'none',
                  fontWeight: 'bold',
                  color: '#8B0000'
                }}
              >
                Gửi Phản Hồi
              </Button>
            </Space>
          </Space>
        </Form>
      </Modal>
    </Layout>
  );
};

export default SupportPage;
