"use client"
// pages/news-page.tsx
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
    Input,
    Select,
    Badge,
    Timeline,
    Pagination,
    Carousel,
    Modal,
    Image,
    Grid
} from 'antd';
import {
    Crown,
    Calendar,
    User,
    Eye,
    Heart,
    MessageCircle,
    Share2,
    Bookmark,
    Search,
    Filter,
    TrendingUp,
    Clock,
    Award,
    Sword,
    Castle,
    Users,
    Trophy,
    Zap,
    Play,
    ArrowRight,
    BookOpen,
    Star
} from 'lucide-react';

const { Title, Paragraph, Text } = Typography;
const { Search: AntSearch } = Input;
const { Option } = Select;
const { useBreakpoint } = Grid;
const { Header, Footer, Content } = Layout;

const NewsPage = () => {
    const screens = useBreakpoint();
    const [selectedNews, setSelectedNews] = useState<any>(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchText, setSearchText] = useState('');

    const newsCategories = [
        { key: 'all', name: 'Tất Cả', color: '#8B0000', icon: <Crown size={14} /> },
        { key: 'update', name: 'Cập Nhật', color: '#D4AF37', icon: <Zap size={14} /> },
        { key: 'event', name: 'Sự Kiện', color: '#003366', icon: <Calendar size={14} /> },
        { key: 'tournament', name: 'Giải Đấu', color: '#2E8B57', icon: <Trophy size={14} /> },
        { key: 'guide', name: 'Hướng Dẫn', color: '#CD7F32', icon: <BookOpen size={14} /> },
        { key: 'community', name: 'Cộng Đồng', color: '#9370DB', icon: <Users size={14} /> }
    ];

    const featuredNews = [
        {
            id: 1,
            title: "Ra Mắt Tính Năng Liên Minh Mới - Hợp Sức Chiến Đấu",
            summary: "Khám phá hệ thống liên minh hoàn toàn mới cho phép các sứ quân hợp tác chiến đấu và chia sẻ tài nguyên",
            category: 'update',
            author: "Đội Ngũ Phát Triển",
            date: "2024-01-20",
            readTime: "5 phút",
            views: 12500,
            likes: 3200,
            comments: 456,
            image: "/api/placeholder/800/400",
            featured: true,
            tags: ['Update', 'Liên Minh', 'Tính Năng Mới'],
            content: `
        <p>Chào mừng các sứ quân đến với bản cập nhật lớn nhất trong lịch sử 12 Sứ Quân! Chúng tôi tự hào giới thiệu hệ thống Liên Minh hoàn toàn mới, cho phép các thủ lĩnh hợp tác chiến đấu và xây dựng đế chế hùng mạnh.</p>
        
        <h3>Điểm Nổi Bật:</h3>
        <ul>
          <li><strong>Thành Lập Liên Minh:</strong> Tập hợp tối đa 10 sứ quân cùng chiến đấu</li>
          <li><strong>Công Thành Liên Minh:</strong> Phối hợp tấn công các thành trì lớn</li>
          <li><strong>Chia Sẻ Tài Nguyên:</strong> Hỗ trợ lẫn nhau trong phát triển</li>
          <li><strong>Bảng Xếp Hạng Liên Minh:</strong> Cạnh tranh vị trí cao nhất</li>
        </ul>
        
        <p>Hệ thống liên minh mở ra chiến lược hoàn toàn mới, nơi ngoại giao và hợp tác quan trọng không kém sức mạnh quân sự.</p>
      `
        },
        {
            id: 2,
            title: "Giải Đấu Mùa Xuân 2024 - Tranh Quyền Thống Nhất",
            summary: "Giải đấu thường niên với tổng giải thưởng lên đến 500,000,000 VND dành cho các sứ quân xuất sắc nhất",
            category: 'tournament',
            author: "Ban Tổ Chức",
            date: "2024-01-18",
            readTime: "4 phút",
            views: 8900,
            likes: 2100,
            comments: 289,
            image: "/api/placeholder/800/400",
            featured: true,
            tags: ['Giải Đấu', 'Mùa Xuân', 'Thưởng Lớn'],
            content: `
        <p>Giải Đấu Mùa Xuân 2024 chính thức khởi tranh với quy mô lớn chưa từng có. Đây là cơ hội để các sứ quân chứng tỏ tài năng và giành lấy vinh quang tối thượng.</p>
        
        <h3>Thông Tin Giải Đấu:</h3>
        <ul>
          <li><strong>Thời Gian:</strong> 01/02/2024 - 30/03/2024</li>
          <li><strong>Tổng Giải Thưởng:</strong> 500,000,000 VND</li>
          <li><strong>Thể Thức:</strong> Đấu trường loại trực tiếp</li>
          <li><strong>Điều Kiện:</strong> Cấp 30 trở lên</li>
        </ul>
        
        <p>Hãy chuẩn bị cho cuộc chiến cam go nhất và viết nên lịch sử của riêng bạn!</p>
      `
        }
    ];

    const newsList = [
        {
            id: 3,
            title: "Cân Bằng Chiến Thuật Tháng 1 - Tối Ưu Sức Mạnh Quân Đội",
            summary: "Điều chỉnh sức mạnh các đơn vị quân và chiến thuật để đảm bảo công bằng trong chiến đấu",
            category: 'update',
            author: "Game Master",
            date: "2024-01-15",
            readTime: "3 phút",
            views: 6700,
            likes: 1500,
            comments: 234,
            image: "/api/placeholder/400/250",
            tags: ['Cân Bằng', 'Update', 'Chiến Thuật']
        },
        {
            id: 4,
            title: "Sự Kiện Tết Giáp Thìn - Lì Xì May Mắn",
            summary: "Chuỗi sự kiện đặc biệt chào đón năm mới với quà tặng giá trị và hoạt động độc đáo",
            category: 'event',
            author: "Sự Kiện",
            date: "2024-01-12",
            readTime: "2 phút",
            views: 12300,
            likes: 3400,
            comments: 567,
            image: "/api/placeholder/400/250",
            tags: ['Tết', 'Sự Kiện', 'Quà Tặng']
        },
        {
            id: 5,
            title: "Hướng Dẫn Tân Thủ: Chiến Thuật Xây Dựng Thành Trì Hiệu Quả",
            summary: "Bí kíp xây dựng và phòng thủ thành trì từ những bậc thầy chiến thuật",
            category: 'guide',
            author: "Chiến Thuật Gia",
            date: "2024-01-10",
            readTime: "6 phút",
            views: 8900,
            likes: 2100,
            comments: 189,
            image: "/api/placeholder/400/250",
            tags: ['Hướng Dẫn', 'Tân Thủ', 'Thành Trì']
        },
        {
            id: 6,
            title: "Top 10 Sứ Quân Mạnh Nhất Tháng 12/2023",
            summary: "Vinh danh những sứ quân xuất sắc nhất với thành tích chiến đấu ấn tượng",
            category: 'community',
            author: "Cộng Đồng",
            date: "2024-01-08",
            readTime: "4 phút",
            views: 15600,
            likes: 4200,
            comments: 678,
            image: "/api/placeholder/400/250",
            tags: ['Top', 'Xếp Hạng', 'Cộng Đồng']
        },
        {
            id: 7,
            title: "Bảo Trì Hệ Thống - Nâng Cấp Tính Năng Bảo Mật",
            summary: "Thông báo lịch bảo trì định kỳ và nâng cấp hệ thống bảo mật toàn diện",
            category: 'update',
            author: "Kỹ Thuật",
            date: "2024-01-05",
            readTime: "2 phút",
            views: 4500,
            likes: 890,
            comments: 123,
            image: "/api/placeholder/400/250",
            tags: ['Bảo Trì', 'Bảo Mật', 'Thông Báo']
        },
        {
            id: 8,
            title: "Cuộc Thi Thiết Kế Trang Phục - Tỏa Sáng Phong Cách",
            summary: "Cơ hội để người chơi thiết kế trang phục mới và nhận phần thưởng hấp dẫn",
            category: 'community',
            author: "Sáng Tạo",
            date: "2024-01-03",
            readTime: "3 phút",
            views: 7800,
            likes: 1900,
            comments: 256,
            image: "/api/placeholder/400/250",
            tags: ['Thiết Kế', 'Cuộc Thi', 'Cộng Đồng']
        }
    ];

    const trendingTags = [
        { name: 'Update Mới', count: 156, color: '#8B0000' },
        { name: 'Giải Đấu', count: 142, color: '#D4AF37' },
        { name: 'Tết 2024', count: 128, color: '#003366' },
        { name: 'Cân Bằng', count: 115, color: '#2E8B57' },
        { name: 'Liên Minh', count: 98, color: '#CD7F32' },
        { name: 'Chiến Thuật', count: 87, color: '#9370DB' }
    ];

    const filteredNews = newsList.filter(news => {
        const matchesSearch = news.title.toLowerCase().includes(searchText.toLowerCase()) ||
            news.summary.toLowerCase().includes(searchText.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const openNewsDetail = (news: any) => {
        setSelectedNews(news);
        setIsDetailModalVisible(true);
    };

    const NewsCard = ({ news, featured = false }: { news: any, featured?: boolean }) => (
        <Card
            hoverable
            style={{
                border: '2px solid #D4AF37',
                borderRadius: '12px',
                background: 'white',
                height: featured ? '100%' : 'auto',
                position: 'relative'
            }}
            bodyStyle={{ padding: featured ? '24px' : '16px' }}
            onClick={() => openNewsDetail(news)}
        >
            {news.featured && (
                <Badge.Ribbon
                    text="NỔI BẬT"
                    color="#D4AF37"
                    style={{ color: '#8B0000', fontWeight: 'bold' }}
                >
                    <div></div>
                </Badge.Ribbon>
            )}

            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {/* Thumbnail */}
                <div style={{
                    height: featured ? '200px' : '160px',
                    background: `linear-gradient(135deg, rgba(139, 0, 0, 0.3), rgba(0, 51, 102, 0.3)), url("${news.image}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '8px',
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px'
                    }}>
                        <Tag
                            color={newsCategories.find(cat => cat.key === news.category)?.color}
                            style={{
                                color: 'white',
                                fontWeight: 'bold',
                                margin: 0
                            }}
                        >
                            {newsCategories.find(cat => cat.key === news.category)?.icon}
                            <span style={{ marginLeft: '4px' }}>
                                {newsCategories.find(cat => cat.key === news.category)?.name}
                            </span>
                        </Tag>
                    </div>
                </div>

                {/* Content */}
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                    <Title
                        level={featured ? 3 : 5}
                        style={{
                            color: '#8B0000',
                            margin: 0,
                            lineHeight: 1.3,
                            height: featured ? 'auto' : '64px',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        }}
                    >
                        {news.title}
                    </Title>

                    <Paragraph
                        style={{
                            margin: 0,
                            color: '#666',
                            lineHeight: 1.5,
                            height: featured ? 'auto' : '60px',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical'
                        }}
                    >
                        {news.summary}
                    </Paragraph>

                    {/* Meta Information */}
                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                            <Space size="small">
                                <User size={12} style={{ color: '#8B4513' }} />
                                <Text type="secondary" style={{ fontSize: '12px' }}>{news.author}</Text>
                            </Space>
                            <Space size="small">
                                <Calendar size={12} style={{ color: '#8B4513' }} />
                                <Text type="secondary" style={{ fontSize: '12px' }}>{news.date}</Text>
                            </Space>
                        </Space>

                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                            <Space size="small">
                                <Clock size={12} style={{ color: '#8B4513' }} />
                                <Text type="secondary" style={{ fontSize: '12px' }}>{news.readTime}</Text>
                            </Space>
                            <Space size="large">
                                <Space size="small">
                                    <Eye size={12} style={{ color: '#8B4513' }} />
                                    <Text type="secondary" style={{ fontSize: '12px' }}>{news.views}</Text>
                                </Space>
                                <Space size="small">
                                    <Heart size={12} style={{ color: '#8B4513' }} />
                                    <Text type="secondary" style={{ fontSize: '12px' }}>{news.likes}</Text>
                                </Space>
                            </Space>
                        </Space>
                    </Space>

                    {/* Tags */}
                    <Space wrap size={[4, 4]} style={{ marginTop: '8px' }}>
                        {news.tags.map((tag: string, index: number) => (
                            <Tag
                                key={index}
                                color="#8B0000" // imperialRed - cho tin quan trọng, cập nhật
                                style={{
                                    fontSize: '10px',
                                    padding: '2px 6px',
                                    margin: 0,
                                    color: 'white',
                                    fontWeight: 'bold',
                                    border: '1px solid #D4AF37'
                                }}
                            >
                                {tag}
                            </Tag>
                        ))}
                    </Space>
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
                            TIN TỨC & SỰ KIỆN
                        </Title>
                    </div>

                    <Space>
                        <Button type="link" style={{ color: '#D4AF37', fontWeight: '600' }}>Tin Mới</Button>
                        <Button type="link" style={{ color: '#D4AF37', fontWeight: '600' }}>Sự Kiện</Button>
                        <Button type="link" style={{ color: '#D4AF37', fontWeight: '600' }}>Thông Báo</Button>
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
                                            CẬP NHẬT MỚI NHẤT
                                        </Tag>
                                        <Title level={1} style={{ color: '#D4AF37', margin: 0, fontSize: '3rem' }}>
                                            Tin Tức 12 Sứ Quân
                                        </Title>
                                    </div>

                                    <Paragraph style={{
                                        color: 'white',
                                        fontSize: '1.1rem',
                                        lineHeight: '1.6'
                                    }}>
                                        Cập nhật những tin tức mới nhất, sự kiện đặc biệt và hướng dẫn chiến thuật
                                        từ đội ngũ phát triển. Không bỏ lỡ bất kỳ thông tin quan trọng nào!
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
                                            Xem Video Mới Nhất
                                        </Button>
                                        <Button
                                            icon={<Bookmark size={16} />}
                                            style={{
                                                background: 'rgba(212, 175, 55, 0.2)',
                                                border: '1px solid #D4AF37',
                                                color: '#D4AF37'
                                            }}
                                        >
                                            Theo Dõi Tin Tức
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
                                        <TrendingUp style={{ marginRight: '8px' }} />
                                        Đang Thịnh Hành
                                    </Title>
                                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                        {trendingTags.slice(0, 4).map((tag, index) => (
                                            <div key={index} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '8px 12px',
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease'
                                            }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                                }}>
                                                <Space>
                                                    <div style={{
                                                        width: '8px',
                                                        height: '8px',
                                                        background: tag.color,
                                                        borderRadius: '50%'
                                                    }} />
                                                    <Text style={{ color: 'white', fontSize: '12px' }}>{tag.name}</Text>
                                                </Space>
                                                <Badge count={tag.count} style={{
                                                    background: tag.color,
                                                    fontSize: '10px'
                                                }} />
                                            </div>
                                        ))}
                                    </Space>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    {/* Filters and Search */}
                    <Card style={{ border: '2px solid #D4AF37', borderRadius: '12px', marginBottom: '24px' }}>
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} md={12} lg={8}>
                                <AntSearch
                                    placeholder="Tìm kiếm tin tức..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    style={{ width: '100%' }}
                                    prefix={<Search size={16} />}
                                />
                            </Col>
                            <Col xs={24} md={12} lg={8}>
                                <Select
                                    value={selectedCategory}
                                    onChange={setSelectedCategory}
                                    style={{ width: '100%' }}
                                    suffixIcon={<Filter size={14} />}
                                >
                                    {newsCategories.map(category => (
                                        <Option key={category.key} value={category.key}>
                                            <Space>
                                                <div style={{
                                                    width: '12px',
                                                    height: '12px',
                                                    background: category.color,
                                                    borderRadius: '2px'
                                                }} />
                                                {category.name}
                                            </Space>
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col xs={24} lg={8}>
                                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                                    <Text strong style={{ color: '#8B0000' }}>
                                        {filteredNews.length + featuredNews.length} tin được tìm thấy
                                    </Text>
                                </Space>
                            </Col>
                        </Row>
                    </Card>

                    {/* Featured News */}
                    <Title level={2} style={{ color: '#8B0000', marginBottom: '24px' }}>
                        <Star style={{ marginRight: '8px' }} />
                        Tin Nổi Bật
                    </Title>

                    <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
                        {featuredNews.map(news => (
                            <Col key={news.id} xs={24} lg={12}>
                                <NewsCard news={news} featured={true} />
                            </Col>
                        ))}
                    </Row>

                    {/* Latest News */}
                    <Title level={2} style={{ color: '#8B0000', marginBottom: '24px' }}>
                        <Clock style={{ marginRight: '8px' }} />
                        Tin Mới Nhất
                    </Title>

                    <Row gutter={[16, 16]}>
                        {filteredNews.map(news => (
                            <Col key={news.id} xs={24} sm={12} lg={8}>
                                <NewsCard news={news} />
                            </Col>
                        ))}
                    </Row>

                    {filteredNews.length === 0 && (
                        <Card style={{ textAlign: 'center', border: '2px dashed #D4AF37', background: 'transparent' }}>
                            <Space direction="vertical" size="large">
                                <BookOpen size={48} style={{ color: '#8B0000', opacity: 0.5 }} />
                                <Title level={4} style={{ color: '#8B0000' }}>
                                    Không tìm thấy tin tức phù hợp
                                </Title>
                                <Text type="secondary">
                                    Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
                                </Text>
                            </Space>
                        </Card>
                    )}

                    {/* Pagination */}
                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <Pagination
                            current={currentPage}
                            onChange={setCurrentPage}
                            total={50}
                            pageSize={6}
                            showSizeChanger={false}
                            itemRender={(page, type, originalElement) => {
                                if (type === 'page') {
                                    return (
                                        <Button
                                            type={currentPage === page ? 'primary' : 'default'}
                                            style={{
                                                background: currentPage === page ? '#8B0000' : 'transparent',
                                                borderColor: '#D4AF37',
                                                color: currentPage === page ? 'white' : '#8B0000',
                                                margin: '0 4px'
                                            }}
                                        >
                                            {page}
                                        </Button>
                                    );
                                }
                                return originalElement;
                            }}
                        />
                    </div>
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
                            12 SỨ QUÂN - TRUNG TÂM TIN TỨC
                        </Title>
                        <Paragraph style={{ color: 'rgba(212, 175, 55, 0.8)', margin: 0 }}>
                            Theo dõi để không bỏ lỡ bất kỳ thông tin quan trọng nào từ game
                        </Paragraph>
                    </Space>

                    <Divider style={{ borderColor: '#D4AF37', margin: '30px 0' }} />

                    <Text style={{ color: 'rgba(212, 175, 55, 0.6)' }}>
                        © 2024 12 Sứ Quân. Tất cả quyền được bảo lưu.
                    </Text>
                </div>
            </Footer>

            {/* News Detail Modal */}
            <Modal
                title={selectedNews ? selectedNews.title : ''}
                open={isDetailModalVisible}
                onCancel={() => setIsDetailModalVisible(false)}
                footer={null}
                width={800}
                style={{ top: 20 }}
            >
                {selectedNews && (
                    <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        <Space direction="vertical" style={{ width: '100%' }} size="large">
                            {/* Featured Image */}
                            <div style={{
                                height: '300px',
                                background: `linear-gradient(135deg, rgba(139, 0, 0, 0.3), rgba(0, 51, 102, 0.3)), url("${selectedNews.image}")`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: '12px',
                                position: 'relative'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    bottom: '20px',
                                    left: '20px',
                                    right: '20px'
                                }}>
                                    <Space>
                                        <Tag
                                            color={newsCategories.find(cat => cat.key === selectedNews.category)?.color}
                                            style={{
                                                color: 'white',
                                                fontWeight: 'bold',
                                                fontSize: '14px'
                                            }}
                                        >
                                            {newsCategories.find(cat => cat.key === selectedNews.category)?.name}
                                        </Tag>
                                    </Space>
                                </div>
                            </div>

                            {/* Meta Information */}
                            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                <Space size="large">
                                    <Space size="small">
                                        <User size={14} style={{ color: '#8B4513' }} />
                                        <Text strong style={{ color: '#8B0000' }}>{selectedNews.author}</Text>
                                    </Space>
                                    <Space size="small">
                                        <Calendar size={14} style={{ color: '#8B4513' }} />
                                        <Text type="secondary">{selectedNews.date}</Text>
                                    </Space>
                                    <Space size="small">
                                        <Clock size={14} style={{ color: '#8B4513' }} />
                                        <Text type="secondary">{selectedNews.readTime} đọc</Text>
                                    </Space>
                                </Space>

                                <Space size="large">
                                    <Button type="text" icon={<Heart size={16} />}>
                                        {selectedNews.likes}
                                    </Button>
                                    <Button type="text" icon={<MessageCircle size={16} />}>
                                        {selectedNews.comments}
                                    </Button>
                                    <Button type="text" icon={<Share2 size={16} />}>
                                        Chia sẻ
                                    </Button>
                                </Space>
                            </Space>

                            <Divider />

                            {/* News Content */}
                            <div
                                dangerouslySetInnerHTML={{ __html: selectedNews.content }}
                                style={{
                                    lineHeight: '1.8',
                                    color: '#333'
                                }}
                            />

                            {/* Tags */}
                            <Space wrap>
                                {selectedNews.tags.map((tag: string, index: number) => (
                                    <Tag
                                        key={index}
                                        color="blue"
                                        style={{
                                            fontSize: '12px',
                                            padding: '4px 8px'
                                        }}
                                    >
                                        {tag}
                                    </Tag>
                                ))}
                            </Space>
                        </Space>
                    </div>
                )}
            </Modal>
        </Layout>
    );
};

export default NewsPage;
