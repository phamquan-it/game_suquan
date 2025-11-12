"use client"
// pages/compare-page.tsx
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
    Select,
    Progress,
    Statistic,
    Tooltip,
    Modal,
    Badge,
    Switch,
    Input,
    Grid
} from 'antd';
import {
    Crown,
    Sword,
    Shield,
    Users,
    Target,
    Zap,
    TrendingUp,
    TrendingDown,
    Scale,
    Star,
    Bolt,
    RotateCw,
    Filter,
    Search,
    Plus,
    X,
    BarChart3,
    GitCompare,
    Trophy,
    Castle,
    MapPin
} from 'lucide-react';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { Search: AntSearch } = Input;
const { useBreakpoint } = Grid;
const { Header, Footer, Content } = Layout;

const ComparePage = () => {
    const [selectedCharacters, setSelectedCharacters] = useState<any[]>([]);
    const [compareMode, setCompareMode] = useState('stats');
    const [showDetails, setShowDetails] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCharacterModalVisible, setIsCharacterModalVisible] = useState(false);

    const allCharacters = [
        {
            id: 1,
            name: "Ngô Xương Xí",
            title: "Sứ quân Bình Kiều",
            faction: "Nhà Ngô",
            tier: "legendary",
            level: 50,
            power: 9850000,
            stats: {
                attack: 95,
                defense: 88,
                intelligence: 92,
                speed: 82,
                leadership: 90,
                charisma: 85
            },
            specialties: ["Phòng thủ", "Chính trị", "Truyền thống"],
            abilities: [
                { name: "Uy Danh Hoàng Tộc", level: 5 },
                { name: "Chính Thống", level: 4 },
                { name: "Lôi Kích", level: 3 }
            ],
            troops: 8500,
            territory: 45,
            winRate: 92.5,
            avatar: "/api/placeholder/80/80",
            color: "#8B0000"
        },
        {
            id: 2,
            name: "Đỗ Cảnh Thạc",
            title: "Sứ quân Đỗ Động",
            faction: "Độc Lập",
            tier: "epic",
            level: 49,
            power: 8720000,
            stats: {
                attack: 92,
                defense: 85,
                intelligence: 88,
                speed: 90,
                leadership: 82,
                charisma: 78
            },
            specialties: ["Cơ động", "Chiến thuật", "Du kích"],
            abilities: [
                { name: "Binh Pháp Tôn Tử", level: 4 },
                { name: "Du Kích", level: 5 },
                { name: "Phục Binh", level: 3 }
            ],
            troops: 7200,
            territory: 38,
            winRate: 90.2,
            avatar: "/api/placeholder/80/80",
            color: "#D4AF37"
        },
        {
            id: 3,
            name: "Kiều Công Hãn",
            title: "Sứ quân Phong Châu",
            faction: "Liên Minh",
            tier: "epic",
            level: 48,
            power: 7650000,
            stats: {
                attack: 89,
                defense: 82,
                intelligence: 90,
                speed: 85,
                leadership: 88,
                charisma: 86
            },
            specialties: ["Ngoại giao", "Kinh tế", "Liên minh"],
            abilities: [
                { name: "Ngoại Giao", level: 5 },
                { name: "Thuyết Khách", level: 4 },
                { name: "Kinh Tế", level: 4 }
            ],
            troops: 6800,
            territory: 35,
            winRate: 88.4,
            avatar: "/api/placeholder/80/80",
            color: "#003366"
        },
        {
            id: 4,
            name: "Đinh Bộ Lĩnh",
            title: "Người Thống Nhất",
            faction: "Nhà Đinh",
            tier: "legendary",
            level: 50,
            power: 10200000,
            stats: {
                attack: 98,
                defense: 92,
                intelligence: 95,
                speed: 88,
                leadership: 96,
                charisma: 94
            },
            specialties: ["Tấn công", "Lãnh đạo", "Chiến lược"],
            abilities: [
                { name: "Thống Nhất", level: 5 },
                { name: "Lãnh Đạo", level: 5 },
                { name: "Quyết Đấu", level: 4 }
            ],
            troops: 12000,
            territory: 50,
            winRate: 95.8,
            avatar: "/api/placeholder/80/80",
            color: "#2E8B57"
        }
    ];

    const comparisonCategories = [
        {
            key: 'stats',
            name: 'Chỉ Số',
            icon: <BarChart3 size={16} />,
            color: '#8B0000'
        },
        {
            key: 'abilities',
            name: 'Kỹ Năng',
            icon: <Zap size={16} />,
            color: '#D4AF37'
        },
        {
            key: 'troops',
            name: 'Quân Đội',
            icon: <Users size={16} />,
            color: '#003366'
        },
        {
            key: 'territory',
            name: 'Lãnh Thổ',
            icon: <Castle size={16} />,
            color: '#2E8B57'
        }
    ];

    const statsComparison = [
        { key: 'attack', name: 'Tấn Công', icon: <Sword size={14} />, color: '#ff4d4f' },
        { key: 'defense', name: 'Phòng Thủ', icon: <Shield size={14} />, color: '#1890ff' },
        { key: 'intelligence', name: 'Trí Tuệ', icon: <Target size={14} />, color: '#52c41a' },
        { key: 'speed', name: 'Tốc Độ', icon: <Bolt size={14} />, color: '#faad14' },
        { key: 'leadership', name: 'Lãnh Đạo', icon: <Crown size={14} />, color: '#722ed1' },
        { key: 'charisma', name: 'Uy Tín', icon: <Star size={14} />, color: '#13c2c2' }
    ];

    const filteredCharacters = allCharacters.filter(character =>
        character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        character.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const addCharacterToCompare = (character: any) => {
        if (selectedCharacters.length >= 4) {
            Modal.warning({
                title: 'Giới hạn so sánh',
                content: 'Bạn chỉ có thể so sánh tối đa 4 nhân vật cùng lúc.',
            });
            return;
        }

        if (!selectedCharacters.find(c => c.id === character.id)) {
            setSelectedCharacters([...selectedCharacters, character]);
        }
    };

    const removeCharacterFromCompare = (characterId: number) => {
        setSelectedCharacters(selectedCharacters.filter(c => c.id !== characterId));
    };

    const clearAllComparisons = () => {
        setSelectedCharacters([]);
    };

    const getStatDifference = (char1: any, char2: any, stat: string) => {
        const diff = char1.stats[stat] - char2.stats[stat];
        if (diff > 0) return { value: diff, isPositive: true };
        if (diff < 0) return { value: Math.abs(diff), isPositive: false };
        return { value: 0, isPositive: null };
    };

    const findBestInStat = (stat: string) => {
        if (selectedCharacters.length === 0) return null;

        return selectedCharacters.reduce((best, current) => {
            return current.stats[stat] > best.stats[stat] ? current : best;
        }, selectedCharacters[0]);
    };

    const CharacterCard = ({ character, showAddButton = true }: { character: any, showAddButton?: boolean }) => (
        <Card
            style={{
                border: `2px solid ${character.color}`,
                borderRadius: '12px',
                background: 'white',
                height: '100%'
            }}
            bodyStyle={{ padding: '16px' }}
        >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {/* Header */}
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Space>
                        <Avatar
                            size={48}
                            src={character.avatar}
                            style={{
                                border: `3px solid ${character.color}`,
                                background: character.color
                            }}
                            icon={<Crown size={20} />}
                        />
                        <Space direction="vertical" size={0}>
                            <Text strong style={{ color: character.color, fontSize: '16px' }}>
                                {character.name}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                {character.title}
                            </Text>
                        </Space>
                    </Space>

                    {showAddButton && (
                        <Button
                            type="primary"
                            size="small"
                            icon={<Plus size={14} />}
                            disabled={selectedCharacters.find(c => c.id === character.id)}
                            onClick={() => addCharacterToCompare(character)}
                            style={{
                                background: character.color,
                                border: 'none'
                            }}
                        >
                            So sánh
                        </Button>
                    )}
                </Space>

                {/* Basic Info */}
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Tag color={character.tier === 'legendary' ? 'gold' : 'purple'} style={{ margin: 0 }}>
                        {character.tier === 'legendary' ? 'Huyền Thoại' : 'Sử Thi'}
                    </Tag>
                    <Space>
                        <Text strong style={{ color: character.color }}>
                            Lv.{character.level}
                        </Text>
                    </Space>
                </Space>

                {/* Power */}
                <div style={{ textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Sức Mạnh</Text>
                    <Title level={3} style={{ color: character.color, margin: '4px 0' }}>
                        {(character.power / 1000000).toFixed(1)}M
                    </Title>
                </div>

                {/* Key Stats */}
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: '12px' }}>Tấn công:</Text>
                        <Text strong style={{ color: character.color, fontSize: '12px' }}>
                            {character.stats.attack}
                        </Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: '12px' }}>Phòng thủ:</Text>
                        <Text strong style={{ color: character.color, fontSize: '12px' }}>
                            {character.stats.defense}
                        </Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: '12px' }}>Thắng:</Text>
                        <Text strong style={{ color: character.color, fontSize: '12px' }}>
                            {character.winRate}%
                        </Text>
                    </div>
                </Space>

                {/* Specialties */}
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
            </Space>
        </Card>
    );

    const ComparisonRow = ({ stat, showDifferences = true }: { stat: any, showDifferences?: boolean }) => {
        const bestCharacter = findBestInStat(stat.key);

        return (
            <div style={{
                padding: '16px',
                border: '1px solid #F1E8D6',
                borderRadius: '8px',
                marginBottom: '8px',
                background: 'white'
            }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={3}>
                        <Space>
                            <div style={{ color: stat.color }}>
                                {stat.icon}
                            </div>
                            <Text strong style={{ color: '#8B0000' }}>
                                {stat.name}
                            </Text>
                        </Space>
                    </Col>

                    {selectedCharacters.map((character, index) => {
                        const isBest = bestCharacter && character.id === bestCharacter.id;
                        const prevCharacter = index > 0 ? selectedCharacters[index - 1] : null;
                        const diff = prevCharacter ? getStatDifference(character, prevCharacter, stat.key) : null;

                        return (
                            <Col key={character.id} xs={24} md={3}>
                                <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }} size="small">
                                    <div style={{ position: 'relative' }}>
                                        <Text
                                            strong
                                            style={{
                                                color: character.color,
                                                fontSize: '18px'
                                            }}
                                        >
                                            {character.stats[stat.key]}
                                        </Text>
                                        {isBest && (
                                            <Badge
                                                count="Tốt nhất"
                                                style={{
                                                    background: '#52c41a',
                                                    fontSize: '10px',
                                                    position: 'absolute',
                                                    top: '-8px',
                                                    right: '-8px'
                                                }}
                                            />
                                        )}
                                    </div>

                                    <Progress
                                        percent={character.stats[stat.key]}
                                        size="small"
                                        strokeColor={character.color}
                                        showInfo={false}
                                    />

                                    {showDifferences && diff && diff.value > 0 && (
                                        <Space size={2}>
                                            {diff.isPositive ?
                                                <TrendingUp size={12} style={{ color: '#52c41a' }} /> :
                                                <TrendingDown size={12} style={{ color: '#ff4d4f' }} />
                                            }
                                            <Text
                                                style={{
                                                    color: diff.isPositive ? '#52c41a' : '#ff4d4f',
                                                    fontSize: '10px',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {diff.value}
                                            </Text>
                                        </Space>
                                    )}
                                </Space>
                            </Col>
                        );
                    })}
                </Row>
            </div>
        );
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
                            <GitCompare size={20} color="#FFFFFF" />
                        </div>
                        <Title level={3} style={{
                            margin: 0,
                            color: '#D4AF37',
                            background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 'bold'
                        }}>
                            SO SÁNH NHÂN VẬT
                        </Title>
                    </div>

                    <Space>
                        <Button type="link" style={{ color: '#D4AF37', fontWeight: '600' }}>So Sánh</Button>
                        <Button type="link" style={{ color: '#D4AF37', fontWeight: '600' }}>Thống Kê</Button>
                        <Button type="link" style={{ color: '#D4AF37', fontWeight: '600' }}>Xuất Báo Cáo</Button>
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
                                            CÔNG CỤ SO SÁNH
                                        </Tag>
                                        <Title level={1} style={{ color: '#D4AF37', margin: 0, fontSize: '3rem' }}>
                                            So Sánh Chi Tiết Sứ Quân
                                        </Title>
                                    </div>

                                    <Paragraph style={{
                                        color: 'white',
                                        fontSize: '1.1rem',
                                        lineHeight: '1.6'
                                    }}>
                                        Phân tích và so sánh chi tiết các chỉ số, kỹ năng và khả năng của các sứ quân.
                                        Đưa ra quyết định chiến lược thông minh dựa trên dữ liệu thực tế và thống kê chi tiết.
                                    </Paragraph>

                                    <Space>
                                        <Button
                                            type="primary"
                                            icon={<Scale size={16} />}
                                            style={{
                                                background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                                                border: 'none',
                                                fontWeight: 'bold',
                                                color: '#8B0000'
                                            }}
                                        >
                                            So Sánh Nâng Cao
                                        </Button>
                                        <Button
                                            icon={<RotateCw size={16} />}
                                            style={{
                                                background: 'rgba(212, 175, 55, 0.2)',
                                                border: '1px solid #D4AF37',
                                                color: '#D4AF37'
                                            }}
                                            onClick={clearAllComparisons}
                                        >
                                            Xóa Tất Cả
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
                                        <GitCompare style={{ marginRight: '8px' }} />
                                        Thống Kê So Sánh
                                    </Title>
                                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                        <Statistic
                                            title="Nhân Vật So Sánh"
                                            value={selectedCharacters.length}
                                            valueStyle={{ color: '#D4AF37' }}
                                            prefix={<Users size={16} />}
                                        />
                                        <Statistic
                                            title="Chỉ Số Theo Dõi"
                                            value={statsComparison.length}
                                            valueStyle={{ color: '#D4AF37' }}
                                            prefix={<BarChart3 size={16} />}
                                        />
                                        <Statistic
                                            title="So Sánh Hoàn Thành"
                                            value={selectedCharacters.length > 1 ? '100%' : '0%'}
                                            valueStyle={{ color: '#D4AF37' }}
                                            prefix={<TrendingUp size={16} />}
                                        />
                                    </Space>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    {/* Comparison Controls */}
                    <Card style={{ border: '2px solid #D4AF37', borderRadius: '12px', marginBottom: '24px' }}>
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} md={8}>
                                <AntSearch
                                    placeholder="Tìm kiếm nhân vật..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ width: '100%' }}
                                    prefix={<Search size={16} />}
                                />
                            </Col>
                            <Col xs={12} md={6}>
                                <Select
                                    value={compareMode}
                                    onChange={setCompareMode}
                                    style={{ width: '100%' }}
                                    suffixIcon={<Filter size={14} />}
                                >
                                    {comparisonCategories.map(category => (
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
                            <Col xs={12} md={6}>
                                <Space>
                                    <Switch
                                        checked={showDetails}
                                        onChange={setShowDetails}
                                        checkedChildren="Chi tiết"
                                        unCheckedChildren="Cơ bản"
                                    />
                                    <Text>Hiển thị chi tiết</Text>
                                </Space>
                            </Col>
                            <Col xs={24} md={4}>
                                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                                    <Text strong style={{ color: '#8B0000' }}>
                                        {selectedCharacters.length}/4 nhân vật
                                    </Text>
                                </Space>
                            </Col>
                        </Row>
                    </Card>

                    <Row gutter={[24, 24]}>
                        {/* Character Selection */}
                        <Col xs={24} lg={selectedCharacters.length > 0 ? 8 : 24}>
                            <Card
                                style={{
                                    border: '3px solid #D4AF37',
                                    borderRadius: '16px',
                                    background: 'white'
                                }}
                                title={
                                    <Space>
                                        <Users style={{ color: '#8B0000' }} />
                                        <Text strong>Chọn Nhân Vật So Sánh</Text>
                                    </Space>
                                }
                            >
                                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                    {filteredCharacters.map(character => (
                                        <CharacterCard key={character.id} character={character} />
                                    ))}
                                </Space>
                            </Card>
                        </Col>

                        {/* Comparison Results */}
                        {selectedCharacters.length > 0 && (
                            <Col xs={24} lg={16}>
                                <Card
                                    style={{
                                        border: '3px solid #D4AF37',
                                        borderRadius: '16px',
                                        background: 'white'
                                    }}
                                    title={
                                        <Space>
                                            <BarChart3 style={{ color: '#8B0000' }} />
                                            <Text strong>Kết Quả So Sánh</Text>
                                            <Badge
                                                count={`${selectedCharacters.length} nhân vật`}
                                                style={{ background: '#8B0000' }}
                                            />
                                        </Space>
                                    }
                                    extra={
                                        <Space>
                                            {selectedCharacters.map(character => (
                                                <Tooltip key={character.id} title={`Xóa ${character.name}`}>
                                                    <Button
                                                        type="text"
                                                        size="small"
                                                        icon={<X size={14} />}
                                                        onClick={() => removeCharacterFromCompare(character.id)}
                                                        style={{ color: character.color }}
                                                    />
                                                </Tooltip>
                                            ))}
                                        </Space>
                                    }
                                >
                                    {/* Comparison Header */}
                                    <div style={{
                                        padding: '16px',
                                        background: 'linear-gradient(135deg, #F5F5DC, #F1E8D6)',
                                        borderRadius: '8px',
                                        marginBottom: '16px'
                                    }}>
                                        <Row gutter={[16, 16]} align="middle">
                                            <Col xs={24} md={3}>
                                                <Text strong style={{ color: '#8B0000' }}>
                                                    Chỉ Số
                                                </Text>
                                            </Col>
                                            {selectedCharacters.map(character => (
                                                <Col key={character.id} xs={24} md={3}>
                                                    <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }} size="small">
                                                        <Avatar
                                                            size={40}
                                                            src={character.avatar}
                                                            style={{
                                                                border: `2px solid ${character.color}`,
                                                                margin: '0 auto'
                                                            }}
                                                        />
                                                        <Text strong style={{ color: character.color, fontSize: '12px' }}>
                                                            {character.name}
                                                        </Text>
                                                    </Space>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>

                                    {/* Stats Comparison */}
                                    {compareMode === 'stats' && (
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            {statsComparison.map(stat => (
                                                <ComparisonRow key={stat.key} stat={stat} showDifferences={showDetails} />
                                            ))}
                                        </Space>
                                    )}

                                    {/* Abilities Comparison */}
                                    {compareMode === 'abilities' && (
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            {selectedCharacters[0]?.abilities.map((ability: any, index: number) => (
                                                <div key={index} style={{
                                                    padding: '16px',
                                                    border: '1px solid #F1E8D6',
                                                    borderRadius: '8px',
                                                    marginBottom: '8px',
                                                    background: 'white'
                                                }}>
                                                    <Row gutter={[16, 16]} align="middle">
                                                        <Col xs={24} md={3}>
                                                            <Text strong style={{ color: '#8B0000' }}>
                                                                {ability.name}
                                                            </Text>
                                                        </Col>
                                                        {selectedCharacters.map(character => {
                                                            const charAbility = character.abilities[index];
                                                            return (
                                                                <Col key={character.id} xs={24} md={3}>
                                                                    <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }} size="small">
                                                                        <Text strong style={{ color: character.color, fontSize: '16px' }}>
                                                                            Cấp {charAbility?.level || 0}
                                                                        </Text>
                                                                        <Progress
                                                                            percent={((charAbility?.level || 0) / 5) * 100}
                                                                            size="small"
                                                                            strokeColor={character.color}
                                                                            showInfo={false}
                                                                        />
                                                                    </Space>
                                                                </Col>
                                                            );
                                                        })}
                                                    </Row>
                                                </div>
                                            ))}
                                        </Space>
                                    )}

                                    {/* Summary Stats */}
                                    {selectedCharacters.length > 1 && (
                                        <Card
                                            style={{
                                                border: '2px solid #D4AF37',
                                                borderRadius: '12px',
                                                marginTop: '24px',
                                                background: 'linear-gradient(135deg, #FFFFFF, #F5F5DC)'
                                            }}
                                            title="Tổng Kết So Sánh"
                                        >
                                            <Row gutter={[16, 16]}>
                                                <Col xs={12} md={6}>
                                                    <Statistic
                                                        title="Sức Mạnh Cao Nhất"
                                                        value={Math.max(...selectedCharacters.map(c => c.power))}
                                                        valueStyle={{ color: '#8B0000' }}
                                                        prefix={<Trophy size={16} />}
                                                    />
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Statistic
                                                        title="Tỷ Lệ Thắng Cao"
                                                        value={Math.max(...selectedCharacters.map(c => c.winRate))}
                                                        suffix="%"
                                                        valueStyle={{ color: '#2E8B57' }}
                                                        prefix={<TrendingUp size={16} />}
                                                    />
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Statistic
                                                        title="Quân Số Lớn Nhất"
                                                        value={Math.max(...selectedCharacters.map(c => c.troops))}
                                                        valueStyle={{ color: '#D4AF37' }}
                                                        prefix={<Users size={16} />}
                                                    />
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Statistic
                                                        title="Lãnh Thổ Rộng Nhất"
                                                        value={Math.max(...selectedCharacters.map(c => c.territory))}
                                                        valueStyle={{ color: '#003366' }}
                                                        prefix={<MapPin size={16} />}
                                                    />
                                                </Col>
                                            </Row>
                                        </Card>
                                    )}
                                </Card>
                            </Col>
                        )}
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
                            12 SỨ QUÂN - TRUNG TÂM PHÂN TÍCH
                        </Title>
                        <Paragraph style={{ color: 'rgba(212, 175, 55, 0.8)', margin: 0 }}>
                            Đưa ra quyết định chiến lược thông minh với công cụ so sánh toàn diện
                        </Paragraph>
                    </Space>

                    <Divider style={{ borderColor: '#D4AF37', margin: '30px 0' }} />

                    <Text style={{ color: 'rgba(212, 175, 55, 0.6)' }}>
                        © 2024 12 Sứ Quân. Tất cả quyền được bảo lưu.
                    </Text>
                </div>
            </Footer>
        </Layout>
    );
};

export default ComparePage;
