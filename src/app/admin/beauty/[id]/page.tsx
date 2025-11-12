// app/(admin)/beauty-system/[id]/page.tsx
'use client';

import React, { useState } from 'react';
import {
    Card,
    Row,
    Col,
    Tag,
    Button,
    Space,
    Descriptions,
    Progress,
    Avatar,
    Divider,
    Tabs,
    List,
    Statistic,
    Badge,
    Modal,
    message,
    Timeline,
    Tooltip,
    Image,
    Grid,
    Rate,
    Collapse,
    FloatButton
} from 'antd';
import {
    ArrowLeftOutlined,
    EditOutlined,
    RocketOutlined,
    ReadOutlined,
    CrownOutlined,
    StarOutlined,
    TeamOutlined,
    HistoryOutlined,
    GiftOutlined,
    SafetyCertificateOutlined,
    ThunderboltOutlined,
    HeartOutlined,
    EyeOutlined,
    CopyOutlined,
    ShareAltOutlined,
    SettingOutlined,
    TrophyOutlined,
    FireOutlined,
    BulbOutlined,
    GlobalOutlined,
    ClusterOutlined,
    CalendarOutlined,
    IdcardOutlined,
    PictureOutlined
} from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import { BeautyCharacter, BeautySkill, Costume, Jewelry } from '@/types/beauty-system';
import { Shield } from 'lucide-react';
import { getAttributeColor, getRarityColor } from '@/lib/utils/beauty-helpers';

const { useBreakpoint } = Grid;
const { Panel } = Collapse;

// Mock data phù hợp với interface hiện có
const mockBeauty: BeautyCharacter = {
    id: 'beauty_001',
    name: 'Tây Thi',
    title: 'Tuyệt Sắc Giai Nhân',
    description: 'Một trong tứ đại mỹ nhân Trung Hoa, nổi tiếng với nụ cười nghiêng nước nghiêng thành.',
    rarity: 'legendary',
    level: 50,
    experience: 32000,
    maxLevel: 60,
    attributes: {
        charm: 98,
        intelligence: 82,
        diplomacy: 76,
        intrigue: 88,
        loyalty: 95,
    },
    skills: [
        {
            id: 'skill_001',
            name: 'Nụ Cười Nghiêng Nước',
            description: 'Tăng sức hút và khả năng thành công trong sứ mệnh ngoại giao.',
            type: 'passive',
            effect: {
                type: 'mission_success',
                value: 15,
                target: 'diplomatic_mission'
            },
            level: 3,
            maxLevel: 5,
        },
        {
            id: 'skill_002',
            name: 'Vũ Điệu Bích Ba',
            description: 'Khiêu vũ uyển chuyển làm mê hoặc đối phương.',
            type: 'active',
            effect: {
                type: 'attribute_boost',
                value: 25,
                target: 'charm'
            },
            cooldown: 12,
            level: 2,
            maxLevel: 5,
        }
    ],
    costumes: [
        {
            id: 'costume_001',
            name: 'Lụa Bích Thủy',
            rarity: 'epic',
            attributes: {
                charm: 20,
                intelligence: 5,
                diplomacy: 8
            },
            equipped: true,
            image: '/images/costumes/bich-thuy-icon.png',
        }
    ],
    jewelry: [
        {
            id: 'jewelry_001',
            name: 'Trâm Ngọc Lam',
            type: 'hairpin',
            rarity: 'rare',
            attributes: {
                charm: 10,
                intrigue: 4,
                loyalty: 6
            },
            equipped: true,
            image: '/images/jewelry/hairpin-icon.png',
        }
    ],
    status: 'available',
    avatar: '/images/beauties/tay-thi-avatar.jpg',
    fullImage: '/images/beauties/tay-thi-full.jpg',
    acquisitionDate: '2025-02-10',
    lastUsed: '2025-10-15T14:30:00Z',
    missionSuccessRate: 90,
};

