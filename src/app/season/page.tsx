"use client"
// pages/season-page.tsx
import React, { useState, useEffect } from 'react';
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
    Grid,
    List,
    Tooltip,
    Switch,
    Radio,
    Dropdown,
    MenuProps,
    Empty,
    Spin,
    notification,
    TimelineProps,
    Carousel,
    Collapse,
    Timeline as AntTimeline,
    Steps,
    Calendar,
    Descriptions,
    Alert,
    Popover,
    QRCode
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
    Calendar as CalendarIcon,
    Search,
    Eye,
    Share2,
    ArrowUp,
    ArrowDown,
    Minus,
    Medal,
    Filter,
    Download,
    RefreshCw,
    Star,
    Shield,
    Crosshair,
    BarChart3,
    History,
    UserCheck,
    Globe,
    MapPin,
    Mail,
    MessageCircle,
    Flag,
    MoreVertical,
    CheckCircle,
    XCircle,
    Clock4,
    CrownIcon,
    Skull,
    Gift,
    Coins,
    Sparkles,
    CalendarDays,
    Hourglass,
    RotateCcw,
    ChevronRight,
    ChevronLeft,
    Play,
    Pause,
    SkipForward,
    Rewind,
    BookOpen,
    ScrollText,
    Castle as CastleIcon,
    Map,
    Target as TargetIcon,
    Gem,
    Clock8,
    AlertTriangle,
    CheckSquare,
    Square,
    ArrowRight,
    Rocket,
    Flame,
    Shield as ShieldIcon,
    Swords,
    CalendarRange,
    UserPlus,
    Bell,
    QrCode
} from 'lucide-react';

const { Title, Paragraph, Text } = Typography;
const { Search: AntSearch } = Input;
const { Option } = Select;
const { useBreakpoint } = Grid;
const { Header, Footer, Content } = Layout;
const { Panel } = Collapse;
const { Step } = Steps;

interface SeasonData {
    id: string;
    name: string;
    number: number;
    theme: string;
    status: 'upcoming' | 'active' | 'ended';
    startDate: string;
    endDate: string;
    duration: number;
    progress: number;
    totalParticipants: number;
    activePlayers: number;
    rewards: SeasonReward[];
    leaderboard: PlayerRanking[];
    missions: SeasonMission[];
    events: SeasonEvent[];
    rules: SeasonRule[];
}

interface SeasonReward {
    tier: string;
    rankRange: string;
    rewards: string[];
    specialBonus?: string;
    image?: string;
}

interface PlayerRanking {
    rank: number;
    player: string;
    alliance: string;
    points: number;
    progress: number;
    change: 'up' | 'down' | 'stable';
    level: number;
    avatar: string;
    stats: {
        battles: number;
        wins: number;
        territory: number;
        completedMissions: number;
    };
}

interface SeasonMission {
    id: string;
    name: string;
    type: 'daily' | 'weekly' | 'season';
    difficulty: 'easy' | 'medium' | 'hard' | 'epic';
    description: string;
    reward: string;
    progress: number;
    total: number;
    completed: boolean;
    expiration?: string;
    category: string;
}

interface SeasonEvent {
    id: string;
    name: string;
    type: 'tournament' | 'conquest' | 'special' | 'alliance';
    status: 'upcoming' | 'active' | 'completed';
    startTime: string;
    endTime: string;
    participants: number;
    reward: string;
    description: string;
    location?: string;
}

interface SeasonRule {
    id: string;
    title: string;
    description: string;
    category: string;
}

