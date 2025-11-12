"use client"
// pages/leaderboard-page.tsx
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
    Tabs,
    Select,
    Badge,
    Progress,
    Statistic,
    Modal,
    Input,
    Timeline,
    Grid
} from 'antd';
import {
    Crown,
    Trophy,
    Award,
    Users,
    Sword,
    Castle,
    TrendingUp,
    Target,
    Zap,
    Clock,
    Calendar,
    Search,
    Eye,
    Share2,
    ArrowUp,
    ArrowDown,
    Minus,
    Medal,
} from 'lucide-react';

const { Title, Paragraph, Text } = Typography;
const { Search: AntSearch } = Input;
const { Option } = Select;
const { useBreakpoint } = Grid;
const { Header, Footer, Content } = Layout;

const LeaderboardPage = () => {
    const screens = useBreakpoint();
    const [activeRankingTab, setActiveRankingTab] = useState('power');
    const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
    const [isPlayerModalVisible, setIsPlayerModalVisible] = useState(false);
    const [timeRange, setTimeRange] = useState('weekly');
    const [searchText, setSearchText] = useState('');

    const rankingCategories = [
        { key: 'power', name: 'Sức Mạnh', icon: <Sword />, color: '#8B0000' },
        { key: 'territory', name: 'Lãnh Thổ', icon: <Castle />, color: '#D4AF37' },
        { key: 'alliance', name: 'Liên Minh', icon: <Users />, color: '#003366' },
        { key: 'wealth', name: 'Tài Sản', icon: <Trophy />, color: '#2E8B57' },
        { key: 'victory', name: 'Chiến Thắng', icon: <Award />, color: '#CD7F32' }
    ];

    const timeRanges = [
        { value: 'daily', label: 'Hàng Ngày', color: '#8B0000' },
        { value: 'weekly', label: 'Hàng Tuần', color: '#D4AF37' },
        { value: 'monthly', label: 'Hàng Tháng', color: '#003366' },
        { value: 'season', label: 'Mùa Giải', color: '#2E8B57' },
        { value: 'alltime', label: 'Toàn Thời Gian', color: '#CD7F32' }
    ];

    const leaderboardData = {
        power: [
            {
                rank: 1,
                player: 'ThiênLongĐế',
                alliance: 'Thiên Hạ Quy Nhất',
                power: 9850000,
                change: 'up',
                changeAmount: 125000,
                level: 50,
                avatar: '/api/placeholder/40/40',
                progress: 98,
                stats: { battles: 1247, wins: 1156, territory: 45 }
            },
            {
                rank: 2,
                player: 'BachDangChienThan',
                alliance: 'Hào Khí Đông A',
                power: 8720000,
                change: 'up',
                changeAmount: 89000,
                level: 49,
                avatar: '/api/placeholder/40/40',
                progress: 87,
                stats: { battles: 1089, wins: 987, territory: 38 }
            },
            {
                rank: 3,
                player: 'HongBangVuong',
                alliance: 'Lạc Hồng Thần Tộc',
                power: 7650000,
                change: 'down',
                changeAmount: 45000,
                level: 48,
                avatar: '/api/placeholder/40/40',
                progress: 76,
                stats: { battles: 956, wins: 845, territory: 35 }
            },
            {
                rank: 4,
                player: 'LacLongQuanDe',
                alliance: 'Con Rồng Cháu Tiên',
                power: 6980000,
                change: 'up',
                changeAmount: 156000,
                level: 47,
                avatar: '/api/placeholder/40/40',
                progress: 69,
                stats: { battles: 887, wins: 765, territory: 32 }
            },
            {
                rank: 5,
                player: 'AnDuongVuong',
                alliance: 'Âu Lạc Vương Triều',
                power: 6450000,
                change: 'up',
                changeAmount: 78000,
                level: 46,
                avatar: '/api/placeholder/40/40',
                progress: 64,
                stats: { battles: 765, wins: 654, territory: 29 }
            }
        ],
        territory: [
            {
                rank: 1,
                player: 'ThiênLongĐế',
                alliance: 'Thiên Hạ Quy Nhất',
                power: 9850000,
                territory: 45,
                change: 'up',
                changeAmount: 3,
                level: 50,
                avatar: '/api/placeholder/40/40',
                progress: 100
            },
            {
                rank: 2,
                player: 'BachDangChienThan',
                alliance: 'Hào Khí Đông A',
                power: 8720000,
                territory: 38,
                change: 'stable',
                changeAmount: 0,
                level: 49,
                avatar: '/api/placeholder/40/40',
                progress: 84
            },
            {
                rank: 3,
                player: 'HongBangVuong',
                alliance: 'Lạc Hồng Thần Tộc',
                power: 7650000,
                territory: 35,
                change: 'down',
                changeAmount: 2,
                level: 48,
                avatar: '/api/placeholder/40/40',
                progress: 77
            }
        ]
    };

    const myRanking = {
        rank: 28,
        player: 'SứQuânCủaBạn',
        alliance: 'Liên Minh Mới',
        power: 2450000,
        change: 'up',
        changeAmount: 45000,
        level: 35,
        progress: 24,
        stats: { battles: 234, wins: 187, territory: 12 }
    };

    const recentActivities = [
        {
            player: 'ThiênLongĐế',
            action: 'chinh phục',
            target: 'Thành Đại La',
            time: '2 phút trước',
            type: 'conquest'
        },
        {
            player: 'BachDangChienThan',
            action: 'thăng hạng',
            target: 'Hạng 2 Bảng Xếp Hạng',
            time: '5 phút trước',
            type: 'rankup'
        },
        {
            player: 'HongBangVuong',
            action: 'thành lập liên minh',
            target: 'Lạc Hồng Thần Tộc',
            time: '15 phút trước',
            type: 'alliance'
        },
        {
            player: 'LacLongQuanDe',
            action: 'đạt cấp độ',
            target: 'Cấp 47',
            time: '30 phút trước',
            type: 'levelup'
        }
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

    const openPlayerDetail = (player: any) => {
        setSelectedPlayer(player);
        setIsPlayerModalVisible(true);
    };

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
            dataIndex: 'player',
            key: 'player',
            render: (player: string, record: any) => (
                <Space>
                    <Avatar
                        size={40}
                        src={record.avatar}
                        style={{ border: '2px solid #D4AF37' }}
                    />
                    <Space direction="vertical" size={0}>
                        <Text strong style={{ color: '#8B0000' }}>{player}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {record.alliance}
                        </Text>
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
            render: (power: number) => (
                <Text strong style={{ color: '#8B0000' }}>
                    {power.toLocaleString()}
                </Text>
            )
        },
        {
            title: 'Thay Đổi',
            dataIndex: 'change',
            key: 'change',
            width: 120,
            render: (change: string, record: any) => (
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
            title: 'Tiến Trình',
            key: 'progress',
            width: 150,
            render: (record: any) => (
                <Progress
                    percent={record.progress}
                    size="small"
                    strokeColor={{
                        '0%': '#D4AF37',
                        '100%': '#8B0000',
                    }}
                    showInfo={false}
                />
            )
        },
        {
            title: '',
            key: 'action',
            width: 80,
            render: (record: any) => (
                <Button
                    type="link"
                    icon={<Eye size={16} />}
                    onClick={() => openPlayerDetail(record)}
                    style={{ color: '#8B0000' }}
                />
            )
        }
    ];

    const RankingCard = ({ player, showDetails = false }: { player: any, showDetails?: boolean }) => (
        <Card
            style={{
                border: `2px solid ${player.rank <= 3 ? '#D4AF37' : '#CD7F32'}`,
                borderRadius: '12px',
                background: player.rank <= 3 ? 'linear-gradient(135deg, #FFF9E6, #FFFFFF)' : 'white',
                marginBottom: '12px'
            }}
            bodyStyle={{ padding: '16px' }}
        >
            <Row gutter={[16, 16]} align="middle">
                <Col xs={3}>
                    <div style={{ textAlign: 'center' }}>
                        {getRankIcon(player.rank)}
                    </div>
                </Col>

                <Col xs={5}>
                    <Avatar
                        size={48}
                        src={player.avatar}
                        style={{
                            border: `3px solid ${player.rank === 1 ? '#FFD700' : player.rank === 2 ? '#C0C0C0' : player.rank === 3 ? '#CD7F32' : '#D4AF37'}`
                        }}
                    />
                </Col>

                <Col xs={16}>
                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                            <Space direction="vertical" size={0}>
                                <Text strong style={{ color: '#8B0000', fontSize: '16px' }}>
                                    {player.player}
                                </Text>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    {player.alliance}
                                </Text>
                            </Space>

                            <Space>
                                <Tag color="#003366" style={{ margin: 0, fontWeight: 'bold' }}>
                                    Lv.{player.level}
                                </Tag>
                                <Space>
                                    {getChangeIcon(player.change)}
                                    <Text
                                        style={{
                                            color: player.change === 'up' ? '#52c41a' : player.change === 'down' ? '#ff4d4f' : '#faad14',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {player.changeAmount.toLocaleString()}
                                    </Text>
                                </Space>
                            </Space>
                        </Space>

                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                            <Text strong style={{ color: '#8B0000' }}>
                                {player.power.toLocaleString()}
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

                        {showDetails && (
                            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                <Statistic
                                    title="Trận"
                                    value={player.stats.battles}
                                    valueStyle={{ color: '#8B0000', fontSize: '12px' }}
                                    prefix={<Sword size={12} />}
                                />
                                <Statistic
                                    title="Thắng"
                                    value={player.stats.wins}
                                    valueStyle={{ color: '#2E8B57', fontSize: '12px' }}
                                    prefix={<Trophy size={12} />}
                                />
                                <Statistic
                                    title="Lãnh Thổ"
                                    value={player.stats.territory}
                                    valueStyle={{ color: '#D4AF37', fontSize: '12px' }}
                                    prefix={<Castle size={12} />}
                                />
                            </Space>
                        )}
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
                            BẢNG XẾP HẠNG
                        </Title>
                    </div>

                    <Space>
                        <Button type="link" style={{ color: '#D4AF37', fontWeight: '600' }}>Top Cá Nhân</Button>
                        <Button type="link" style={{ color: '#D4AF37', fontWeight: '600' }}>Top Liên Minh</Button>
                        <Button type="link" style={{ color: '#D4AF37', fontWeight: '600' }}>Mùa Giải</Button>
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
                                            THỐNG KÊ QUYỀN LỰC
                                        </Tag>
                                        <Title level={1} style={{ color: '#D4AF37', margin: 0, fontSize: '3rem' }}>
                                            Bảng Xếp Hạng 12 Sứ Quân
                                        </Title>
                                    </div>

                                    <Paragraph style={{
                                        color: 'white',
                                        fontSize: '1.1rem',
                                        lineHeight: '1.6'
                                    }}>
                                        Theo dõi vị trí của các sứ quân hùng mạnh nhất. Cạnh tranh để leo lên đỉnh cao
                                        quyền lực và viết tên mình vào lịch sử. Mỗi tuần đều có phần thưởng đặc biệt cho top đầu!
                                    </Paragraph>

                                    <Space>
                                        <Button
                                            type="primary"
                                            icon={<Trophy size={16} />}
                                            style={{
                                                background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                                                border: 'none',
                                                fontWeight: 'bold',
                                                color: '#8B0000'
                                            }}
                                        >
                                            Phần Thưởng Mùa Giải
                                        </Button>
                                        <Button
                                            icon={<Share2 size={16} />}
                                            style={{
                                                background: 'rgba(212, 175, 55, 0.2)',
                                                border: '1px solid #D4AF37',
                                                color: '#D4AF37'
                                            }}
                                        >
                                            Chia Sẻ Thành Tích
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
                                        <Clock style={{ marginRight: '8px' }} />
                                        Cập Nhật
                                    </Title>
                                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                        <Statistic
                                            title="Tổng Người Chơi"
                                            value={125847}
                                            valueStyle={{ color: '#D4AF37' }}
                                            prefix={<Users size={16} />}
                                        />
                                        <Statistic
                                            title="Đang Cạnh Tranh"
                                            value={89234}
                                            valueStyle={{ color: '#D4AF37' }}
                                            prefix={<Sword size={16} />}
                                        />
                                        <Statistic
                                            title="Mùa Giải"
                                            value={3}
                                            valueStyle={{ color: '#D4AF37' }}
                                            prefix={<Award size={16} />}
                                        />
                                    </Space>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    {/* Filters and Controls */}
                    <Card style={{ border: '2px solid #D4AF37', borderRadius: '12px', marginBottom: '24px' }}>
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} md={8}>
                                <AntSearch
                                    placeholder="Tìm kiếm người chơi..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    style={{ width: '100%' }}
                                    prefix={<Search size={16} />}
                                />
                            </Col>
                            <Col xs={12} md={8}>
                                <Select
                                    value={timeRange}
                                    onChange={setTimeRange}
                                    style={{ width: '100%' }}
                                    suffixIcon={<Calendar size={14} />}
                                >
                                    {timeRanges.map(range => (
                                        <Option key={range.value} value={range.value}>
                                            <Space>
                                                <div style={{
                                                    width: '12px',
                                                    height: '12px',
                                                    background: range.color,
                                                    borderRadius: '2px'
                                                }} />
                                                {range.label}
                                            </Space>
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col xs={12} md={8}>
                                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                                    <Text strong style={{ color: '#8B0000' }}>
                                        Cập nhật: 5 phút trước
                                    </Text>
                                </Space>
                            </Col>
                        </Row>
                    </Card>

                    <Row gutter={[24, 24]}>
                        {/* Main Leaderboard */}
                        <Col xs={24} lg={16}>
                            <Card
                                style={{
                                    border: '3px solid #D4AF37',
                                    borderRadius: '16px',
                                    background: 'white'
                                }}
                                title={
                                    <Space>
                                        <Trophy style={{ color: '#8B0000' }} />
                                        <Text strong>Top Sứ Quân Hùng Mạnh</Text>
                                    </Space>
                                }
                                extra={
                                    <Tag color="#8B0000" style={{ color: 'white', fontWeight: 'bold' }}>
                                        {timeRanges.find(t => t.value === timeRange)?.label}
                                    </Tag>
                                }
                            >
                                <Tabs
                                    activeKey={activeRankingTab}
                                    onChange={setActiveRankingTab}
                                    items={rankingCategories.map(category => ({
                                        key: category.key,
                                        label: (
                                            <Space>
                                                <div style={{ color: category.color }}>
                                                    {category.icon}
                                                </div>
                                                <Text style={{ color: category.color, fontWeight: 600 }}>
                                                    {category.name}
                                                </Text>
                                            </Space>
                                        ),
                                        children: screens.xs ? (
                                            <Space direction="vertical" style={{ width: '100%' }}>
                                                {leaderboardData[category.key as keyof typeof leaderboardData]?.map((player, index) => (
                                                    <RankingCard key={index} player={player} showDetails={true} />
                                                ))}
                                            </Space>
                                        ) : (
                                            <Table
                                                columns={columns}
                                                dataSource={leaderboardData[category.key as keyof typeof leaderboardData]}
                                                pagination={false}
                                                rowKey="rank"
                                                style={{ marginTop: '16px' }}
                                            />
                                        )
                                    }))}
                                />
                            </Card>
                        </Col>

                        {/* Sidebar */}
                        <Col xs={24} lg={8}>
                            {/* My Ranking */}
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
                                        <Text strong>Thứ Hạng Của Bạn</Text>
                                    </Space>
                                }
                            >
                                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                    <div style={{ textAlign: 'center' }}>
                                        <Badge count={`#${myRanking.rank}`} style={{
                                            background: '#8B0000',
                                            fontSize: '16px',
                                            padding: '8px 16px'
                                        }}>
                                            <Avatar
                                                size={64}
                                                style={{
                                                    background: 'linear-gradient(135deg, #8B0000, #D4AF37)',
                                                    border: '3px solid #D4AF37'
                                                }}
                                                icon={<Crown size={24} />}
                                            />
                                        </Badge>
                                    </div>

                                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                                        <Title level={4} style={{ color: '#8B0000', textAlign: 'center', margin: 0 }}>
                                            {myRanking.player}
                                        </Title>
                                        <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
                                            {myRanking.alliance}
                                        </Text>
                                    </Space>

                                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                        <Statistic
                                            title="Sức Mạnh"
                                            value={myRanking.power}
                                            valueStyle={{ color: '#8B0000', fontSize: '18px' }}
                                        />
                                        <Space>
                                            {getChangeIcon(myRanking.change)}
                                            <Text
                                                style={{
                                                    color: myRanking.change === 'up' ? '#52c41a' : '#ff4d4f',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {myRanking.changeAmount.toLocaleString()}
                                            </Text>
                                        </Space>
                                    </Space>

                                    <Progress
                                        percent={myRanking.progress}
                                        strokeColor={{
                                            '0%': '#D4AF37',
                                            '100%': '#8B0000',
                                        }}
                                        format={percent => `Top ${percent}%`}
                                    />

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
                                </Space>
                            </Card>

                            {/* Recent Activities */}
                            <Card
                                style={{
                                    border: '2px solid #D4AF37',
                                    borderRadius: '12px',
                                    marginBottom: '24px'
                                }}
                                title={
                                    <Space>
                                        <Zap style={{ color: '#8B0000' }} />
                                        <Text strong>Hoạt Động Gần Đây</Text>
                                    </Space>
                                }
                            >
                                <Timeline>
                                    {recentActivities.map((activity, index) => (
                                        <Timeline.Item
                                            key={index}
                                            color={
                                                activity.type === 'conquest' ? '#8B0000' :
                                                    activity.type === 'rankup' ? '#D4AF37' :
                                                        activity.type === 'alliance' ? '#003366' : '#2E8B57'
                                            }
                                            dot={
                                                activity.type === 'conquest' ? <Sword size={14} /> :
                                                    activity.type === 'rankup' ? <TrendingUp size={14} /> :
                                                        activity.type === 'alliance' ? <Users size={14} /> : <Award size={14} />
                                            }
                                        >
                                            <Space direction="vertical" size={0}>
                                                <Text strong style={{ fontSize: '12px' }}>
                                                    {activity.player} <Text type="secondary">{activity.action}</Text> {activity.target}
                                                </Text>
                                                <Text type="secondary" style={{ fontSize: '10px' }}>
                                                    {activity.time}
                                                </Text>
                                            </Space>
                                        </Timeline.Item>
                                    ))}
                                </Timeline>
                            </Card>

                            {/* Season Rewards */}
                            <Card
                                style={{
                                    border: '2px solid #D4AF37',
                                    borderRadius: '12px'
                                }}
                                title={
                                    <Space>
                                        <Award style={{ color: '#8B0000' }} />
                                        <Text strong>Phần Thưởng Mùa</Text>
                                    </Space>
                                }
                            >
                                <Space direction="vertical" style={{ width: '100%' }} size="small">
                                    {[1, 2, 3].map(rank => (
                                        <div key={rank} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '8px 12px',
                                            background: 'rgba(212, 175, 55, 0.1)',
                                            borderRadius: '6px',
                                            marginBottom: '8px'
                                        }}>
                                            <Space>
                                                {getRankIcon(rank)}
                                                <Text strong style={{ color: '#8B0000' }}>Hạng {rank}</Text>
                                            </Space>
                                            <Tag color="gold" style={{ color: '#8B0000', fontWeight: 'bold' }}>
                                                1,000 Vàng
                                            </Tag>
                                        </div>
                                    ))}
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
                            12 SỨ QUÂN - ĐẤU TRƯỜNG DANH VỌNG
                        </Title>
                        <Paragraph style={{ color: 'rgba(212, 175, 55, 0.8)', margin: 0 }}>
                            Cạnh tranh để khẳng định vị thế và viết tên mình vào lịch sử
                        </Paragraph>
                    </Space>

                    <Divider style={{ borderColor: '#D4AF37', margin: '30px 0' }} />

                    <Text style={{ color: 'rgba(212, 175, 55, 0.6)' }}>
                        © 2024 12 Sứ Quân. Tất cả quyền được bảo lưu.
                    </Text>
                </div>
            </Footer>

            {/* Player Detail Modal */}
            <Modal
                title={selectedPlayer ? `Hồ Sơ: ${selectedPlayer.player}` : ''}
                open={isPlayerModalVisible}
                onCancel={() => setIsPlayerModalVisible(false)}
                footer={null}
                width={600}
            >
                {selectedPlayer && (
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <div style={{ textAlign: 'center' }}>
                            <Avatar
                                size={80}
                                src={selectedPlayer.avatar}
                                style={{
                                    border: `4px solid ${selectedPlayer.rank === 1 ? '#FFD700' : selectedPlayer.rank === 2 ? '#C0C0C0' : '#CD7F32'}`,
                                    marginBottom: '16px'
                                }}
                            />
                            <Title level={3} style={{ color: '#8B0000', margin: '8px 0' }}>
                                {selectedPlayer.player}
                            </Title>
                            <Text type="secondary">{selectedPlayer.alliance}</Text>
                        </div>

                        <Row gutter={[16, 16]}>
                            <Col xs={8}>
                                <Statistic
                                    title="Hạng"
                                    value={selectedPlayer.rank}
                                    valueStyle={{ color: '#8B0000' }}
                                    prefix={getRankIcon(selectedPlayer.rank)}
                                />
                            </Col>
                            <Col xs={8}>
                                <Statistic
                                    title="Cấp Độ"
                                    value={selectedPlayer.level}
                                    valueStyle={{ color: '#D4AF37' }}
                                    prefix={<TrendingUp size={16} />}
                                />
                            </Col>
                            <Col xs={8}>
                                <Statistic
                                    title="Sức Mạnh"
                                    value={selectedPlayer.power}
                                    valueStyle={{ color: '#003366' }}
                                    prefix={<Sword size={16} />}
                                />
                            </Col>
                        </Row>

                        <Divider />

                        <Title level={5}>Thống Kê Chiến Đấu</Title>
                        <Row gutter={[16, 16]}>
                            <Col xs={12}>
                                <Card size="small" style={{ border: '1px solid #D4AF37', textAlign: 'center' }}>
                                    <Statistic
                                        title="Tổng Trận"
                                        value={selectedPlayer.stats.battles}
                                        valueStyle={{ color: '#8B0000' }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={12}>
                                <Card size="small" style={{ border: '1px solid #D4AF37', textAlign: 'center' }}>
                                    <Statistic
                                        title="Chiến Thắng"
                                        value={selectedPlayer.stats.wins}
                                        valueStyle={{ color: '#2E8B57' }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={12}>
                                <Card size="small" style={{ border: '1px solid #D4AF37', textAlign: 'center' }}>
                                    <Statistic
                                        title="Tỷ Lệ Thắng"
                                        value={((selectedPlayer.stats.wins / selectedPlayer.stats.battles) * 100).toFixed(1)}
                                        suffix="%"
                                        valueStyle={{ color: '#D4AF37' }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={12}>
                                <Card size="small" style={{ border: '1px solid #D4AF37', textAlign: 'center' }}>
                                    <Statistic
                                        title="Lãnh Thổ"
                                        value={selectedPlayer.stats.territory}
                                        valueStyle={{ color: '#CD7F32' }}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </Space>
                )}
            </Modal>
        </Layout>
    );
};

export default LeaderboardPage;
