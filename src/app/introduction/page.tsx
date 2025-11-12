"use client"
// pages/introduction-page.tsx
import React, { useState, useEffect } from 'react';
import {
    Layout,
    Button,
    Card,
    Row,
    Col,
    Timeline,
    Avatar,
    Divider,
    Typography,
    Space,
    Badge,
    Progress,
    List,
    Tag,
    Carousel,
    Modal,
    Drawer
} from 'antd';
import {
    Crown,
    Sword,
    Users,
    Calendar,
    BookOpen,
    Play,
    Castle,
    Zap,
    Compass,
    Book
} from 'lucide-react';
import './introduction.css'
import { GameLink } from '@/enums/Links';
const { Title, Paragraph, Text } = Typography;
const { Header, Footer, Content } = Layout;

const IntroductionPage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isStoryModalVisible, setIsStoryModalVisible] = useState(false);
    const [isFeatureDrawerVisible, setIsFeatureDrawerVisible] = useState(false);

    const historicalPeriods = [
        {
            year: "944",
            title: "Thời Loạn 12 Sứ Quân",
            description: "Sau khi Ngô Quyền mất, đất nước rơi vào cảnh cát cứ, 12 thế lực hùng mạnh chia nhau thống trị các vùng",
            color: "#8B0000"
        },
        {
            year: "965",
            title: "Hình Thành Các Thế Lực",
            description: "Các sứ quân củng cố lực lượng, xây dựng thành trì và phát triển quân đội",
            color: "#D4AF37"
        },
        {
            year: "967",
            title: "Đinh Bộ Lĩnh Nổi Dậy",
            description: "Đinh Bộ Lĩnh bắt đầu sự nghiệp thống nhất đất nước từ vùng Hoa Lư",
            color: "#003366"
        },
        {
            year: "968",
            title: "Thống Nhất Đất Nước",
            description: "Đinh Bộ Lĩnh lên ngôi hoàng đế, kết thúc thời kỳ 12 sứ quân",
            color: "#2E8B57"
        }
    ];

    const mainCharacters = [
        {
            id: 1,
            name: "Ngô Xương Xí",
            title: "Sứ quân Bình Kiều",
            power: 95,
            intelligence: 88,
            loyalty: 75,
            description: "Con trai Ngô Xương Ngập, kế thừa sự nghiệp của triều Ngô",
            specialty: "Kế thừa chính thống",
            color: "#8B0000"
        },
        {
            id: 2,
            name: "Đỗ Cảnh Thạc",
            title: "Sứ quân Đỗ Động",
            power: 92,
            intelligence: 85,
            loyalty: 70,
            description: "Tướng cũ của Dương Đình Nghệ, có tài thao lược",
            specialty: "Chiến thuật quân sự",
            color: "#D4AF37"
        },
        {
            id: 3,
            name: "Kiều Công Hãn",
            title: "Sứ quân Phong Châu",
            power: 89,
            intelligence: 90,
            loyalty: 80,
            description: "Người có học thức, giỏi về chính trị và ngoại giao",
            specialty: "Ngoại giao liên minh",
            color: "#003366"
        },
        {
            id: 4,
            name: "Nguyễn Khoan",
            title: "Sứ quân Tam Đái",
            power: 87,
            intelligence: 86,
            loyalty: 85,
            description: "Giỏi tổ chức và quản lý lãnh thổ",
            specialty: "Kinh tế & Hậu cần",
            color: "#2E8B57"
        }
    ];

    const gameFeatures = [
        {
            icon: <Castle size={32} />,
            title: "Xây Dựng Thành Trì",
            description: "Phát triển căn cứ quân sự, xây dựng công trình phòng thủ và kinh tế",
            details: [
                "15 loại công trình khác nhau",
                "Hệ thống nâng cấp đa dạng",
                "Tối ưu hóa vị trí chiến lược"
            ]
        },
        {
            icon: <Sword size={32} />,
            title: "Chiến Thuật Quân Sự",
            description: "Chỉ huy các loại quân với chiến thuật đa dạng trên chiến trường",
            details: [
                "Hơn 20 loại quân đội khác nhau",
                "Hệ thống tướng lĩnh với kỹ năng riêng",
                "Địa hình ảnh hưởng đến chiến thuật"
            ]
        },
        {
            icon: <Users size={32} />,
            title: "Ngoại Giao & Liên Minh",
            description: "Kết hợp với các sứ quân khác hoặc sử dụng mưu kế phân hóa",
            details: [
                "Hệ thống quan hệ ngoại giao",
                "Cơ chế liên minh và phản bội",
                "Mưu kế và gián điệp"
            ]
        },
        {
            icon: <Compass size={32} />,
            title: "Bản Đồ Chiến Lược",
            description: "Khám phá bản đồ Việt Nam thế kỷ 10 với các vùng đất đặc trưng",
            details: [
                "Bản đồ rộng lớn 45 vùng lãnh thổ",
                "Tài nguyên phân bố theo vùng",
                "Địa hình ảnh hưởng đến di chuyển"
            ]
        }
    ];

    const carouselSlides = [
        {
            image: "/api/placeholder/1200/600",
            title: "Thời Đại Loạn Lạc",
            description: "Chứng kiến giai đoạn lịch sử đầy biến động của Việt Nam thế kỷ 10",
            color: "#8B0000"
        },
        {
            image: "/api/placeholder/1200/600",
            title: "Chiến Tranh & Chính Trị",
            description: "Cân bằng giữa sức mạnh quân sự và tài ngoại giao để tồn tại",
            color: "#D4AF37"
        },
        {
            image: "/api/placeholder/1200/600",
            title: "Con Đường Thống Nhất",
            description: "Lựa chọn giữa việc trở thành kẻ thống nhất hay kẻ bị trị",
            color: "#003366"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <Layout style={{ background: 'linear-gradient(135deg, #F5F5DC 0%, #F1E8D6 100%)', minHeight: '100vh' }}>
            {/* Header */}
            <Header style={{
                background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.95) 0%, rgba(0, 51, 102, 0.95) 100%)',
                borderBottom: '3px solid #D4AF37',
                position: 'fixed',
                width: '100%',
                zIndex: 1000
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
                        <Button type="link" href={GameLink.DOWNLOAD} style={{ color: '#D4AF37', fontWeight: '600' }}>Tải Game</Button>
                        <Button type="link" href={GameLink.CHARACTERS} style={{ color: '#D4AF37', fontWeight: '600' }}>Nhân Vật</Button>
                        <Button type="link" href={GameLink.STORY} style={{ color: '#D4AF37', fontWeight: '600' }}>Cốt Truyện</Button>
                        <Button
                            type="primary"
                            style={{
                                background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                                border: 'none',
                                fontWeight: 'bold',
                                color: '#8B0000'
                            }}
                            href={GameLink.DOWNLOAD}
                            icon={<Play size={16} />}

                        >
                            Chơi Ngay
                        </Button>
                    </Space>
                </div>
            </Header>

            <Content style={{ paddingTop: '80px' }}>
                {/* Hero Section */}
                <section style={{
                    background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.8) 0%, rgba(0, 51, 102, 0.8) 100%), url("/api/placeholder/1920/800")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '100px 20px',
                    position: 'relative'
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', color: 'white' }}>
                        <Badge.Ribbon
                            text="TRẢI NGHIỆM LỊCH SỬ"
                            color="#D4AF37"
                            style={{ color: '#8B0000', fontWeight: 'bold', fontSize: '16px' }}
                        >
                            <div style={{ padding: '40px' }}>
                                <Title level={1} style={{
                                    color: '#D4AF37',
                                    fontSize: '4rem',
                                    marginBottom: '20px',
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                                }}>
                                    THỜI KỲ 12 SỨ QUÂN
                                </Title>

                                <Paragraph style={{
                                    fontSize: '1.5rem',
                                    color: '#FFFFFF',
                                    marginBottom: '40px',
                                    maxWidth: '800px',
                                    margin: '0 auto 40px',
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                                }}>
                                    Bước vào giai đoạn lịch sử đầy biến động của Việt Nam thế kỷ 10.
                                    Lựa chọn một trong 12 sứ quân và viết nên câu chuyện của riêng bạn -
                                    thống nhất đất nước hoặc bị lịch sử lãng quên.
                                </Paragraph>

                                <Space size="large">
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
                                        Khám Phá Ngay
                                    </Button>
                                    <Button
                                        style={{
                                            background: 'rgba(212, 175, 55, 0.2)',
                                            border: '2px solid #D4AF37',
                                            height: '60px',
                                            padding: '0 30px',
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            color: '#D4AF37'
                                        }}
                                        icon={<BookOpen size={20} />}
                                        onClick={() => setIsStoryModalVisible(true)}
                                    >
                                        Đọc Cốt Truyện
                                    </Button>
                                </Space>
                            </div>
                        </Badge.Ribbon>
                    </div>
                </section>

                {/* Historical Timeline */}
                <section style={{ padding: '80px 20px', background: '#F5F5DC' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <Title level={2} style={{
                            textAlign: 'center',
                            color: '#8B0000',
                            marginBottom: '60px',
                            fontSize: '3rem'
                        }}>
                            <Calendar style={{ marginRight: '12px' }} />
                            DÒNG THỜI GIAN LỊCH SỬ
                        </Title>

                        <Timeline
                            mode="alternate"
                            items={historicalPeriods.map((period, index) => ({
                                color: period.color,
                                children: (
                                    <Card
                                        style={{
                                            border: `2px solid ${period.color}`,
                                            background: 'white',
                                            borderRadius: '12px'
                                        }}
                                    >
                                        <Space direction="vertical" size="small">
                                            <Tag color={period.color} style={{ fontSize: '16px', padding: '4px 12px' }}>
                                                {period.year}
                                            </Tag>
                                            <Title level={4} style={{ color: period.color, margin: 0 }}>
                                                {period.title}
                                            </Title>
                                            <Paragraph style={{ margin: 0 }}>
                                                {period.description}
                                            </Paragraph>
                                        </Space>
                                    </Card>
                                ),
                            }))}
                        />
                    </div>
                </section>

                {/* Main Characters */}
                <section style={{ padding: '80px 20px', background: 'linear-gradient(135deg, #003366, #8B0000)' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <Title level={2} style={{
                            textAlign: 'center',
                            color: '#D4AF37',
                            marginBottom: '60px',
                            fontSize: '3rem'
                        }}>
                            <Crown style={{ marginRight: '12px' }} />
                            TỨ ĐẠI SỨ QUÂN
                        </Title>

                        <Row gutter={[32, 32]}>
                            {mainCharacters.map((character) => (
                                <Col xs={24} md={12} lg={6} key={character.id}>
                                    <Card
                                        hoverable
                                        style={{
                                            border: `3px solid ${character.color}`,
                                            borderRadius: '15px',
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(10px)',
                                            height: '100%'
                                        }}
                                        styles={{ body: { padding: '20px', color: 'white' } }}
                                    >
                                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                            <Avatar
                                                size={80}
                                                style={{
                                                    background: character.color,
                                                    border: '3px solid #D4AF37',
                                                    marginBottom: '12px'
                                                }}
                                                icon={<Crown size={32} />}
                                            />
                                            <Title level={3} style={{ color: '#D4AF37', margin: '8px 0' }}>
                                                {character.name}
                                            </Title>
                                            <Tag color="gold" style={{ color: '#8B0000', fontWeight: 'bold' }}>
                                                {character.title}
                                            </Tag>
                                        </div>

                                        <Paragraph style={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center' }}>
                                            {character.description}
                                        </Paragraph>

                                        <Divider style={{ borderColor: '#D4AF37' }} />

                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            <div>
                                                <Text strong style={{ color: '#D4AF37' }}>Sức mạnh:</Text>
                                                <Progress
                                                    percent={character.power}
                                                    size="small"
                                                    strokeColor={character.color}
                                                    showInfo={false}
                                                />
                                            </div>
                                            <div>
                                                <Text strong style={{ color: '#D4AF37' }}>Trí tuệ:</Text>
                                                <Progress
                                                    percent={character.intelligence}
                                                    size="small"
                                                    strokeColor="#52c41a"
                                                    showInfo={false}
                                                />
                                            </div>
                                            <div>
                                                <Text strong style={{ color: '#D4AF37' }}>Trung thành:</Text>
                                                <Progress
                                                    percent={character.loyalty}
                                                    size="small"
                                                    strokeColor="#1890ff"
                                                    showInfo={false}
                                                />
                                            </div>
                                        </Space>

                                        <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                            <Tag color={character.color} style={{ color: 'white' }}>
                                                {character.specialty}
                                            </Tag>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </section>

                {/* Game Features Carousel */}
                <section style={{ padding: '80px 20px', background: '#F1E8D6' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <Title level={2} style={{
                            textAlign: 'center',
                            color: '#8B0000',
                            marginBottom: '60px',
                            fontSize: '3rem'
                        }}>
                            <Zap style={{ marginRight: '12px' }} />
                            TÍNH NĂNG NỔI BẬT
                        </Title>

                        <Carousel
                            autoplay
                            effect="fade"
                            beforeChange={(_, next) => setCurrentSlide(next)}
                            style={{ marginBottom: '40px' }}
                        >
                            {carouselSlides.map((slide, index) => (
                                <div key={index}>
                                    <div style={{
                                        height: '400px',
                                        background: `linear-gradient(135deg, ${slide.color}40, #00000040), url("/api/placeholder/1200/400")`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        borderRadius: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        textAlign: 'center',
                                        padding: '40px'
                                    }}>
                                        <Space direction="vertical" size="large">
                                            <Title level={1} style={{ color: '#D4AF37', margin: 0 }}>
                                                {slide.title}
                                            </Title>
                                            <Paragraph style={{
                                                color: 'white',
                                                fontSize: '1.2rem',
                                                maxWidth: '600px',
                                                margin: 0
                                            }}>
                                                {slide.description}
                                            </Paragraph>
                                        </Space>
                                    </div>
                                </div>
                            ))}
                        </Carousel>

                        {/* Feature Indicators */}
                        <Row gutter={[16, 16]} justify="center">
                            {carouselSlides.map((_, index) => (
                                <Col key={index}>
                                    <div
                                        style={{
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            background: index === currentSlide ? '#D4AF37' : '#8B0000',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => setCurrentSlide(index)}
                                    />
                                </Col>
                            ))}
                        </Row>

                        {/* Quick Features Grid */}
                        <Row gutter={[32, 32]} style={{ marginTop: '60px' }}>
                            {gameFeatures.map((feature, index) => (
                                <Col xs={24} md={12} key={index}>
                                    <Card
                                        hoverable
                                        style={{
                                            border: '2px solid #D4AF37',
                                            borderRadius: '12px',
                                            background: 'white',
                                            height: '100%'
                                        }}
                                        onClick={() => setIsFeatureDrawerVisible(true)}
                                    >
                                        <Space size="middle" align="start">
                                            <div style={{ color: '#8B0000' }}>
                                                {feature.icon}
                                            </div>
                                            <Space direction="vertical" size="small">
                                                <Title level={4} style={{ color: '#8B0000', margin: 0 }}>
                                                    {feature.title}
                                                </Title>
                                                <Paragraph style={{ margin: 0, color: '#666' }}>
                                                    {feature.description}
                                                </Paragraph>
                                            </Space>
                                        </Space>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </section>

                {/* Call to Action */}
                <section style={{
                    padding: '100px 20px',
                    background: 'linear-gradient(135deg, #8B0000 0%, #003366 100%)',
                    textAlign: 'center'
                }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <Title level={2} style={{ color: '#D4AF37', fontSize: '3rem', marginBottom: '20px' }}>
                            SẴN SÀNG VIẾT NÊN LỊCH SỬ?
                        </Title>
                        <Paragraph style={{ color: 'white', fontSize: '1.2rem', marginBottom: '40px' }}>
                            Tham gia ngay để trở thành một trong những sứ quân hùng mạnh nhất
                            và thay đổi vận mệnh của đất nước Việt Nam!
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
                                Bắt Đầu Ngay
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
                                icon={<Book size={20} />}
                            >
                                Tìm Hiểu Thêm
                            </Button>
                        </Space>
                    </div>
                </section>
            </Content>

            {/* Footer */}
            <Footer style={{
                background: '#003366',
                color: '#D4AF37',
                padding: '40px 20px',
                borderTop: '3px solid #D4AF37'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    <Space direction="vertical" size="large">
                        <Title level={4} style={{ color: '#D4AF37', margin: 0 }}>
                            12 SỨ QUÂN - Game Chiến Thuật Lịch Sử
                        </Title>
                        <Paragraph style={{ color: 'rgba(212, 175, 55, 0.8)', margin: 0 }}>
                            Trải nghiệm lịch sử Việt Nam thế kỷ 10 sống động và chân thực
                        </Paragraph>
                    </Space>

                    <Divider style={{ borderColor: '#D4AF37', margin: '30px 0' }} />

                    <Text style={{ color: 'rgba(212, 175, 55, 0.6)' }}>
                        © 2024 12 Sứ Quân. Tất cả quyền được bảo lưu.
                    </Text>
                </div>
            </Footer>

            {/* Story Modal */}
            <Modal
                title={
                    <Space>
                        <BookOpen />
                        <Text strong>Cốt Truyện 12 Sứ Quân</Text>
                    </Space>
                }
                open={isStoryModalVisible}
                onCancel={() => setIsStoryModalVisible(false)}
                footer={null}
                width={800}
            >
                <Space direction="vertical" size="large">
                    <Paragraph>
                        Sau cái chết của Ngô Quyền năm 944, nhà Ngô suy yếu dần.
                        Đến năm 965, khi Ngô Xương Văn chết, đất nước rơi vào cảnh
                        "Thập nhị sứ quân" - 12 sứ quân cát cứ.
                    </Paragraph>

                    <Paragraph>
                        Mỗi sứ quân chiếm giữ một vùng đất, xây dựng lực lượng quân sự
                        và tranh giành ảnh hưởng. Trong bối cảnh đó, Đinh Bộ Lĩnh nổi
                        lên từ vùng Hoa Lư, bắt đầu sự nghiệp thống nhất đất nước.
                    </Paragraph>

                    <Title level={4}>Bối Cảnh Lịch Sử</Title>
                    <List
                        dataSource={[
                            "Thời kỳ: 944 - 968 sau Công nguyên",
                            "Địa bàn: Toàn lãnh thổ Việt Nam",
                            "Tình hình: Phân tán, cát cứ",
                            "Kết quả: Đinh Bộ Lĩnh thống nhất"
                        ]}
                        renderItem={item => (
                            <List.Item>
                                <Text>• {item}</Text>
                            </List.Item>
                        )}
                    />
                </Space>
            </Modal>

            {/* Features Drawer */}
            <Drawer
                title="Tính Năng Chi Tiết"
                placement="right"
                onClose={() => setIsFeatureDrawerVisible(false)}
                open={isFeatureDrawerVisible}
                width={600}
            >
                <Space direction="vertical" size="large">
                    {gameFeatures.map((feature, index) => (
                        <Card key={index} size="small">
                            <Card.Meta
                                avatar={<div style={{ color: '#8B0000' }}>{feature.icon}</div>}
                                title={feature.title}
                                description={
                                    <Space direction="vertical">
                                        <Text>{feature.description}</Text>
                                        <List
                                            size="small"
                                            dataSource={feature.details}
                                            renderItem={detail => (
                                                <List.Item>
                                                    <Text>• {detail}</Text>
                                                </List.Item>
                                            )}
                                        />
                                    </Space>
                                }
                            />
                        </Card>
                    ))}
                </Space>
            </Drawer>
        </Layout>
    );
};

export default IntroductionPage;
