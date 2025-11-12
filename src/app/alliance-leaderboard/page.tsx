"use client"
// pages/alliance-leaderboard-page.tsx
import React, { useState } from 'react';
import {
    Layout,
    Card,
    Row,
    Col,
    Typography,
    Space,
    Tag,
    Button,
    Tabs,
    Select,
    Badge,
    Statistic,
    Input,
    Grid,
    Radio,
    notification,
} from 'antd';
import { ArrowUp, Globe, Search, TrendingUp, Trophy, UserCheck, UserPlus, Users, } from 'lucide-react';
import { MessageOutlined } from '@ant-design/icons';
import { AllianceDetailModal } from '@/components/layouts/regions/AllianceDetailModal';
import { MyAllianceCard } from '@/components/layouts/regions/MyAllianceCard';
import { AllianceRankingTable } from '@/components/layouts/regions/AllianceRankingTable';
import { AllianceCard } from '@/components/layouts/regions/AllianceCard';
import AllianceRegions from '@/components/layouts/regions/AllianceRegions';
import { JoinAllianceModal } from '@/components/layouts/regions/JoinAllianceModal';
import { alliances, languages, regions, sortOptions } from '@/components/layouts/regions/data';
// Một số tên icon thay thế cho "bản đồ":
import { 
    Map,           // Biểu tượng bản đồ cơ bản
} from 'lucide-react';
const { Title, Paragraph, Text } = Typography;
const { Search: AntSearch } = Input;
const { Option } = Select;
const { useBreakpoint } = Grid;
const { Header, Content } = Layout;

