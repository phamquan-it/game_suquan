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
  PictureOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import { BeautyCharacter, BeautySkill, Costume, Jewelry } from '@/types/beauty-system';
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
  charm: undefined,
  intelligence: undefined,
  diplomacy: undefined
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
    <div className="beauty-detail-page" style={{ padding: '24px' }}>
      {/* Hero Section */}
      <div
        className="hero-section"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.95) 0%, rgba(0, 51, 102, 0.95) 100%)',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '24px',
          minHeight: '200px',
          padding: '24px'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            display: 'flex',
            flexDirection: screens.lg ? 'row' : 'column',
            alignItems: screens.lg ? 'center' : 'flex-start',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => router.back()}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white'
                }}
              >
                Quay Lại
              </Button>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', margin: 0 }}>{character.name}</h1>
                <p style={{ fontSize: '16px', opacity: 0.9, color: 'white', margin: '4px 0 0 0' }}>{character.title}</p>
              </div>
            </div>
            <Space wrap>
              <Tooltip title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}>
                <Button
                  icon={<HeartOutlined />}
                  type={isFavorite ? "primary" : "default"}
                  danger={isFavorite}
                  onClick={() => handleQuickAction('favorite')}
                  style={{ background: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)', color: 'white' }}
                />
              </Tooltip>
              <Button
                icon={<ShareAltOutlined />}
                style={{ background: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)', color: 'white' }}
              >
                Chia Sẻ
              </Button>
              <Button
                icon={<EditOutlined />}
                onClick={() => handleQuickAction('edit')}
                style={{ background: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)', color: 'white' }}
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
          <Card
            className="profile-card"
            style={{
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '8px',
                background: getRarityGradient(character.rarity)
              }}
            ></div>

            <div style={{ position: 'relative', marginTop: '-32px', marginBottom: '16px' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  size={120}
                  src={character.avatar}
                  style={{ border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
                />
                <div style={{ position: 'absolute', bottom: '-8px', right: '-8px' }}>
                  <Tag
                    color={getRarityColor(character.rarity)}
                    style={{ fontWeight: 'bold', padding: '4px 12px', borderRadius: '12px' }}
                  >
                    <CrownOutlined /> {character.rarity.toUpperCase()}
                  </Tag>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Level & Progress */}
              <div style={{ background: '#f5f5f5', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, color: '#4a4a4a' }}>Cấp Độ</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#8B0000' }}>Lv.{character.level}</span>
                    <StarOutlined style={{ color: '#FAAD14' }} />
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
                <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
                  {character.experience.toLocaleString()} EXP
                </div>
              </div>

              {/* Quick Stats */}
              <Row gutter={[8, 8]}>
                <Col span={12}>
                  <div style={{ background: '#e6f7ff', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                    <RocketOutlined style={{ color: '#1890FF', fontSize: '20px', marginBottom: '4px', display: 'block' }} />
                    <div style={{ fontWeight: 'bold', color: '#1890FF' }}>{characterStats.missionsCompleted}</div>
                    <div style={{ fontSize: '12px', color: '#1890FF' }}>Nhiệm Vụ</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ background: '#f6ffed', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                    <SafetyCertificateOutlined style={{ color: '#52C41A', fontSize: '20px', marginBottom: '4px', display: 'block' }} />
                    <div style={{ fontWeight: 'bold', color: '#52C41A' }}>{characterStats.successRate}%</div>
                    <div style={{ fontSize: '12px', color: '#52C41A' }}>Thành Công</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ background: '#fff7e6', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                    <ThunderboltOutlined style={{ color: '#FA8C16', fontSize: '20px', marginBottom: '4px', display: 'block' }} />
                    <div style={{ fontWeight: 'bold', color: '#FA8C16' }}>{characterStats.battleWinRate}%</div>
                    <div style={{ fontSize: '12px', color: '#FA8C16' }}>Thắng Trận</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ background: '#f9f0ff', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                    <TeamOutlined style={{ color: '#722ED1', fontSize: '20px', marginBottom: '4px', display: 'block' }} />
                    <div style={{ fontWeight: 'bold', color: '#722ED1' }}>{characterStats.interactions}</div>
                    <div style={{ fontSize: '12px', color: '#722ED1' }}>Tương Tác</div>
                  </div>
                </Col>
              </Row>

              {/* Quick Actions */}
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  icon={<RocketOutlined />}
                  onClick={() => handleQuickAction('mission')}
                  disabled={character.status !== 'available'}
                  block
                  size="large"
                  style={{ background: '#8B0000', borderColor: '#8B0000' }}
                >
                  Giao Nhiệm Vụ
                </Button>
                <Button
                  icon={<ReadOutlined />}
                  onClick={() => handleQuickAction('train')}
                  disabled={character.status !== 'available'}
                  block
                  size="large"
                  style={{ borderColor: '#D4AF37', color: '#8B0000' }}
                >
                  Huấn Luyện
                </Button>
              </Space>
            </div>
          </Card>

          {/* Character Info */}
          <Card
            title="Thông Tin Cá Nhân"
            style={{ marginTop: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
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
          <Card
            title={<><PictureOutlined /> Hình Ảnh</>}
            style={{ marginTop: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            <Row gutter={[8, 8]}>
              <Col span={12}>
                <div
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onClick={() => handleViewImage(character.avatar)}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Image
                    src={character.avatar}
                    alt="Avatar"
                    style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                    preview={false}
                  />
                  <div style={{ fontSize: '12px', textAlign: 'center', marginTop: '4px', color: '#8c8c8c' }}>
                    Avatar
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onClick={() => handleViewImage(character.fullImage)}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Image
                    src={character.fullImage}
                    alt="Full Image"
                    style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                    preview={false}
                  />
                  <div style={{ fontSize: '12px', textAlign: 'center', marginTop: '4px', color: '#8c8c8c' }}>
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
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <GlobalOutlined style={{ marginRight: '8px' }} />
                    Tổng Quan
                  </span>
                ),
                children: <OverviewTab character={character} />
              },
              {
                key: 'attributes',
                label: (
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <ClusterOutlined style={{ marginRight: '8px' }} />
                    Thuộc Tính
                  </span>
                ),
                children: <AttributesTab character={character} />
              },
              {
                key: 'skills',
                label: (
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <BulbOutlined style={{ marginRight: '8px' }} />
                    Kỹ Năng
                  </span>
                ),
                children: <SkillsTab character={character} />
              },
              {
                key: 'equipment',
                label: (
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <SafetyOutlined style={{ marginRight: '8px' }} />
                    Trang Bị
                  </span>
                ),
                children: <EquipmentTab character={character} />
              },
              {
                key: 'statistics',
                label: (
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <TrophyOutlined style={{ marginRight: '8px' }} />
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
        styles={{ body: { padding: '24px' } }}
      >
        <Image
          src={selectedImage}
          alt="Character Image"
          style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
          preview={false}
        />
      </Modal>

      {/* Floating Action Button */}
      <FloatButton.Group
        shape="circle"
        style={{ right: 24, bottom: 24 }}
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
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    {/* Description */}
    <Card
      title={
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <FireOutlined style={{ marginRight: '8px', color: '#ff4d4f' }} />
          Mô Tả Nhân Vật
        </span>
      }
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ color: '#4a4a4a', lineHeight: 1.8, fontSize: '16px' }}>{character.description}</p>
        <div style={{ background: '#fffbe6', borderLeft: '4px solid #faad14', padding: '16px', borderRadius: '4px' }}>
          <p style={{ color: '#8c8c8c', fontStyle: 'italic', margin: 0 }}>{'"' + character.title + '"'}</p>
        </div>
      </div>
    </Card>

    {/* Basic Info */}
    <Card title="Thông Tin Cơ Bản" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small">
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
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    {/* Main Attributes */}
    <Card title="Thuộc Tính Chính" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <Row gutter={[16, 16]}>
        {Object.entries(character.attributes).map(([key, value]) => (
          <Col xs={24} md={12} key={key}>
            <div style={{ background: '#fafafa', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                  {key === 'charm' ? '💝 Duyên Dáng' :
                    key === 'intelligence' ? '🧠 Trí Tuệ' :
                      key === 'diplomacy' ? '🤝 Ngoại Giao' :
                        key === 'intrigue' ? '🎭 Mưu Mẹo' : '🛡️ Trung Thành'}
                </span>
                <span
                  style={{ fontWeight: 'bold', fontSize: '18px' }}
                  color={getAttributeColor(value)}
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
    <Card title="Tổng Quan Thuộc Tính" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <div style={{ textAlign: 'center', padding: '16px', background: '#e6f7ff', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890FF' }}>
              {Object.values(character.attributes).reduce((a, b) => a + b, 0)}
            </div>
            <div style={{ fontSize: '14px', color: '#1890FF' }}>Tổng Điểm</div>
          </div>
        </Col>
        <Col span={8}>
          <div style={{ textAlign: 'center', padding: '16px', background: '#f6ffed', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52C41A' }}>
              {Math.round(Object.values(character.attributes).reduce((a, b) => a + b, 0) / Object.values(character.attributes).length)}
            </div>
            <div style={{ fontSize: '14px', color: '#52C41A' }}>Điểm TB</div>
          </div>
        </Col>
        <Col span={8}>
          <div style={{ textAlign: 'center', padding: '16px', background: '#f9f0ff', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ED1' }}>
              {Math.max(...Object.values(character.attributes))}
            </div>
            <div style={{ fontSize: '14px', color: '#722ED1' }}>Điểm Cao Nhất</div>
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
        <span style={{ display: 'flex', alignItems: 'center', color: '#1890FF', fontWeight: 600 }}>
          <BulbOutlined style={{ marginRight: '8px' }} />
          Kỹ Năng Chủ Động ({character.skills.filter(s => s.type === 'active').length})
        </span>
      }
      key="active"
    >
      <List
        dataSource={character.skills.filter(skill => skill.type === 'active')}
        renderItem={skill => (
          <List.Item style={{ padding: '8px 0' }}>
            <Card size="small" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h4 style={{ fontWeight: 600, fontSize: '16px', margin: 0 }}>{skill.name}</h4>
                    <Space>
                      <Tag color="blue">Lv.{skill.level}</Tag>
                      <Badge count="Chủ Động" style={{ backgroundColor: '#1890FF' }} />
                    </Space>
                  </div>
                  <p style={{ color: '#4a4a4a', marginBottom: '8px' }}>{skill.description}</p>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#8c8c8c' }}>
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
        <span style={{ display: 'flex', alignItems: 'center', color: '#52C41A', fontWeight: 600 }}>
          <BulbOutlined style={{ marginRight: '8px' }} />
          Kỹ Năng Bị Động ({character.skills.filter(s => s.type === 'passive').length})
        </span>
      }
      key="passive"
    >
      <List
        dataSource={character.skills.filter(skill => skill.type === 'passive')}
        renderItem={skill => (
          <List.Item style={{ padding: '8px 0' }}>
            <Card size="small" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h4 style={{ fontWeight: 600, fontSize: '16px', margin: 0 }}>{skill.name}</h4>
                    <Tag color="green">Bị Động</Tag>
                  </div>
                  <p style={{ color: '#4a4a4a' }}>{skill.description}</p>
                  <div style={{ fontSize: '14px', color: '#8c8c8c', marginTop: '8px' }}>
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
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    {/* Costumes */}
    <Card title="🦺 Trang Phục" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <Row gutter={[16, 16]}>
        {character.costumes.map(costume => (
          <Col xs={24} key={costume.id}>
            <Card
              size="small"
              style={{
                borderLeft: `4px solid ${costume.equipped ? '#52C41A' : '#d9d9d9'}`,
                background: costume.equipped ? '#f6ffed' : 'white'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Avatar size={60} src={costume.image} shape="square" />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{ fontWeight: 600, fontSize: '16px', margin: 0 }}>{costume.name}</h4>
                      <Tag color={getRarityColor(costume.rarity)}>
                        {costume.rarity.toUpperCase()}
                      </Tag>
                    </div>
                    {costume.equipped && (
                      <Badge status="success" text="Đang trang bị" />
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#8c8c8c' }}>
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
    <Card title="💎 Trang Sức" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <Row gutter={[16, 16]}>
        {character.jewelry.map(jewelry => (
          <Col xs={24} md={12} key={jewelry.id}>
            <Card
              size="small"
              style={{
                borderLeft: `4px solid ${jewelry.equipped ? '#1890FF' : '#d9d9d9'}`,
                background: jewelry.equipped ? '#e6f7ff' : 'white'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar size={50} src={jewelry.image} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <h4 style={{ fontWeight: 600, margin: 0 }}>{jewelry.name}</h4>
                    <Tag color={getRarityColor(jewelry.rarity)}>
                      {jewelry.rarity}
                    </Tag>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                      {jewelry.equipped ? '✅ Đang đeo' : '❌ Chưa đeo'}
                    </div>
                    <div style={{ fontSize: '12px' }}>
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
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
            style={{ textAlign: 'center', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            styles={{ body: { padding: '20px' } }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px', color: stat.color }}>
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
    <Card title="📊 Hiệu Suất Chi Tiết" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600 }}>Hoàn thành nhiệm vụ</span>
                <span style={{ fontWeight: 'bold', color: '#52C41A' }}>{stats.successRate}%</span>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600 }}>Tỷ lệ thắng trận</span>
                <span style={{ fontWeight: 'bold', color: '#FF4D4F' }}>{stats.battleWinRate}%</span>
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
          <div style={{ background: '#fafafa', borderRadius: '8px', padding: '16px', height: '100%' }}>
            <h4 style={{ fontWeight: 600, marginBottom: '12px' }}>Lịch Sử Hoạt Động</h4>
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
