"use client"
// pages/landing-page.tsx
import React, { useState, useEffect } from 'react';
import {
    Layout,
    Button,
    Card,
    Row,
    Col,
    Statistic,
    Tag,
    Avatar,
    Divider,
    Typography,
    Space,
    Badge,
    Progress
} from 'antd';
import {
    Crown,
    Sword,
    Trophy,
    Users,
    Star,
    Play,
    Download,
    Share2,
    Castle,
} from 'lucide-react';
import Link from 'next/link';
import { GameLink } from '@/enums/Links';

const { Title, Paragraph, Text } = Typography;
const { Header, Footer } = Layout;

const LandingPage = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Layout style={{ background: 'linear-gradient(135deg, #F5F5DC 0%, #F1E8D6 100%)', minHeight: '100vh' }}>
            {/* Navigation Header */}
            <Header
                style={{
                    position: 'fixed',
                    top: 0,
                    width: '100%',
                    zIndex: 1000,
                    background: isScrolled ? 'rgba(139, 0, 0, 0.95)' : 'transparent',
                    borderBottom: isScrolled ? `2px solid #D4AF37` : 'none',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                }}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 20px'
                }}>
                    {/* Logo */}
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

                    {/* Navigation Menu */}
                    <Space size="large" style={{ marginLeft: 'auto' }}>
                        <Link type="link" style={{ color: '#D4AF37', fontWeight: '600' }} href={'/introduction'}>Giới Thiệu</Link>
                        <Link type="link" style={{ color: '#D4AF37', fontWeight: '600' }} href={'/characters'}>Nhân Vật</Link>
                        <Link type="link" style={{ color: '#D4AF37', fontWeight: '600' }} href={'/gameplay'}>Lối Chơi</Link>
                        <Link type="link" style={{ color: '#D4AF37', fontWeight: '600' }} href={'/download'}>Tải Game</Link>
                        <Button
                            type="primary"
                            style={{
                                background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                                border: 'none',
                                fontWeight: 'bold',
                                color: '#8B0000'
                            }}
                            icon={<Play size={16} />}
                            href="/download"
                        >
                            Chơi Ngay
                        </Button>
                    </Space>
                </div>
            </Header>

            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.9) 0%, rgba(0, 51, 102, 0.9) 100%), url("/api/placeholder/1920/800")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '100px 20px 60px',
                    textAlign: 'center',
                    color: 'white',
                    position: 'relative',
                    zIndex: 2
                }}>
                    <Badge.Ribbon
                        text="MỚI RA MẮT"
                        color="#D4AF37"
                        style={{ color: '#8B0000', fontWeight: 'bold' }}
                    >
                        <Card style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '2px solid #D4AF37',
                            borderRadius: '20px',
                            padding: '40px'
                        }}>
                            <Title level={1} style={{
                                color: '#D4AF37',
                                fontSize: '4rem',
                                marginBottom: '20px',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                            }}>
                                ʬ SỨ QUÂN
                            </Title>

                            <Paragraph style={{
                                fontSize: '1.5rem',
                                color: '#FFFFFF',
                                marginBottom: '40px',
                                maxWidth: '800px',
                                margin: '0 auto 40px',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                            }}>
                                Trở thành một trong 12 vị tướng hùng mạnh, chiến đấu giành quyền thống nhất
                                đất nước Việt trong thời kỳ loạn lạc. Sử dụng mưu kế, chiến thuật và sức mạnh
                                để viết nên lịch sử!
                            </Paragraph>

                            <Space size="large" style={{ marginBottom: '40px' }}>
                                <Button
                                    size="large"
                                    type="primary"
                                    href={GameLink.DOWNLOAD}
                                    style={{
                                        background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                                        border: 'none',
                                        height: '60px',
                                        padding: '0 40px',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        color: '#8B0000'
                                    }}
                                    icon={<Play size={20} />}
                                >
                                    Bắt Đầu Chiến Trận
                                </Button>
                                <Button
                                    size="large"
                                    href={GameLink.DOWNLOAD}
                                    style={{
                                        background: 'rgba(212, 175, 55, 0.2)',
                                        border: '2px solid #D4AF37',
                                        height: '60px',
                                        padding: '0 30px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        color: '#D4AF37'
                                    }}
                                    icon={<Download size={20} />}
                                >
                                    Tải Game
                                </Button>
                            </Space>

                            {/* Stats */}
                            <Row gutter={[32, 32]} style={{ marginTop: '60px' }}>
                                <Col xs={24} sm={8}>
                                    <Statistic
                                        title="Người Chơi"
                                        value={125000}
                                        suffix="+"
                                        valueStyle={{ color: '#D4AF37', fontSize: '2.5rem' }}
                                        prefix={<Users style={{ color: '#D4AF37' }} />}
                                    />
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Statistic
                                        title="Chiến Trận"
                                        value={85000}
                                        suffix="+"
                                        valueStyle={{ color: '#D4AF37', fontSize: '2.5rem' }}
                                        prefix={<Sword style={{ color: '#D4AF37' }} />}
                                    />
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Statistic
                                        title="Đánh Giá"
                                        value={4.9}
                                        suffix="/5"
                                        valueStyle={{ color: '#D4AF37', fontSize: '2.5rem' }}
                                        prefix={<Star style={{ color: '#D4AF37' }} />}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Badge.Ribbon>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '80px 20px', background: '#F5F5DC' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Title level={2} style={{
                        textAlign: 'center',
                        color: '#8B0000',
                        marginBottom: '60px',
                        fontSize: '3rem'
                    }}>
                        ĐẶC ĐIỂM NỔI BẬT
                    </Title>

                    <Row gutter={[32, 32]}>
                        <Col xs={24} md={12} lg={6}>
                            <Card
                                hoverable
                                style={{
                                    background: 'linear-gradient(135deg, #8B0000, #D4AF37)',
                                    border: 'none',
                                    borderRadius: '15px',
                                    textAlign: 'center',
                                    padding: '30px 20px',
                                    color: 'white'
                                }}
                            >
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px'
                                }}>
                                    <Castle size={40} color="#FFFFFF" />
                                </div>
                                <Title level={4} style={{ color: 'white' }}>Thành Trì Chiến Lược</Title>
                                <Paragraph style={{ color: 'rgba(255,255,255,0.8)' }}>
                                    Xây dựng và phòng thủ thành trì với hệ thống công sự kiên cố
                                </Paragraph>
                            </Card>
                        </Col>

                        <Col xs={24} md={12} lg={6}>
                            <Card
                                hoverable
                                style={{
                                    background: 'linear-gradient(135deg, #003366, #D4AF37)',
                                    border: 'none',
                                    borderRadius: '15px',
                                    textAlign: 'center',
                                    padding: '30px 20px',
                                    color: 'white'
                                }}
                            >
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px'
                                }}>
                                    <Sword size={40} color="#FFFFFF" />
                                </div>
                                <Title level={4} style={{ color: 'white' }}>Chiến Thuật Đa Dạng</Title>
                                <Paragraph style={{ color: 'rgba(255,255,255,0.8)' }}>
                                    Hơn 50 loại quân với chiến thuật tấn công và phòng thủ đa dạng
                                </Paragraph>
                            </Card>
                        </Col>

                        <Col xs={24} md={12} lg={6}>
                            <Card
                                hoverable
                                style={{
                                    background: 'linear-gradient(135deg, #8B4513, #D4AF37)',
                                    border: 'none',
                                    borderRadius: '15px',
                                    textAlign: 'center',
                                    padding: '30px 20px',
                                    color: 'white'
                                }}
                            >
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px'
                                }}>
                                    <Users size={40} color="#FFFFFF" />
                                </div>
                                <Title level={4} style={{ color: 'white' }}>Liên Minh Chiến Lược</Title>
                                <Paragraph style={{ color: 'rgba(255,255,255,0.8)' }}>
                                    Kết hợp với các sứ quân khác để tạo thành liên minh hùng mạnh
                                </Paragraph>
                            </Card>
                        </Col>

                        <Col xs={24} md={12} lg={6}>
                            <Card
                                hoverable
                                style={{
                                    background: 'linear-gradient(135deg, #2E8B57, #D4AF37)',
                                    border: 'none',
                                    borderRadius: '15px',
                                    textAlign: 'center',
                                    padding: '30px 20px',
                                    color: 'white'
                                }}
                            >
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px'
                                }}>
                                    <Trophy size={40} color="#FFFFFF" />
                                </div>
                                <Title level={4} style={{ color: 'white' }}>Thành Tích Vinh Quang</Title>
                                <Paragraph style={{ color: 'rgba(255,255,255,0.8)' }}>
                                    Hệ thống thành tích và huy hiệu danh giá cho các chiến tướng
                                </Paragraph>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </section>

            {/* Characters Section */}
            <section style={{ padding: '80px 20px', background: 'linear-gradient(135deg, #003366, #8B0000)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Title level={2} style={{
                        textAlign: 'center',
                        color: '#D4AF37',
                        marginBottom: '60px',
                        fontSize: '3rem'
                    }}>
                        12 SỨ QUÂN HÙNG MẠNH
                    </Title>

                    <Row gutter={[32, 32]}>
                        {[
                            { name: 'Ngô Xương Xí', power: 95, intelligence: 88, territory: 'Bình Kiều' },
                            { name: 'Đỗ Cảnh Thạc', power: 92, intelligence: 85, territory: 'Đỗ Động' },
                            { name: 'Kiều Công Hãn', power: 89, intelligence: 90, territory: 'Phong Châu' },
                            { name: 'Nguyễn Khoan', power: 87, intelligence: 86, territory: 'Tam Đái' }
                        ].map((character, index) => (
                            <Col xs={24} md={12} lg={6} key={index}>
                                <Card
                                    hoverable
                                    cover={
                                        <div style={{
                                            height: '200px',
                                            background: `linear-gradient(135deg, #8B0000, #D4AF37)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative'
                                        }}>
                                            <Avatar
                                                size={100}
                                                style={{
                                                    background: 'rgba(255,255,255,0.2)',
                                                    border: '3px solid #D4AF37'
                                                }}
                                                icon={<Crown size={40} />}
                                            />
                                        </div>
                                    }
                                    style={{
                                        border: '2px solid #D4AF37',
                                        borderRadius: '15px',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                    styles={{ body: { color: 'white' } }}
                                >
                                    <Card.Meta
                                        title={<Text style={{ color: '#D4AF37', fontSize: '18px', fontWeight: 'bold' }}>{character.name}</Text>}
                                        description={
                                            <div>
                                                <div style={{ marginBottom: '10px' }}>
                                                    <Text strong>Lãnh thổ: </Text>
                                                    <Tag color="gold" style={{ color: '#8B0000' }}>{character.territory}</Tag>
                                                </div>
                                                <div>
                                                    <Text strong>Sức mạnh: </Text>
                                                    <Progress percent={character.power} size="small" strokeColor="#D4AF37" />
                                                </div>
                                                <div>
                                                    <Text strong>Trí tuệ: </Text>
                                                    <Progress percent={character.intelligence} size="small" strokeColor="#52c41a" />
                                                </div>
                                            </div>
                                        }
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                padding: '100px 20px',
                background: 'linear-gradient(135deg, #8B0000 0%, #003366 100%)',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <Title level={2} style={{ color: '#D4AF37', fontSize: '3rem', marginBottom: '20px' }}>
                        SẴN SÀNG TRỞ THÀNH HÙNG TƯỚNG?
                    </Title>
                    <Paragraph style={{ color: 'white', fontSize: '1.2rem', marginBottom: '40px' }}>
                        Tham gia ngay để viết nên lịch sử của riêng bạn. Chiến đấu, chiến thắng và
                        trở thành người hùng thống nhất đất nước!
                    </Paragraph>
                    <Space size="large">
                        <Button
                            size="large"
                            type="primary"
                            style={{
                                background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                                border: 'none',
                                height: '60px',
                                padding: '0 40px',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: '#8B0000'
                            }}
                            icon={<Play size={20} />}
                        >
                            Chơi Miễn Phí
                        </Button>
                        <Button
                            size="large"
                            style={{
                                background: 'transparent',
                                border: '2px solid #D4AF37',
                                height: '60px',
                                padding: '0 30px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: '#D4AF37'
                            }}
                            icon={<Share2 size={20} />}
                        >
                            Chia Sẻ
                        </Button>
                    </Space>
                </div>
            </section>

            {/* Footer */}
            <Footer style={{
                background: '#003366',
                color: '#D4AF37',
                padding: '40px 20px',
                borderTop: '3px solid #D4AF37'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Row gutter={[32, 32]}>
                        <Col xs={24} md={8}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <Crown size={24} color="#D4AF37" />
                                <Title level={4} style={{ color: '#D4AF37', margin: 0 }}>12 SỨ QUÂN</Title>
                            </div>
                            <Paragraph style={{ color: 'rgba(212, 175, 55, 0.8)' }}>
                                Game chiến thuật lịch sử Việt Nam - Nơi hội tụ các anh hùng thời loạn
                            </Paragraph>
                        </Col>
                        <Col xs={24} md={8}>
                            <Title level={5} style={{ color: '#D4AF37' }}>Liên Kết</Title>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Button type="link" href={GameLink.INTRODUCTION} style={{ color: '#D4AF37', padding: 0 }}>Giới Thiệu</Button>
                                <Button type="link" href={GameLink.GAMEPLAY} style={{ color: '#D4AF37', padding: 0 }}>Hướng Dẫn</Button>
                                <Button type="link" href={GameLink.NEWS} style={{ color: '#D4AF37', padding: 0 }}>Tin Tức</Button>
                            </Space>
                        </Col>
                        <Col xs={24} md={8}>
                            <Title level={5} style={{ color: '#D4AF37' }}>Hỗ Trợ</Title>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Button type="link"  style={{ color: '#D4AF37', padding: 0 }}>Trung Tâm Hỗ Trợ</Button>
                                <Button type="link" href={GameLink.TERMS} style={{ color: '#D4AF37', padding: 0 }}>Điều Khoản</Button>
                                <Button type="link" href={GameLink.POLICY} style={{ color: '#D4AF37', padding: 0 }}>Chính Sách</Button>
                            </Space>
                        </Col>
                    </Row>
                    <Divider style={{ borderColor: '#D4AF37' }} />
                    <div style={{ textAlign: 'center', color: 'rgba(212, 175, 55, 0.6)' }}>
                        © 2024 12 Sứ Quân. Tất cả quyền được bảo lưu.
                    </div>
                </div>
            </Footer>
        </Layout>
    );
};

export default LandingPage;
