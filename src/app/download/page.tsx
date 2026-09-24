"use client"
// pages/download-page.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Layout,
  Button,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Progress,
  List,
  Avatar,
  Divider,
  Typography,
  Space,
  Badge,
  Alert,
  Tabs,
  Tooltip,
  Modal,
  Spin,
  Empty,
  message
} from 'antd';
import {
  Download,
  CloudDownload,
  Clock,
  Shield,
  Zap,
  Crown,
  Star,
  Gift,
  QrCode,
  Package,
  Monitor
} from 'lucide-react';
import { AndroidFilled, LinuxOutlined, WindowsFilled } from '@ant-design/icons';
import { GameLink } from '@/enums/Links';
import DistroSelectorPopup, { type DistroValue } from '@/components/DistroSelectorPopup';
import type { ReleaseFile } from '@/app/api/releases/route';



const { Title, Paragraph, Text } = Typography;
const { Header, Footer, Content } = Layout;

type PlatformKey = 'windows' | 'linux' | 'android';

/** Đuôi/keyword dùng để lọc file theo nền tảng — khớp với b2-classify.ts. */
const PLATFORM_MATCHERS: Record<PlatformKey, (r: ReleaseFile) => boolean> = {
  windows: (r) =>
    r.os === 'windows' ||
    /windows|win32|win64|win-x64|win-x86|\.zip$|\.exe$|\.msi$/i.test(r.fileName),
  linux: (r) => r.os === 'linux',
  android: (r) =>
    r.os === 'android' || /\.apk$|android|arm64/i.test(r.fileName),
};

