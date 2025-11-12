"use client"
// pages/player-leaderboard-page.tsx
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
    Table,
    Select,
    Badge,
    Progress,
    Statistic,
    Modal,
    Input,
    Grid,
    Radio,
} from 'antd';
import {
    Crown,
    Trophy,
    Users,
    Sword,
    TrendingUp,
    Target,
    Eye,
    Search,
    Globe,
    Filter,
    Medal,
    Award,
    Zap,
    UserCheck,
    Crosshair,
    MessageCircle,
    ArrowUp,
    ArrowDown,
    Minus,
} from 'lucide-react';

const { Title, Paragraph, Text } = Typography;
const { Search: AntSearch } = Input;
const { Option } = Select;
const { useBreakpoint } = Grid;
const { Header, Content } = Layout;

interface Player {
    id: string;
    rank: number;
    name: string;
    level: number;
    power: number;
    alliance: string;
    victoryPoints: number;
    winRate: number;
    battles: number;
    wins: number;
    territory: number;
    region: string;
    specialization: string;
    title: string;
    online: boolean;
    avatar: string;
    change: 'up' | 'down' | 'stable';
    changeAmount: number;
    progress: number;
}

const PlayerLeaderboardPage = () => {
    const screens = useBreakpoint();
    const [searchText, setSearchText] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('all');
    const [selectedSpecialization, setSelectedSpecialization] = useState('all');
    const [sortBy, setSortBy] = useState('rank');
    const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('detailed');
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [isPlayerModalVisible, setIsPlayerModalVisible] = useState(false);

    // Sample player data
    const players: Player[] = [
        {
            id: 'player_1',
            rank: 1,
            name: 'ThiênLongĐế',
            level: 50,
            power: 9850000,
            alliance: 'Thiên Hạ Quy Nhất',
            victoryPoints: 12500,
            winRate: 94.2,
            battles: 1247,
            wins: 1175,
            territory: 45,
            region: 'north',
            specialization: 'commander',
            title: 'Đại Đế',
            online: true,
            avatar: '/api/placeholder/40/40?seed=1',
            change: 'up',
            changeAmount: 125000,
            progress: 98
        },
        {
            id: 'player_2',
            rank: 2,
            name: 'BachDangChienThan',
            level: 49,
            power: 8720000,
            alliance: 'Hào Khí Đông A',
            victoryPoints: 11200,
            winRate: 91.8,
            battles: 1089,
            wins: 1000,
            territory: 38,
            region: 'north',
            specialization: 'warrior',
            title: 'Chiến Thần',
            online: true,
            avatar: '/api/placeholder/40/40?seed=2',
            change: 'up',
            changeAmount: 89000,
            progress: 87
        },
        {
            id: 'player_3',
            rank: 3,
            name: 'HongBangVuong',
            level: 48,
            power: 7650000,
            alliance: 'Lạc Hồng Thần Tộc',
            victoryPoints: 9800,
            winRate: 89.5,
            battles: 956,
            wins: 855,
            territory: 35,
            region: 'central',
            specialization: 'strategist',
            title: 'Quân Sư',
            online: false,
            avatar: '/api/placeholder/40/40?seed=3',
            change: 'down',
            changeAmount: 45000,
            progress: 76
        },
        {
            id: 'player_4',
            rank: 4,
            name: 'LacLongQuanDe',
            level: 47,
            power: 6980000,
            alliance: 'Con Rồng Cháu Tiên',
            victoryPoints: 8900,
            winRate: 87.3,
            battles: 887,
            wins: 774,
            territory: 32,
            region: 'south',
            specialization: 'diplomat',
            title: 'Ngoại Giao',
            online: true,
            avatar: '/api/placeholder/40/40?seed=4',
            change: 'up',
            changeAmount: 156000,
            progress: 69
        },
        {
            id: 'player_5',
            rank: 5,
            name: 'AnDuongVuong',
            level: 46,
            power: 6450000,
            alliance: 'Âu Lạc Vương Triều',
            victoryPoints: 7800,
            winRate: 85.1,
            battles: 765,
            wins: 651,
            territory: 29,
            region: 'highlands',
            specialization: 'commander',
            title: 'Vương Gia',
            online: false,
            avatar: '/api/placeholder/40/40?seed=5',
            change: 'up',
            changeAmount: 78000,
            progress: 64
        },
    ];

    const myStats = {
        rank: 28,
        name: 'SứQuânCủaBạn',
        level: 35,
        power: 2450000,
        alliance: 'Liên Minh Mới',
        victoryPoints: 3200,
        winRate: 78.6,
        battles: 234,
        wins: 184,
        territory: 12,
        progress: 42
    };

    const regions = [
        { value: 'all', label: 'Tất Cả Vùng', color: '#8B0000' },
        { value: 'north', label: 'Bắc Bộ', color: '#003366' },
        { value: 'central', label: 'Trung Bộ', color: '#D4AF37' },
        { value: 'south', label: 'Nam Bộ', color: '#2E8B57' },
        { value: 'highlands', label: 'Tây Nguyên', color: '#CD7F32' }
    ];

    const specializations = [
        { value: 'all', label: 'Tất Cả' },
        { value: 'commander', label: 'Chỉ Huy', color: '#8B0000' },
        { value: 'warrior', label: 'Võ Tướng', color: '#D4AF37' },
        { value: 'strategist', label: 'Quân Sư', color: '#003366' },
        { value: 'diplomat', label: 'Ngoại Giao', color: '#2E8B57' }
    ];

    const sortOptions = [
        { value: 'rank', label: 'Hạng' },
        { value: 'power', label: 'Sức Mạnh' },
        { value: 'level', label: 'Cấp Độ' },
        { value: 'victoryPoints', label: 'Điểm Chiến Thắng' },
        { value: 'winRate', label: 'Tỷ Lệ Thắng' }
    ];

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Crown style={{ color: '#FFD700' }} />;
            case 2:
                return <Medal style={{ color: '#C0C0C0' }} />;
            case 3:
                return <Medal style={{ color: '#CD7F32' }} />;
            default:
                return <Text strong style={{ color: '#8B0000' }}>#{rank}</Text>;
        }
    };

    const getChangeIcon = (change: string) => {
        switch (change) {
            case 'up':
                return <ArrowUp size={14} style={{ color: '#52c41a' }} />;
            case 'down':
                return <ArrowDown size={14} style={{ color: '#ff4d4f' }} />;
            default:
                return <Minus size={14} style={{ color: '#faad14' }} />;
        }
    };

    const getRegionInfo = (region: string) => {
        return regions.find(r => r.value === region) || regions[0];
    };

    const getSpecializationInfo = (spec: string) => {
        return specializations.find(s => s.value === spec) || specializations[0];
    };

    const filteredPlayers = players.filter(player => {
        if (searchText && !player.name.toLowerCase().includes(searchText.toLowerCase())) {
            return false;
        }
        if (selectedRegion !== 'all' && player.region !== selectedRegion) return false;
        if (selectedSpecialization !== 'all' && player.specialization !== selectedSpecialization) return false;
        return true;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'power': return b.power - a.power;
            case 'level': return b.level - a.level;
            case 'victoryPoints': return b.victoryPoints - a.victoryPoints;
            case 'winRate': return b.winRate - a.winRate;
            default: return a.rank - b.rank;
        }
    });

    const openPlayerDetail = (player: Player) => {
        setSelectedPlayer(player);
        setIsPlayerModalVisible(true);
    };

    const PlayerCard = ({ player, compact = false }: { player: Player, compact?: boolean }) => (
        <Card
            style={{
                border: `2px solid ${player.rank <= 3 ? '#D4AF37' : '#CD7F32'}`,
                borderRadius: '12px',
                background: player.rank <= 3 ? 'linear-gradient(135deg, #FFF9E6, #FFFFFF)' : 'white',
                marginBottom: '12px'
            }}
            bodyStyle={{ padding: compact ? '12px' : '16px' }}
        >
            <Row gutter={[16, 16]} align="middle">
                <Col xs={compact ? 3 : 2}>
                    <div style={{ textAlign: 'center' }}>
                        {getRankIcon(player.rank)}
                    </div>
                </Col>

                <Col xs={compact ? 5 : 4}>
                    <Badge dot={player.online} color="#52c41a" offset={[-5, 5]}>
                        <Avatar
                            size={compact ? 40 : 48}
                            src={player.avatar}
                            style={{
                                border: `2px solid ${player.rank === 1 ? '#FFD700' : player.rank === 2 ? '#C0C0C0' : player.rank === 3 ? '#CD7F32' : '#D4AF37'}`
                            }}
                        />
                    </Badge>
                </Col>

                <Col xs={compact ? 16 : 18}>
                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                            <Space direction="vertical" size={0}>
                                <Text strong style={{ color: '#8B0000', fontSize: compact ? '14px' : '16px' }}>
                                    {player.name}
                                </Text>
                                <Text type="secondary" style={{ fontSize: compact ? '10px' : '12px' }}>
                                    {player.alliance} • {player.title}
                                </Text>
                                <Space size={4} style={{ marginTop: '4px' }}>
                                    <Tag
                                        color={getSpecializationInfo(player.specialization).color}
                                        style={{ margin: 0, fontSize: compact ? '10px' : '12px' }}
                                    >
                                        {getSpecializationInfo(player.specialization).label}
                                    </Tag>
                                    <Tag
                                        color={getRegionInfo(player.region).color}
                                        style={{ margin: 0, fontSize: compact ? '10px' : '12px' }}
                                    >
                                        {getRegionInfo(player.region).label}
                                    </Tag>
                                </Space>
                            </Space>

                            <Space direction="vertical" align="end" size={0}>
                                <Tag color="#003366" style={{ margin: 0, fontWeight: 'bold', fontSize: compact ? '10px' : '12px' }}>
                                    Lv.{player.level}
                                </Tag>
                                <Space>
                                    {getChangeIcon(player.change)}
                                    <Text
                                        style={{
                                            color: player.change === 'up' ? '#52c41a' : player.change === 'down' ? '#ff4d4f' : '#faad14',
                                            fontSize: compact ? '10px' : '12px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {player.changeAmount.toLocaleString()}
                                    </Text>
                                </Space>
                            </Space>
                        </Space>

                        {!compact && (
                            <>
                                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                    <Text strong style={{ color: '#8B0000' }}>
                                        {(player.power / 1000000).toFixed(1)}M
                                    </Text>
                                    <Progress
                                        percent={player.progress}
                                        size="small"
                                        style={{ width: '100px' }}
                                        strokeColor={{
                                            '0%': '#D4AF37',
                                            '100%': '#8B0000',
                                        }}
                                        showInfo={false}
                                    />
                                </Space>

                                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                    <Statistic
                                        title="Trận"
                                        value={player.battles}
                                        valueStyle={{ color: '#8B0000', fontSize: '12px' }}
                                        prefix={<Sword size={12} />}
                                    />
                                    <Statistic
                                        title="Thắng"
                                        value={player.wins}
                                        valueStyle={{ color: '#2E8B57', fontSize: '12px' }}
                                        prefix={<Trophy size={12} />}
                                    />
                                    <Statistic
                                        title="TL Thắng"
                                        value={player.winRate}
                                        suffix="%"
                                        valueStyle={{ color: '#D4AF37', fontSize: '12px' }}
                                    />
                                </Space>
                            </>
                        )}
                    </Space>
                </Col>
            </Row>
        </Card>
    );

    const PlayerRankingTable = () => {
        const columns = [
            {
                title: 'Hạng',
                dataIndex: 'rank',
                key: 'rank',
                width: 80,
                render: (rank: number) => (
                    <Space>
                        {getRankIcon(rank)}
                    </Space>
                )
            },
            {
                title: 'Người Chơi',
                dataIndex: 'name',
                key: 'name',
                render: (name: string, record: Player) => (
                    <Space>
                        <Badge dot={record.online} color="#52c41a" offset={[-5, 5]}>
                            <Avatar
                                size={40}
                                src={record.avatar}
                                style={{ border: '2px solid #D4AF37' }}
                            />
                        </Badge>
                        <Space direction="vertical" size={0}>
                            <Text strong style={{ color: '#8B0000' }}>{name}</Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                {record.alliance}
                            </Text>
                            <Space size={4}>
                                <Tag
                                    color={getSpecializationInfo(record.specialization).color}
                                    style={{ margin: 0, fontSize: '10px' }}
                                >
                                    {getSpecializationInfo(record.specialization).label}
                                </Tag>
                                <Tag
                                    color={getRegionInfo(record.region).color}
                                    style={{ margin: 0, fontSize: '10px' }}
                                >
                                    {getRegionInfo(record.region).label}
                                </Tag>
                            </Space>
                        </Space>
                    </Space>
                )
            },
            {
                title: 'Cấp Độ',
                dataIndex: 'level',
                key: 'level',
                width: 100,
                render: (level: number) => (
                    <Tag color="#003366" style={{ margin: 0, fontWeight: 'bold' }}>
                        Lv.{level}
                    </Tag>
                )
            },
            {
                title: 'Sức Mạnh',
                dataIndex: 'power',
                key: 'power',
                width: 120,
                render: (power: number) => (
                    <Text strong style={{ color: '#8B0000' }}>
                        {(power / 1000000).toFixed(1)}M
                    </Text>
                )
            },
            {
                title: 'Điểm CT',
                dataIndex: 'victoryPoints',
                key: 'victoryPoints',
                width: 100,
                render: (points: number) => (
                    <Text strong style={{ color: '#D4AF37' }}>
                        {points.toLocaleString()}
                    </Text>
                )
            },
            {
                title: 'TL Thắng',
                dataIndex: 'winRate',
                key: 'winRate',
                width: 120,
                render: (rate: number) => (
                    <Progress
                        percent={rate}
                        size="small"
                        format={() => `${rate}%`}
                        strokeColor={{
                            '0%': '#ff4d4f',
                            '50%': '#faad14',
                            '100%': '#52c41a',
                        }}
                    />
                )
            },
            {
                title: 'Thay Đổi',
                dataIndex: 'change',
                key: 'change',
                width: 120,
                render: (change: string, record: Player) => (
                    <Space>
                        {getChangeIcon(change)}
                        <Text
                            style={{
                                color: change === 'up' ? '#52c41a' : change === 'down' ? '#ff4d4f' : '#faad14',
                                fontWeight: 'bold'
                            }}
                        >
                            {record.changeAmount.toLocaleString()}
                        </Text>
                    </Space>
                )
            },
            {
                title: '',
                key: 'action',
                width: 80,
                render: (record: Player) => (
                    <Button
                        type="link"
                        icon={<Eye size={16} />}
                        onClick={() => openPlayerDetail(record)}
                        style={{ color: '#8B0000' }}
                    />
                )
            }
        ];

        return (
            <Table
                columns={columns}
                dataSource={filteredPlayers}
                pagination={{
                    pageSize: 20,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} người chơi`
                }}
                rowKey="id"
                scroll={{ x: 1000 }}
            />
        );
    };

    const MyStatsCard = () => (
        <Card
            style={{
                border: '2px solid #D4AF37',
                borderRadius: '12px',
                marginBottom: '24px',
                background: 'linear-gradient(135deg, #FFFFFF, #F5F5DC)'
            }}
            title={
                <Space>
                    <Target style={{ color: '#8B0000' }} />
                    <Text strong>Thống Kê Của Bạn</Text>
                </Space>
            }
        >
            <Row gutter={[24, 24]} align="middle">
                <Col xs={24} md={8}>
                    <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }} size="middle">
                        <Badge count={`#${myStats.rank}`} style={{
                            background: '#8B0000',
                            fontSize: '16px',
                            padding: '8px 16px'
                        }}>
                            <Avatar
                                size={80}
                                style={{
                                    background: 'linear-gradient(135deg, #8B0000, #D4AF37)',
                                    border: '3px solid #D4AF37'
                                }}
                                icon={<Crown size={24} />}
                            />
                        </Badge>

                        <Space direction="vertical" size={0}>
                            <Title level={4} style={{ color: '#8B0000', margin: 0 }}>
                                {myStats.name}
                            </Title>
                            <Text type="secondary">{myStats.alliance}</Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                Hạng #{myStats.rank}
                            </Text>
                        </Space>
                    </Space>
                </Col>

                <Col xs={24} md={8}>
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <Row gutter={[8, 8]}>
                            <Col span={12}>
                                <Statistic
                                    title="Cấp Độ"
                                    value={myStats.level}
                                    valueStyle={{ color: '#003366', fontSize: '16px' }}
                                    prefix={<TrendingUp size={14} />}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Sức Mạnh"
                                    value={(myStats.power / 1000000).toFixed(1)}
                                    suffix="M"
                                    valueStyle={{ color: '#8B0000', fontSize: '16px' }}
                                    prefix={<Sword size={14} />}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Điểm CT"
                                    value={myStats.victoryPoints}
                                    valueStyle={{ color: '#D4AF37', fontSize: '16px' }}
                                    prefix={<Award size={14} />}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="TL Thắng"
                                    value={myStats.winRate}
                                    suffix="%"
                                    valueStyle={{ color: '#52c41a', fontSize: '16px' }}
                                    prefix={<Trophy size={14} />}
                                />
                            </Col>
                        </Row>
                    </Space>
                </Col>

                <Col xs={24} md={8}>
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <Title level={5} style={{ color: '#8B0000', margin: 0 }}>
                            Tiến Trình Thăng Hạng
                        </Title>
                        <Progress
                            percent={myStats.progress}
                            strokeColor={{
                                '0%': '#D4AF37',
                                '100%': '#8B0000',
                            }}
                            format={percent => `Top ${percent}%`}
                        />

                        <Space direction="vertical" style={{ width: '100%' }} size="small">
                            <Button
                                type="primary"
                                block
                                style={{
                                    background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                                    border: 'none',
                                    fontWeight: 'bold',
                                    color: '#8B0000'
                                }}
                                icon={<TrendingUp size={16} />}
                            >
                                Nâng Cấp Để Thăng Hạng
                            </Button>
                            <Button
                                block
                                style={{
                                    borderColor: '#8B0000',
                                    color: '#8B0000'
                                }}
                                icon={<Crosshair size={16} />}
                            >
                                Khiêu Chiến Top Đầu
                            </Button>
                        </Space>
                    </Space>
                </Col>
            </Row>
        </Card>
    );

    return (
        <Layout style={{ background: 'linear-gradient(135deg, #F5F5DC 0%, #F1E8D6 100%)', minHeight: '100vh' }}>
            {/* Header */}
            <Header style={{
                background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.95) 0%, rgba(0, 51, 102, 0.95) 100%)',
                borderBottom: '3px solid #D4AF37',
                padding: '0 20px'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: '1200px',
                    margin: '0 auto'
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
                            <Trophy size={20} color="#FFFFFF" />
                        </div>
                        <Title level={3} style={{
                            margin: 0,
                            color: '#D4AF37',
                            background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 'bold'
                        }}>
                            TOP CÁ NHÂN
                        </Title>
                    </div>

                    <Space>
                        <Button
                            type="link"
                            style={{ color: '#D4AF37', fontWeight: '600' }}
                        >
                            Bảng Xếp Hạng
                        </Button>
                        <Button
                            type="link"
                            style={{ color: '#D4AF37', fontWeight: '600' }}
                        >
                            Thành Tích
                        </Button>
                        <Button
                            type="link"
                            style={{ color: '#D4AF37', fontWeight: '600' }}
                        >
                            Mùa Giải
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
                                            ĐẤU TRƯỜNG DANH VỌNG
                                        </Tag>
                                        <Title level={1} style={{ color: '#D4AF37', margin: 0, fontSize: '3rem' }}>
                                            Bảng Xếp Hạng Cá Nhân
                                        </Title>
                                    </div>

                                    <Paragraph style={{
                                        color: 'white',
                                        fontSize: '1.1rem',
                                        lineHeight: '1.6'
                                    }}>
                                        Khám phá những người chơi xuất sắc nhất server. Theo dõi thứ hạng của bạn,
                                        cạnh tranh với các sứ quân khác và viết tên mình vào lịch sử Đại Cồ Việt.
                                    </Paragraph>

                                    <Space wrap>
                                        <Button
                                            type="primary"
                                            icon={<TrendingUp size={16} />}
                                            style={{
                                                background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                                                border: 'none',
                                                fontWeight: 'bold',
                                                color: '#8B0000',
                                                height: '48px',
                                                padding: '0 24px'
                                            }}
                                        >
                                            Chiến Lược Thăng Hạng
                                        </Button>
                                        <Button
                                            icon={<Crosshair size={16} />}
                                            style={{
                                                background: 'rgba(212, 175, 55, 0.2)',
                                                border: '1px solid #D4AF37',
                                                color: '#D4AF37',
                                                height: '48px'
                                            }}
                                        >
                                            Khiêu Chiến Top Đầu
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
                                        Thống Kê Server
                                    </Title>
                                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                        <Statistic
                                            title="Tổng Người Chơi"
                                            value={125847}
                                            valueStyle={{ color: '#D4AF37' }}
                                            prefix={<Users size={16} />}
                                        />
                                        <Statistic
                                            title="Đang Online"
                                            value={89234}
                                            valueStyle={{ color: '#52c41a' }}
                                            prefix={<UserCheck size={16} />}
                                        />
                                        <Statistic
                                            title="Cấp Cao Nhất"
                                            value={50}
                                            valueStyle={{ color: '#FFD700' }}
                                            prefix={<Crown size={16} />}
                                        />
                                    </Space>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    {/* My Stats */}
                    <MyStatsCard />

                    {/* Filters and Controls */}
                    <Card style={{
                        border: '2px solid #D4AF37',
                        borderRadius: '12px',
                        marginBottom: '24px',
                        background: 'linear-gradient(135deg, #FFFFFF, #F8F5F0)'
                    }}>
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} md={6}>
                                <AntSearch
                                    placeholder="Tìm kiếm người chơi..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    style={{ width: '100%' }}
                                    prefix={<Search size={16} />}
                                    allowClear
                                />
                            </Col>

                            <Col xs={12} md={4}>
                                <Select
                                    value={selectedRegion}
                                    onChange={setSelectedRegion}
                                    style={{ width: '100%' }}
                                    suffixIcon={<Globe size={14} />}
                                >
                                    {regions.map(region => (
                                        <Option key={region.value} value={region.value}>
                                            <Space>
                                                <div style={{
                                                    width: '12px',
                                                    height: '12px',
                                                    background: region.color,
                                                    borderRadius: '2px'
                                                }} />
                                                {region.label}
                                            </Space>
                                        </Option>
                                    ))}
                                </Select>
                            </Col>

                            <Col xs={12} md={4}>
                                <Select
                                    value={selectedSpecialization}
                                    onChange={setSelectedSpecialization}
                                    style={{ width: '100%' }}
                                    suffixIcon={<Sword size={14} />}
                                >
                                    {specializations.map(spec => (
                                        <Option key={spec.value} value={spec.value}>
                                            {spec.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Col>

                            <Col xs={12} md={4}>
                                <Select
                                    value={sortBy}
                                    onChange={setSortBy}
                                    style={{ width: '100%' }}
                                    suffixIcon={<Filter size={14} />}
                                >
                                    {sortOptions.map(option => (
                                        <Option key={option.value} value={option.value}>
                                            {option.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Col>

                            <Col xs={12} md={3}>
                                <Radio.Group
                                    value={viewMode}
                                    onChange={(e) => setViewMode(e.target.value)}
                                    size="small"
                                >
                                    <Radio.Button value="detailed">Chi tiết</Radio.Button>
                                    <Radio.Button value="compact">Rút gọn</Radio.Button>
                                </Radio.Group>
                            </Col>

                            <Col xs={24} md={3}>
                                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                                    <Text strong style={{ color: '#8B0000', fontSize: '12px' }}>
                                        {filteredPlayers.length} người chơi
                                    </Text>
                                </Space>
                            </Col>
                        </Row>
                    </Card>

                    {/* Leaderboard */}
                    <Card
                        style={{
                            border: '2px solid #D4AF37',
                            borderRadius: '12px'
                        }}
                        title={
                            <Space>
                                <Trophy style={{ color: '#8B0000' }} />
                                <Text strong>Bảng Xếp Hạng Người Chơi</Text>
                                <Badge count={filteredPlayers.length} style={{ backgroundColor: '#8B0000' }} />
                            </Space>
                        }
                    >
                        {screens.xs || viewMode === 'compact' ? (
                            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                {filteredPlayers.map((player, index) => (
                                    <PlayerCard key={index} player={player} compact={viewMode === 'compact'} />
                                ))}
                            </Space>
                        ) : (
                            <PlayerRankingTable />
                        )}
                    </Card>
                </div>
            </Content>

            {/* Player Detail Modal */}
            <Modal
                title={
                    <Space>
                        <Crown style={{ color: '#D4AF37' }} />
                        <Text strong>Hồ Sơ Chiến Binh</Text>
                    </Space>
                }
                open={isPlayerModalVisible}
                onCancel={() => setIsPlayerModalVisible(false)}
                footer={null}
                width={600}
            >
                {selectedPlayer && (
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        {/* Header */}
                        <div style={{ textAlign: 'center' }}>
                            <Badge dot={selectedPlayer.online} color="#52c41a" offset={[-10, 10]}>
                                <Avatar
                                    size={100}
                                    src={selectedPlayer.avatar}
                                    style={{
                                        border: `4px solid ${selectedPlayer.rank === 1 ? '#FFD700' : selectedPlayer.rank === 2 ? '#C0C0C0' : selectedPlayer.rank === 3 ? '#CD7F32' : '#D4AF37'}`
                                    }}
                                />
                            </Badge>
                            <Title level={3} style={{ color: '#8B0000', margin: '16px 0 8px' }}>
                                {selectedPlayer.name}
                            </Title>
                            <Space>
                                <Tag color="#003366">{selectedPlayer.alliance}</Tag>
                                <Tag color={getSpecializationInfo(selectedPlayer.specialization).color}>
                                    {getSpecializationInfo(selectedPlayer.specialization).label}
                                </Tag>
                                <Tag color={getRegionInfo(selectedPlayer.region).color}>
                                    {getRegionInfo(selectedPlayer.region).label}
                                </Tag>
                            </Space>
                        </div>

                        {/* Stats Grid */}
                        <Row gutter={[16, 16]}>
                            <Col xs={8}>
                                <Card size="small" style={{ border: '1px solid #D4AF37', textAlign: 'center' }}>
                                    <Statistic
                                        title="Hạng"
                                        value={selectedPlayer.rank}
                                        valueStyle={{ color: '#8B0000' }}
                                        prefix={getRankIcon(selectedPlayer.rank)}
                                    />
                                </Card>
                            </Col>
                            <Col xs={8}>
                                <Card size="small" style={{ border: '1px solid #D4AF37', textAlign: 'center' }}>
                                    <Statistic
                                        title="Cấp Độ"
                                        value={selectedPlayer.level}
                                        valueStyle={{ color: '#D4AF37' }}
                                        prefix={<TrendingUp size={16} />}
                                    />
                                </Card>
                            </Col>
                            <Col xs={8}>
                                <Card size="small" style={{ border: '1px solid #D4AF37', textAlign: 'center' }}>
                                    <Statistic
                                        title="Sức Mạnh"
                                        value={(selectedPlayer.power / 1000000).toFixed(1)}
                                        suffix="M"
                                        valueStyle={{ color: '#003366' }}
                                        prefix={<Sword size={16} />}
                                    />
                                </Card>
                            </Col>
                        </Row>

                        {/* Battle Stats */}
                        <Title level={5}>Thống Kê Chiến Đấu</Title>
                        <Row gutter={[16, 16]}>
                            <Col xs={8}>
                                <Card size="small" style={{ border: '1px solid #D4AF37', textAlign: 'center' }}>
                                    <Statistic
                                        title="Tổng Trận"
                                        value={selectedPlayer.battles}
                                        valueStyle={{ color: '#8B0000' }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={8}>
                                <Card size="small" style={{ border: '1px solid #D4AF37', textAlign: 'center' }}>
                                    <Statistic
                                        title="Chiến Thắng"
                                        value={selectedPlayer.wins}
                                        valueStyle={{ color: '#2E8B57' }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={8}>
                                <Card size="small" style={{ border: '1px solid #D4AF37', textAlign: 'center' }}>
                                    <Statistic
                                        title="Tỷ Lệ Thắng"
                                        value={selectedPlayer.winRate}
                                        suffix="%"
                                        valueStyle={{ color: '#D4AF37' }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={8}>
                                <Card size="small" style={{ border: '1px solid #D4AF37', textAlign: 'center' }}>
                                    <Statistic
                                        title="Lãnh Thổ"
                                        value={selectedPlayer.territory}
                                        valueStyle={{ color: '#CD7F32' }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={8}>
                                <Card size="small" style={{ border: '1px solid #D4AF37', textAlign: 'center' }}>
                                    <Statistic
                                        title="Điểm CT"
                                        value={selectedPlayer.victoryPoints}
                                        valueStyle={{ color: '#003366' }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={8}>
                                <Card size="small" style={{ border: '1px solid #D4AF37', textAlign: 'center' }}>
                                    <Statistic
                                        title="Thay Đổi"
                                        value={selectedPlayer.changeAmount}
                                        valueStyle={{
                                            color: selectedPlayer.change === 'up' ? '#52c41a' :
                                                selectedPlayer.change === 'down' ? '#ff4d4f' : '#faad14'
                                        }}
                                        prefix={getChangeIcon(selectedPlayer.change)}
                                    />
                                </Card>
                            </Col>
                        </Row>

                        {/* Action Buttons */}
                        <Divider />
                        <Space style={{ width: '100%', justifyContent: 'center' }}>
                            <Button
                                icon={<MessageCircle size={16} />}
                                style={{ borderColor: '#D4AF37', color: '#8B0000' }}
                            >
                                Nhắn Tin
                            </Button>
                            <Button
                                icon={<Crosshair size={16} />}
                                type="primary"
                                style={{
                                    background: 'linear-gradient(135deg, #8B0000, #D4AF37)',
                                    border: 'none'
                                }}
                            >
                                Khiêu Chiến
                            </Button>
                            <Button
                                icon={<UserCheck size={16} />}
                                style={{ borderColor: '#003366', color: '#003366' }}
                            >
                                Kết Bạn
                            </Button>
                        </Space>
                    </Space>
                )}
            </Modal>
        </Layout>
    );
};

export default PlayerLeaderboardPage;
