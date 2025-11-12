"use client"
// pages/characters-page.tsx
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
    Progress,
    Tabs,
    Modal,
    Descriptions,
    Badge,
    Input,
    Select,
    Grid,
    Statistic
} from 'antd';
import {
    Crown,
    Users,
    MapPin,
    Star,
    Search,
    Filter,
    Award,
    Flag,
} from 'lucide-react';
import { GameLink } from '@/enums/Links';

const { Title, Paragraph, Text } = Typography;
const { Search: AntSearch } = Input;
const { Option } = Select;
const { useBreakpoint } = Grid;
const { Header, Footer, Content } = Layout;

const CharactersPage = () => {
    const screens = useBreakpoint();
    const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedFaction, setSelectedFaction] = useState('all');
    const [selectedTier, setSelectedTier] = useState('all');

    const factions = {
        ngo: { name: 'Nhà Ngô', color: '#8B0000' },
        dinh: { name: 'Nhà Đinh', color: '#2E8B57' },
        independent: { name: 'Độc Lập', color: '#D4AF37' },
        alliance: { name: 'Liên Minh', color: '#003366' }
    };

    const characterTiers = {
        legendary: { name: 'Huyền Thoại', color: '#FFD700' },
        epic: { name: 'Sử Thi', color: '#9370DB' },
        rare: { name: 'Hiếm', color: '#1E90FF' },
        common: { name: 'Thường', color: '#808080' }
    };

    const characters = [
        {
            id: 1,
            name: "Ngô Xương Xí",
            title: "Sứ quân Bình Kiều",
            faction: "ngo",
            tier: "legendary",
            status: "active",
            power: 95,
            intelligence: 88,
            charisma: 82,
            loyalty: 90,
            health: 92,
            description: "Con trai Ngô Xương Ngập, kế thừa sự nghiệp của triều Ngô. Là biểu tượng cho sự chính thống và truyền thống.",
            backstory: "Là hậu duệ trực tiếp của Ngô Quyền, ông cố gắng duy trì di sản của tổ tiên trong buổi loạn lạc. Với dòng máu hoàng tộc, ông mang trọng trách gìn giữ ngai vàng.",
            abilities: [
                { name: "Uy Danh Hoàng Tộc", type: "passive", effect: "Tăng 15% sức mạnh quân đội khi phòng thủ" },
                { name: "Chính Thống", type: "aura", effect: "Giảm 10% tỷ lệ phản bội" },
                { name: "Lôi Kích", type: "active", effect: "Gây sát thương lớn và làm choáng kẻ địch" }
            ],
            territory: "Bình Kiều",
            troops: 8500,
            specialties: ["Phòng thủ", "Chính trị", "Truyền thống"],
            relationships: [
                { character: "Đỗ Cảnh Thạc", type: "rival", status: "Thù địch" },
                { character: "Kiều Công Hãn", type: "neutral", status: "Cảnh giác" },
                { character: "Ngô Xương Văn", type: "ally", status: "Gia tộc" }
            ],
            quote: "Máu hoàng tộc không bao giờ phản bội di sản tổ tiên!",
            image: "/api/placeholder/300/400",
            banner: "/api/placeholder/800/200"
        },
        {
            id: 2,
            name: "Đỗ Cảnh Thạc",
            title: "Sứ quân Đỗ Động",
            faction: "independent",
            tier: "epic",
            status: "active",
            power: 92,
            intelligence: 85,
            charisma: 78,
            loyalty: 70,
            health: 88,
            description: "Tướng cũ của Dương Đình Nghệ, có tài thao lược và kinh nghiệm chiến trường dày dặn.",
            backstory: "Từng phục vụ dưới trướng Dương Đình Nghệ, ông sử dụng kinh nghiệm quân sự để xây dựng lực lượng. Là bậc thầy về chiến thuật và cơ động.",
            abilities: [
                { name: "Binh Pháp Tôn Tử", type: "passive", effect: "Tăng 20% hiệu quả chiến thuật" },
                { name: "Du Kích", type: "active", effect: "Di chuyển nhanh, né tránh 30% sát thương" },
                { name: "Phục Binh", type: "active", effect: "Tấn công bất ngờ, gây thêm 50% sát thương" }
            ],
            territory: "Đỗ Động Giang",
            troops: 7200,
            specialties: ["Cơ động", "Chiến thuật", "Du kích"],
            relationships: [
                { character: "Ngô Xương Xí", type: "rival", status: "Thù địch" },
                { character: "Kiều Công Hãn", type: "ally", status: "Liên minh" },
                { character: "Nguyễn Khoan", type: "neutral", status: "Thương lượng" }
            ],
            quote: "Chiến thắng thuộc về kẻ biết nắm bắt thời cơ!",
            image: "/api/placeholder/300/400",
            banner: "/api/placeholder/800/200"
        },
        {
            id: 3,
            name: "Kiều Công Hãn",
            title: "Sứ quân Phong Châu",
            faction: "alliance",
            tier: "epic",
            status: "active",
            power: 89,
            intelligence: 90,
            charisma: 88,
            loyalty: 80,
            health: 85,
            description: "Người có học thức, giỏi về chính trị và ngoại giao, thường tìm kiếm giải pháp hòa bình.",
            backstory: "Xuất thân từ dòng họ có truyền thống văn hóa, ông tin vào sức mạnh của liên minh và thương lượng. Luôn tìm cách giải quyết xung đột bằng con đường ngoại giao.",
            abilities: [
                { name: "Ngoại Giao", type: "passive", effect: "Giảm 25% chi phí liên minh" },
                { name: "Thuyết Khách", type: "active", effect: "Thuyết phục kẻ địch đầu hàng" },
                { name: "Kinh Tế", type: "passive", effect: "Tăng 20% thu nhập tài nguyên" }
            ],
            territory: "Phong Châu",
            troops: 6800,
            specialties: ["Ngoại giao", "Kinh tế", "Liên minh"],
            relationships: [
                { character: "Đỗ Cảnh Thạc", type: "ally", status: "Liên minh" },
                { character: "Nguyễn Khoan", type: "ally", status: "Đối tác" },
                { character: "Ngô Xương Xí", type: "neutral", status: "Cảnh giác" }
            ],
            quote: "Một cây làm chẳng nên non, ba cây chụm lại nên hòn núi cao!",
            image: "/api/placeholder/300/400",
            banner: "/api/placeholder/800/200"
        },
        {
            id: 4,
            name: "Đinh Bộ Lĩnh",
            title: "Người Thống Nhất",
            faction: "dinh",
            tier: "legendary",
            status: "active",
            power: 98,
            intelligence: 92,
            charisma: 95,
            loyalty: 85,
            health: 96,
            description: "Người đã thống nhất đất nước sau thời kỳ loạn lạc, lập ra nhà Đinh và nước Đại Cồ Việt.",
            backstory: "Xuất thân từ vùng Hoa Lư, với tài năng quân sự thiên bẩm và tầm nhìn chính trị sắc bén. Từ một thủ lĩnh địa phương trở thành người thống nhất đất nước.",
            abilities: [
                { name: "Thống Nhất", type: "aura", effect: "Tăng 25% sức mạnh toàn quân" },
                { name: "Lãnh Đạo", type: "passive", effect: "Giảm 15% thời gian huấn luyện" },
                { name: "Quyết Đấu", type: "active", effect: "Tăng 100% sát thương trong 10 giây" }
            ],
            territory: "Hoa Lư",
            troops: 12000,
            specialties: ["Tấn công", "Lãnh đạo", "Chiến lược"],
            relationships: [
                { character: "Tất cả Sứ quân", type: "rival", status: "Chinh phục" },
                { character: "Lê Hoàn", type: "ally", status: "Cận thần" },
                { character: "Đinh Liễn", type: "ally", status: "Con trai" }
            ],
            quote: "Non sông thu về một mối, đó là ý trời!",
            image: "/api/placeholder/300/400",
            banner: "/api/placeholder/800/200"
        },
        {
            id: 5,
            name: "Nguyễn Khoan",
            title: "Sứ quân Tam Đái",
            faction: "alliance",
            tier: "rare",
            status: "active",
            power: 87,
            intelligence: 86,
            charisma: 84,
            loyalty: 85,
            health: 83,
            description: "Giỏi tổ chức và quản lý lãnh thổ, có khả năng phát triển kinh tế mạnh mẽ.",
            backstory: "Xuất thân từ gia tộc thương nhân, ông áp dụng tư duy kinh doanh vào việc quản lý lãnh thổ. Luôn tìm kiếm lợi ích từ hợp tác hơn là xung đột.",
            abilities: [
                { name: "Thương Mại", type: "passive", effect: "Tăng 30% thu nhập vàng" },
                { name: "Tổ Chức", type: "passive", effect: "Giảm 20% chi phí xây dựng" },
                { name: "Đàm Phán", type: "active", effect: "Mua chuộc đơn vị địch" }
            ],
            territory: "Tam Đái",
            troops: 5500,
            specialties: ["Kinh tế", "Thương mại", "Tổ chức"],
            relationships: [
                { character: "Kiều Công Hãn", type: "ally", status: "Đối tác" },
                { character: "Đỗ Cảnh Thạc", type: "neutral", status: "Thương lượng" },
                { character: "Ngô Xương Xí", type: "neutral", status: "Cạnh tranh" }
            ],
            quote: "Vàng bạc có thể mua được nhiều thứ, kể cả lòng trung thành!",
            image: "/api/placeholder/300/400",
            banner: "/api/placeholder/800/200"
        }
    ];

    const filteredCharacters = characters.filter(character => {
        const matchesSearch = character.name.toLowerCase().includes(searchText.toLowerCase()) ||
            character.title.toLowerCase().includes(searchText.toLowerCase());
        const matchesFaction = selectedFaction === 'all' || character.faction === selectedFaction;
        const matchesTier = selectedTier === 'all' || character.tier === selectedTier;

        return matchesSearch && matchesFaction && matchesTier;
    });

    const openCharacterDetail = (character: any) => {
        setSelectedCharacter(character);
        setIsDetailModalVisible(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'green';
            case 'wounded': return 'orange';
            case 'retired': return 'gray';
            default: return 'blue';
        }
    };

    const CharacterCard = ({ character }: { character: any }) => (
        <Card
            hoverable
            style={{
                border: `2px solid ${factions[character.faction as keyof typeof factions].color}`,
                borderRadius: '12px',
                background: 'white',
                height: '100%',
                position: 'relative'
            }}
            styles={{ body: { padding: '16px' } }}
            onClick={() => openCharacterDetail(character)}
        >
            {/* Tier Badge */}
            <Badge.Ribbon
                text={characterTiers[character.tier as keyof typeof characterTiers].name}
                color={characterTiers[character.tier as keyof typeof characterTiers].color}
                style={{
                    color: character.tier === 'legendary' ? '#8B0000' : 'white',
                    fontWeight: 'bold'
                }}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    {/* Character Header */}
                    <Space style={{ width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Avatar
                            size={64}
                            style={{
                                background: factions[character.faction as keyof typeof factions].color,
                                border: '2px solid #D4AF37'
                            }}
                            icon={<Crown size={24} />}
                        />
                        <Space direction="vertical" size={0} style={{ textAlign: 'right', flex: 1 }}>
                            <Title level={4} style={{
                                color: factions[character.faction as keyof typeof factions].color,
                                margin: 0,
                                fontSize: screens.xs ? '14px' : '16px'
                            }}>
                                {character.name}
                            </Title>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                {character.title}
                            </Text>
                            <Tag
                                color={factions[character.faction as keyof typeof factions].color}
                                style={{
                                    color: 'white',
                                    fontSize: '10px',
                                    margin: 0,
                                    padding: '2px 6px'
                                }}
                            >
                                {factions[character.faction as keyof typeof factions].name}
                            </Tag>
                        </Space>
                    </Space>

                    <Divider style={{ margin: '12px 0' }} />

                    {/* Stats Overview */}
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text strong style={{ fontSize: '12px' }}>Sức mạnh:</Text>
                            <Progress
                                percent={character.power}
                                size="small"
                                strokeColor="#ff4d4f"
                                showInfo={false}
                                style={{ width: '60%' }}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text strong style={{ fontSize: '12px' }}>Trí tuệ:</Text>
                            <Progress
                                percent={character.intelligence}
                                size="small"
                                strokeColor="#52c41a"
                                showInfo={false}
                                style={{ width: '60%' }}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text strong style={{ fontSize: '12px' }}>Uy tín:</Text>
                            <Progress
                                percent={character.charisma}
                                size="small"
                                strokeColor="#1890ff"
                                showInfo={false}
                                style={{ width: '60%' }}
                            />
                        </div>
                    </Space>

                    {/* Specialties */}
                    <div style={{ marginTop: '12px' }}>
                        <Space wrap size={[4, 4]} style={{ width: '100%' }}>
                            {character.specialties.map((spec: string, index: number) => (
                                <Tag
                                    key={index}
                                    color="blue"
                                    style={{
                                        fontSize: '10px',
                                        padding: '2px 6px',
                                        margin: 0
                                    }}
                                >
                                    {spec}
                                </Tag>
                            ))}
                        </Space>
                    </div>

                    {/* Quick Actions */}
                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                        <Button
                            type="primary"
                            size="small"
                            style={{
                                background: factions[character.faction as keyof typeof factions].color,
                                border: 'none',
                                width: '100%'
                            }}
                        >
                            Xem Chi Tiết
                        </Button>
                    </div>
                </Space>
            </Badge.Ribbon>
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
                            <Users size={20} color="#FFFFFF" />
                        </div>
                        <Title level={3} style={{
                            margin: 0,
                            color: '#D4AF37',
                            background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 'bold'
                        }}>
                            DANH SÁCH NHÂN VẬT
                        </Title>
                    </div>

                    <Space>
                        <Button type="link" href={GameLink.HOME} style={{ color: '#D4AF37', fontWeight: '600' }}>Tổng Quan</Button>
                        <Button type="link" href={GameLink.LEADERBOARD} style={{ color: '#D4AF37', fontWeight: '600' }}>Bảng Xếp Hạng</Button>
                        <Button type="link" style={{ color: '#D4AF37', fontWeight: '600' }}>So Sánh</Button>
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
                                            {characters.length} NHÂN VẬT LỊCH SỬ
                                        </Tag>
                                        <Title level={1} style={{ color: '#D4AF37', margin: 0, fontSize: '3rem' }}>
                                            Các Sứ Quân Hùng Mạnh
                                        </Title>
                                    </div>

                                    <Paragraph style={{
                                        color: 'white',
                                        fontSize: '1.1rem',
                                        lineHeight: '1.6'
                                    }}>
                                        Khám phá danh sách đầy đủ các nhân vật lịch sử trong thời kỳ 12 sứ quân.
                                        Mỗi nhân vật mang những đặc điểm, kỹ năng và câu chuyện riêng biệt.
                                        Lựa chọn người hùng của bạn và bắt đầu hành trình chinh phục!
                                    </Paragraph>
                                </Space>
                            </Col>

                            <Col xs={24} lg={8}>
                                <Row gutter={[16, 16]}>
                                    <Col xs={12}>
                                        <Card size="small" style={{ background: 'rgba(212, 175, 55, 0.2)', textAlign: 'center', border: '1px solid #D4AF37' }}>
                                            <Statistic
                                                title="Huyền Thoại"
                                                value={characters.filter(c => c.tier === 'legendary').length}
                                                valueStyle={{ color: '#D4AF37' }}
                                                prefix={<Crown size={16} />}
                                            />
                                        </Card>
                                    </Col>
                                    <Col xs={12}>
                                        <Card size="small" style={{ background: 'rgba(212, 175, 55, 0.2)', textAlign: 'center', border: '1px solid #D4AF37' }}>
                                            <Statistic
                                                title="Sử Thi"
                                                value={characters.filter(c => c.tier === 'epic').length}
                                                valueStyle={{ color: '#9370DB' }}
                                                prefix={<Award size={16} />}
                                            />
                                        </Card>
                                    </Col>
                                    <Col xs={12}>
                                        <Card size="small" style={{ background: 'rgba(212, 175, 55, 0.2)', textAlign: 'center', border: '1px solid #D4AF37' }}>
                                            <Statistic
                                                title="Phe Phái"
                                                value={Object.keys(factions).length}
                                                valueStyle={{ color: '#52c41a' }}
                                                prefix={<Flag size={16} />}
                                            />
                                        </Card>
                                    </Col>
                                    <Col xs={12}>
                                        <Card size="small" style={{ background: 'rgba(212, 175, 55, 0.2)', textAlign: 'center', border: '1px solid #D4AF37' }}>
                                            <Statistic
                                                title="Tổng Quân"
                                                value={characters.reduce((sum, c) => sum + c.troops, 0)}
                                                valueStyle={{ color: '#1890ff' }}
                                                prefix={<Users size={16} />}
                                            />
                                        </Card>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>

                    {/* Filters and Search */}
                    <Card style={{ border: '2px solid #D4AF37', borderRadius: '12px', marginBottom: '24px' }}>
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} md={8}>
                                <AntSearch
                                    placeholder="Tìm kiếm nhân vật..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    style={{ width: '100%' }}
                                    prefix={<Search size={16} />}
                                />
                            </Col>
                            <Col xs={12} md={4}>
                                <Select
                                    value={selectedFaction}
                                    onChange={setSelectedFaction}
                                    style={{ width: '100%' }}
                                    suffixIcon={<Filter size={14} />}
                                >
                                    <Option value="all">Tất cả phe</Option>
                                    {Object.entries(factions).map(([key, faction]) => (
                                        <Option key={key} value={key}>
                                            <Space>
                                                <div style={{
                                                    width: '12px',
                                                    height: '12px',
                                                    background: faction.color,
                                                    borderRadius: '2px'
                                                }} />
                                                {faction.name}
                                            </Space>
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col xs={12} md={4}>
                                <Select
                                    value={selectedTier}
                                    onChange={setSelectedTier}
                                    style={{ width: '100%' }}
                                    suffixIcon={<Star size={14} />}
                                >
                                    <Option value="all">Tất cả cấp</Option>
                                    {Object.entries(characterTiers).map(([key, tier]) => (
                                        <Option key={key} value={key}>
                                            <Space>
                                                <div style={{
                                                    width: '12px',
                                                    height: '12px',
                                                    background: tier.color,
                                                    borderRadius: '2px'
                                                }} />
                                                {tier.name}
                                            </Space>
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col xs={24} md={8}>
                                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                                    <Text strong style={{ color: '#8B0000' }}>
                                        {filteredCharacters.length} nhân vật được tìm thấy
                                    </Text>
                                </Space>
                            </Col>
                        </Row>
                    </Card>

                    {/* Characters Grid */}
                    <Row gutter={[16, 16]}>
                        {filteredCharacters.map(character => (
                            <Col key={character.id} xs={24} sm={12} lg={8} xl={6}>
                                <CharacterCard character={character} />
                            </Col>
                        ))}
                    </Row>

                    {filteredCharacters.length === 0 && (
                        <Card style={{ textAlign: 'center', border: '2px dashed #D4AF37', background: 'transparent' }}>
                            <Space direction="vertical" size="large">
                                <Users size={48} style={{ color: '#8B0000', opacity: 0.5 }} />
                                <Title level={4} style={{ color: '#8B0000' }}>
                                    Không tìm thấy nhân vật phù hợp
                                </Title>
                                <Text type="secondary">
                                    Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
                                </Text>
                            </Space>
                        </Card>
                    )}
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
                            12 SỨ QUÂN - PHÒNG TRƯNG BÀY NHÂN VẬT
                        </Title>
                        <Paragraph style={{ color: 'rgba(212, 175, 55, 0.8)', margin: 0 }}>
                            Khám phá sâu hơn về từng nhân vật lịch sử và câu chuyện của họ
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
                title={selectedCharacter ? `Hồ Sơ Chi Tiết: ${selectedCharacter.name}` : ''}
                open={isDetailModalVisible}
                onCancel={() => setIsDetailModalVisible(false)}
                footer={null}
                width={1000}
                style={{ top: 20 }}
            >
                {selectedCharacter && (
                    <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                        {/* Character Banner */}
                        <div style={{
                            height: '120px',
                            background: `linear-gradient(135deg, ${factions[selectedCharacter.faction as keyof typeof factions].color}40, #00000040), url("${selectedCharacter.banner}")`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '8px',
                            marginBottom: '24px',
                            position: 'relative'
                        }}>
                            <div style={{
                                position: 'absolute',
                                bottom: '16px',
                                left: '16px',
                                right: '16px'
                            }}>
                                <Space>
                                    <Avatar
                                        size={80}
                                        style={{
                                            background: factions[selectedCharacter.faction as keyof typeof factions].color,
                                            border: '3px solid #D4AF37'
                                        }}
                                        icon={<Crown size={32} />}
                                    />
                                    <Space direction="vertical">
                                        <Title level={2} style={{ color: 'white', margin: 0, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                                            {selectedCharacter.name}
                                        </Title>
                                        <Text style={{ color: '#D4AF37', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                                            {selectedCharacter.title}
                                        </Text>
                                    </Space>
                                </Space>
                            </div>
                        </div>

                        <Tabs
                            defaultActiveKey="overview"
                            items={[
                                {
                                    key: 'overview',
                                    label: 'Tổng Quan',
                                    children: <CharacterOverviewTab character={selectedCharacter} factions={factions} />
                                },
                                {
                                    key: 'abilities',
                                    label: 'Kỹ Năng',
                                    children: <AbilitiesTab character={selectedCharacter} />
                                },
                                {
                                    key: 'relationships',
                                    label: 'Quan Hệ',
                                    children: <RelationshipsTab character={selectedCharacter} />
                                },
                                {
                                    key: 'story',
                                    label: 'Tiểu Sử',
                                    children: <StoryTab character={selectedCharacter} />
                                }
                            ]}
                        />
                    </div>
                )}
            </Modal>
        </Layout>
    );
};

// Tab Components
const CharacterOverviewTab = ({ character, factions }: any) => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
                <Card title="Thông Tin Cơ Bản" size="small" style={{ border: '1px solid #D4AF37' }}>
                    <Descriptions column={1} size="small">
                        <Descriptions.Item label="Phe phái">
                            <Tag color={factions[character.faction].color}>
                                {factions[character.faction].name}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Lãnh thổ">
                            <Space>
                                <MapPin size={14} />
                                {character.territory}
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Quân số">
                            <Space>
                                <Users size={14} />
                                {character.troops.toLocaleString()} quân
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Tag color="green">Đang hoạt động</Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </Col>

            <Col xs={24} md={12}>
                <Card title="Chỉ Số Chiến Đấu" size="small" style={{ border: '1px solid #D4AF37' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                            <Text strong>Sức mạnh: </Text>
                            <Progress percent={character.power} strokeColor="#ff4d4f" />
                        </div>
                        <div>
                            <Text strong>Trí tuệ: </Text>
                            <Progress percent={character.intelligence} strokeColor="#52c41a" />
                        </div>
                        <div>
                            <Text strong>Uy tín: </Text>
                            <Progress percent={character.charisma} strokeColor="#1890ff" />
                        </div>
                        <div>
                            <Text strong>Lòng trung thành: </Text>
                            <Progress percent={character.loyalty} strokeColor="#faad14" />
                        </div>
                        <div>
                            <Text strong>Sức khỏe: </Text>
                            <Progress percent={character.health} strokeColor="#13c2c2" />
                        </div>
                    </Space>
                </Card>
            </Col>
        </Row>

        <Card title="Mô Tả" size="small" style={{ border: '1px solid #D4AF37' }}>
            <Paragraph>{character.description}</Paragraph>
        </Card>

        <Card title="Đặc Điểm Nổi Bật" size="small" style={{ border: '1px solid #D4AF37' }}>
            <Space wrap>
                {character.specialties.map((spec: string, index: number) => (
                    <Tag key={index} color="blue" style={{ fontSize: '12px', padding: '4px 8px' }}>
                        {spec}
                    </Tag>
                ))}
            </Space>
        </Card>
    </Space>
);

const AbilitiesTab = ({ character }: any) => (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {character.abilities.map((ability: any, index: number) => (
            <Card
                key={index}
                size="small"
                style={{
                    border: '1px solid #D4AF37',
                    background: ability.type === 'active' ? 'rgba(24, 144, 255, 0.1)' : 'rgba(82, 196, 26, 0.1)'
                }}
            >
                <Space align="start">
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: ability.type === 'active' ? '#1890ff' : '#52c41a',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: 'bold'
                    }}>
                        {index + 1}
                    </div>
                    <Space direction="vertical" size={0}>
                        <Space>
                            <Text strong>{ability.name}</Text>
                            <Tag color={ability.type === 'active' ? 'blue' : 'green'}>
                                {ability.type === 'active' ? 'Chủ động' : 'Bị động'}
                            </Tag>
                        </Space>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {ability.effect}
                        </Text>
                    </Space>
                </Space>
            </Card>
        ))}
    </Space>
);

const RelationshipsTab = ({ character }: any) => (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {character.relationships.map((rel: any, index: number) => (
            <Card key={index} size="small" style={{ border: '1px solid #D4AF37' }}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Text strong>{rel.character}</Text>
                    <Space>
                        <Tag color={
                            rel.type === 'ally' ? 'green' :
                                rel.type === 'rival' ? 'red' : 'orange'
                        }>
                            {rel.type === 'ally' ? 'Đồng minh' : rel.type === 'rival' ? 'Đối thủ' : 'Trung lập'}
                        </Tag>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {rel.status}
                        </Text>
                    </Space>
                </Space>
            </Card>
        ))}
    </Space>
);

const StoryTab = ({ character }: any) => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="Tiểu Sử" size="small" style={{ border: '1px solid #D4AF37' }}>
            <Paragraph style={{ lineHeight: '1.8' }}>
                {character.backstory}
            </Paragraph>
        </Card>

        <Card title="Câu Nói Nổi Tiếng" size="small" style={{
            border: '1px solid #D4AF37',
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(139, 0, 0, 0.1))'
        }}>
            <Space>
                <div style={{
                    width: '4px',
                    height: '40px',
                    background: '#D4AF37',
                    borderRadius: '2px'
                }} />
                <Text style={{ fontStyle: 'italic', fontSize: '16px', color: '#8B0000' }}>
                    "{character.quote}"
                </Text>
            </Space>
        </Card>
    </Space>
);

export default CharactersPage;