const PLATFORM_META: Record<PlatformKey, {
  name: string;
  icon: React.ReactNode;
  requirements: Record<string, string>;
}> = {
  windows: {
    name: 'Windows',
    icon: <WindowsFilled size={24} />,
    requirements: {
      os: 'Windows 10/11 (64-bit)',
      processor: 'Intel i5 or AMD equivalent',
      memory: '8 GB RAM',
      graphics: 'NVIDIA GTX 1060 / AMD RX 580',
      storage: '10 GB available space'
    }
  },
  linux: {
    name: 'Linux',
    icon: <LinuxOutlined size={24} />,
    requirements: {
      os: 'Ubuntu 22.04+, Fedora 39+, Arch Linux (64-bit)',
      processor: 'Intel i5 or AMD equivalent',
      memory: '8 GB RAM',
      graphics: 'NVIDIA GTX 1060 / AMD RX 580',
      storage: '10 GB available space'
    }
  },
  android: {
    name: 'Android',
    icon: <AndroidFilled size={24} />,
    requirements: {
      os: 'Android 8.0 or later',
      processor: 'Snapdragon 660 or equivalent',
      memory: '4 GB RAM',
      graphics: 'Adreno 512 or equivalent',
      storage: '3 GB available space'
    }
  },
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

const DownloadPage = () => {
  const [activePlatform, setActivePlatform] = useState<PlatformKey>('windows');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [releases, setReleases] = useState<ReleaseFile[]>([]);
  const [loadingReleases, setLoadingReleases] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pickerPlatform, setPickerPlatform] = useState<PlatformKey | null>(null);

  // Danh sách file lấy trực tiếp từ B2 qua /api/releases. Trước đây trang này
  // hardcode packageKey/version/size — key thì không tồn tại trên bucket (nên
  // bấm tải là 404), còn version "v2.1.4" và size "0.2 GB" là số bịa.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoadingReleases(true);
        setLoadError(null);

        const res = await fetch('/api/releases');
        const body = await res.json();

        if (!res.ok) {
          throw new Error(body?.error ?? 'Không tải được danh sách file');
        }

        if (!cancelled) setReleases(body.releases ?? []);
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error ? error.message : 'Không tải được danh sách file'
          );
        }
      } finally {
        if (!cancelled) setLoadingReleases(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /** File khớp nền tảng đang chọn, mới nhất lên đầu. */
  const filesForPlatform = useCallback(
    (platform: PlatformKey) =>
      releases
        .filter(PLATFORM_MATCHERS[platform])
        .sort((a, b) => b.uploadTimestamp - a.uploadTimestamp),
    [releases]
  );

  const platformFiles = useMemo(
    () => filesForPlatform(activePlatform),
    [filesForPlatform, activePlatform]
  );

  /** Bản mới nhất của nền tảng đang chọn — dùng cho thẻ Phiên Bản / Kích Thước. */
  const latest = platformFiles[0] ?? null;

  const [selectedDistro, setSelectedDistro] = useState<DistroValue | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleDistroSelect = (distro: DistroValue) => {
    setSelectedDistro(distro);
    message.success({
      content: `✓ ${distro.toUpperCase()} distribution selected successfully!`,
      duration: 2.5,
      style: {
        marginTop: '20px',
        borderLeft: `4px solid #2E8B57`,
      },
    });
  };

  const getDistroDisplayName = () => {
    if (!selectedDistro) return null;
    const names: Record<DistroValue, string> = {
      arch: 'Arch Linux',
      deb: 'Debian/Ubuntu',
      rpm: 'RHEL/Fedora',
      appimage: 'AppImage',
    };
    return names[selectedDistro];
  };

  /**
   * Tạo link tải mới mỗi lần gọi: /api/get-download-link cấp một token B2 mới
   * (hạn 1 giờ) cho đúng key này.
   */
  const triggerDownload = useCallback(async (packageKey: string) => {
    try {
      setIsDownloading(true);
      setDownloadProgress(0);

      const res = await fetch(
        `/api/get-download-link?key=${encodeURIComponent(packageKey)}`
      );

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? 'Không lấy được link tải');
      }

      const { url } = await res.json();

      const interval = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // trigger browser download
      const link = document.createElement("a");
      link.href = url;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      clearInterval(interval);
      setDownloadProgress(100);

      setTimeout(() => {
        setIsDownloading(false);
        setPickerPlatform(null);
      }, 500);
    } catch (error) {
      console.error(error);
      setIsDownloading(false);
      message.error(
        error instanceof Error ? error.message : 'Tải thất bại'
      );
    }
  }, []);

  /** Nút tải chính: Linux mở popup chọn distro, các nền tảng khác chọn file. */
  const handleDownload = useCallback(() => {
    if (activePlatform === 'linux') {
      setIsPopupOpen(true);
      return;
    }

    if (platformFiles.length === 0) {
      message.warning('Chưa có bản build cho nền tảng này');
      return;
    }

    // Nhiều file cùng nền tảng (vd nhiều phiên bản) → để người dùng chọn.
    if (platformFiles.length > 1) {
      setPickerPlatform(activePlatform);
      return;
    }

    triggerDownload(platformFiles[0].fileName);
  }, [activePlatform, platformFiles, triggerDownload]);

  const versionFeatures = [
    {
      version: 'v2.1.4',
      date: '15/01/2026',
      features: [
        'Thêm tính năng liên minh mới',
        'Tối ưu hóa hiệu năng 15%',
        'Sửa lỗi crash trên Windows 11',
        'Cân bằng chiến thuật'
      ]
    },
  ];

  return (
    <Layout style={{ background: 'linear-gradient(135deg, #F5F5DC 0%, #F1E8D6 100%)', minHeight: '100vh' }}>
      {/* Header */}
      <Header style={{
        background: 'linear-gradient(135deg, #8B0000 0%, #003366 100%)',
        borderBottom: '3px solid #D4AF37'
      }}>
        <DistroSelectorPopup
          open={isPopupOpen}
          onClose={handleClosePopup}
          onSelect={handleDistroSelect}
          defaultSelected="arch"
          linuxFiles={filesForPlatform('linux')}
          onDownload={triggerDownload}
          downloading={isDownloading}
        />

        {/* Chọn file khi một nền tảng có nhiều bản build */}
        <Modal
          open={pickerPlatform !== null}
          title={
            pickerPlatform
              ? `Chọn bản build cho ${PLATFORM_META[pickerPlatform].name}`
              : ''
          }
          footer={null}
          onCancel={() => setPickerPlatform(null)}
          width={640}
        >
          {pickerPlatform && (
            <List
              dataSource={filesForPlatform(pickerPlatform)}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      key="dl"
                      type="primary"
                      size="small"
                      icon={<Download size={14} />}
                      loading={isDownloading}
                      onClick={() => triggerDownload(item.fileName)}
                      style={{
                        background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                        border: 'none',
                        color: '#8B0000',
                        fontWeight: 'bold'
                      }}
                    >
                      Tải
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Package size={20} color="#8B0000" />}
                    title={
                      <Text strong style={{ color: '#8B0000', wordBreak: 'break-all' }}>
                        {item.fileName}
                      </Text>
                    }
                    description={
                      <Space size={12} wrap>
                        <Text type="secondary">{formatBytes(item.contentLength)}</Text>
                        <Text type="secondary">
                          {new Date(item.uploadTimestamp).toLocaleString('vi-VN')}
                        </Text>
                        {item.label && <Tag color="#D4AF37">{item.label}</Tag>}
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Modal>

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
              <Crown size={20} color="#FFFFFF" />
            </div>
            <Title level={3} style={{
              margin: 0,
              color: '#D4AF37',
              background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}>
              12 SỨ QUÂN
            </Title>
          </div>

          <Space>
            <Button type="link" href={GameLink.HOME} style={{ color: '#D4AF37', fontWeight: '600' }}>Trang Chủ</Button>
            <Button type="link" href={GameLink.GAMEPLAY} style={{ color: '#D4AF37', fontWeight: '600' }}>Hướng Dẫn</Button>
            <Button type="link" href={GameLink.SUPPORT} style={{ color: '#D4AF37', fontWeight: '600' }}>Hỗ Trợ</Button>
          </Space>
        </div>
      </Header>

      <Content style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Main Download Section */}
          <Row gutter={[32, 32]} style={{ marginBottom: '60px' }}>
            <Col xs={24} lg={12}>
              <Card style={{
                background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.9), rgba(0, 51, 102, 0.9))',
                border: '3px solid #D4AF37',
                borderRadius: '20px',
                color: 'white'
              }}>
                <Title level={1} style={{ color: '#D4AF37', textAlign: 'center', marginBottom: '8px' }}>
                  TẢI GAME NGAY
                </Title>
                <Paragraph style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: '1.2rem',
                  marginBottom: '40px'
                }}>
                  Bắt đầu hành trình thống nhất đất nước. Tải và cài đặt chỉ trong 5 phút!
                </Paragraph>

                {/* Platform Selection */}
                <div style={{ marginBottom: '30px' }}>
                  <Title level={4} style={{ color: '#D4AF37', marginBottom: '20px' }}>
                    <Monitor style={{ marginRight: '8px' }} />
                    Chọn Nền Tảng
                  </Title>
                  <Space size="middle" style={{ width: '100%', justifyContent: 'center' }}>
                    {(Object.keys(PLATFORM_META) as PlatformKey[]).map((key) => {
                      const meta = PLATFORM_META[key];
                      const count = filesForPlatform(key).length;

                      return (
                        <Tooltip
                          key={key}
                          title={
                            count > 0
                              ? `${count} bản build cho ${meta.name}`
                              : `Chưa có bản build cho ${meta.name}`
                          }
                        >
                          <Button
                            size="large"
                            type={activePlatform === key ? 'primary' : 'default'}
                            icon={meta.icon}
                            disabled={count === 0}
                            style={{
                              background: activePlatform === key ?
                                'linear-gradient(135deg, #D4AF37, #FFD700)' : 'transparent',
                              border: `2px solid #D4AF37`,
                              color: activePlatform === key ? '#8B0000' : '#D4AF37',
                              height: '80px',
                              width: '120px',
                              fontSize: '16px',
                              fontWeight: 'bold'
                            }}
                            onClick={() => setActivePlatform(key)}
                          >
                            <div>{meta.name}</div>
                            <div style={{ fontSize: 11, fontWeight: 400 }}>
                              {count > 0 ? `${count} bản` : '—'}
                            </div>
                          </Button>
                        </Tooltip>
                      );
                    })}
                  </Space>
                </div>

                {/* Download Info — số liệu thật lấy từ B2, không còn hardcode */}
                <Card style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid #D4AF37',
                  marginBottom: '20px'
                }}>
                  {loadingReleases ? (
                    <div style={{ textAlign: 'center', padding: '8px 0' }}>
                      <Spin />
                    </div>
                  ) : loadError ? (
                    <Alert type="error" showIcon message={loadError} />
                  ) : latest ? (
                    <>
                      <Row gutter={[16, 16]}>
                        <Col xs={12}>
                          <Statistic
                            title="Kích Thước"
                            value={formatBytes(latest.contentLength)}
                            valueStyle={{ color: '#D4AF37', fontSize: '18px' }}
                          />
                        </Col>
                        <Col xs={12}>
                          <Statistic
                            title="Cập Nhật"
                            value={new Date(latest.uploadTimestamp).toLocaleDateString('vi-VN')}
                            valueStyle={{ color: '#D4AF37', fontSize: '18px' }}
                          />
                        </Col>
                      </Row>
                      <Text
                        style={{
                          display: 'block',
                          marginTop: 12,
                          fontSize: 12,
                          color: 'rgba(212, 175, 55, 0.85)',
                          wordBreak: 'break-all'
                        }}
                      >
                        {latest.fileName.split('/').pop()}
                      </Text>
                    </>
                  ) : (
                    <Text style={{ color: '#D4AF37' }}>
                      Chưa có bản build cho nền tảng này.
                    </Text>
                  )}
                </Card>

                {/* Download Progress */}
                {isDownloading && (
                  <div style={{ marginBottom: '20px' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Text strong style={{ color: '#D4AF37' }}>Đang tải xuống...</Text>
                      <Progress
                        percent={downloadProgress}
                        strokeColor={{
                          '0%': '#D4AF37',
                          '100%': '#FFD700',
                        }}
                        showInfo
                      />
                    </Space>
                  </div>
                )}

                {/* Download Button */}
                <Button
                  type="primary"
                  size="large"
                  icon={isDownloading ? <Clock /> : <CloudDownload />}
                  loading={isDownloading}
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                    border: 'none',
                    height: '60px',
                    width: '100%',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#8B0000',
                    marginBottom: '20px'
                  }}
                  onClick={handleDownload}
                  disabled={!loadingReleases && platformFiles.length === 0}
                >
                  {isDownloading
                    ? 'ĐANG TẢI...'
                    : `TẢI CHO ${PLATFORM_META[activePlatform].name.toUpperCase()}`}
                </Button>

                {/* Additional Options */}
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button
                    type="link"
                    icon={<Package />}
                    style={{ color: '#D4AF37' }}
                  >
                    Tải bản cài đặt ngoại tuyến
                  </Button>
                  <Button
                    type="link"
                    icon={<QrCode />}
                    style={{ color: '#D4AF37' }}
                  >
                    Tải qua QR Code
                  </Button>
                </Space>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              {/* System Requirements */}
              <Card
                title={
                  <Space>
                    <Zap style={{ color: '#D4AF37' }} />
                    <Text strong style={{ color: '#8B0000' }}>Yêu Cầu Hệ Thống</Text>
                  </Space>
                }
                style={{
                  border: '2px solid #D4AF37',
                  borderRadius: '15px',
                  marginBottom: '24px'
                }}
              >
                <Tabs
                  activeKey={activePlatform}
                  onChange={(key) => setActivePlatform(key as PlatformKey)}
                  items={(Object.keys(PLATFORM_META) as PlatformKey[]).map((key) => {
                    const meta = PLATFORM_META[key];

                    return {
                      key,
                      label: (
                        <Space>
                          {meta.icon}
                          {meta.name}
                        </Space>
                      ),
                      children: (
                        <List
                          dataSource={Object.entries(meta.requirements)}
                          renderItem={([reqKey, value]) => (
                            <List.Item>
                              <List.Item.Meta
                                title={<Text strong style={{ color: '#8B0000' }}>
                                  {reqKey.charAt(0).toUpperCase() + reqKey.slice(1)}:
                                </Text>}
                                description={value}
                              />
                            </List.Item>
                          )}
                        />
                      )
                    };
                  })}
                />
              </Card>

              {/* Quick Stats */}
              <Row gutter={[16, 16]}>
                <Col xs={12}>
                  <Card size="small" style={{ background: 'rgba(139, 0, 0, 0.8)', color: 'white', textAlign: 'center' }}>
                    <Statistic
                      title="Lượt Tải"
                      value={125847}
                      valueStyle={{ color: '#D4AF37', fontSize: '24px' }}
                      prefix={<Download size={16} />}
                    />
                  </Card>
                </Col>
                <Col xs={12}>
                  <Card size="small" style={{ background: 'rgba(0, 51, 102, 0.8)', color: 'white', textAlign: 'center' }}>
                    <Statistic
                      title="Đánh Giá"
                      value={4.9}
                      suffix="/5"
                      valueStyle={{ color: '#D4AF37', fontSize: '24px' }}
                      prefix={<Star size={16} />}
                    />
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Version History & Features */}
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <Clock style={{ color: '#D4AF37' }} />
                    <Text strong style={{ color: '#8B0000' }}>Lịch Sử Phiên Bản</Text>
                  </Space>
                }
                style={{ border: '2px solid #D4AF37', borderRadius: '15px' }}
              >
                <List
                  dataSource={versionFeatures}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar style={{ background: '#D4AF37' }}>V</Avatar>}
                        title={
                          <Space>
                            <Text strong>{item.version}</Text>
                            <Tag color="gold" style={{ color: '#8B0000' }}>{item.date}</Tag>
                          </Space>
                        }
                        description={
                          <ul style={{ paddingLeft: '20px', margin: 0 }}>
                            {item.features.map((feature, index) => (
                              <li key={index} style={{ marginBottom: '4px' }}>
                                <Text>{feature}</Text>
                              </li>
                            ))}
                          </ul>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <Gift style={{ color: '#D4AF37' }} />
                    <Text strong style={{ color: '#8B0000' }}>Ưu Đãi Đặc Biệt</Text>
                  </Space>
                }
                style={{ border: '2px solid #D4AF37', borderRadius: '15px' }}
              >
                <Alert
                  message="TẢI NGAY - NHẬN QUÀ"
                  description="Tải game trong tháng này để nhận ngay:
                  • 1000 Vàng khởi nghiệp
                  • Vật phẩm hiếm 'Binh Thư Yếu Lược'
                  • Trang bị độc quyền 'Giáp Hoàng Gia'"
                  type="success"
                  showIcon
                  style={{ marginBottom: '16px' }}
                />

                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Title level={4} style={{ color: '#8B0000' }}>
                    <Crown style={{ marginRight: '8px' }} />
                    Gói Đặc Biệt Cho Người Mới
                  </Title>
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Badge count="FREE" style={{ background: '#D4AF37', color: '#8B0000' }}>
                      <Card
                        size="small"
                        style={{
                          background: 'linear-gradient(135deg, #F1E8D6, #F5F5DC)',
                          border: '1px solid #D4AF37'
                        }}
                      >
                        <Text strong>Gói Khởi Đầu Vàng</Text>
                      </Card>
                    </Badge>

                    <Progress
                      percent={75}
                      format={percent => `Còn lại: ${100 - (percent || 0)}%`}
                      strokeColor="#D4AF37"
                    />

                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Ưu đãi kết thúc sau: 15 ngày 08:32:15
                    </Text>
                  </Space>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Installation Guide */}
          <Card
            title={
              <Space>
                <Shield style={{ color: '#D4AF37' }} />
                <Text strong style={{ color: '#8B0000' }}>Hướng Dẫn Cài Đặt & Bảo Mật</Text>
              </Space>
            }
            style={{
              border: '2px solid #D4AF37',
              borderRadius: '15px',
              marginTop: '32px'
            }}
          >
            <Row gutter={[32, 32]}>
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: '#8B0000',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    color: '#D4AF37',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}>
                    1
                  </div>
                  <Title level={5} style={{ color: '#8B0000' }}>Tải Xuống</Title>
                  <Text>Chọn nền tảng và nhấn nút tải về</Text>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: '#003366',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    color: '#D4AF37',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}>
                    2
                  </div>
                  <Title level={5} style={{ color: '#003366' }}>Cài Đặt</Title>
                  <Text>Chạy file .exe và làm theo hướng dẫn</Text>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: '#2E8B57',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    color: '#D4AF37',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}>
                    3
                  </div>
                  <Title level={5} style={{ color: '#2E8B57' }}>Chơi Game</Title>
                  <Text>Khởi động và bắt đầu chinh phục</Text>
                </div>
              </Col>
            </Row>

            <Divider />

            <Alert
              message="Lưu ý Bảo Mật"
              description="Chỉ tải game từ trang web chính thức này. Tránh các trang không chính thức để bảo vệ thông tin và thiết bị của bạn."
              type="warning"
              showIcon
            />
          </Card>
        </div>
      </Content>

      {/* Footer */}
      <Footer style={{
        background: 'linear-gradient(135deg, #003366 0%, #8B0000 100%)',
        color: '#D4AF37',
        padding: '40px 20px',
        borderTop: '3px solid #D4AF37',
        marginTop: '60px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <Space direction="vertical" size="large">
            <Title level={4} style={{ color: '#D4AF37', margin: 0 }}>
              Sẵn sàng cho cuộc chiến?
            </Title>
            <Paragraph style={{ color: 'rgba(212, 175, 55, 0.8)', margin: 0 }}>
              Tải ngay và bắt đầu hành trình thống nhất đất nước
            </Paragraph>
            <Button
              type="primary"
              size="large"
              href={GameLink.DOWNLOAD}
              icon={<Download />}
              style={{
                background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                border: 'none',
                fontWeight: 'bold',
                color: '#8B0000'
              }}
            >
              TẢI GAME MIỄN PHÍ
            </Button>
          </Space>

          <Divider style={{ borderColor: '#D4AF37', margin: '30px 0' }} />

          <Text style={{ color: 'rgba(212, 175, 55, 0.6)' }}>
            © 2024 12 Sứ Quân. Tất cả quyền được bảo lưu. |
            <Button type="link" style={{ color: '#D4AF37', padding: '0 8px' }} href={GameLink.TERMS}>Điều Khoản</Button>
            <Button type="link" style={{ color: '#D4AF37', padding: '0 8px' }} href={GameLink.POLICY}>Chính Sách</Button>
            <Button type="link" style={{ color: '#D4AF37', padding: '0 8px' }} href={GameLink.SUPPORT}>Hỗ Trợ</Button>
          </Text>
        </div>
      </Footer>
    </Layout>
  );
};

export default DownloadPage;
