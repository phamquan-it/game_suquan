"use client"
// pages/terms-page.tsx
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
    Alert,
    Collapse,
    Timeline,
    Steps,
    Statistic,
    Switch,
    Modal,
    Checkbox,
    Progress
} from 'antd';
import {
    Shield,
    FileText,
    Lock,
    UserCheck,
    AlertTriangle,
    BookOpen,
    Crown,
    CheckCircle,
    Clock,
    Globe,
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    Download,
    Eye,
    EyeOff,
    PrinterIcon
} from 'lucide-react';

const { Title, Paragraph, Text } = Typography;
const { Header, Footer, Content } = Layout;

const TermsPage = () => {
    const [acceptAll, setAcceptAll] = useState(false);
    const [acceptedSections, setAcceptedSections] = useState<Record<string, boolean>>({});
    const [isAcceptModalVisible, setIsAcceptModalVisible] = useState(false);
    const [showDetailedView, setShowDetailedView] = useState(false);

    const termsSections = [
        {
            key: 'account',
            title: 'Điều Khoản Tài Khoản',
            icon: <UserCheck />,
            required: true,
            content: {
                summary: 'Quy định về việc tạo và quản lý tài khoản người chơi',
                details: [
                    'Người chơi phải từ 13 tuổi trở lên để tạo tài khoản',
                    'Mỗi người chỉ được sở hữu một tài khoản duy nhất',
                    'Thông tin tài khoản phải chính xác và đầy đủ',
                    'Cấm chia sẻ, mua bán hoặc chuyển nhượng tài khoản',
                    'Nhà phát triển có quyền khóa tài khoản vi phạm'
                ],
                lastUpdated: '15/01/2025'
            }
        },
        {
            key: 'privacy',
            title: 'Chính Sách Bảo Mật',
            icon: <Lock />,
            required: true,
            content: {
                summary: 'Cam kết bảo vệ thông tin cá nhân người chơi',
                details: [
                    'Thu thập thông tin cần thiết cho việc cung cấp dịch vụ',
                    'Không chia sẻ thông tin cá nhân cho bên thứ ba không liên quan',
                    'Mã hóa dữ liệu nhạy cảm theo tiêu chuẩn bảo mật',
                    'Người chơi có quyền truy cập và chỉnh sửa thông tin cá nhân',
                    'Tuân thủ Luật Bảo vệ dữ liệu cá nhân của Việt Nam'
                ],
                lastUpdated: '15/01/2025'
            }
        },
        {
            key: 'gameplay',
            title: 'Quy Tắc Trò Chơi',
            icon: <Crown />,
            required: true,
            content: {
                summary: 'Quy định về hành vi và ứng xử trong trò chơi',
                details: [
                    'Cấm sử dụng phần mềm, công cụ hỗ trợ bên ngoài',
                    'Không gian lận, khai thác lỗ hổng trong trò chơi',
                    'Tôn trọng người chơi khác, không có hành vi bắt nạt',
                    'Cấm phát ngôn thù địch, phân biệt đối xử',
                    'Tuân thủ các quyết định của Quản trị viên'
                ],
                lastUpdated: '10/01/2025'
            }
        },
        {
            key: 'payment',
            title: 'Điều Khoản Thanh Toán',
            icon: <Shield />,
            required: true,
            content: {
                summary: 'Quy định về giao dịch và thanh toán trong trò chơi',
                details: [
                    'Chỉ sử dụng các phương thức thanh toán được hỗ trợ',
                    'Mọi giao dịch đều được ghi nhận và lưu trữ',
                    'Không hoàn tiền cho các giao dịch đã thực hiện',
                    'Giá cả có thể thay đổi mà không cần báo trước',
                    'Chịu trách nhiệm về các giao dịch từ tài khoản'
                ],
                lastUpdated: '08/01/2025'
            }
        },
        {
            key: 'content',
            title: 'Sở Hữu Trí Tuệ',
            icon: <BookOpen />,
            required: false,
            content: {
                summary: 'Quyền sở hữu nội dung và tài sản trí tuệ',
                details: [
                    'Mọi nội dung trong trò chơi thuộc sở hữu của nhà phát triển',
                    'Cấm sao chép, phân phối trái phép nội dung trò chơi',
                    'Cho phép stream và tạo video với mục đích phi thương mại',
                    'Người chơi sở hữu nội dung do họ tạo ra trong khuôn khổ cho phép',
                    'Tôn trọng bản quyền và thương hiệu của bên thứ ba'
                ],
                lastUpdated: '05/01/2025'
            }
        }
    ];

    const violationLevels = [
        {
            level: 'Nhẹ',
            color: 'blue',
            examples: [
                'Sử dụng ngôn từ không phù hợp trong chat',
                'Spam tin nhắn',
                'Ẩn danh không đúng mục đích'
            ],
            penalties: ['Cảnh cáo', 'Khóa chat 24h']
        },
        {
            level: 'Trung bình',
            color: 'orange',
            examples: [
                'Cố tình phá hoại trải nghiệm người chơi khác',
                'Lợi dụng lỗi game nhỏ',
                'Tạo tài khoản phụ không hợp lệ'
            ],
            penalties: ['Cấm chat 7 ngày', 'Khóa một số tính năng']
        },
        {
            level: 'Nặng',
            color: 'red',
            examples: [
                'Sử dụng hack, cheat tool',
                'Gian lận trong giao dịch',
                'Phát ngôn thù địch, phân biệt chủng tộc'
            ],
            penalties: ['Khóa tài khoản vĩnh viễn', 'Xóa tài sản game']
        }
    ];

    const updateHistory = [
        {
            date: '15/01/2025',
            version: 'v2.1',
            changes: [
                'Cập nhật chính sách bảo mật theo luật mới',
                'Bổ sung điều khoản về nội dung người dùng tạo',
                'Sửa đổi quy trình giải quyết tranh chấp'
            ]
        },
        {
            date: '20/12/2023',
            version: 'v2.0',
            changes: [
                'Thêm điều khoản về tính năng liên minh mới',
                'Cập nhật chính sách thanh toán',
                'Bổ sung quy tắc ứng xử trong PvP'
            ]
        },
        {
            date: '15/11/2023',
            version: 'v1.9',
            changes: [
                'Sửa đổi điều khoản tài khoản',
                'Cập nhật chính sách hoàn tiền',
                'Thêm quy định về nội dung stream'
            ]
        }
    ];

    const handleAcceptAll = (checked: boolean) => {
        setAcceptAll(checked);
        if (checked) {
            const allAccepted: Record<string, boolean> = {};
            termsSections.forEach(section => {
                if (section.required) {
                    allAccepted[section.key] = true;
                }
            });
            setAcceptedSections(allAccepted);
        }
    };

    const handleSectionAccept = (key: string, accepted: boolean) => {
        setAcceptedSections(prev => ({
            ...prev,
            [key]: accepted
        }));
    };

    const canProceed = () => {
        const requiredSections = termsSections.filter(section => section.required);
        return requiredSections.every(section => acceptedSections[section.key]);
    };

    const acceptanceProgress = () => {
        const requiredSections = termsSections.filter(section => section.required);
        const acceptedCount = requiredSections.filter(section => acceptedSections[section.key]).length;
        return (acceptedCount / requiredSections.length) * 100;
    };

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
                            ĐIỀU KHOẢN DỊCH VỤ
                        </Title>
                    </div>

                    <Space>
                        <Button
                            type="link"
                            style={{ color: '#D4AF37', fontWeight: '600' }}
                            icon={<Download size={16} />}
                        >
                            Tải PDF
                        </Button>
                        <Button
                            type="link"
                            style={{ color: '#D4AF37', fontWeight: '600' }}
                            icon={<PrinterIcon size={16} />}
                        >
                            In Ấn
                        </Button>
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
                                            PHÁP LÝ & QUY ĐỊNH
                                        </Tag>
                                        <Title level={1} style={{ color: '#D4AF37', margin: 0, fontSize: '3rem' }}>
                                            Điều Khoản Dịch Vụ
                                        </Title>
                                    </div>

                                    <Paragraph style={{
                                        color: 'white',
                                        fontSize: '1.1rem',
                                        lineHeight: '1.6'
                                    }}>
                                        Chào mừng bạn đến với 12 Sứ Quân! Vui lòng đọc kỹ các điều khoản dịch vụ dưới đây
                                        để hiểu rõ quyền lợi và trách nhiệm của bạn khi sử dụng trò chơi. Bằng việc tiếp tục
                                        sử dụng dịch vụ, bạn đồng ý tuân thủ mọi điều khoản được nêu ra.
                                    </Paragraph>

                                    <Space>
                                        <Button
                                            type="primary"
                                            icon={<ArrowRight size={16} />}
                                            style={{
                                                background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                                                border: 'none',
                                                fontWeight: 'bold',
                                                color: '#8B0000'
                                            }}
                                            onClick={() => setIsAcceptModalVisible(true)}
                                        >
                                            Đồng ý & Tiếp tục
                                        </Button>
                                        <Button
                                            icon={showDetailedView ? <EyeOff size={16} /> : <Eye size={16} />}
                                            style={{
                                                background: 'rgba(212, 175, 55, 0.2)',
                                                border: '1px solid #D4AF37',
                                                color: '#D4AF37'
                                            }}
                                            onClick={() => setShowDetailedView(!showDetailedView)}
                                        >
                                            {showDetailedView ? 'Xem tóm tắt' : 'Xem chi tiết'}
                                        </Button>
                                    </Space>
                                </Space>
                            </Col>

                            <Col xs={24} lg={8}>
                                <Row gutter={[16, 16]}>
                                    <Col xs={12}>
                                        <Card size="small" style={{ background: 'rgba(212, 175, 55, 0.2)', textAlign: 'center', border: '1px solid #D4AF37' }}>
                                            <Statistic
                                                title="Điều khoản"
                                                value={termsSections.length}
                                                valueStyle={{ color: '#D4AF37' }}
                                                prefix={<FileText size={16} />}
                                            />
                                        </Card>
                                    </Col>
                                    <Col xs={12}>
                                        <Card size="small" style={{ background: 'rgba(212, 175, 55, 0.2)', textAlign: 'center', border: '1px solid #D4AF37' }}>
                                            <Statistic
                                                title="Bắt buộc"
                                                value={termsSections.filter(t => t.required).length}
                                                valueStyle={{ color: '#52c41a' }}
                                                prefix={<CheckCircle size={16} />}
                                            />
                                        </Card>
                                    </Col>
                                    <Col xs={12}>
                                        <Card size="small" style={{ background: 'rgba(212, 175, 55, 0.2)', textAlign: 'center', border: '1px solid #D4AF37' }}>
                                            <Statistic
                                                title="Cập nhật"
                                                value={updateHistory[0].version}
                                                valueStyle={{ color: '#1890ff' }}
                                                prefix={<Clock size={16} />}
                                            />
                                        </Card>
                                    </Col>
                                    <Col xs={12}>
                                        <Card size="small" style={{ background: 'rgba(212, 175, 55, 0.2)', textAlign: 'center', border: '1px solid #D4AF37' }}>
                                            <Statistic
                                                title="Trạng thái"
                                                value={canProceed() ? "Sẵn sàng" : "Chưa đủ"}
                                                valueStyle={{ color: canProceed() ? '#52c41a' : '#faad14' }}
                                                prefix={canProceed() ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                                            />
                                        </Card>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>

                    {/* Progress Indicator */}
                    <Card style={{ border: '2px solid #D4AF37', borderRadius: '12px', marginBottom: '24px' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text strong style={{ color: '#8B0000' }}>Tiến độ chấp nhận điều khoản</Text>
                                <Text strong style={{ color: '#D4AF37' }}>{Math.round(acceptanceProgress())}%</Text>
                            </div>
                            <Progress
                                percent={acceptanceProgress()}
                                strokeColor={{
                                    '0%': '#D4AF37',
                                    '100%': '#FFD700',
                                }}
                                size="small"
                            />
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                {termsSections.filter(section => section.required && acceptedSections[section.key]).length} / {termsSections.filter(section => section.required).length} điều khoản bắt buộc đã được chấp nhận
                            </Text>
                        </Space>
                    </Card>

                    {/* Main Content */}
                    <Row gutter={[32, 32]}>
                        <Col xs={24} lg={16}>
                            {/* Terms Sections */}
                            <Space direction="vertical" style={{ width: '100%' }} size="large">
                                {termsSections.map((section) => (
                                    <Card
                                        key={section.key}
                                        style={{
                                            border: `2px solid ${section.required ? '#8B0000' : '#D4AF37'}`,
                                            borderRadius: '12px',
                                            background: 'white'
                                        }}
                                        title={
                                            <Space>
                                                <div style={{ color: section.required ? '#8B0000' : '#D4AF37' }}>
                                                    {section.icon}
                                                </div>
                                                <Text strong style={{ color: '#8B0000' }}>{section.title}</Text>
                                                {section.required && (
                                                    <Tag color="red" style={{ fontSize: '10px', padding: '2px 6px' }}>
                                                        BẮT BUỘC
                                                    </Tag>
                                                )}
                                            </Space>
                                        }
                                        extra={
                                            <Space>
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    Cập nhật: {section.content.lastUpdated}
                                                </Text>
                                                <Checkbox
                                                    checked={!!acceptedSections[section.key]}
                                                    disabled={!section.required && !acceptAll}
                                                    onChange={(e) => handleSectionAccept(section.key, e.target.checked)}
                                                    // Thêm className để custom style
                                                    className="custom-checkbox"
                                                    style={{
                                                        // Custom inline styles
                                                        '--checkbox-color': '#8B4513',
                                                        '--checkbox-hover-color': '#A0522D',
                                                        '--checkbox-border-color': '#CD7F32',
                                                    } as React.CSSProperties}
                                                >
                                                    <Text style={{ fontSize: '12px', color: '#8B4513', fontWeight: 500 }}>
                                                        {section.required ? 'Đã đọc và đồng ý' : 'Đã đọc và hiểu'}
                                                    </Text>
                                                </Checkbox>
                                            </Space>
                                        }
                                    >
                                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                            <Paragraph style={{ fontWeight: '500', color: '#003366', margin: 0 }}>
                                                {section.content.summary}
                                            </Paragraph>

                                            {showDetailedView && (
                                                <List
                                                    size="small"
                                                    dataSource={section.content.details}
                                                    renderItem={(item) => (
                                                        <List.Item>
                                                            <Space>
                                                                <div style={{
                                                                    width: '6px',
                                                                    height: '6px',
                                                                    background: '#D4AF37',
                                                                    borderRadius: '50%'
                                                                }} />
                                                                <Text>{item}</Text>
                                                            </Space>
                                                        </List.Item>
                                                    )}
                                                />
                                            )}
                                        </Space>
                                    </Card>
                                ))}
                            </Space>

                            {/* Violation Guidelines */}
                            <Card
                                style={{
                                    border: '2px solid #D4AF37',
                                    borderRadius: '12px',
                                    marginTop: '32px'
                                }}
                                title={
                                    <Space>
                                        <AlertTriangle style={{ color: '#8B0000' }} />
                                        <Text strong>Hướng Dẫn Xử Lý Vi Phạm</Text>
                                    </Space>
                                }
                            >
                                <Space direction="vertical" style={{ width: '100%' }} size="large">
                                    {violationLevels.map((level, index) => (
                                        <Card
                                            key={index}
                                            size="small"
                                            style={{
                                                border: `1px solid ${level.color}`,
                                                borderLeft: `4px solid ${level.color}`
                                            }}
                                        >
                                            <Space direction="vertical" style={{ width: '100%' }}>
                                                <Space>
                                                    <Tag color={level.color} style={{ fontWeight: 'bold' }}>
                                                        Mức {level.level}
                                                    </Tag>
                                                    <Text strong>Hành vi vi phạm:</Text>
                                                </Space>

                                                <List
                                                    size="small"
                                                    dataSource={level.examples}
                                                    renderItem={(example) => (
                                                        <List.Item style={{ padding: '4px 0' }}>
                                                            <Text style={{ fontSize: '12px' }}>• {example}</Text>
                                                        </List.Item>
                                                    )}
                                                />

                                                <Space>
                                                    <Text strong type="secondary" style={{ fontSize: '12px' }}>Hình phạt:</Text>
                                                    <Space wrap>
                                                        {level.penalties.map((penalty, idx) => (
                                                            <Tag key={idx} color={level.color} style={{ fontSize: '10px', margin: 0 }}>
                                                                {penalty}
                                                            </Tag>
                                                        ))}
                                                    </Space>
                                                </Space>
                                            </Space>
                                        </Card>
                                    ))}
                                </Space>
                            </Card>
                        </Col>

                        {/* Sidebar */}
                        <Col xs={24} lg={8}>
                            {/* Quick Accept */}
                            <Card
                                style={{ border: '2px solid #D4AF37', borderRadius: '12px', marginBottom: '24px' }}
                                title={
                                    <Space>
                                        <CheckCircle style={{ color: '#8B0000' }} />
                                        <Text strong>Chấp Nhận Nhanh</Text>
                                    </Space>
                                }
                            >
                                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                    <Alert
                                        message="Lưu ý quan trọng"
                                        description="Việc chấp nhận tất cả đồng nghĩa với việc bạn đã đọc và đồng ý với mọi điều khoản bắt buộc."
                                        type="warning"
                                        showIcon
                                    />

                                    <div style={{ textAlign: 'center' }}>
                                        <Switch
                                            checked={acceptAll}
                                            onChange={handleAcceptAll}
                                            checkedChildren="Đã đồng ý tất cả"
                                            unCheckedChildren="Đồng ý tất cả"
                                            style={{ background: acceptAll ? '#52c41a' : '#D4AF37' }}
                                        />
                                    </div>

                                    <Button
                                        type="primary"
                                        block
                                        disabled={!canProceed()}
                                        style={{
                                            background: canProceed() ? 'linear-gradient(135deg, #D4AF37, #FFD700)' : '#d9d9d9',
                                            border: 'none',
                                            color: canProceed() ? '#8B0000' : '#999',
                                            fontWeight: 'bold'
                                        }}
                                        onClick={() => setIsAcceptModalVisible(true)}
                                    >
                                        {canProceed() ? 'Xác Nhận & Tiếp Tục' : 'Chưa thể tiếp tục'}
                                    </Button>
                                </Space>
                            </Card>

                            {/* Update History */}
                            <Card
                                style={{ border: '2px solid #D4AF37', borderRadius: '12px', marginBottom: '24px' }}
                                title={
                                    <Space>
                                        <Clock style={{ color: '#8B0000' }} />
                                        <Text strong>Lịch Sử Cập Nhật</Text>
                                    </Space>
                                }
                            >
                                <Timeline>
                                    {updateHistory.map((update, index) => (
                                        <Timeline.Item
                                            key={index}
                                            color="#D4AF37"
                                            dot={<Crown size={14} />}
                                        >
                                            <Space direction="vertical" size={0}>
                                                <Text strong style={{ color: '#8B0000' }}>
                                                    {update.version} - {update.date}
                                                </Text>
                                                <List
                                                    size="small"
                                                    dataSource={update.changes}
                                                    renderItem={(change) => (
                                                        <List.Item style={{ padding: '2px 0' }}>
                                                            <Text style={{ fontSize: '12px' }}>• {change}</Text>
                                                        </List.Item>
                                                    )}
                                                />
                                            </Space>
                                        </Timeline.Item>
                                    ))}
                                </Timeline>
                            </Card>

                            {/* Contact Information */}
                            <Card
                                style={{ border: '2px solid #D4AF37', borderRadius: '12px' }}
                                title={
                                    <Space>
                                        <Mail style={{ color: '#8B0000' }} />
                                        <Text strong>Liên Hệ & Hỗ Trợ</Text>
                                    </Space>
                                }
                            >
                                <Space direction="vertical" style={{ width: '100%' }} size="small">
                                    <Space>
                                        <Mail size={14} />
                                        <Text style={{ fontSize: '12px' }}>support@12suquan.game</Text>
                                    </Space>
                                    <Space>
                                        <Phone size={14} />
                                        <Text style={{ fontSize: '12px' }}>1900 1234</Text>
                                    </Space>
                                    <Space>
                                        <Globe size={14} />
                                        <Text style={{ fontSize: '12px' }}>www.12suquan.game</Text>
                                    </Space>
                                    <Space align="start">
                                        <MapPin size={14} />
                                        <Text style={{ fontSize: '12px' }}>
                                            Tòa nhà VietGame, 123 Trần Hưng Đạo,
                                            Hoàn Kiếm, Hà Nội, Việt Nam
                                        </Text>
                                    </Space>
                                </Space>
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
                            12 SỨ QUÂN - ĐIỀU KHOẢN PHÁP LÝ
                        </Title>
                        <Paragraph style={{ color: 'rgba(212, 175, 55, 0.8)', margin: 0 }}>
                            Mọi thắc mắc về điều khoản dịch vụ, vui lòng liên hệ với bộ phận hỗ trợ
                        </Paragraph>
                    </Space>

                    <Divider style={{ borderColor: '#D4AF37', margin: '30px 0' }} />

                    <Text style={{ color: 'rgba(212, 175, 55, 0.6)' }}>
                        © 2025 12 Sứ Quân. Tất cả quyền được bảo lưu. |
                        <Button type="link" style={{ color: '#D4AF37', padding: '0 8px' }}>Chính sách bảo mật</Button>
                        <Button type="link" style={{ color: '#D4AF37', padding: '0 8px' }}>Cookie</Button>
                        <Button type="link" style={{ color: '#D4AF37', padding: '0 8px' }}>DMCA</Button>
                    </Text>
                </div>
            </Footer>

            {/* Acceptance Modal */}
            <Modal
                title={
                    <Space>
                        <CheckCircle style={{ color: '#52c41a' }} />
                        <Text strong>Xác Nhận Đồng Ý Điều Khoản</Text>
                    </Space>
                }
                open={isAcceptModalVisible}
                onCancel={() => setIsAcceptModalVisible(false)}
                footer={null}
                width={600}
            >
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <Alert
                        message="Xác nhận cuối cùng"
                        description="Bằng việc nhấn 'Đồng Ý', bạn xác nhận đã đọc, hiểu và đồng ý với tất cả các điều khoản dịch vụ của 12 Sứ Quân."
                        type="success"
                        showIcon
                    />

                    <Card
                        size="small"
                        style={{
                            background: 'rgba(212, 175, 55, 0.1)',
                            border: '1px solid #D4AF37'
                        }}
                    >
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Text strong style={{ color: '#8B0000' }}>Các điều khoản đã chấp nhận:</Text>
                            <List
                                size="small"
                                dataSource={termsSections.filter(section => acceptedSections[section.key])}
                                renderItem={(section) => (
                                    <List.Item>
                                        <Space>
                                            <CheckCircle size={14} style={{ color: '#52c41a' }} />
                                            <Text style={{ fontSize: '12px' }}>{section.title}</Text>
                                        </Space>
                                    </List.Item>
                                )}
                            />
                        </Space>
                    </Card>

                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Button
                            onClick={() => setIsAcceptModalVisible(false)}
                            style={{ borderColor: '#8B0000', color: '#8B0000' }}
                        >
                            Hủy Bỏ
                        </Button>
                        <Button
                            type="primary"
                            style={{
                                background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                                border: 'none',
                                fontWeight: 'bold',
                                color: '#8B0000'
                            }}
                            icon={<CheckCircle size={16} />}
                            onClick={() => {
                                setIsAcceptModalVisible(false);
                                // Here you would typically handle the acceptance logic
                                console.log('Terms accepted:', acceptedSections);
                            }}
                        >
                            Đồng Ý & Bắt Đầu Chơi
                        </Button>
                    </Space>
                </Space>
            </Modal>
        </Layout>
    );
};

export default TermsPage;
