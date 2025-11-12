// app/(admin)/generals/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Card,
    Button,
    Space,
    Row,
    Col,
    Statistic,
    Tag,
    Descriptions,
    Progress,
    Divider,
    Tabs,
    List,
    Avatar,
    Tooltip,
    Alert,
    Skeleton,
    Modal,
    message
} from 'antd';
import {
    ArrowLeftOutlined,
    EditOutlined,
    DeleteOutlined,
    StarFilled,
    FireOutlined,
    SunOutlined,
    MoonOutlined,
    TrophyOutlined,
    HeartOutlined,
    ShieldOutlined,
    ThunderboltOutlined,
    CrownOutlined
} from '@ant-design/icons';
import { Sword, Droplets, Moon, WindIcon, Sun, Mountain } from 'lucide-react';

const { TabPane } = Tabs;

export default function GeneralDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [generalData, setGeneralData] = useState<any>(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const generalId = params.id as string;

    // Load dữ liệu tướng
    useEffect(() => {
        const loadGeneralData = async () => {
            setLoading(true);
            try {
                // Mock API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                const mockData = {
                    id: generalId,
                    name: 'Lê Hoàn',
                    title: 'Đại Vương',
                    rarity: 'legendary',
                    element: 'fire',
                    type: 'warrior',
                    level: 95,
                    maxLevel: 100,
                    baseStats: {
                        attack: 950,
                        defense: 850,
                        health: 12000,
                        speed: 80,
                        intelligence: 70,
                        leadership: 95
                    },
                    currentStats: {
                        attack: 1250,
                        defense: 1050,
                        health: 15000,
                        speed: 85,
                        intelligence: 75,
                        leadership: 98
                    },
                    skills: [
                        {
                            id: '1',
                            name: 'Thiên Mệnh',
                            type: 'ultimate',
                            description: 'Tăng 50% sức mạnh toàn quân trong 30 giây',
                            level: 5,
                            maxLevel: 10,
                            cooldown: 60,
                            manaCost: 100
                        },
                        {
                            id: '2',
                            name: 'Long Bào',
                            type: 'passive',
                            description: 'Tăng 20% phòng thủ cho bản thân',
                            level: 3,
                            maxLevel: 5
                        }
                    ],
                    equipment: [
                        {
                            id: 'e1',
                            name: 'Kiếm Thánh',
                            type: 'weapon',
                            rarity: 'legendary',
                            level: 90,
                            enhancement: 15,
                            stats: { attack: 300 },
                            equipped: true
                        }
                    ],
                    status: 'active',
                    owner: 'player_001',
                    location: 'Thăng Long',
                    experience: 485000,
                    requiredExp: 500000,
                    starLevel: 5,
                    maxStarLevel: 6,
                    awakeningLevel: 3,
                    bondLevel: 4,
                    favorite: true,
                    obtainedDate: '2024-01-15',
                    lastUsed: '2024-12-01T10:30:00Z',
                    battleCount: 1250,
                    wins: 980,
                    winRate: 78.5,
                    specialAbilities: ['Thiên Mệnh', 'Long Bào', 'Vương Giả'],
                    voiceActor: 'Trần Văn A',
                    biography: 'Lê Hoàn (941-1005), tức Lê Đại Hành, là vị hoàng đế sáng lập nhà Tiền Lê trong lịch sử Việt Nam. Ông trị vì từ năm 980 đến năm 1005, sau khi dẹp loạn 12 sứ quân và đánh bại quân Tống xâm lược.',
                    quotes: [
                        'Thiên hạ thái bình là nguyện vọng của trẫm!',
                        'Vì dân vì nước, trẫm không ngại hy sinh!',
                        'Quân Tống dám xâm phạm, ắt phải trả giá!'
                    ],
                    image: '/generals/le-hoan.jpg',
                    thumbnail: '/generals/le-hoan-thumb.jpg'
                };

                setGeneralData(mockData);
            } catch (error) {
                console.error('Error loading general:', error);
            } finally {
                setLoading(false);
            }
        };

        if (generalId) {
            loadGeneralData();
        }
    }, [generalId]);

    // Helper functions
    const getRarityColor = (rarity: string) => {
        const colors = {
            common: '#8C8C8C',
            rare: '#1890FF',
            epic: '#722ED1',
            legendary: '#FA8C16',
            mythic: '#F5222D'
        };
        return colors[rarity as keyof typeof colors] || '#8C8C8C';
    };

    const getRarityText = (rarity: string) => {
        const texts = {
            common: 'Thường',
            rare: 'Hiếm',
            epic: 'Sử Thi',
            legendary: 'Huyền Thoại',
            mythic: 'Thần Thoại'
        };
        return texts[rarity as keyof typeof texts] || 'Thường';
    };

    const getElementIcon = (element: string) => {
        const icons = {
            fire: <FireOutlined style={{ color: '#FF4D4F' }} />,
            water: <Droplets style={{ color: '#1890FF' }} />,
            earth: <Mountain style={{ color: '#52C41A' }} />,
            wind: <WindIcon style={{ color: '#13C2C2' }} />,
            light: <SunOutlined style={{ color: '#FAAD14' }} />,
            dark: <MoonOutlined style={{ color: '#722ED1' }} />
        };
        return icons[element as keyof typeof icons] || <FireOutlined />;
    };

    const getElementText = (element: string) => {
        const texts = {
            fire: 'Hỏa',
            water: 'Thủy',
            earth: 'Thổ',
            wind: 'Phong',
            light: 'Quang',
            dark: 'Ám'
        };
        return texts[element as keyof typeof texts] || 'Hỏa';
    };

    const getTypeColor = (type: string) => {
        const colors = {
            warrior: '#CF1322',
            archer: '#389E0D',
            mage: '#722ED1',
            assassin: '#434343',
            support: '#08979C',
            tank: '#D46B08'
        };
        return colors[type as keyof typeof colors] || '#8C8C8C';
    };

    const getTypeText = (type: string) => {
        const texts = {
            warrior: 'Chiến Binh',
            archer: 'Cung Thủ',
            mage: 'Pháp Sư',
            assassin: 'Sát Thủ',
            support: 'Hỗ Trợ',
            tank: 'Đỡ Đòn'
        };
        return texts[type as keyof typeof texts] || 'Chiến Binh';
    };

    const getStatusColor = (status: string) => {
        const colors = {
            active: '#52C41A',
            inactive: '#8C8C8C',
            training: '#1890FF',
            deployed: '#FA8C16'
        };
        return colors[status as keyof typeof colors] || '#8C8C8C';
    };

    const getStatusText = (status: string) => {
        const texts = {
            active: 'Hoạt Động',
            inactive: 'Không Hoạt Động',
            training: 'Đang Huấn Luyện',
            deployed: 'Đã Triển Khai'
        };
        return texts[status as keyof typeof texts] || 'Không Hoạt Động';
    };

    const calculateCombatPower = (stats: any) => {
        if (!stats) return 0;
        return Math.round(
            stats.attack * 2 +
            stats.defense * 1.5 +
            stats.health * 0.1 +
            stats.speed * 3 +
            stats.intelligence * 1.2 +
            stats.leadership * 1.8
        );
    };

    const handleEdit = () => {
        router.push(`/admin/generals/${generalId}/edit`);
    };

    const handleDelete = () => {
        setDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        try {
            // Gọi API xóa
            await new Promise(resolve => setTimeout(resolve, 1000));
            message.success('Đã xóa tướng thành công');
            router.push('/admin/generals');
        } catch (error) {
            message.error('Có lỗi xảy ra khi xóa tướng');
        } finally {
            setDeleteModalVisible(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: 24 }}>
                <Card>
                    <Skeleton active paragraph={{ rows: 8 }} />
                </Card>
            </div>
        );
    }

    if (!generalData) {
        return (
            <div style={{ padding: 24 }}>
                <Alert
                    message="Lỗi"
                    description="Không tìm thấy thông tin tướng"
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    const combatPower = calculateCombatPower(generalData.currentStats);

    return (
        <div style={{ padding: 24 }}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.push('/generals')}
                    style={{ marginBottom: 16 }}
                >
                    Danh Sách Tướng
                </Button>

                <Row justify="space-between" align="middle">
                    <Col>
                        <h1 style={{ margin: 0, color: '#8B0000' }}>
                            {generalData.name}
                            <span style={{ fontSize: 16, color: '#666', marginLeft: 8 }}>
                                - {generalData.title}
                            </span>
                        </h1>
                    </Col>
                    <Col>
                        <Space>
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={handleEdit}
                            >
                                Chỉnh Sửa
                            </Button>
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={handleDelete}
                            >
                                Xóa
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </div>

            <Row gutter={[24, 24]}>
                {/* Thông tin chính */}
                <Col xs={24} lg={8}>
                    <Card>
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <Avatar
                                size={160}
                                src={generalData.image}
                                icon={<StarFilled />}
                                style={{
                                    border: `4px solid ${getRarityColor(generalData.rarity)}`,
                                    marginBottom: 16
                                }}
                            />
                            <div>
                                <Tag color={getRarityColor(generalData.rarity)} style={{ fontSize: 14 }}>
                                    {getRarityText(generalData.rarity)}
                                </Tag>
                                <Tag color={getTypeColor(generalData.type)} style={{ fontSize: 14 }}>
                                    {getTypeText(generalData.type)}
                                </Tag>
                                <div style={{ marginTop: 8 }}>
                                    <Space>
                                        {getElementIcon(generalData.element)}
                                        <span>{getElementText(generalData.element)}</span>
                                    </Space>
                                </div>
                            </div>
                        </div>

                        <Statistic
                            title="Sức Mạnh Chiến Đấu"
                            value={combatPower}
                            prefix={<Sword />}
                            valueStyle={{ color: '#8B0000', fontSize: 32 }}
                            suffix="CP"
                        />
                    </Card>

                    <Card title="Thông Tin Hệ Thống" style={{ marginTop: 24 }}>
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="ID">{generalData.id}</Descriptions.Item>
                            <Descriptions.Item label="Trạng Thái">
                                <Tag color={getStatusColor(generalData.status)}>
                                    {getStatusText(generalData.status)}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày Nhận">
                                {generalData.obtainedDate}
                            </Descriptions.Item>
                            <Descriptions.Item label="Lần Cuối Sử Dụng">
                                {new Date(generalData.lastUsed).toLocaleString('vi-VN')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Vị Trí">
                                {generalData.location}
                            </Descriptions.Item>
                            <Descriptions.Item label="Chủ Sở Hữu">
                                {generalData.owner || 'Hệ Thống'}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                {/* Chi tiết */}
                <Col xs={24} lg={16}>
                    <Tabs defaultActiveKey="stats">
                        <TabPane tab="Chỉ Số & Tiến Trình" key="stats">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={8}>
                                    <Card size="small">
                                        <Statistic
                                            title="Cấp Độ"
                                            value={generalData.level}
                                            suffix={`/ ${generalData.maxLevel}`}
                                            valueStyle={{ color: '#1890FF' }}
                                        />
                                        <Progress
                                            percent={Math.round((generalData.experience / generalData.requiredExp) * 100)}
                                            style={{ marginTop: 8 }}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Card size="small">
                                        <Statistic
                                            title="Sao"
                                            value={generalData.starLevel}
                                            suffix={`/ ${generalData.maxStarLevel}`}
                                            prefix={<StarFilled />}
                                            valueStyle={{ color: '#FA8C16' }}
                                        />
                                        <div style={{ marginTop: 8, textAlign: 'center' }}>
                                            {Array.from({ length: generalData.maxStarLevel }, (_, i) => (
                                                <StarFilled
                                                    key={i}
                                                    style={{
                                                        color: i < generalData.starLevel ? '#D4AF37' : '#d9d9d9',
                                                        margin: '0 2px'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </Card>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Card size="small">
                                        <Statistic
                                            title="Thức Tỉnh"
                                            value={generalData.awakeningLevel}
                                            prefix={<ThunderboltOutlined />}
                                            valueStyle={{ color: '#722ED1' }}
                                        />
                                    </Card>
                                </Col>
                            </Row>

                            <Divider />

                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={12}>
                                    <Card title="Chỉ Số Chiến Đấu" size="small">
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            <div>
                                                <strong>Tấn Công:</strong>
                                                <Progress
                                                    percent={Math.round((generalData.currentStats.attack / 2000) * 100)}
                                                    format={() => `${generalData.currentStats.attack} ATK`}
                                                    strokeColor="#CF1322"
                                                />
                                            </div>
                                            <div>
                                                <strong>Phòng Thủ:</strong>
                                                <Progress
                                                    percent={Math.round((generalData.currentStats.defense / 2000) * 100)}
                                                    format={() => `${generalData.currentStats.defense} DEF`}
                                                    strokeColor="#389E0D"
                                                />
                                            </div>
                                            <div>
                                                <strong>Sinh Lực:</strong>
                                                <Progress
                                                    percent={Math.round((generalData.currentStats.health / 20000) * 100)}
                                                    format={() => `${generalData.currentStats.health} HP`}
                                                    strokeColor="#1890FF"
                                                />
                                            </div>
                                        </Space>
                                    </Card>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Card title="Chỉ Số Đặc Biệt" size="small">
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            <div>
                                                <strong>Tốc Độ:</strong>
                                                <Progress
                                                    percent={Math.round((generalData.currentStats.speed / 200) * 100)}
                                                    format={() => `${generalData.currentStats.speed} SPD`}
                                                    strokeColor="#722ED1"
                                                />
                                            </div>
                                            <div>
                                                <strong>Trí Tuệ:</strong>
                                                <Progress
                                                    percent={Math.round((generalData.currentStats.intelligence / 200) * 100)}
                                                    format={() => `${generalData.currentStats.intelligence} INT`}
                                                    strokeColor="#FA8C16"
                                                />
                                            </div>
                                            <div>
                                                <strong>Lãnh Đạo:</strong>
                                                <Progress
                                                    percent={Math.round((generalData.currentStats.leadership / 200) * 100)}
                                                    format={() => `${generalData.currentStats.leadership} LDR`}
                                                    strokeColor="#D4AF37"
                                                />
                                            </div>
                                        </Space>
                                    </Card>
                                </Col>
                            </Row>

                            <Divider />

                            <Card title="Thống Kê Chiến Trận" size="small">
                                <Row gutter={[16, 16]}>
                                    <Col xs={12} md={6}>
                                        <Statistic
                                            title="Tổng Số Trận"
                                            value={generalData.battleCount}
                                            prefix={<Sword />}
                                        />
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Statistic
                                            title="Số Trận Thắng"
                                            value={generalData.wins}
                                            prefix={<TrophyOutlined />}
                                        />
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Statistic
                                            title="Tỷ Lệ Thắng"
                                            value={generalData.winRate}
                                            suffix="%"
                                            valueStyle={{
                                                color: generalData.winRate >= 70 ? '#52C41A' :
                                                    generalData.winRate >= 50 ? '#FAAD14' : '#F5222D'
                                            }}
                                        />
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Statistic
                                            title="Cấp Thân Mật"
                                            value={generalData.bondLevel}
                                            prefix={<HeartOutlined />}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </TabPane>

                        <TabPane tab="Kỹ Năng & Trang Bị" key="skills">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={12}>
                                    <Card title="Kỹ Năng" size="small">
                                        <List
                                            dataSource={generalData.skills}
                                            renderItem={(skill: any) => (
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={
                                                            <Avatar
                                                                style={{
                                                                    backgroundColor: skill.type === 'ultimate' ? '#F5222D' :
                                                                        skill.type === 'active' ? '#1890FF' : '#52C41A'
                                                                }}
                                                            >
                                                                {skill.type === 'ultimate' ? 'U' :
                                                                    skill.type === 'active' ? 'A' : 'P'}
                                                            </Avatar>
                                                        }
                                                        title={skill.name}
                                                        description={
                                                            <div>
                                                                <div>{skill.description}</div>
                                                                <div style={{ marginTop: 4, fontSize: 12, color: '#666' }}>
                                                                    Cấp {skill.level}/{skill.maxLevel}
                                                                    {skill.cooldown && ` • CD: ${skill.cooldown}s`}
                                                                    {skill.manaCost && ` • MP: ${skill.manaCost}`}
                                                                </div>
                                                            </div>
                                                        }
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Card title="Trang Bị" size="small">
                                        <List
                                            dataSource={generalData.equipment}
                                            renderItem={(item: any) => (
                                                <List.Item
                                                    actions={[
                                                        <Tag key={0} color={getRarityColor(item.rarity)}>
                                                            {item.rarity}
                                                        </Tag>
                                                    ]}
                                                >
                                                    <List.Item.Meta
                                                        avatar={
                                                            <Avatar
                                                                style={{
                                                                    backgroundColor: item.equipped ? '#52C41A' : '#8C8C8C'
                                                                }}
                                                            >
                                                                {item.type.charAt(0).toUpperCase()}
                                                            </Avatar>
                                                        }
                                                        title={
                                                            <Space>
                                                                {item.name}
                                                                {item.equipped && <Tag color="green">Đang Trang Bị</Tag>}
                                                            </Space>
                                                        }
                                                        description={
                                                            <div>
                                                                <div>Cấp {item.level} • +{item.enhancement}</div>
                                                                <div style={{ fontSize: 12, color: '#666' }}>
                                                                    ATK: +{item.stats.attack}
                                                                </div>
                                                            </div>
                                                        }
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </TabPane>

                        <TabPane tab="Tiểu Sử & Câu Nói" key="bio">
                            <Card title="Tiểu Sử">
                                <p style={{ lineHeight: 1.8, textAlign: 'justify' }}>
                                    {generalData.biography}
                                </p>
                            </Card>

                            <Card title="Khả Năng Đặc Biệt" style={{ marginTop: 16 }}>
                                <div>
                                    {generalData.specialAbilities.map((ability: string, index: number) => (
                                        <Tag
                                            key={index}
                                            color="blue"
                                            style={{ marginBottom: 8 }}
                                        >
                                            {ability}
                                        </Tag>
                                    ))}
                                </div>
                            </Card>

                            <Card title="Câu Nói Đặc Biệt" style={{ marginTop: 16 }}>
                                <List
                                    dataSource={generalData.quotes}
                                    renderItem={(quote: string, index: number) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<Avatar>{index + 1}</Avatar>}
                                                description={
                                                    <div style={{ fontStyle: 'italic', color: '#8B4513' }}>
                                                        &quot; {quote} &quot;
                                                    </div>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>

            {/* Delete Confirmation Modal */}
            <Modal
                title="Xác Nhận Xóa Tướng"
                open={deleteModalVisible}
                onOk={confirmDelete}
                onCancel={() => setDeleteModalVisible(false)}
                okText="Xóa"
                cancelText="Hủy"
                okType="danger"
            >
                <p>
                    Bạn có chắc chắn muốn xóa tướng <strong>{generalData.name}</strong>?
                </p>
                <Alert
                    message="Cảnh Báo"
                    description="Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến tướng sẽ bị xóa vĩnh viễn."
                    type="warning"
                    showIcon
                />
            </Modal>
        </div>
    );
}