const AllianceLeaderboardPage = () => {
    const screens = useBreakpoint();
    const [activeTab, setActiveTab] = useState('ranking');
    const [selectedAlliance, setSelectedAlliance] = useState<Alliance | null>(null);
    const [isAllianceModalVisible, setIsAllianceModalVisible] = useState(false);
    const [isJoinModalVisible, setIsJoinModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('all');
    const [selectedLanguage, setSelectedLanguage] = useState('all');
    const [sortBy, setSortBy] = useState('power');
    const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('detailed');


      const openAllianceDetail = (alliance: Alliance) => {
        setSelectedAlliance(alliance);
        setIsAllianceModalVisible(true);
    };

    const handleJoinRequest = (alliance: Alliance) => {
        setSelectedAlliance(alliance);
        setIsJoinModalVisible(true);
    };

    const filteredAlliances = alliances.filter(alliance => {
        if (searchText && !alliance.name.toLowerCase().includes(searchText.toLowerCase()) &&
            !alliance.tag.toLowerCase().includes(searchText.toLowerCase())) {
            return false;
        }
        if (selectedRegion !== 'all' && alliance.region !== selectedRegion) return false;
        if (selectedLanguage !== 'all' && alliance.language !== selectedLanguage) return false;
        return true;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'power': return b.totalPower - a.totalPower;
            case 'level': return b.level - a.level;
            case 'members': return b.memberCount - a.memberCount;
            case 'territory': return b.territory - a.territory;
            case 'winRate': return b.winRate - a.winRate;
            default: return a.rank - b.rank;
        }
    });

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
                            TOP LIÊN MINH
                        </Title>
                    </div>

                    <Space>
                        <Button
                            type="link"
                            style={{ color: '#D4AF37', fontWeight: '600' }}
                            icon={<Trophy size={16} />}
                        >
                            Xếp Hạng
                        </Button>
                        <Button
                            type="link"
                            style={{ color: '#D4AF37', fontWeight: '600' }}
                            icon={<Users size={16} />}
                        >
                            Liên Minh Của Tôi
                        </Button>
                        <Button
                            type="link"
                            style={{ color: '#D4AF37', fontWeight: '600' }}
                            icon={<UserPlus size={16} />}
                        >
                            Tạo Liên Minh
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
                                            SỨC MẠNH TẬP THỂ
                                        </Tag>
                                        <Title level={1} style={{ color: '#D4AF37', margin: 0, fontSize: '3rem' }}>
                                            Bảng Xếp Hạng Liên Minh
                                        </Title>
                                    </div>

                                    <Paragraph style={{
                                        color: 'white',
                                        fontSize: '1.1rem',
                                        lineHeight: '1.6'
                                    }}>
                                        Đoàn kết tạo nên sức mạnh. Khám phá các liên minh hùng mạnh nhất,
                                        tìm kiếm đồng đội và cùng nhau xây dựng đế chế. Tham gia liên minh
                                        để nhận hỗ trợ và chiến thắng vĩ đại!
                                    </Paragraph>

                                    <Space wrap>
                                        <Button
                                            type="primary"
                                            icon={<UserPlus size={16} />}
                                            style={{
                                                background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                                                border: 'none',
                                                fontWeight: 'bold',
                                                color: '#8B0000',
                                                height: '48px',
                                                padding: '0 24px'
                                            }}
                                        >
                                            Tạo Liên Minh Mới
                                        </Button>
                                        <Button
                                            icon={<Search size={16} />}
                                            style={{
                                                background: 'rgba(212, 175, 55, 0.2)',
                                                border: '1px solid #D4AF37',
                                                color: '#D4AF37',
                                                height: '48px'
                                            }}
                                        >
                                            Tìm Liên Minh Phù Hợp
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
                                        Thống Kê Toàn Server
                                    </Title>
                                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                        <Statistic
                                            title="Tổng Liên Minh"
                                            value={1258}
                                            valueStyle={{ color: '#D4AF37' }}
                                            prefix={<Users size={16} />}
                                        />
                                        <Statistic
                                            title="Liên Minh Đang Tuyển"
                                            value={892}
                                            valueStyle={{ color: '#52c41a' }}
                                            prefix={<UserPlus size={16} />}
                                        />
                                        <Statistic
                                            title="Thành Viên Tích Cực"
                                            value={89234}
                                            valueStyle={{ color: '#FFD700' }}
                                            prefix={<UserCheck size={16} />}
                                        />
                                    </Space>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    {/* My Alliance */}
                    <MyAllianceCard />

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
                                    placeholder="Tìm kiếm liên minh..."
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
                                    value={selectedLanguage}
                                    onChange={setSelectedLanguage}
                                    style={{ width: '100%' }}
                                    suffixIcon={<MessageOutlined size={14} />}
                                >
                                    {languages.map(lang => (
                                        <Option key={lang.value} value={lang.value}>
                                            {lang.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Col>

                            <Col xs={12} md={4}>
                                <Select
                                    value={sortBy}
                                    onChange={setSortBy}
                                    style={{ width: '100%' }}
                                    suffixIcon={<ArrowUp size={14} />}
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
                                        {filteredAlliances.length} liên minh
                                    </Text>
                                </Space>
                            </Col>
                        </Row>
                    </Card>

                    {/* Main Content */}
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={[
                            {
                                key: 'ranking',
                                label: (
                                    <Space>
                                        <Trophy size={16} />
                                        Bảng Xếp Hạng
                                    </Space>
                                ),
                                children: screens.xs || viewMode === 'compact' ? (
                                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                        {filteredAlliances.map((alliance, index) => (
                                            <AllianceCard key={index} alliance={alliance} compact={viewMode === 'compact'} />
                                        ))}
                                    </Space>
                                ) : (
                                    <AllianceRankingTable filteredAlliances={filteredAlliances} handleJoinRequest={handleJoinRequest} openAllianceDetail={openAllianceDetail} />
                                )
                            },
                            {
                                key: 'recruiting',
                                label: (
                                    <Space>
                                        <UserPlus size={16} />
                                        Đang Tuyển Thành Viên
                                        <Badge count={filteredAlliances.filter(a => a.status === 'recruiting').length} />
                                    </Space>
                                ),
                                children: (
                                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                        {filteredAlliances
                                            .filter(alliance => alliance.status === 'recruiting')
                                            .map((alliance, index) => (
                                                <AllianceCard key={index} alliance={alliance} />
                                            ))
                                        }
                                    </Space>
                                )
                            },
                            {
                                key: 'regions',
                                label: (
                                    <Space>
                                        <Map size={16} />
                                        Phân Bổ Theo Vùng
                                    </Space>
                                ),
                                children: <AllianceRegions />
                            }
                        ]}
                    />
                </div>
            </Content>

            {/* Alliance Detail Modal */}
            <AllianceDetailModal
                alliance={selectedAlliance}
                visible={isAllianceModalVisible}
                onClose={() => setIsAllianceModalVisible(false)}
                onJoin={() => handleJoinRequest(selectedAlliance!)}
            />

            {/* Join Request Modal */}
            <JoinAllianceModal
                alliance={selectedAlliance}
                visible={isJoinModalVisible}
                onClose={() => setIsJoinModalVisible(false)}
                onConfirm={() => {
                    notification.success({
                        message: 'Đã gửi yêu cầu',
                        description: `Yêu cầu gia nhập ${selectedAlliance?.name} đã được gửi thành công`,
                        placement: 'topRight'
                    });
                    setIsJoinModalVisible(false);
                }}
            />
        </Layout>
    );
};


export default AllianceLeaderboardPage;
