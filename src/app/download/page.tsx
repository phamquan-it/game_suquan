"use client"
// pages/download-page.tsx
import React, { useState } from 'react';
import {
    Layout,
    Button,
    Card,
    Row,
    Col,
    Statistic,
    Tag,
    Progress,
    List,
    Avatar,
    Divider,
    Typography,
    Space,
    Badge,
    Alert,
    Tabs,
    Tooltip
} from 'antd';
import {
    Download,
    CloudDownload,
    Clock,
    Shield,
    Zap,
    Crown,
    Star,
    Gift,
    QrCode,
    Apple,
    Package,
    Monitor
} from 'lucide-react';
import { AndroidFilled, LinuxOutlined, WindowsFilled } from '@ant-design/icons';
import { GameLink } from '@/enums/Links';



const { Title, Paragraph, Text } = Typography;
const { Header, Footer, Content } = Layout;

const DownloadPage = () => {
    const [activePlatform, setActivePlatform] = useState('windows');
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);

    const platformData = {
        windows: {
            name: 'Windows',
            icon: <WindowsFilled size={24} />,
            version: 'v2.1.4',
            size: '4.2 GB',
            requirements: {
                os: 'Windows 10/11 (64-bit)',
                processor: 'Intel i5 or AMD equivalent',
                memory: '8 GB RAM',
                graphics: 'NVIDIA GTX 1060 / AMD RX 580',
                storage: '10 GB available space'
            }
        },
        mac: {
            name: 'macOS',
            icon: <Apple size={24} />,
            version: 'v2.1.3',
            size: '3.8 GB',
            requirements: {
                os: 'macOS 11.0 or later',
                processor: 'Apple M1 or Intel i5',
                memory: '8 GB RAM',
                graphics: 'Metal compatible GPU',
                storage: '10 GB available space'
            }
        },
        android: {
            name: 'Android',
            icon: <AndroidFilled size={24} />,
            version: 'v2.1.2',
            size: '1.2 GB',
            requirements: {
                os: 'Android 8.0 or later',
                processor: 'Snapdragon 660 or equivalent',
                memory: '4 GB RAM',
                graphics: 'Adreno 512 or equivalent',
                storage: '3 GB available space'
            }
        }
    };

    const handleDownload = (platform: string) => {
        setIsDownloading(true);
        setActivePlatform(platform);

        // Simulate download progress
        const interval = setInterval(() => {
            setDownloadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsDownloading(false);
                    return 100;
                }
                return prev + 10;
            });
        }, 500);
    };

    const systemRequirements = [
        {
            platform: 'Windows',
            os: 'Windows 10/11 64-bit',
            processor: 'Intel Core i5-8400 / AMD Ryzen 5 1600',
            memory: '8 GB RAM',
            graphics: 'NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580 8GB',
            storage: '10 GB',
            directx: 'Version 12'
        },
        {
            platform: 'macOS',
            os: 'macOS 11.0 Big Sur',
            processor: 'Apple M1 or Intel Core i5',
            memory: '8 GB RAM',
            graphics: 'Apple M1 7-core / Intel Iris Plus Graphics 640',
            storage: '10 GB',
            directx: 'Metal 2'
        },
        {
            platform: 'Android',
            os: 'Android 8.0 Oreo',
            processor: 'Snapdragon 660 / Kirin 710 / MediaTek Helio G80',
            memory: '4 GB RAM',
            graphics: 'Adreno 512 / Mali-G52',
            storage: '3 GB',
            directx: 'OpenGL ES 3.2'
        }
    ];

    const downloadHistory = [
        {
            version: 'v2.1.4',
            date: '2024-01-15',
            size: '4.2 GB',
            platform: 'Windows',
            status: 'completed'
        },
        {
            version: 'v2.1.3',
            date: '2024-01-10',
            size: '4.1 GB',
            platform: 'Windows',
            status: 'completed'
        },
        {
            version: 'v2.1.2',
            date: '2024-01-05',
            size: '4.0 GB',
            platform: 'Windows',
            status: 'completed'
        }
    ];

    const versionFeatures = [
        {
            version: 'v2.1.4',
            date: '15/01/2024',
            features: [
                'Thêm tính năng liên minh mới',
                'Tối ưu hóa hiệu năng 15%',
                'Sửa lỗi crash trên Windows 11',
                'Cân bằng chiến thuật'
            ]
        },
        {
            version: 'v2.1.3',
            date: '10/01/2024',
            features: [
                'Thêm 2 nhân vật mới',
                'Cải thiện đồ họa',
                'Tối ưu kết nối mạng',
                'Sửa lỗi minor'
            ]
        }
    ];

    return (
        <Layout style={{ background: 'linear-gradient(135deg, #F5F5DC 0%, #F1E8D6 100%)', minHeight: '100vh' }}>
            {/* Header */}
            <Header style={{
                background: 'linear-gradient(135deg, #8B0000 0%, #003366 100%)',
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
                            <Crown size={20} color="#FFFFFF" />
                        </div>
                        <Title level={3} style={{
                            margin: 0,
                            color: '#D4AF37',
                            background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 'bold'
                        }}>
                            12 SỨ QUÂN
                        </Title>
                    </div>

                    <Space>
                        <Button type="link" href={GameLink.HOME} style={{ color: '#D4AF37', fontWeight: '600' }}>Trang Chủ</Button>
                        <Button type="link" href={GameLink.GAMEPLAY} style={{ color: '#D4AF37', fontWeight: '600' }}>Hướng Dẫn</Button>
                        <Button type="link" href={GameLink.SUPPORT} style={{ color: '#D4AF37', fontWeight: '600' }}>Hỗ Trợ</Button>
                    </Space>
                </div>
            </Header>

            <Content style={{ padding: '40px 20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                    {/* Main Download Section */}
                    <Row gutter={[32, 32]} style={{ marginBottom: '60px' }}>
                        <Col xs={24} lg={12}>
                            <Card style={{
                                background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.9), rgba(0, 51, 102, 0.9))',
                                border: '3px solid #D4AF37',
                                borderRadius: '20px',
                                color: 'white'
                            }}>
                                <Title level={1} style={{ color: '#D4AF37', textAlign: 'center', marginBottom: '8px' }}>
                                    TẢI GAME NGAY
                                </Title>
                                <Paragraph style={{
                                    color: 'white',
                                    textAlign: 'center',
                                    fontSize: '1.2rem',
                                    marginBottom: '40px'
                                }}>
                                    Bắt đầu hành trình thống nhất đất nước. Tải và cài đặt chỉ trong 5 phút!
                                </Paragraph>

                                {/* Platform Selection */}
                                <div style={{ marginBottom: '30px' }}>
                                    <Title level={4} style={{ color: '#D4AF37', marginBottom: '20px' }}>
                                        <Monitor style={{ marginRight: '8px' }} />
                                        Chọn Nền Tảng
                                    </Title>
                                    <Space size="middle" style={{ width: '100%', justifyContent: 'center' }}>
                                        {Object.entries(platformData).map(([key, platform]) => (
                                            <Tooltip key={key} title={`Tải cho ${platform.name}`}>
                                                <Button
                                                    size="large"
                                                    type={activePlatform === key ? 'primary' : 'default'}
                                                    icon={platform.icon}
                                                    style={{
                                                        background: activePlatform === key ?
                                                            'linear-gradient(135deg, #D4AF37, #FFD700)' : 'transparent',
                                                        border: `2px solid #D4AF37`,
                                                        color: activePlatform === key ? '#8B0000' : '#D4AF37',
                                                        height: '80px',
                                                        width: '120px',
                                                        fontSize: '16px',
                                                        fontWeight: 'bold'
                                                    }}
                                                    onClick={() => setActivePlatform(key)}
                                                >
                                                    {platform.name}
                                                </Button>
                                            </Tooltip>
                                        ))}
                                    </Space>
                                </div>

                                {/* Download Info */}
                                <Card style={{
                                    background: 'rgba(212, 175, 55, 0.1)',
                                    border: '1px solid #D4AF37',
                                    marginBottom: '20px'
                                }}>
                                    <Row gutter={[16, 16]}>
                                        <Col xs={12}>
                                            <Statistic
                                                title="Phiên Bản"
                                                value={platformData[activePlatform as keyof typeof platformData].version}
                                                valueStyle={{ color: '#D4AF37', fontSize: '18px' }}
                                            />
                                        </Col>
                                        <Col xs={12}>
                                            <Statistic
                                                title="Kích Thước"
                                                value={platformData[activePlatform as keyof typeof platformData].size}
                                                valueStyle={{ color: '#D4AF37', fontSize: '18px' }}
                                            />
                                        </Col>
                                    </Row>
                                </Card>

                                {/* Download Progress */}
                                {isDownloading && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            <Text strong style={{ color: '#D4AF37' }}>Đang tải xuống...</Text>
                                            <Progress
                                                percent={downloadProgress}
                                                strokeColor={{
                                                    '0%': '#D4AF37',
                                                    '100%': '#FFD700',
                                                }}
                                                showInfo
                                            />
                                        </Space>
                                    </div>
                                )}

                                {/* Download Button */}
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={isDownloading ? <Clock /> : <CloudDownload />}
                                    loading={isDownloading}
                                    style={{
                                        background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                                        border: 'none',
                                        height: '60px',
                                        width: '100%',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        color: '#8B0000',
                                        marginBottom: '20px'
                                    }}
                                    onClick={() => handleDownload(activePlatform)}
                                >
                                    {isDownloading ? 'ĐANG TẢI...' : `TẢI CHO ${platformData[activePlatform as keyof typeof platformData].name}`}
                                </Button>

                                {/* Additional Options */}
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Button
                                        type="link"
                                        icon={<Package />}
                                        style={{ color: '#D4AF37' }}
                                    >
                                        Tải bản cài đặt ngoại tuyến
                                    </Button>
                                    <Button
                                        type="link"
                                        icon={<QrCode />}
                                        style={{ color: '#D4AF37' }}
                                    >
                                        Tải qua QR Code
                                    </Button>
                                </Space>
                            </Card>
                        </Col>

                        <Col xs={24} lg={12}>
                            {/* System Requirements */}
                            <Card
                                title={
                                    <Space>
                                        <Zap style={{ color: '#D4AF37' }} />
                                        <Text strong style={{ color: '#8B0000' }}>Yêu Cầu Hệ Thống</Text>
                                    </Space>
                                }
                                style={{
                                    border: '2px solid #D4AF37',
                                    borderRadius: '15px',
                                    marginBottom: '24px'
                                }}
                            >
                                <Tabs
                                    activeKey={activePlatform}
                                    onChange={setActivePlatform}
                                    items={Object.entries(platformData).map(([key, platform]) => ({
                                        key,
                                        label: (
                                            <Space>
                                                {platform.icon}
                                                {platform.name}
                                            </Space>
                                        ),
                                        children: (
                                            <List
                                                dataSource={Object.entries(platform.requirements)}
                                                renderItem={([key, value]) => (
                                                    <List.Item>
                                                        <List.Item.Meta
                                                            title={<Text strong style={{ color: '#8B0000' }}>
                                                                {key.charAt(0).toUpperCase() + key.slice(1)}:
                                                            </Text>}
                                                            description={value}
                                                        />
                                                    </List.Item>
                                                )}
                                            />
                                        )
                                    }))}
                                />
                            </Card>

                            {/* Quick Stats */}
                            <Row gutter={[16, 16]}>
                                <Col xs={12}>
                                    <Card size="small" style={{ background: 'rgba(139, 0, 0, 0.8)', color: 'white', textAlign: 'center' }}>
                                        <Statistic
                                            title="Lượt Tải"
                                            value={125847}
                                            valueStyle={{ color: '#D4AF37', fontSize: '24px' }}
                                            prefix={<Download size={16} />}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={12}>
                                    <Card size="small" style={{ background: 'rgba(0, 51, 102, 0.8)', color: 'white', textAlign: 'center' }}>
                                        <Statistic
                                            title="Đánh Giá"
                                            value={4.9}
                                            suffix="/5"
                                            valueStyle={{ color: '#D4AF37', fontSize: '24px' }}
                                            prefix={<Star size={16} />}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    {/* Version History & Features */}
                    <Row gutter={[32, 32]}>
                        <Col xs={24} lg={12}>
                            <Card
                                title={
                                    <Space>
                                        <Clock style={{ color: '#D4AF37' }} />
                                        <Text strong style={{ color: '#8B0000' }}>Lịch Sử Phiên Bản</Text>
                                    </Space>
                                }
                                style={{ border: '2px solid #D4AF37', borderRadius: '15px' }}
                            >
                                <List
                                    dataSource={versionFeatures}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<Avatar style={{ background: '#D4AF37' }}>V</Avatar>}
                                                title={
                                                    <Space>
                                                        <Text strong>{item.version}</Text>
                                                        <Tag color="gold" style={{ color: '#8B0000' }}>{item.date}</Tag>
                                                    </Space>
                                                }
                                                description={
                                                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                                        {item.features.map((feature, index) => (
                                                            <li key={index} style={{ marginBottom: '4px' }}>
                                                                <Text>{feature}</Text>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>

                        <Col xs={24} lg={12}>
                            <Card
                                title={
                                    <Space>
                                        <Gift style={{ color: '#D4AF37' }} />
                                        <Text strong style={{ color: '#8B0000' }}>Ưu Đãi Đặc Biệt</Text>
                                    </Space>
                                }
                                style={{ border: '2px solid #D4AF37', borderRadius: '15px' }}
                            >
                                <Alert
                                    message="TẢI NGAY - NHẬN QUÀ"
                                    description="Tải game trong tháng này để nhận ngay:
                  • 1000 Vàng khởi nghiệp
                  • Vật phẩm hiếm 'Binh Thư Yếu Lược'
                  • Trang bị độc quyền 'Giáp Hoàng Gia'"
                                    type="success"
                                    showIcon
                                    style={{ marginBottom: '16px' }}
                                />

                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                    <Title level={4} style={{ color: '#8B0000' }}>
                                        <Crown style={{ marginRight: '8px' }} />
                                        Gói Đặc Biệt Cho Người Mới
                                    </Title>
                                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                        <Badge count="FREE" style={{ background: '#D4AF37', color: '#8B0000' }}>
                                            <Card
                                                size="small"
                                                style={{
                                                    background: 'linear-gradient(135deg, #F1E8D6, #F5F5DC)',
                                                    border: '1px solid #D4AF37'
                                                }}
                                            >
                                                <Text strong>Gói Khởi Đầu Vàng</Text>
                                            </Card>
                                        </Badge>

                                        <Progress
                                            percent={75}
                                            format={percent => `Còn lại: ${100 - (percent || 0)}%`}
                                            strokeColor="#D4AF37"
                                        />

                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                            Ưu đãi kết thúc sau: 15 ngày 08:32:15
                                        </Text>
                                    </Space>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    {/* Installation Guide */}
                    <Card
                        title={
                            <Space>
                                <Shield style={{ color: '#D4AF37' }} />
                                <Text strong style={{ color: '#8B0000' }}>Hướng Dẫn Cài Đặt & Bảo Mật</Text>
                            </Space>
                        }
                        style={{
                            border: '2px solid #D4AF37',
                            borderRadius: '15px',
                            marginTop: '32px'
                        }}
                    >
                        <Row gutter={[32, 32]}>
                            <Col xs={24} md={8}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        background: '#8B0000',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 12px',
                                        color: '#D4AF37',
                                        fontSize: '24px',
                                        fontWeight: 'bold'
                                    }}>
                                        1
                                    </div>
                                    <Title level={5} style={{ color: '#8B0000' }}>Tải Xuống</Title>
                                    <Text>Chọn nền tảng và nhấn nút tải về</Text>
                                </div>
                            </Col>
                            <Col xs={24} md={8}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        background: '#003366',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 12px',
                                        color: '#D4AF37',
                                        fontSize: '24px',
                                        fontWeight: 'bold'
                                    }}>
                                        2
                                    </div>
                                    <Title level={5} style={{ color: '#003366' }}>Cài Đặt</Title>
                                    <Text>Chạy file .exe và làm theo hướng dẫn</Text>
                                </div>
                            </Col>
                            <Col xs={24} md={8}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        background: '#2E8B57',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 12px',
                                        color: '#D4AF37',
                                        fontSize: '24px',
                                        fontWeight: 'bold'
                                    }}>
                                        3
                                    </div>
                                    <Title level={5} style={{ color: '#2E8B57' }}>Chơi Game</Title>
                                    <Text>Khởi động và bắt đầu chinh phục</Text>
                                </div>
                            </Col>
                        </Row>

                        <Divider />

                        <Alert
                            message="Lưu ý Bảo Mật"
                            description="Chỉ tải game từ trang web chính thức này. Tránh các trang không chính thức để bảo vệ thông tin và thiết bị của bạn."
                            type="warning"
                            showIcon
                        />
                    </Card>
                </div>
            </Content>

            {/* Footer */}
            <Footer style={{
                background: 'linear-gradient(135deg, #003366 0%, #8B0000 100%)',
                color: '#D4AF37',
                padding: '40px 20px',
                borderTop: '3px solid #D4AF37',
                marginTop: '60px'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    <Space direction="vertical" size="large">
                        <Title level={4} style={{ color: '#D4AF37', margin: 0 }}>
                            Sẵn sàng cho cuộc chiến?
                        </Title>
                        <Paragraph style={{ color: 'rgba(212, 175, 55, 0.8)', margin: 0 }}>
                            Tải ngay và bắt đầu hành trình thống nhất đất nước
                        </Paragraph>
                        <Button
                            type="primary"
                            size="large"
                            href={GameLink.DOWNLOAD}
                            icon={<Download />}
                            style={{
                                background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                                border: 'none',
                                fontWeight: 'bold',
                                color: '#8B0000'
                            }}
                        >
                            TẢI GAME MIỄN PHÍ
                        </Button>
                    </Space>

                    <Divider style={{ borderColor: '#D4AF37', margin: '30px 0' }} />

                    <Text style={{ color: 'rgba(212, 175, 55, 0.6)' }}>
                        © 2024 12 Sứ Quân. Tất cả quyền được bảo lưu. |
                        <Button type="link" style={{ color: '#D4AF37', padding: '0 8px' }} href={GameLink.TERMS}>Điều Khoản</Button>
                        <Button type="link" style={{ color: '#D4AF37', padding: '0 8px' }} href={GameLink.POLICY}>Chính Sách</Button>
                        <Button type="link" style={{ color: '#D4AF37', padding: '0 8px' }} href={GameLink.SUPPORT}>Hỗ Trợ</Button>
                    </Text>
                </div>
            </Footer>
        </Layout>
    );
};

export default DownloadPage;