const SeasonPage = () => {
    const screens = useBreakpoint();
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedSeason, setSelectedSeason] = useState<number>(3);
    const [isLoading, setIsLoading] = useState(false);
    const [showCompletedMissions, setShowCompletedMissions] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<SeasonEvent | null>(null);
    const [isEventModalVisible, setIsEventModalVisible] = useState(false);

    // Current Season Data
    const currentSeason: SeasonData = {
        id: 'season_3',
        name: 'Mùa Thống Nhất Đại Cồ Việt',
        number: 3,
        theme: 'imperial_unification',
        status: 'active',
        startDate: '2024-11-01',
        endDate: '2024-12-31',
        duration: 60,
        progress: 65,
        totalParticipants: 125847,
        activePlayers: 89234,
        rewards: [
            {
                tier: 'Imperial',
                rankRange: '1-3',
                rewards: ['5,000 Vàng', 'Avatar Đế Vương', 'Khung Tên VIP', 'Title "Đại Đế"'],
                specialBonus: 'Unlock Imperial Castle Theme',
                image: '/api/placeholder/80/80'
            },
            {
                tier: 'Royal',
                rankRange: '4-10',
                rewards: ['3,000 Vàng', 'Avatar Quý Tộc', 'Khung Tên Gold', 'Title "Vương Gia"'],
                specialBonus: 'Exclusive Royal Units'
            },
            {
                tier: 'Noble',
                rankRange: '11-50',
                rewards: ['1,500 Vàng', 'Avatar Hiệp Sĩ', 'Title "Quan Tướng"'],
                specialBonus: 'Special Nobility Badge'
            },
            {
                tier: 'Elite',
                rankRange: '51-100',
                rewards: ['800 Vàng', 'Avatar Tinh Nhuệ', 'Title "Dũng Sĩ"']
            },
            {
                tier: 'Warrior',
                rankRange: '101-500',
                rewards: ['400 Vàng', 'Title "Chiến Binh"']
            },
            {
                tier: 'Participant',
                rankRange: '501+',
                rewards: ['100 Vàng', 'Season Participation Badge']
            }
        ],
        leaderboard: Array.from({ length: 20 }, (_, i) => ({
            rank: i + 1,
            player: `SứQuân${i + 1}`,
            alliance: `Liên Minh ${String.fromCharCode(65 + (i % 5))}`,
            points: 98500 - (i * 4500),
            progress: 98 - (i * 4),
            change: i % 3 === 0 ? 'up' : i % 3 === 1 ? 'down' : 'stable',
            level: 50 - Math.floor(i / 4),
            avatar: `/api/placeholder/40/40?seed=season${i}`,
            stats: {
                battles: 1247 - (i * 50),
                wins: 1156 - (i * 45),
                territory: 45 - Math.floor(i / 2),
                completedMissions: 38 - Math.floor(i / 3)
            }
        })),
        missions: [
            {
                id: 'mission_1',
                name: 'Chinh Phục Thành Đại La',
                type: 'season',
                difficulty: 'epic',
                description: 'Chiếm đóng và giữ thành Đại La trong 24 giờ',
                reward: '2,000 Điểm Mùa + 500 Vàng',
                progress: 1,
                total: 1,
                completed: true,
                category: 'conquest'
            },
            {
                id: 'mission_2',
                name: 'Tuyển Mộ 1000 Quân',
                type: 'weekly',
                difficulty: 'medium',
                description: 'Tuyển mộ tổng cộng 1000 đơn vị quân đội',
                reward: '500 Điểm Mùa + 200 Vàng',
                progress: 750,
                total: 1000,
                completed: false,
                expiration: '2024-12-22',
                category: 'recruitment'
            },
            {
                id: 'mission_3',
                name: 'Thắng 50 Trận Liên Tiếp',
                type: 'daily',
                difficulty: 'hard',
                description: 'Chiến thắng 50 trận đấu mà không thua',
                reward: '300 Điểm Mùa + 100 Vàng',
                progress: 32,
                total: 50,
                completed: false,
                expiration: '2024-12-16',
                category: 'combat'
            },
            {
                id: 'mission_4',
                name: 'Xây Dựng 5 Công Trình',
                type: 'season',
                difficulty: 'medium',
                description: 'Hoàn thành xây dựng 5 công trình cấp cao',
                reward: '800 Điểm Mùa + 300 Vàng',
                progress: 3,
                total: 5,
                completed: false,
                category: 'construction'
            },
            {
                id: 'mission_5',
                name: 'Liên Minh Chiến Thắng',
                type: 'weekly',
                difficulty: 'hard',
                description: 'Chiến thắng 10 trận liên minh',
                reward: '700 Điểm Mùa + 250 Vàng',
                progress: 6,
                total: 10,
                completed: false,
                expiration: '2024-12-22',
                category: 'alliance'
            }
        ],
        events: [
            {
                id: 'event_1',
                name: 'Đại Chiến Bạch Đằng',
                type: 'tournament',
                status: 'upcoming',
                startTime: '2024-12-20 20:00',
                endTime: '2024-12-20 23:00',
                participants: 0,
                reward: '3,000 Vàng + Title "Bạch Đằng Tướng Quân"',
                description: 'Giải đấu đặc biệt tái hiện chiến thắng Bạch Đằng lịch sử',
                location: 'Sông Bạch Đằng'
            },
            {
                id: 'event_2',
                name: 'Chinh Phục Hoa Lư',
                type: 'conquest',
                status: 'active',
                startTime: '2024-12-15 10:00',
                endTime: '2024-12-17 22:00',
                participants: 1247,
                reward: '2,000 Vàng + Avatar Kinh Đô',
                description: 'Cuộc chinh phục thành Hoa Lư - kinh đô đầu tiên của Đại Cồ Việt',
                location: 'Hoa Lư'
            },
            {
                id: 'event_3',
                name: 'Hội Thề Trung Thành',
                type: 'special',
                status: 'active',
                startTime: '2024-12-10 00:00',
                endTime: '2024-12-31 23:59',
                participants: 45892,
                reward: '1,500 Điểm Mùa + Badge Trung Thành',
                description: 'Sự kiện đặc biệt tăng cường lòng trung thành và đoàn kết'
            },
            {
                id: 'event_4',
                name: 'Liên Minh Đại Chiến',
                type: 'alliance',
                status: 'completed',
                startTime: '2024-12-05 20:00',
                endTime: '2024-12-05 22:00',
                participants: 892,
                reward: '1,800 Vàng + Alliance XP Boost',
                description: 'Giải đấu liên minh quy mô lớn'
            }
        ],
        rules: [
            {
                id: 'rule_1',
                title: 'Tích Luỹ Điểm Mùa',
                description: 'Điểm mùa được tích lũy thông qua chiến thắng, hoàn thành nhiệm vụ và sự kiện',
                category: 'scoring'
            },
            {
                id: 'rule_2',
                title: 'Xếp Hạng Theo Điểm',
                description: 'Thứ hạng được xác định dựa trên tổng điểm mùa tích lũy',
                category: 'ranking'
            },
            {
                id: 'rule_3',
                title: 'Phần Thưởng Mùa',
                description: 'Phần thưởng được trao dựa trên thứ hạng khi mùa giải kết thúc',
                category: 'rewards'
            },
            {
                id: 'rule_4',
                title: 'Nhiệm Vụ Hàng Ngày/Tuần',
                description: 'Nhiệm vụ mới sẽ được làm mới hàng ngày và hàng tuần',
                category: 'missions'
            },
            {
                id: 'rule_5',
                title: 'Sự Kiện Đặc Biệt',
                description: 'Tham gia sự kiện để nhận điểm thưởng và phần thưởng độc quyền',
                category: 'events'
            }
        ]
    };

    const mySeasonStats = {
        rank: 28,
        points: 12450,
        progress: 65,
        completedMissions: 12,
        totalMissions: 25,
        seasonLevel: 15,
        nextReward: 'Imperial Castle Theme',
        pointsToNextRank: 1250
    };

    const seasonsHistory = [
        { number: 1, name: 'Mùa Khai Quốc', status: 'ended', date: '2024-01-01 - 2024-03-31' },
        { number: 2, name: 'Mùa Hùng Vương', status: 'ended', date: '2024-04-01 - 2024-06-30' },
        { number: 3, name: 'Mùa Thống Nhất', status: 'active', date: '2024-11-01 - 2024-12-31' },
        { number: 4, name: 'Mùa Đế Vương', status: 'upcoming', date: '2025-01-01 - 2025-03-31' }
    ];

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return '#52c41a';
            case 'medium': return '#faad14';
            case 'hard': return '#fa541c';
            case 'epic': return '#722ed1';
            default: return '#8B0000';
        }
    };

    const getEventTypeColor = (type: string) => {
        switch (type) {
            case 'tournament': return '#8B0000';
            case 'conquest': return '#D4AF37';
            case 'special': return '#003366';
            case 'alliance': return '#2E8B57';
            default: return '#CD7F32';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return '#52c41a';
            case 'upcoming': return '#faad14';
            case 'ended': return '#fa541c';
            default: return '#8B0000';
        }
    };

    const handleJoinEvent = (event: SeasonEvent) => {
        setSelectedEvent(event);
        setIsEventModalVisible(true);
    };

    const calculateTimeRemaining = (endDate: string) => {
        const end = new Date(endDate);
        const now = new Date();
        const diff = end.getTime() - now.getTime();
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        return { days, hours };
    };

    const timeRemaining = calculateTimeRemaining(currentSeason.endDate);

    const SeasonProgressCard = () => (
        <Card
            style={{
                background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.9), rgba(0, 51, 102, 0.9))',
                border: '3px solid #D4AF37',
                borderRadius: '16px',
                color: 'white',
                marginBottom: '24px'
            }}
        >
            <Row gutter={[32, 32]} align="middle">
                <Col xs={24} lg={16}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div>
                            <Tag color="gold" style={{ color: '#8B0000', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
                                MÙA GIẢI ĐANG DIỄN RA
                            </Tag>
                            <Title level={2} style={{ color: '#D4AF37', margin: 0 }}>
                                {currentSeason.name}
                            </Title>
                            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                                Mùa {currentSeason.number} - Thống nhất giang sơn, xây dựng Đại Cồ Việt
                            </Text>
                        </div>

                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            <div>
                                <Text strong style={{ color: '#D4AF37', display: 'block', marginBottom: '8px' }}>
                                    Tiến độ mùa giải: {currentSeason.progress}%
                                </Text>
                                <Progress
                                    percent={currentSeason.progress}
                                    strokeColor={{
                                        '0%': '#D4AF37',
                                        '100%': '#FFD700',
                                    }}
                                    showInfo={false}
                                    style={{ marginBottom: '8px' }}
                                />
                                <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                                    Còn lại: {timeRemaining.days} ngày {timeRemaining.hours} giờ
                                </Text>
                            </div>

                            <Row gutter={[16, 16]}>
                                <Col xs={8}>
                                    <Statistic
                                        title="Người Tham Gia"
                                        value={currentSeason.totalParticipants}
                                        valueStyle={{ color: '#D4AF37', fontSize: '18px' }}
                                        prefix={<Users size={16} />}
                                    />
                                </Col>
                                <Col xs={8}>
                                    <Statistic
                                        title="Đang Hoạt Động"
                                        value={currentSeason.activePlayers}
                                        valueStyle={{ color: '#52c41a', fontSize: '18px' }}
                                        prefix={<UserCheck size={16} />}
                                    />
                                </Col>
                                <Col xs={8}>
                                    <Statistic
                                        title="Sự Kiện"
                                        value={currentSeason.events.filter(e => e.status === 'active').length}
                                        valueStyle={{ color: '#FFD700', fontSize: '18px' }}
                                        prefix={<Zap size={16} />}
                                    />
                                </Col>
                            </Row>
                        </Space>
                    </Space>
                </Col>

                <Col xs={24} lg={8}>
                    <div style={{
                        background: 'rgba(212, 175, 55, 0.1)',
                        border: '2px solid #D4AF37',
                        borderRadius: '12px',
                        padding: '20px',
                        textAlign: 'center'
                    }}>
                        <Title level={4} style={{ color: '#D4AF37', marginBottom: '16px' }}>
                            <Trophy style={{ marginRight: '8px' }} />
                            Thống Kê Của Bạn
                        </Title>
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            <Statistic
                                title="Hạng Hiện Tại"
                                value={mySeasonStats.rank}
                                valueStyle={{ color: '#D4AF37', fontSize: '20px' }}
                                prefix={<Crown size={16} />}
                            />
                            <Statistic
                                title="Điểm Mùa"
                                value={mySeasonStats.points}
                                valueStyle={{ color: '#FFD700', fontSize: '20px' }}
                                prefix={<Star size={16} />}
                            />
                            <Statistic
                                title="Cấp Mùa"
                                value={mySeasonStats.seasonLevel}
                                valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                                prefix={<TrendingUp size={16} />}
                            />
                        </Space>
                    </div>
                </Col>
            </Row>
        </Card>
    );

    const RewardsDisplay = () => (
        <Card
            style={{
                border: '2px solid #D4AF37',
                borderRadius: '12px',
                marginBottom: '24px'
            }}
            title={
                <Space>
                    <Gift style={{ color: '#8B0000' }} />
                    <Text strong>Phần Thưởng Mùa Giải</Text>
                </Space>
            }
        >
            <Row gutter={[16, 16]}>
                {currentSeason.rewards.map((reward, index) => (
                    <Col xs={24} md={12} lg={8} key={index}>
                        <Card
                            style={{
                                border: `2px solid ${index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#D4AF37'}`,
                                background: index < 3 ? 'linear-gradient(135deg, #FFF9E6, #FFFFFF)' : 'white',
                                height: '100%'
                            }}
                            bodyStyle={{ padding: '16px' }}
                        >
                            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                <div style={{ textAlign: 'center' }}>
                                    <Badge.Ribbon 
                                        text={reward.tier} 
                                        color={
                                            index === 0 ? 'gold' : 
                                            index === 1 ? 'default' : 
                                            index === 2 ? '#CD7F32' : '#D4AF37'
                                        }
                                    >
                                        <div style={{
                                            width: '60px',
                                            height: '60px',
                                            background: 'linear-gradient(135deg, #8B0000, #D4AF37)',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 12px',
                                            border: '2px solid #D4AF37'
                                        }}>
                                            <Trophy size={24} color="#FFFFFF" />
                                        </div>
                                    </Badge.Ribbon>
                                </div>

                                <div style={{ textAlign: 'center' }}>
                                    <Text strong style={{ color: '#8B0000', display: 'block' }}>
                                        Hạng {reward.rankRange}
                                    </Text>
                                    {reward.specialBonus && (
                                        <Tag color="gold" style={{ margin: '8px 0', fontSize: '12px' }}>
                                            {reward.specialBonus}
                                        </Tag>
                                    )}
                                </div>

                                <List
                                    size="small"
                                    dataSource={reward.rewards}
                                    renderItem={item => (
                                        <List.Item style={{ padding: '4px 0', border: 'none' }}>
                                            <Space>
                                                <CheckCircle size={12} style={{ color: '#52c41a' }} />
                                                <Text style={{ fontSize: '12px' }}>{item}</Text>
                                            </Space>
                                        </List.Item>
                                    )}
                                />
                            </Space>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Card>
    );

    const MissionsSection = () => (
        <Card
            style={{
                border: '2px solid #D4AF37',
                borderRadius: '12px',
                marginBottom: '24px'
            }}
            title={
                <Space>
                    <Target style={{ color: '#8B0000' }} />
                    <Text strong>Nhiệm Vụ Mùa Giải</Text>
                </Space>
            }
            extra={
                <Space>
                    <Switch
                        checked={showCompletedMissions}
                        onChange={setShowCompletedMissions}
                        size="small"
                    />
                    <Text style={{ fontSize: '12px' }}>Hiện đã hoàn thành</Text>
                </Space>
            }
        >
            <Tabs
                items={[
                    {
                        key: 'all',
                        label: 'Tất Cả Nhiệm Vụ',
                        children: <MissionsList missions={currentSeason.missions} />
                    },
                    {
                        key: 'daily',
                        label: 'Hàng Ngày',
                        children: <MissionsList missions={currentSeason.missions.filter(m => m.type === 'daily')} />
                    },
                    {
                        key: 'weekly',
                        label: 'Hàng Tuần',
                        children: <MissionsList missions={currentSeason.missions.filter(m => m.type === 'weekly')} />
                    },
                    {
                        key: 'season',
                        label: 'Mùa Giải',
                        children: <MissionsList missions={currentSeason.missions.filter(m => m.type === 'season')} />
                    }
                ]}
            />
        </Card>
    );

    const MissionsList = ({ missions }: { missions: SeasonMission[] }) => {
        const filteredMissions = showCompletedMissions 
            ? missions 
            : missions.filter(mission => !mission.completed);

        return (
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {filteredMissions.map(mission => (
                    <Card
                        key={mission.id}
                        style={{
                            border: `2px solid ${getDifficultyColor(mission.difficulty)}`,
                            background: mission.completed ? 'linear-gradient(135deg, #F6FFED, #FFFFFF)' : 'white',
                            opacity: mission.completed ? 0.8 : 1
                        }}
                        bodyStyle={{ padding: '16px' }}
                    >
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} md={16}>
                                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                    <Space>
                                        <Tag color={getDifficultyColor(mission.difficulty)}>
                                            {mission.difficulty.toUpperCase()}
                                        </Tag>
                                        <Tag color={
                                            mission.type === 'daily' ? '#52c41a' :
                                            mission.type === 'weekly' ? '#faad14' : '#8B0000'
                                        }>
                                            {mission.type === 'daily' ? 'Hàng Ngày' :
                                             mission.type === 'weekly' ? 'Hàng Tuần' : 'Mùa Giải'}
                                        </Tag>
                                        {mission.completed && (
                                            <Tag color="success" icon={<CheckCircle size={12} />}>
                                                Đã Hoàn Thành
                                            </Tag>
                                        )}
                                    </Space>
                                    
                                    <Title level={5} style={{ margin: 0, color: '#8B0000' }}>
                                        {mission.name}
                                    </Title>
                                    
                                    <Text type="secondary" style={{ display: 'block' }}>
                                        {mission.description}
                                    </Text>

                                    {mission.expiration && (
                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                            <Clock size={12} style={{ marginRight: '4px' }} />
                                            Hết hạn: {mission.expiration}
                                        </Text>
                                    )}
                                </Space>
                            </Col>

                            <Col xs={24} md={8}>
                                <Space direction="vertical" style={{ width: '100%' }} size="small">
                                    <div style={{ textAlign: 'center' }}>
                                        <Text strong style={{ color: '#D4AF37', display: 'block' }}>
                                            Phần Thưởng
                                        </Text>
                                        <Text style={{ fontSize: '12px' }}>{mission.reward}</Text>
                                    </div>

                                    {!mission.completed && mission.total > 1 && (
                                        <Progress
                                            percent={Math.round((mission.progress / mission.total) * 100)}
                                            size="small"
                                            strokeColor={getDifficultyColor(mission.difficulty)}
                                        />
                                    )}

                                    <Button
                                        type={mission.completed ? "default" : "primary"}
                                        block
                                        icon={mission.completed ? <CheckCircle size={16} /> : <Play size={16} />}
                                        style={{
                                            background: mission.completed ? '#52c41a' : 
                                                       `linear-gradient(135deg, ${getDifficultyColor(mission.difficulty)}, #D4AF37)`,
                                            border: 'none',
                                            color: 'white'
                                        }}
                                    >
                                        {mission.completed ? 'Đã Hoàn Thành' : 'Bắt Đầu'}
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                ))}
            </Space>
        );
    };

    const EventsSection = () => (
        <Card
            style={{
                border: '2px solid #D4AF37',
                borderRadius: '12px',
                marginBottom: '24px'
            }}
            title={
                <Space>
                    <CalendarDays style={{ color: '#8B0000' }} />
                    <Text strong>Sự Kiện Mùa Giải</Text>
                </Space>
            }
        >
            <Row gutter={[16, 16]}>
                {currentSeason.events.map(event => (
                    <Col xs={24} md={12} lg={8} key={event.id}>
                        <Card
                            style={{
                                border: `2px solid ${getEventTypeColor(event.type)}`,
                                background: event.status === 'active' ? 
                                          'linear-gradient(135deg, #F6FFED, #FFFFFF)' : 'white',
                                height: '100%'
                            }}
                            bodyStyle={{ padding: '16px' }}
                        >
                            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                    <Tag color={getEventTypeColor(event.type)}>
                                        {event.type === 'tournament' ? 'Giải Đấu' :
                                         event.type === 'conquest' ? 'Chinh Phục' :
                                         event.type === 'special' ? 'Đặc Biệt' : 'Liên Minh'}
                                    </Tag>
                                    <Tag color={getStatusColor(event.status)}>
                                        {event.status === 'active' ? 'Đang Diễn Ra' :
                                         event.status === 'upcoming' ? 'Sắp Diễn Ra' : 'Đã Kết Thúc'}
                                    </Tag>
                                </Space>

                                <Title level={5} style={{ margin: 0, color: '#8B0000' }}>
                                    {event.name}
                                </Title>

                                <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                                    {event.description}
                                </Text>

                                {event.location && (
                                    <Space>
                                        <MapPin size={12} />
                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                            {event.location}
                                        </Text>
                                    </Space>
                                )}

                                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                        <Users size={12} style={{ marginRight: '4px' }} />
                                        {event.participants} người tham gia
                                    </Text>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                        <Clock size={12} style={{ marginRight: '4px' }} />
                                        {event.startTime.split(' ')[0]}
                                    </Text>
                                </Space>

                                <div style={{ textAlign: 'center' }}>
                                    <Text strong style={{ color: '#D4AF37', display: 'block', fontSize: '12px' }}>
                                        Phần Thưởng
                                    </Text>
                                    <Text style={{ fontSize: '11px' }}>{event.reward}</Text>
                                </div>

                                <Button
                                    type={event.status === 'active' ? 'primary' : 'default'}
                                    block
                                    icon={event.status === 'active' ? <Play size={16} /> : <Eye size={16} />}
                                    onClick={() => handleJoinEvent(event)}
                                    disabled={event.status === 'ended'}
                                    style={{
                                        background: event.status === 'active' ? 
                                                   `linear-gradient(135deg, ${getEventTypeColor(event.type)}, #D4AF37)` : undefined,
                                        border: event.status === 'active' ? 'none' : undefined
                                    }}
                                >
                                    {event.status === 'active' ? 'Tham Gia Ngay' :
                                     event.status === 'upcoming' ? 'Xem Chi Tiết' : 'Đã Kết Thúc'}
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Card>
    );

    const LeaderboardSection = () => (
        <Card
            style={{
                border: '2px solid #D4AF37',
                borderRadius: '12px',
                marginBottom: '24px'
            }}
            title={
                <Space>
                    <Trophy style={{ color: '#8B0000' }} />
                    <Text strong>Bảng Xếp Hạng Mùa Giải</Text>
                </Space>
            }
        >
            <Table
                columns={[
                    {
                        title: 'Hạng',
                        dataIndex: 'rank',
                        key: 'rank',
                        width: 80,
                        render: (rank: number) => (
                            <Space>
                                {rank <= 3 ? <Crown style={{ color: rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32' }} /> : null}
                                <Text strong>#{rank}</Text>
                            </Space>
                        )
                    },
                    {
                        title: 'Người Chơi',
                        dataIndex: 'player',
                        key: 'player',
                        render: (player: string, record: PlayerRanking) => (
                            <Space>
                                <Avatar size={32} src={record.avatar} />
                                <Space direction="vertical" size={0}>
                                    <Text strong>{player}</Text>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                        {record.alliance}
                                    </Text>
                                </Space>
                            </Space>
                        )
                    },
                    {
                        title: 'Điểm Mùa',
                        dataIndex: 'points',
                        key: 'points',
                        render: (points: number) => (
                            <Text strong style={{ color: '#8B0000' }}>
                                {points.toLocaleString()}
                            </Text>
                        )
                    },
                    {
                        title: 'Cấp Độ',
                        dataIndex: 'level',
                        key: 'level',
                        render: (level: number) => (
                            <Tag color="#003366">Lv.{level}</Tag>
                        )
                    },
                    {
                        title: 'Thống Kê',
                        key: 'stats',
                        render: (record: PlayerRanking) => (
                            <Space>
                                <Tooltip title="Số trận">
                                    <Sword size={12} />
                                    <Text style={{ fontSize: '12px' }}>{record.stats.battles}</Text>
                                </Tooltip>
                                <Tooltip title="Chiến thắng">
                                    <Trophy size={12} />
                                    <Text style={{ fontSize: '12px' }}>{record.stats.wins}</Text>
                                </Tooltip>
                                <Tooltip title="Lãnh thổ">
                                    <Castle size={12} />
                                    <Text style={{ fontSize: '12px' }}>{record.stats.territory}</Text>
                                </Tooltip>
                            </Space>
                        )
                    }
                ]}
                dataSource={currentSeason.leaderboard}
                pagination={{ pageSize: 10 }}
                rowKey="rank"
            />
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
                            <CalendarRange size={20} color="#FFFFFF" />
                        </div>
                        <Title level={3} style={{
                            margin: 0,
                            color: '#D4AF37',
                            background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 'bold'
                        }}>
                            MÙA GIẢI
                        </Title>
                    </div>

                    <Space>
                        <Button 
                            type="link" 
                            style={{ color: '#D4AF37', fontWeight: '600' }}
                            icon={<History size={16} />}
                        >
                            Mùa Trước
                        </Button>
                        <Button 
                            type="link" 
                            style={{ color: '#D4AF37', fontWeight: '600' }}
                            icon={<Trophy size={16} />}
                        >
                            Thành Tích
                        </Button>
                        <Button 
                            type="link" 
                            style={{ color: '#D4AF37', fontWeight: '600' }}
                            icon={<Gift size={16} />}
                        >
                            Phần Thưởng
                        </Button>
                    </Space>
                </div>
            </Header>

            <Content style={{ padding: '40px 20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {/* Season Progress */}
                    <SeasonProgressCard />

                    {/* Main Content Tabs */}
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={[
                            {
                                key: 'overview',
                                label: (
                                    <Space>
                                        <BarChart3 size={16} />
                                        Tổng Quan
                                    </Space>
                                ),
                                children: (
                                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                                        <RewardsDisplay />
                                        <MissionsSection />
                                        <EventsSection />
                                    </Space>
                                )
                            },
                            {
                                key: 'leaderboard',
                                label: (
                                    <Space>
                                        <Trophy size={16} />
                                        Bảng Xếp Hạng
                                    </Space>
                                ),
                                children: <LeaderboardSection />
                            },
                            {
                                key: 'history',
                                label: (
                                    <Space>
                                        <History size={16} />
                                        Lịch Sử Mùa
                                    </Space>
                                ),
                                children: <SeasonHistory />
                            },
                            {
                                key: 'rules',
                                label: (
                                    <Space>
                                        <ScrollText size={16} />
                                        Luật Chơi
                                    </Space>
                                ),
                                children: <SeasonRules />
                            }
                        ]}
                    />
                </div>
            </Content>

            {/* Event Detail Modal */}
            <Modal
                title={selectedEvent ? selectedEvent.name : ''}
                open={isEventModalVisible}
                onCancel={() => setIsEventModalVisible(false)}
                footer={null}
                width={600}
            >
                {selectedEvent && (
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: `linear-gradient(135deg, ${getEventTypeColor(selectedEvent.type)}, #D4AF37)`,
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px',
                                border: '3px solid #D4AF37'
                            }}>
                                <CalendarDays size={32} color="#FFFFFF" />
                            </div>
                            <Title level={3} style={{ color: '#8B0000', margin: '8px 0' }}>
                                {selectedEvent.name}
                            </Title>
                            <Space>
                                <Tag color={getEventTypeColor(selectedEvent.type)}>
                                    {selectedEvent.type === 'tournament' ? 'Giải Đấu' :
                                     selectedEvent.type === 'conquest' ? 'Chinh Phục' :
                                     selectedEvent.type === 'special' ? 'Đặc Biệt' : 'Liên Minh'}
                                </Tag>
                                <Tag color={getStatusColor(selectedEvent.status)}>
                                    {selectedEvent.status === 'active' ? 'Đang Diễn Ra' :
                                     selectedEvent.status === 'upcoming' ? 'Sắp Diễn Ra' : 'Đã Kết Thúc'}
                                </Tag>
                            </Space>
                        </div>

                        <Descriptions bordered column={1} size="small">
                            <Descriptions.Item label="Thời gian bắt đầu">
                                {selectedEvent.startTime}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian kết thúc">
                                {selectedEvent.endTime}
                            </Descriptions.Item>
                            {selectedEvent.location && (
                                <Descriptions.Item label="Địa điểm">
                                    {selectedEvent.location}
                                </Descriptions.Item>
                            )}
                            <Descriptions.Item label="Số người tham gia">
                                {selectedEvent.participants}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phần thưởng">
                                {selectedEvent.reward}
                            </Descriptions.Item>
                        </Descriptions>

                        <Card title="Mô tả sự kiện" size="small">
                            <Paragraph>
                                {selectedEvent.description}
                            </Paragraph>
                        </Card>

                        {selectedEvent.status === 'active' && (
                            <Button
                                type="primary"
                                block
                                size="large"
                                icon={<Play size={16} />}
                                style={{
                                    background: 'linear-gradient(135deg, #8B0000, #D4AF37)',
                                    border: 'none',
                                    fontWeight: 'bold'
                                }}
                            >
                                Tham Gia Ngay
                            </Button>
                        )}
                    </Space>
                )}
            </Modal>
        </Layout>
    );
};

// Additional Components
const SeasonHistory = () => (
    <Card
        style={{
            border: '2px solid #D4AF37',
            borderRadius: '12px'
        }}
        title={
            <Space>
                <History style={{ color: '#8B0000' }} />
                <Text strong>Lịch Sử Mùa Giải</Text>
            </Space>
        }
    >
        <Timeline
            mode="alternate"
            items={[
                {
                    color: 'green',
                    children: (
                        <Space direction="vertical">
                            <Text strong>Mùa 4: Đế Vương (2025)</Text>
                            <Text type="secondary">Sắp diễn ra - Chuẩn bị cho kỷ nguyên mới</Text>
                            <Tag color="blue">Upcoming</Tag>
                        </Space>
                    ),
                },
                {
                    color: 'gold',
                    children: (
                        <Space direction="vertical">
                            <Text strong>Mùa 3: Thống Nhất (2024)</Text>
                            <Text type="secondary">Đang diễn ra - Thống nhất giang sơn</Text>
                            <Tag color="green">Active</Tag>
                        </Space>
                    ),
                },
                {
                    color: 'volcano',
                    children: (
                        <Space direction="vertical">
                            <Text strong>Mùa 2: Hùng Vương (2024)</Text>
                            <Text type="secondary">Đã kết thúc - Xây dựng nền móng</Text>
                            <Text>Người chiến thắng: ThiênLongĐế</Text>
                            <Tag color="red">Completed</Tag>
                        </Space>
                    ),
                },
                {
                    color: 'volcano',
                    children: (
                        <Space direction="vertical">
                            <Text strong>Mùa 1: Khai Quốc (2024)</Text>
                            <Text type="secondary">Mùa giải đầu tiên - Khai sáng</Text>
                            <Text>Người chiến thắng: BachDangChienThan</Text>
                            <Tag color="red">Completed</Tag>
                        </Space>
                    ),
                },
            ]}
        />
    </Card>
);

const SeasonRules = () => (
    <Card
        style={{
            border: '2px solid #D4AF37',
            borderRadius: '12px'
        }}
        title={
            <Space>
                <ScrollText style={{ color: '#8B0000' }} />
                <Text strong>Luật Lệ Mùa Giải</Text>
            </Space>
        }
    >
        <Collapse ghost>
            <Panel header="Hệ Thống Điểm" key="1">
                <Space direction="vertical" size="middle">
                    <Text strong>Cách tích lũy điểm mùa:</Text>
                    <List
                        size="small"
                        dataSource={[
                            'Chiến thắng PvP: +50 điểm',
                            'Chiến thắng PvE: +25 điểm',
                            'Hoàn thành nhiệm vụ hàng ngày: +100 điểm',
                            'Hoàn thành nhiệm vụ hàng tuần: +300 điểm',
                            'Tham gia sự kiện: +200 điểm',
                            'Chiến thắng sự kiện: +500 điểm',
                            'Xây dựng công trình: +10-50 điểm'
                        ]}
                        renderItem={item => (
                            <List.Item>
                                <CheckCircle size={14} style={{ color: '#52c41a', marginRight: '8px' }} />
                                {item}
                            </List.Item>
                        )}
                    />
                </Space>
            </Panel>
            <Panel header="Phần Thưởng" key="2">
                <Text>
                    Phần thưởng được trao dựa trên thứ hạng khi mùa giải kết thúc. 
                    Tất cả người chơi tham gia đều nhận được phần thưởng cơ bản.
                </Text>
            </Panel>
            <Panel header="Nhiệm Vụ" key="3">
                <Text>
                    Nhiệm vụ được làm mới hàng ngày, hàng tuần và có nhiệm vụ mùa kéo dài toàn bộ mùa giải.
                    Hoàn thành nhiệm vụ để nhận điểm và phần thưởng đặc biệt.
                </Text>
            </Panel>
            <Panel header="Sự Kiện" key="4">
                <Text>
                    Sự kiện đặc biệt diễn ra trong suốt mùa giải. Tham gia sự kiện để nhận điểm thưởng
                    và phần thưởng độc quyền không có ở nơi khác.
                </Text>
            </Panel>
        </Collapse>
    </Card>
);

export default SeasonPage;