const BeautyDetailPage = () => {
    const router = useRouter();
    const params = useParams();
    const screens = useBreakpoint();
    const [activeTab, setActiveTab] = useState('overview');
    const [isFavorite, setIsFavorite] = useState(true);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const character = mockBeauty;

    // Helper functions
    const getRarityColor = (rarity: string) => {
        const colors: { [key: string]: string } = {
            common: '#8C8C8C',
            rare: '#1890FF',
            epic: '#722ED1',
            legendary: '#FAAD14',
        };
        return colors[rarity] || '#8C8C8C';
    };

    const getRarityGradient = (rarity: string) => {
        const gradients: { [key: string]: string } = {
            common: 'linear-gradient(135deg, #8C8C8C 0%, #BFBFBF 100%)',
            rare: 'linear-gradient(135deg, #1890FF 0%, #69C0FF 100%)',
            epic: 'linear-gradient(135deg, #722ED1 0%, #9254DE 100%)',
            legendary: 'linear-gradient(135deg, #FAAD14 0%, #FFC53D 100%)',
        };
        return gradients[rarity] || gradients.common;
    };

    const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            available: 'green',
            mission: 'blue',
            training: 'orange',
            resting: 'purple',
        };
        return colors[status] || 'default';
    };

    const getAttributeColor = (value: number) => {
        if (value >= 90) return '#FF4D4F';
        if (value >= 80) return '#FAAD14';
        if (value >= 70) return '#52C41A';
        if (value >= 60) return '#1890FF';
        return '#8C8C8C';
    };

    // Tính toán các giá trị thống kê từ dữ liệu có sẵn
    const characterStats = {
        missionsCompleted: Math.floor(character.missionSuccessRate * 0.5), // Ước tính từ success rate
        successRate: character.missionSuccessRate,
        battleWinRate: 67, // Giá trị mặc định
        interactions: 45, // Giá trị mặc định
        trainingSessions: 15, // Giá trị mặc định
        giftsGiven: 23, // Giá trị mặc định
    };

    // Handlers
    const handleViewImage = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setImageModalVisible(true);
    };

    const handleQuickAction = (action: string) => {
        const actions: { [key: string]: () => void } = {
            mission: () => {
                if (character.status !== 'available') {
                    message.warning(`${character.name} đang không ở trạng thái sẵn sàng!`);
                    return;
                }
                message.info(`Giao nhiệm vụ cho ${character.name}`);
            },
            train: () => {
                if (character.status !== 'available') {
                    message.warning(`${character.name} đang không ở trạng thái sẵn sàng!`);
                    return;
                }
                message.info(`Huấn luyện ${character.name}`);
            },
            edit: () => router.push(`/beauty-system/${character.id}/edit`),
            favorite: () => {
                setIsFavorite(!isFavorite);
                message.success(!isFavorite ? 'Đã thêm vào yêu thích' : 'Đã bỏ khỏi yêu thích');
            }
        };
        actions[action]?.();
    };

    return (
        <div className="beauty-detail-page">
            {/* Hero Section */}
            <div
                className="hero-section bg-[#8B0000] relative rounded-2xl overflow-hidden mb-6"
                style={{
                    minHeight: '200px'
                }}
            >
                <div className="absolute inset-0 bg-opacity-20"></div>
                <div className="relative  z-10 p-6 text-white">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={() => router.back()}
                                className="bg-white bg-opacity-20 border-white text-white hover:bg-opacity-30"
                            >
                                Quay Lại
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold drop-shadow-lg">{character.name}</h1>
                                <p className="text-lg opacity-90 drop-shadow">{character.title}</p>
                            </div>
                        </div>
                        <Space>
                            <Tooltip title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}>
                                <Button
                                    icon={<HeartOutlined />}
                                    type={isFavorite ? "primary" : "default"}
                                    danger={isFavorite}
                                    onClick={() => handleQuickAction('favorite')}
                                    className="bg-white bg-opacity-20 border-white text-white"
                                />
                            </Tooltip>
                            <Button
                                icon={<ShareAltOutlined />}
                                className="bg-white bg-opacity-20 border-white text-white"
                            >
                                Chia Sẻ
                            </Button>
                            <Button
                                icon={<EditOutlined />}
                                onClick={() => handleQuickAction('edit')}
                                className="bg-white bg-opacity-20 border-white text-white"
                            >
                                Chỉnh Sửa
                            </Button>
                        </Space>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <Row gutter={[24, 24]}>
                {/* Left Column - Character Profile */}
                <Col xs={24} lg={8}>
                    {/* Character Card */}
                    <Card className="profile-card text-center shadow-lg relative overflow-hidden">
                        <div
                            className="absolute top-0 left-0 right-0 h-2"
                            style={{ background: getRarityGradient(character.rarity) }}
                        ></div>

                        <div className="relative -mt-8 mb-4">
                            <div className="relative inline-block">
                                <Avatar
                                    size={120}
                                    src={character.avatar}
                                    className="border-4 border-white shadow-2xl"
                                />
                                <div className="absolute -bottom-2 -right-2">
                                    <Tag
                                        color={getRarityColor(character.rarity)}
                                        className="font-bold px-3 py-1 rounded-full"
                                    >
                                        <CrownOutlined /> {character.rarity.toUpperCase()}
                                    </Tag>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Level & Progress */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-gray-700">Cấp Độ</span>
                                    <div className="flex items-center space-x-1">
                                        <span className="text-xl font-bold text-red-600">Lv.{character.level}</span>
                                        <StarOutlined className="text-yellow-500" />
                                    </div>
                                </div>
                                <Progress
                                    percent={Math.round((character.experience / (character.level * 1000)) * 100)}
                                    strokeColor={{
                                        '0%': '#D4AF37',
                                        '100%': '#FFD700',
                                    }}
                                    showInfo={false}
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                    {character.experience.toLocaleString()} EXP
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <Row gutter={[8, 8]}>
                                <Col span={12}>
                                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                                        <RocketOutlined className="text-blue-600 text-xl mb-1" />
                                        <div className="font-bold text-blue-700">{characterStats.missionsCompleted}</div>
                                        <div className="text-xs text-blue-600">Nhiệm Vụ</div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="bg-green-50 rounded-lg p-3 text-center">
                                        <SafetyCertificateOutlined className="text-green-600 text-xl mb-1" />
                                        <div className="font-bold text-green-700">{characterStats.successRate}%</div>
                                        <div className="text-xs text-green-600">Thành Công</div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="bg-orange-50 rounded-lg p-3 text-center">
                                        <ThunderboltOutlined className="text-orange-600 text-xl mb-1" />
                                        <div className="font-bold text-orange-700">{characterStats.battleWinRate}%</div>
                                        <div className="text-xs text-orange-600">Thắng Trận</div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                                        <TeamOutlined className="text-purple-600 text-xl mb-1" />
                                        <div className="font-bold text-purple-700">{characterStats.interactions}</div>
                                        <div className="text-xs text-purple-600">Tương Tác</div>
                                    </div>
                                </Col>
                            </Row>

                            {/* Quick Actions */}
                            <Space direction="vertical" className="w-full">
                                <Button
                                    type="primary"
                                    icon={<RocketOutlined />}
                                    onClick={() => handleQuickAction('mission')}
                                    disabled={character.status !== 'available'}
                                    block
                                    size="large"
                                >
                                    Giao Nhiệm Vụ
                                </Button>
                                <Button
                                    icon={<ReadOutlined />}
                                    onClick={() => handleQuickAction('train')}
                                    disabled={character.status !== 'available'}
                                    block
                                    size="large"
                                >
                                    Huấn Luyện
                                </Button>
                            </Space>
                        </div>
                    </Card>

                    {/* Character Info */}
                    <Card title="Thông Tin Cá Nhân" className="mt-4 shadow-sm">
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label={<><IdcardOutlined /> ID</>}>
                                <code>{character.id}</code>
                            </Descriptions.Item>
                            <Descriptions.Item label={<><CalendarOutlined /> Ngày Nhận</>}>
                                {new Date(character.acquisitionDate).toLocaleDateString('vi-VN')}
                            </Descriptions.Item>
                            <Descriptions.Item label={<><HistoryOutlined /> Lần Cuối</>}>
                                {new Date(character.lastUsed).toLocaleDateString('vi-VN')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng Thái">
                                <Tag color={getStatusColor(character.status)}>
                                    {character.status === 'available' ? 'Sẵn Sàng' :
                                        character.status === 'mission' ? 'Nhiệm Vụ' :
                                            character.status === 'training' ? 'Huấn Luyện' : 'Nghỉ Ngơi'}
                                </Tag>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    {/* Image Gallery */}
                    <Card title={<><PictureOutlined /> Hình Ảnh</>} className="mt-4 shadow-sm">
                        <Row gutter={[8, 8]}>
                            <Col span={12}>
                                <div
                                    className="cursor-pointer transition-all duration-300 hover:scale-105"
                                    onClick={() => handleViewImage(character.avatar)}
                                >
                                    <Image
                                        src={character.avatar}
                                        alt="Avatar"
                                        className="w-full h-20 object-cover rounded-lg shadow-sm"
                                        preview={false}
                                    />
                                    <div className="text-xs text-center mt-1 text-gray-600">
                                        Avatar
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div
                                    className="cursor-pointer transition-all duration-300 hover:scale-105"
                                    onClick={() => handleViewImage(character.fullImage)}
                                >
                                    <Image
                                        src={character.fullImage}
                                        alt="Full Image"
                                        className="w-full h-20 object-cover rounded-lg shadow-sm"
                                        preview={false}
                                    />
                                    <div className="text-xs text-center mt-1 text-gray-600">
                                        Toàn Thân
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Right Column - Detailed Information */}
                <Col xs={24} lg={16}>
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={[
                            {
                                key: 'overview',
                                label: (
                                    <span className="flex items-center">
                                        <GlobalOutlined className="mr-2" />
                                        Tổng Quan
                                    </span>
                                ),
                                children: <OverviewTab character={character} />
                            },
                            {
                                key: 'attributes',
                                label: (
                                    <span className="flex items-center">
                                        <ClusterOutlined className="mr-2" />
                                        Thuộc Tính
                                    </span>
                                ),
                                children: <AttributesTab character={character} />
                            },
                            {
                                key: 'skills',
                                label: (
                                    <span className="flex items-center">
                                        <BulbOutlined className="mr-2" />
                                        Kỹ Năng
                                    </span>
                                ),
                                children: <SkillsTab character={character} />
                            },
                            {
                                key: 'equipment',
                                label: (
                                    <span className="flex items-center">
                                        <Shield className="mr-2" />
                                        Trang Bị
                                    </span>
                                ),
                                children: <EquipmentTab character={character} />
                            },
                            {
                                key: 'statistics',
                                label: (
                                    <span className="flex items-center">
                                        <TrophyOutlined className="mr-2" />
                                        Thống Kê
                                    </span>
                                ),
                                children: <StatisticsTab character={character} stats={characterStats} />
                            }
                        ]}
                        size="large"
                    />
                </Col>
            </Row>

            {/* Image Modal */}
            <Modal
                open={imageModalVisible}
                onCancel={() => setImageModalVisible(false)}
                footer={null}
                width="80vw"
                style={{ top: 20 }}
                className="image-modal"
            >
                <Image
                    src={selectedImage}
                    alt="Character Image"
                    style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                />
            </Modal>

            {/* Floating Action Button */}
            <FloatButton.Group
                shape="circle"
                style={{ right: 24 }}
                icon={<SettingOutlined />}
            >
                <FloatButton
                    icon={<CopyOutlined />}
                    tooltip="Sao chép ID"
                    onClick={() => {
                        navigator.clipboard.writeText(character.id);
                        message.success('Đã sao chép ID nhân vật');
                    }}
                />
                <FloatButton
                    icon={<HeartOutlined />}
                    tooltip={isFavorite ? "Bỏ yêu thích" : "Thêm yêu thích"}
                    type={isFavorite ? "primary" : "default"}
                    onClick={() => handleQuickAction('favorite')}
                />
            </FloatButton.Group>
        </div>
    );
};

