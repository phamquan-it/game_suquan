"use client"
// pages/story-page.tsx
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
    Progress,
    Steps,
    Collapse,
    Modal,
    Breadcrumb
} from 'antd';
import {
    Crown,
    BookOpen,
    Map,
    Users,
    Play,
    Share2,
    Bookmark,
    Quote,
    Award,
    Compass,
    Clock,
    ChevronRight,
    Home
} from 'lucide-react';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { Step } = Steps;
const { Header, Footer, Content } = Layout;

const StoryPage = () => {
    const [selectedChapter, setSelectedChapter] = useState(0);
    const [isCharacterModalVisible, setIsCharacterModalVisible] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState<any>(null);

    const storyChapters = [
        {
            id: 1,
            title: "Buổi Hoàng Hôn Của Nhà Ngô",
            period: "Năm 944",
            duration: "944 - 950",
            status: "completed",
            image: "/api/placeholder/800/400",
            content: {
                introduction: "Sau cái chết của Ngô Quyền, người kế vị không đủ sức giữ vững đất nước. Quyền lực trung ương suy yếu, các thế lực địa phương bắt đầu trỗi dậy.",
                mainEvents: [
                    "Ngô Quyền qua đời, để lại ngôi cho con trai",
                    "Các tướng lĩnh địa phương bắt đầu củng cố lực lượng",
                    "Triều đình trung ương mất dần ảnh hưởng",
                    "Những dấu hiệu đầu tiên của phân liệt xuất hiện"
                ],
                keyCharacters: ["Ngô Xương Ngập", "Ngô Xương Văn", "Dương Tam Kha"],
                significance: "Mở đầu cho thời kỳ loạn lạc, đánh dấu sự sụp đổ của chính quyền trung ương"
            }
        },
        {
            id: 2,
            title: "Sự Trỗi Dậy Của 12 Sứ Quân",
            period: "Năm 965",
            duration: "951 - 965",
            status: "completed",
            image: "/api/placeholder/800/400",
            content: {
                introduction: "Đất nước chính thức bị chia cắt thành 12 vùng do 12 thủ lĩnh hùng mạnh kiểm soát. Mỗi sứ quân xây dựng lực lượng và tranh giành ảnh hưởng.",
                mainEvents: [
                    "12 thế lực lớn hình thành và củng cố quyền lực",
                    "Xây dựng thành trì kiên cố tại các vị trí chiến lược",
                    "Phát triển quân đội và kinh tế địa phương",
                    "Bắt đầu các cuộc xung đột nhỏ để mở rộng lãnh thổ"
                ],
                keyCharacters: ["Ngô Xương Xí", "Đỗ Cảnh Thạc", "Kiều Công Hãn", "Nguyễn Khoan"],
                significance: "Giai đoạn cát cứ chính thức, hình thành cục diện 12 sứ quân"
            }
        },
        {
            id: 3,
            title: "Cuộc Chiến Tranh Giành Quyền Lực",
            period: "Năm 966",
            duration: "966 - 967",
            status: "current",
            image: "/api/placeholder/800/400",
            content: {
                introduction: "Các sứ quân bắt đầu những cuộc chiến tranh quy mô lớn để mở rộng lãnh thổ và ảnh hưởng. Liên minh được hình thành và tan vỡ.",
                mainEvents: [
                    "Các trận chiến lớn nổ ra giữa các sứ quân",
                    "Hình thành và tan vỡ các liên minh quân sự",
                    "Đinh Bộ Lĩnh bắt đầu nổi lên từ Hoa Lư",
                    "Sự can thiệp của các thế lực bên ngoài"
                ],
                keyCharacters: ["Đinh Bộ Lĩnh", "Lê Hoàn", "Các sứ quân"],
                significance: "Giai đoạn chiến tranh ác liệt, làm suy yếu lẫn nhau giữa các sứ quân"
            }
        },
        {
            id: 4,
            title: "Sự Thống Nhất Của Đinh Bộ Lĩnh",
            period: "Năm 968",
            duration: "968",
            status: "upcoming",
            image: "/api/placeholder/800/400",
            content: {
                introduction: "Đinh Bộ Lĩnh, với tài năng quân sự và chính trị, lần lượt đánh bại các sứ quân, thống nhất đất nước và lập ra nhà Đinh.",
                mainEvents: [
                    "Đinh Bộ Lĩnh đánh bại các sứ quân một cách có hệ thống",
                    "Thành lập triều đình trung ương tại Hoa Lư",
                    "Lên ngôi Hoàng đế, hiệu là Đinh Tiên Hoàng",
                    "Đặt tên nước là Đại Cồ Việt"
                ],
                keyCharacters: ["Đinh Bộ Lĩnh", "Đinh Liễn", "Các tướng lĩnh nhà Đinh"],
                significance: "Kết thúc thời kỳ 12 sứ quân, mở ra kỷ nguyên mới cho đất nước"
            }
        }
    ];

    const mainCharacters = [
        {
            id: 1,
            name: "Ngô Xương Xí",
            title: "Sứ quân Bình Kiều",
            allegiance: "Nhà Ngô",
            status: "Trung thành với di sản",
            power: 95,
            intelligence: 88,
            charisma: 82,
            description: "Con trai Ngô Xương Ngập, kế thừa sự nghiệp của triều Ngô. Là biểu tượng cho sự chính thống và truyền thống.",
            story: "Là hậu duệ trực tiếp của Ngô Quyền, ông cố gắng duy trì di sản của tổ tiên trong buổi loạn lạc.",
            color: "#8B0000",
            image: "/api/placeholder/200/200"
        },
        {
            id: 2,
            name: "Đỗ Cảnh Thạc",
            title: "Sứ quân Đỗ Động",
            allegiance: "Tự lập",
            status: "Chiến lược gia",
            power: 92,
            intelligence: 85,
            charisma: 78,
            description: "Tướng cũ của Dương Đình Nghệ, có tài thao lược và kinh nghiệm chiến trường dày dặn.",
            story: "Từng phục vụ dưới trướng Dương Đình Nghệ, ông sử dụng kinh nghiệm quân sự để xây dựng lực lượng.",
            color: "#D4AF37",
            image: "/api/placeholder/200/200"
        },
        {
            id: 3,
            name: "Kiều Công Hãn",
            title: "Sứ quân Phong Châu",
            allegiance: "Liên minh",
            status: "Nhà ngoại giao",
            power: 89,
            intelligence: 90,
            charisma: 88,
            description: "Người có học thức, giỏi về chính trị và ngoại giao, thường tìm kiếm giải pháp hòa bình.",
            story: "Xuất thân từ dòng họ có truyền thống văn hóa, ông tin vào sức mạnh của liên minh và thương lượng.",
            color: "#003366",
            image: "/api/placeholder/200/200"
        },
        {
            id: 4,
            name: "Đinh Bộ Lĩnh",
            title: "Người Thống Nhất",
            allegiance: "Nhà Đinh",
            status: "Nhà cải cách",
            power: 98,
            intelligence: 92,
            charisma: 95,
            description: "Người đã thống nhất đất nước sau thời kỳ loạn lạc, lập ra nhà Đinh và nước Đại Cồ Việt.",
            story: "Xuất thân từ vùng Hoa Lư, với tài năng quân sự thiên bẩm và tầm nhìn chính trị sắc bén.",
            color: "#2E8B57",
            image: "/api/placeholder/200/200"
        }
    ];

    const historicalLocations = [
        {
            name: "Thành Bình Kiều",
            ruler: "Ngô Xương Xí",
            significance: "Trung tâm quyền lực cuối cùng của nhà Ngô",
            description: "Thành trì kiên cố bảo vệ di sản triều Ngô",
            status: "Phòng thủ"
        },
        {
            name: "Đỗ Động Giang",
            ruler: "Đỗ Cảnh Thạc",
            significance: "Căn cứ quân sự chiến lược",
            description: "Vị trí then chốt kiểm soát giao thương",
            status: "Tấn công"
        },
        {
            name: "Phong Châu",
            ruler: "Kiều Công Hãn",
            significance: "Trung tâm văn hóa và ngoại giao",
            description: "Nơi giao thoa của các nền văn hóa",
            status: "Trung lập"
        },
        {
            name: "Hoa Lư",
            ruler: "Đinh Bộ Lĩnh",
            significance: "Kinh đô của nước Đại Cồ Việt",
            description: "Thủ đô đầu tiên của nhà nước phong kiến độc lập",
            status: "Thống nhất"
        }
    ];

    const openCharacterModal = (character: any) => {
        setSelectedCharacter(character);
        setIsCharacterModalVisible(true);
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
                            <BookOpen size={20} color="#FFFFFF" />
                        </div>
                        <Title level={3} style={{
                            margin: 0,
                            color: '#D4AF37',
                            background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 'bold'
                        }}>
                            CỐT TRUYỆN 12 SỨ QUÂN
                        </Title>
                    </div>

                    <Space>
                        <Button type="link" style={{ color: '#D4AF37', fontWeight: '600' }}>Tổng Quan</Button>
                        <Button type="link" style={{ color: '#D4AF37', fontWeight: '600' }}>Chương</Button>
                        <Button type="link" style={{ color: '#D4AF37', fontWeight: '600' }}>Nhân Vật</Button>
                        <Button type="link" style={{ color: '#D4AF37', fontWeight: '600' }}>Bản Đồ</Button>
                    </Space>
                </div>
            </Header>

            <Content style={{ padding: '40px 20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {/* Breadcrumb */}
                    <Breadcrumb
                        style={{ marginBottom: '32px' }}
                        items={[
                            {
                                title: (
                                    <Space>
                                        <Home size={16} />
                                        <span>Trang Chủ</span>
                                    </Space>
                                ),
                            },
                            {
                                title: 'Cốt Truyện',
                            },
                            {
                                title: 'Tổng Quan',
                            },
                        ]}
                    />

                    {/* Hero Section */}
                    <Card
                        style={{
                            background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.9), rgba(0, 51, 102, 0.9))',
                            border: '3px solid #D4AF37',
                            borderRadius: '20px',
                            marginBottom: '40px',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <Row gutter={[32, 32]} align="middle">
                            <Col xs={24} lg={14}>
                                <Space direction="vertical" size="large">
                                    <div>
                                        <Tag color="gold" style={{ color: '#8B0000', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
                                            LỊCH SỬ VIỆT NAM THẾ KỶ 10
                                        </Tag>
                                        <Title level={1} style={{ color: '#D4AF37', margin: 0, fontSize: '3rem' }}>
                                            Thời Kỳ 12 Sứ Quân
                                        </Title>
                                    </div>

                                    <Paragraph style={{
                                        color: 'white',
                                        fontSize: '1.2rem',
                                        lineHeight: '1.6'
                                    }}>
                                        Bước vào giai đoạn lịch sử đầy biến động khi đất nước Việt bị chia cắt
                                        thành 12 vùng do các thủ lĩnh địa phương cai quản. Trải qua những cuộc
                                        chiến tranh, liên minh và phản bội, cuối cùng được thống nhất dưới
                                        bàn tay tài ba của Đinh Bộ Lĩnh.
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
                                            Bắt Đầu Đọc
                                        </Button>
                                        <Button
                                            icon={<Bookmark size={16} />}
                                            style={{
                                                background: 'rgba(212, 175, 55, 0.2)',
                                                border: '1px solid #D4AF37',
                                                color: '#D4AF37'
                                            }}
                                        >
                                            Đánh Dấu
                                        </Button>
                                    </Space>
                                </Space>
                            </Col>

                            <Col xs={24} lg={10}>
                                <div style={{
                                    background: 'rgba(212, 175, 55, 0.1)',
                                    border: '2px solid #D4AF37',
                                    borderRadius: '12px',
                                    padding: '24px',
                                    textAlign: 'center'
                                }}>
                                    <Title level={4} style={{ color: '#D4AF37', marginBottom: '16px' }}>
                                        <Clock style={{ marginRight: '8px' }} />
                                        Thông Tin Thời Kỳ
                                    </Title>
                                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                        <div>
                                            <Text strong style={{ color: '#D4AF37' }}>Thời gian: </Text>
                                            <Text style={{ color: 'white' }}>944 - 968 SCN</Text>
                                        </div>
                                        <div>
                                            <Text strong style={{ color: '#D4AF37' }}>Nhân vật chính: </Text>
                                            <Text style={{ color: 'white' }}>12 Sứ quân & Đinh Bộ Lĩnh</Text>
                                        </div>
                                        <div>
                                            <Text strong style={{ color: '#D4AF37' }}>Kết quả: </Text>
                                            <Text style={{ color: 'white' }}>Thống nhất đất nước</Text>
                                        </div>
                                        <div>
                                            <Text strong style={{ color: '#D4AF37' }}>Ý nghĩa: </Text>
                                            <Text style={{ color: 'white' }}>Mở ra kỷ nguyên độc lập</Text>
                                        </div>
                                    </Space>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    {/* Main Content */}
                    <Row gutter={[32, 32]}>
                        {/* Story Chapters */}
                        <Col xs={24} lg={16}>
                            <Card
                                title={
                                    <Space>
                                        <BookOpen style={{ color: '#8B0000' }} />
                                        <Text strong>Diễn Biến Cốt Truyện</Text>
                                    </Space>
                                }
                                style={{ border: '2px solid #D4AF37', borderRadius: '15px' }}
                                extra={
                                    <Button type="link" icon={<Share2 />} style={{ color: '#8B0000' }}>
                                        Chia sẻ
                                    </Button>
                                }
                            >
                                <Steps
                                    current={selectedChapter}
                                    onChange={setSelectedChapter}
                                    direction="vertical"
                                    size="small"
                                    items={storyChapters.map((chapter, index) => ({
                                        title: (
                                            <Space>
                                                <Text strong style={{ color: '#8B0000' }}>{chapter.title}</Text>
                                                <Tag color={chapter.status === 'completed' ? 'green' : chapter.status === 'current' ? 'orange' : 'blue'}>
                                                    {chapter.period}
                                                </Tag>
                                            </Space>
                                        ),
                                        description: (
                                            <Space direction="vertical" size="small" style={{ marginTop: '8px' }}>
                                                <Text type="secondary">{chapter.duration}</Text>
                                                <Paragraph
                                                    ellipsis={{
                                                        rows: 2,
                                                        expandable: true,
                                                        symbol: 'Xem thêm'
                                                    }}
                                                    style={{ margin: 0 }}
                                                >
                                                    {chapter.content.introduction}
                                                </Paragraph>

                                                <Button
                                                    type="link"
                                                    size="small"
                                                    icon={<ChevronRight size={14} />}
                                                    style={{ padding: 0, color: '#8B0000', fontWeight: '600' }}
                                                >
                                                    Đọc chi tiết
                                                </Button>
                                            </Space>
                                        ),
                                        icon: chapter.status === 'completed' ?
                                            <Award style={{ color: '#52c41a' }} /> :
                                            chapter.status === 'current' ?
                                                <Play style={{ color: '#fa8c16' }} /> :
                                                <Clock style={{ color: '#1890ff' }} />
                                    }))}
                                />
                            </Card>

                            {/* Selected Chapter Detail */}
                            {storyChapters[selectedChapter] && (
                                <Card
                                    style={{
                                        border: '2px solid #D4AF37',
                                        borderRadius: '15px',
                                        marginTop: '24px'
                                    }}
                                >
                                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                        <div>
                                            <Tag color="gold" style={{ color: '#8B0000', fontSize: '12px', fontWeight: 'bold' }}>
                                                {storyChapters[selectedChapter].duration}
                                            </Tag>
                                            <Title level={3} style={{ color: '#8B0000', margin: '8px 0' }}>
                                                {storyChapters[selectedChapter].title}
                                            </Title>
                                        </div>

                                        <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
                                            {storyChapters[selectedChapter].content.introduction}
                                        </Paragraph>

                                        <Row gutter={[16, 16]}>
                                            <Col xs={24} md={12}>
                                                <Card
                                                    size="small"
                                                    title="Sự Kiện Chính"
                                                    style={{ border: '1px solid #D4AF37' }}
                                                >
                                                    <List
                                                        size="small"
                                                        dataSource={storyChapters[selectedChapter].content.mainEvents}
                                                        renderItem={(event, index) => (
                                                            <List.Item>
                                                                <Space>
                                                                    <div style={{
                                                                        width: '20px',
                                                                        height: '20px',
                                                                        background: '#8B0000',
                                                                        borderRadius: '50%',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        color: 'white',
                                                                        fontSize: '12px',
                                                                        fontWeight: 'bold'
                                                                    }}>
                                                                        {index + 1}
                                                                    </div>
                                                                    <Text>{event}</Text>
                                                                </Space>
                                                            </List.Item>
                                                        )}
                                                    />
                                                </Card>
                                            </Col>

                                            <Col xs={24} md={12}>
                                                <Card
                                                    size="small"
                                                    title="Nhân Vật Then Chốt"
                                                    style={{ border: '1px solid #D4AF37' }}
                                                >
                                                    <Space direction="vertical" style={{ width: '100%' }}>
                                                        {storyChapters[selectedChapter].content.keyCharacters.map((character, index) => (
                                                            <Tag
                                                                key={index}
                                                                color="#8B0000"
                                                                style={{
                                                                    color: 'white',
                                                                    padding: '4px 8px',
                                                                    cursor: 'pointer'
                                                                }}
                                                                onClick={() => {
                                                                    const char = mainCharacters.find(c => c.name === character);
                                                                    if (char) openCharacterModal(char);
                                                                }}
                                                            >
                                                                {character}
                                                            </Tag>
                                                        ))}
                                                    </Space>
                                                </Card>
                                            </Col>
                                        </Row>

                                        <Card
                                            size="small"
                                            style={{
                                                background: 'rgba(212, 175, 55, 0.1)',
                                                border: '1px solid #D4AF37'
                                            }}
                                        >
                                            <Space>
                                                <Quote style={{ color: '#8B0000' }} />
                                                <Text strong style={{ color: '#8B0000' }}>Ý nghĩa lịch sử: </Text>
                                                <Text>{storyChapters[selectedChapter].content.significance}</Text>
                                            </Space>
                                        </Card>
                                    </Space>
                                </Card>
                            )}
                        </Col>

                        {/* Sidebar */}
                        <Col xs={24} lg={8}>
                            {/* Main Characters */}
                            <Card
                                title={
                                    <Space>
                                        <Users style={{ color: '#8B0000' }} />
                                        <Text strong>Nhân Vật Chính</Text>
                                    </Space>
                                }
                                style={{ border: '2px solid #D4AF37', borderRadius: '15px', marginBottom: '24px' }}
                            >
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    {mainCharacters.map((character) => (
                                        <Card
                                            key={character.id}
                                            size="small"
                                            hoverable
                                            style={{
                                                border: `1px solid ${character.color}`,
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => openCharacterModal(character)}
                                        >
                                            <Space>
                                                <Avatar
                                                    size={40}
                                                    style={{ background: character.color }}
                                                    icon={<Crown size={16} />}
                                                />
                                                <Space direction="vertical" size={0}>
                                                    <Text strong style={{ color: character.color }}>
                                                        {character.name}
                                                    </Text>
                                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                                        {character.title}
                                                    </Text>
                                                </Space>
                                            </Space>
                                        </Card>
                                    ))}
                                </Space>
                            </Card>

                            {/* Historical Locations */}
                            <Card
                                title={
                                    <Space>
                                        <Map style={{ color: '#8B0000' }} />
                                        <Text strong>Địa Điểm Lịch Sử</Text>
                                    </Space>
                                }
                                style={{ border: '2px solid #D4AF37', borderRadius: '15px' }}
                            >
                                <List
                                    size="small"
                                    dataSource={historicalLocations}
                                    renderItem={(location) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<Compass style={{ color: '#8B0000' }} />}
                                                title={
                                                    <Text strong style={{ color: '#8B0000' }}>
                                                        {location.name}
                                                    </Text>
                                                }
                                                description={
                                                    <Space direction="vertical" size={0}>
                                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                                            Chủ nhân: {location.ruler}
                                                        </Text>
                                                        <Text style={{ fontSize: '12px' }}>
                                                            {location.description}
                                                        </Text>
                                                        <Tag
                                                            color={
                                                                location.status === 'Phòng thủ' ? 'blue' :
                                                                    location.status === 'Tấn công' ? 'red' :
                                                                        location.status === 'Trung lập' ? 'green' : 'purple'
                                                            }

                                                        >
                                                            {location.status}
                                                        </Tag>
                                                    </Space>
                                                }
                                            />
                                        </List.Item>
                                    )}
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
                            12 SỨ QUÂN - HÀNH TRÌNH LỊCH SỬ
                        </Title>
                        <Paragraph style={{ color: 'rgba(212, 175, 55, 0.8)', margin: 0 }}>
                            Khám phá câu chuyện đầy kịch tính về thời kỳ phân tranh và thống nhất đất nước
                        </Paragraph>
                    </Space>

                    <Divider style={{ borderColor: '#D4AF37', margin: '30px 0' }} />

                    <Text style={{ color: 'rgba(212, 175, 55, 0.6)' }}>
                        © 2024 12 Sứ Quân. Tất cả quyền được bảo lưu.
                    </Text>
                </div>
            </Footer>

            {/* Character Detail Modal */}
            <Modal
                title={selectedCharacter ? `Hồ Sơ: ${selectedCharacter.name}` : ''}
                open={isCharacterModalVisible}
                onCancel={() => setIsCharacterModalVisible(false)}
                footer={null}
                width={700}
            >
                {selectedCharacter && (
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Row gutter={[24, 24]}>
                            <Col xs={24} md={8}>
                                <div style={{ textAlign: 'center' }}>
                                    <Avatar
                                        size={120}
                                        style={{
                                            background: selectedCharacter.color,
                                            border: '3px solid #D4AF37',
                                            marginBottom: '16px'
                                        }}
                                        icon={<Crown size={32} />}
                                    />
                                    <Title level={3} style={{ color: selectedCharacter.color, margin: '8px 0' }}>
                                        {selectedCharacter.name}
                                    </Title>
                                    <Tag color="gold" style={{ color: '#8B0000', fontWeight: 'bold' }}>
                                        {selectedCharacter.title}
                                    </Tag>
                                </div>
                            </Col>

                            <Col xs={24} md={16}>
                                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                    <div>
                                        <Text strong>Trạng thái: </Text>
                                        <Tag color={selectedCharacter.allegiance === 'Nhà Ngô' ? 'blue' :
                                            selectedCharacter.allegiance === 'Nhà Đinh' ? 'green' : 'orange'}>
                                            {selectedCharacter.status}
                                        </Tag>
                                    </div>

                                    <div>
                                        <Text strong>Lòng trung thành: </Text>
                                        <Text>{selectedCharacter.allegiance}</Text>
                                    </div>

                                    <Paragraph>
                                        {selectedCharacter.description}
                                    </Paragraph>

                                    <Paragraph style={{ fontStyle: 'italic', color: '#666' }}>
                                        {selectedCharacter.story}
                                    </Paragraph>
                                </Space>
                            </Col>
                        </Row>

                        <Divider />

                        <Title level={5}>Chỉ Số Năng Lực</Title>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div>
                                <Text strong>Sức mạnh: </Text>
                                <Progress
                                    percent={selectedCharacter.power}
                                    strokeColor={selectedCharacter.color}
                                    showInfo
                                />
                            </div>
                            <div>
                                <Text strong>Trí tuệ: </Text>
                                <Progress
                                    percent={selectedCharacter.intelligence}
                                    strokeColor="#52c41a"
                                    showInfo
                                />
                            </div>
                            <div>
                                <Text strong>Uy tín: </Text>
                                <Progress
                                    percent={selectedCharacter.charisma}
                                    strokeColor="#1890ff"
                                    showInfo
                                />
                            </div>
                        </Space>
                    </Space>
                )}
            </Modal>
        </Layout>
    );
};

export default StoryPage;