// Tab Components với thiết kế mới
const OverviewTab = ({ character }: { character: BeautyCharacter }) => (
    <div className="space-y-6">
        {/* Description */}
        <Card
            title={
                <span className="flex items-center">
                    <FireOutlined className="mr-2 text-red-500" />
                    Mô Tả Nhân Vật
                </span>
            }
            className="shadow-sm"
        >
            <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed text-lg">{character.description}</p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <p className="text-gray-600 italic">{'"' + character.title + '"'}</p>
                </div>
            </div>
        </Card>

        {/* Basic Info */}
        <Card title="Thông Tin Cơ Bản" className="shadow-sm">
            <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="Độ Hiếm">
                    <Tag color={getRarityColor(character.rarity)}>
                        {character.rarity === 'common' ? 'Thường' :
                            character.rarity === 'rare' ? 'Hiếm' :
                                character.rarity === 'epic' ? 'Siêu Cấp' : 'Huyền Thoại'}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Cấp Độ Tối Đa">
                    {character.maxLevel}
                </Descriptions.Item>
                <Descriptions.Item label="Kinh Nghiệm Hiện Tại">
                    {character.experience.toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Tỷ Lệ Thành Công">
                    {character.missionSuccessRate}%
                </Descriptions.Item>
            </Descriptions>
        </Card>
    </div>
);

const AttributesTab = ({ character }: { character: BeautyCharacter }) => (
    <div className="space-y-6">
        {/* Main Attributes */}
        <Card title="Thuộc Tính Chính" className="shadow-sm">
            <Row gutter={[16, 16]}>
                {Object.entries(character.attributes).map(([key, value]) => (
                    <Col xs={24} md={12} key={key}>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold capitalize">
                                    {key === 'charm' ? '💝 Duyên Dáng' :
                                        key === 'intelligence' ? '🧠 Trí Tuệ' :
                                            key === 'diplomacy' ? '🤝 Ngoại Giao' :
                                                key === 'intrigue' ? '🎭 Mưu Mẹo' : '🛡️ Trung Thành'}
                                </span>
                                <span
                                    className="font-bold text-lg"
                                    style={{ color: getAttributeColor(value) }}
                                >
                                    {value}/100
                                </span>
                            </div>
                            <Progress
                                percent={value}
                                strokeColor={{
                                    '0%': getAttributeColor(value),
                                    '100%': getAttributeColor(value),
                                }}
                                showInfo={false}
                            />
                        </div>
                    </Col>
                ))}
            </Row>
        </Card>

        {/* Attribute Summary */}
        <Card title="Tổng Quan Thuộc Tính" className="shadow-sm">
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                            {Object.values(character.attributes).reduce((a, b) => a + b, 0)}
                        </div>
                        <div className="text-sm text-blue-600">Tổng Điểm</div>
                    </div>
                </Col>
                <Col span={8}>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                            {Math.round(Object.values(character.attributes).reduce((a, b) => a + b, 0) / Object.values(character.attributes).length)}
                        </div>
                        <div className="text-sm text-green-600">Điểm TB</div>
                    </div>
                </Col>
                <Col span={8}>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                            {Math.max(...Object.values(character.attributes))}
                        </div>
                        <div className="text-sm text-purple-600">Điểm Cao Nhất</div>
                    </div>
                </Col>
            </Row>
        </Card>
    </div>
);

const SkillsTab = ({ character }: { character: BeautyCharacter }) => (
    <Collapse
        ghost
        className="skills-collapse"
        defaultActiveKey={['active', 'passive']}
    >
        <Panel
            header={
                <span className="flex items-center text-blue-600 font-semibold">
                    <BulbOutlined className="mr-2" />
                    Kỹ Năng Chủ Động ({character.skills.filter(s => s.type === 'active').length})
                </span>
            }
            key="active"
        >
            <List
                dataSource={character.skills.filter(skill => skill.type === 'active')}
                renderItem={skill => (
                    <List.Item className="!px-0">
                        <Card size="small" className="w-full hover:shadow-md transition-shadow">
                            <div className="flex items-start space-x-4">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-lg">{skill.name}</h4>
                                        <Space>
                                            <Tag color="blue">Lv.{skill.level}</Tag>
                                            <Badge count="Chủ Động" style={{ backgroundColor: '#1890FF' }} />
                                        </Space>
                                    </div>
                                    <p className="text-gray-600 mb-2">{skill.description}</p>
                                    <div className="flex space-x-4 text-sm text-gray-500">
                                        <span>⏱️ {skill.cooldown}h CD</span>
                                        <span>🎯 {skill.effect.value}% {skill.effect.target}</span>
                                        <span>📈 {skill.effect.type.replace('_', ' ')}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
        </Panel>

        <Panel
            header={
                <span className="flex items-center text-green-600 font-semibold">
                    <BulbOutlined className="mr-2" />
                    Kỹ Năng Bị Động ({character.skills.filter(s => s.type === 'passive').length})
                </span>
            }
            key="passive"
        >
            <List
                dataSource={character.skills.filter(skill => skill.type === 'passive')}
                renderItem={skill => (
                    <List.Item className="!px-0">
                        <Card size="small" className="w-full hover:shadow-md transition-shadow">
                            <div className="flex items-start space-x-4">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-lg">{skill.name}</h4>
                                        <Tag color="green">Bị Động</Tag>
                                    </div>
                                    <p className="text-gray-600">{skill.description}</p>
                                    <div className="text-sm text-gray-500 mt-2">
                                        Hiệu ứng: {skill.effect.value}% {skill.effect.target}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
        </Panel>
    </Collapse>
);

const EquipmentTab = ({ character }: { character: BeautyCharacter }) => (
    <div className="space-y-6">
        {/* Costumes */}
        <Card title="🦺 Trang Phục" className="shadow-sm">
            <Row gutter={[16, 16]}>
                {character.costumes.map(costume => (
                    <Col xs={24} key={costume.id}>
                        <Card
                            size="small"
                            className={`border-l-4 ${costume.equipped
                                    ? 'border-l-green-500 bg-green-50'
                                    : 'border-l-gray-300'
                                } hover:shadow-md transition-shadow`}
                        >
                            <div className="flex items-center space-x-4">
                                <Avatar size={60} src={costume.image} shape="square" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h4 className="font-semibold text-lg">{costume.name}</h4>
                                            <Tag color={getRarityColor(costume.rarity)}>
                                                {costume.rarity.toUpperCase()}
                                            </Tag>
                                        </div>
                                        {costume.equipped && (
                                            <Badge status="success" text="Đang trang bị" />
                                        )}
                                    </div>
                                    <div className="flex space-x-4 text-sm text-gray-500">
                                        <span>Duyên +{costume.attributes.charm}</span>
                                        <span>Trí +{costume.attributes.intelligence}</span>
                                        <span>Giao +{costume.attributes.diplomacy}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Card>

        {/* Jewelry */}
        <Card title="💎 Trang Sức" className="shadow-sm">
            <Row gutter={[16, 16]}>
                {character.jewelry.map(jewelry => (
                    <Col xs={24} md={12} key={jewelry.id}>
                        <Card
                            size="small"
                            className={`border-l-4 ${jewelry.equipped
                                    ? 'border-l-blue-500 bg-blue-50'
                                    : 'border-l-gray-300'
                                } hover:shadow-md transition-shadow`}
                        >
                            <div className="flex items-center space-x-3">
                                <Avatar size={50} src={jewelry.image} />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-semibold">{jewelry.name}</h4>
                                        <Tag color={getRarityColor(jewelry.rarity)}>
                                            {jewelry.rarity}
                                        </Tag>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="text-xs text-gray-500">
                                            {jewelry.equipped ? '✅ Đang đeo' : '❌ Chưa đeo'}
                                        </div>
                                        <div className="text-xs">
                                            <span>Duyên +{jewelry.attributes.charm}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Card>
    </div>
);

const StatisticsTab = ({ character, stats }: { character: BeautyCharacter, stats: any }) => (
    <div className="space-y-6">
        <Row gutter={[16, 16]}>
            {[
                { title: 'Tổng Nhiệm Vụ', value: stats.missionsCompleted, icon: <RocketOutlined />, color: '#1890FF' },
                { title: 'Tỷ Lệ Thành Công', value: stats.successRate, suffix: '%', icon: <SafetyCertificateOutlined />, color: '#52C41A' },
                { title: 'Thắng Trận', value: stats.battleWinRate, suffix: '%', icon: <ThunderboltOutlined />, color: '#FF4D4F' },
                { title: 'Huấn Luyện', value: stats.trainingSessions, icon: <ReadOutlined />, color: '#722ED1' },
                { title: 'Tương Tác', value: stats.interactions, icon: <TeamOutlined />, color: '#13C2C2' },
                { title: 'Quà Tặng', value: stats.giftsGiven, icon: <GiftOutlined />, color: '#FA8C16' },
            ].map((stat, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                    <Card
                        size="small"
                        className="text-center hover:shadow-md transition-shadow border-0"
                        bodyStyle={{ padding: '20px' }}
                    >
                        <div
                            className="text-2xl mb-2"
                            style={{ color: stat.color }}
                        >
                            {stat.icon}
                        </div>
                        <Statistic
                            title={stat.title}
                            value={stat.value}
                            suffix={stat.suffix}
                            valueStyle={{ color: stat.color, fontSize: '24px' }}
                        />
                    </Card>
                </Col>
            ))}
        </Row>

        {/* Progress Charts */}
        <Card title="📊 Hiệu Suất Chi Tiết" className="shadow-sm">
            <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">Hoàn thành nhiệm vụ</span>
                                <span className="font-bold text-green-600">{stats.successRate}%</span>
                            </div>
                            <Progress
                                percent={stats.successRate}
                                strokeColor={{
                                    '0%': '#52C41A',
                                    '100%': '#73D13D',
                                }}
                            />
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">Tỷ lệ thắng trận</span>
                                <span className="font-bold text-red-600">{stats.battleWinRate}%</span>
                            </div>
                            <Progress
                                percent={stats.battleWinRate}
                                strokeColor={{
                                    '0%': '#FF4D4F',
                                    '100%': '#FF7A45',
                                }}
                            />
                        </div>
                    </div>
                </Col>
                <Col xs={24} md={12}>
                    <div className="bg-gray-50 rounded-lg p-4 h-full">
                        <h4 className="font-semibold mb-3">Lịch Sử Hoạt Động</h4>
                        <Timeline>
                            <Timeline.Item color="green">
                                <p>Nhận nhân vật: {new Date(character.acquisitionDate).toLocaleDateString('vi-VN')}</p>
                            </Timeline.Item>
                            <Timeline.Item color="blue">
                                <p>Nhiệm vụ hoàn thành: {stats.missionsCompleted}</p>
                            </Timeline.Item>
                            <Timeline.Item color="orange">
                                <p>Tương tác với người chơi: {stats.interactions}</p>
                            </Timeline.Item>
                            <Timeline.Item color="purple">
                                <p>Quà tặng đã nhận: {stats.giftsGiven}</p>
                            </Timeline.Item>
                        </Timeline>
                    </div>
                </Col>
            </Row>
        </Card>
    </div>
);

export default BeautyDetailPage;
