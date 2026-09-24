'use client';

import React, { useMemo, useState } from 'react';
import { Modal, Radio, Space, Tag, Typography, Button, Card, ConfigProvider, Empty, Tooltip, message } from 'antd';
import {
  LinuxOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  CloudDownloadOutlined,
} from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import theme from '@/theme/themeConfig';
import type { ReleaseFile } from '@/app/api/releases/route';

const { Title, Text, Paragraph } = Typography;

/** Distro dùng để tra cứu nhãn hiển thị. */
export type DistroValue = 'arch' | 'deb' | 'rpm' | 'appimage';

interface DistroOption {
  packageKey: string;
  value: DistroValue;
  label: string;
  description: string;
  icon: React.ReactNode;
  packageManager: string;
  color: string;
  badgeColor: string;
  contentLength: number;
  uploadTimestamp: number;
}

/** Nhãn + màu + icon theo từng định dạng gói. */
const FORMAT_META: Record<DistroValue, Omit<DistroOption, 'packageKey' | 'value' | 'contentLength' | 'uploadTimestamp'>> = {
  arch: {
    label: 'Arch Linux',
    description: 'Bản phát hành liên tục, gói mới nhất, hỗ trợ PKGBUILD & AUR',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#1793D1" strokeWidth="1.5" fill="#1793D1" fillOpacity="0.2" />
      <path d="M2 17L12 22L22 17" stroke="#1793D1" strokeWidth="1.5" fill="none" />
      <path d="M2 12L12 17L22 12" stroke="#1793D1" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="2" fill="#1793D1" />
    </svg>,
    packageManager: 'pacman / yay',
    color: '#1793D1',
    badgeColor: '#E8F4FD',
  },
  deb: {
    label: 'Debian / Ubuntu',
    description: 'Ổn định, kho lưu trữ khổng lồ, gói .deb, hệ sinh thái APT',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="#C60A3E" strokeWidth="1.5" fill="#C60A3E" fillOpacity="0.15" />
      <path d="M12 8L12 16M8 12L16 12" stroke="#C60A3E" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2" fill="#C60A3E" />
    </svg>,
    packageManager: 'apt / dpkg',
    color: '#C60A3E',
    badgeColor: '#FEF0F3',
  },
  rpm: {
    label: 'RHEL / Fedora',
    description: 'Cấp doanh nghiệp, gói .rpm, hệ sinh thái DNF/YUM',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L20 8L12 13L4 8L12 3Z" stroke="#2A6EBB" strokeWidth="1.5" fill="#2A6EBB" fillOpacity="0.15" />
      <path d="M4 13L12 18L20 13" stroke="#2A6EBB" strokeWidth="1.5" fill="none" />
      <path d="M4 18L12 23L20 18" stroke="#2A6EBB" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="8" r="1.5" fill="#2A6EBB" />
    </svg>,
    packageManager: 'dnf / rpm',
    color: '#2A6EBB',
    badgeColor: '#E8F0F9',
  },
  appimage: {
    label: 'AppImage',
    description: 'Chạy trên mọi distro, không cần cài đặt, chỉ cấp quyền thực thi',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="16" height="16" rx="4" stroke="#6E4B9E" strokeWidth="1.5" fill="#6E4B9E" fillOpacity="0.15" />
      <path d="M12 8V16M8 12H16" stroke="#6E4B9E" strokeWidth="1.5" strokeLinecap="round" />
    </svg>,
    packageManager: 'chmod +x && ./game',
    color: '#6E4B9E',
    badgeColor: '#F1ECF9',
  },
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

/**
 * Suy loại distro từ tên file B2.
 *
 * Bucket không có metadata distro — chỉ có tên file. Tên file thật có dạng
 * game_12_suquan-arch-x86_64.pkg.tar.zst (distro nằm ở "arch") và
 * game_12_suquan-linux-x64.deb (distro suy từ đuôi). Dùng if/else + includes
 * để bắt cả hai trường hợp; đuôi file xét trước vì đặc thù hơn.
 */
function detectDistro(lower: string): DistroValue | null {
  if (lower.endsWith(".appimage")) return "appimage";
  if (lower.endsWith(".deb")) return "deb";
  if (lower.endsWith(".rpm")) return "rpm";
  if (lower.endsWith(".pkg.tar.zst")) return "arch";
  if (lower.includes("arch")) return "arch";
  if (lower.includes("debian") || lower.includes("ubuntu")) return "deb";
  if (lower.includes("fedora") || lower.includes("rhel")) return "rpm";
  return null;
}

interface DistroSelectorPopupProps {
  open: boolean;
  onClose: () => void;
  onSelect?: (distro: DistroValue, packageKey: string) => void;
  defaultSelected?: DistroValue;
  /** File Linux thật lấy từ B2 (đã lọc os === "linux"). */
  linuxFiles?: ReleaseFile[];
  /** Tải một key: trang cha lo việc gọi /api/get-download-link. */
  onDownload?: (packageKey: string) => void | Promise<void>;
  downloading?: boolean;
}

const DistroSelectorPopup: React.FC<DistroSelectorPopupProps> = ({
  open,
  onClose,
  onSelect,
  defaultSelected = 'arch',
  linuxFiles = [],
  onDownload,
  downloading = false,
}) => {
  const [selectedDistro, setSelectedDistro] = useState<DistroValue>(defaultSelected);

  const [messageApi, contextHolder] = message.useMessage();

  // Dựng danh sách lựa chọn từ file THẬT trên B2. Trước đây là hằng số
  // distroOptions với key hardcode (linux/game-12-su-quan.deb) không tồn tại
  // trên bucket nên bấm tải luôn 404.
  const distroOptions: DistroOption[] = useMemo(() => {
    const byDistro = new Map<DistroValue, ReleaseFile>();

    for (const file of linuxFiles) {
      const distro = detectDistro(file.fileName.toLowerCase());

      if (!distro) continue;

      // Giữ file mới nhất cho mỗi distro.
      const existing = byDistro.get(distro);

      if (!existing || file.uploadTimestamp > existing.uploadTimestamp) {
        byDistro.set(distro, file);
      }
    }

    const order: DistroValue[] = ['arch', 'deb', 'rpm', 'appimage'];

    return order
      .filter((distro) => byDistro.has(distro))
      .map((distro) => {
        const file = byDistro.get(distro)!;

        return {
          ...FORMAT_META[distro],
          value: distro,
          packageKey: file.fileName,
          contentLength: file.contentLength,
          uploadTimestamp: file.uploadTimestamp,
        };
      });
  }, [linuxFiles]);

  const handleRadioChange = (e: RadioChangeEvent) => {
    setSelectedDistro(e.target.value);
  };

  const selectedOption = distroOptions.find((opt) => opt.value === selectedDistro) ?? null;

  const handleConfirm = async () => {
    if (!selectedOption) {
      messageApi.warning({ content: "Vui lòng chọn một dòng phân phối", key: "download" });
      return;
    }

    messageApi.success({
      content: `Đã chọn: ${selectedOption.label}`,
      key: "download",
      duration: 2,
    });

    if (onSelect) {
      onSelect(selectedOption.value, selectedOption.packageKey);
    }

    // Trang cha tạo link mới rồi trigger download.
    if (onDownload) {
      await onDownload(selectedOption.packageKey);
    }
  };

  return (
    <ConfigProvider theme={theme}>
      {contextHolder}
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        closeIcon={<CloseOutlined style={{ color: '#D4AF37', fontSize: '18px' }} />}
        width={560}
        centered
        maskClosable={false}
        styles={{
          mask: { backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(2px)' },
          body: { padding: 0 },
          content: {
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 20px 35px -12px rgba(139, 69, 19, 0.35)',
          },
        }}
      >
        {/* Phần đầu với phong cách hoàng gia */}
        <div
          style={{
            background: 'linear-gradient(135deg, #8B0000 0%, #6B0000 100%)',
            padding: '20px 24px',
            borderBottom: `2px solid #D4AF37`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <CloudDownloadOutlined
            style={{ fontSize: 32, color: '#D4AF37', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))' }}
          />
          <div style={{ flex: 1 }}>
            <Title
              level={4}
              style={{
                margin: 0,
                color: '#FFFFFF',
                fontFamily: "'Cinzel', 'Times New Roman', serif",
                fontWeight: 700,
                letterSpacing: '-0.3px',
                textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              }}
            >
              Chọn hệ sinh thái gói tin
            </Title>
            <Text style={{ color: '#FFD966', fontSize: 12, fontWeight: 500 }}>
              Lựa chọn dòng phân phối Linux của bạn
            </Text>
          </div>
          <Tag
            style={{
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid #D4AF37',
              color: '#D4AF37',
              borderRadius: 40,
              fontWeight: 600,
              fontFamily: 'monospace',
            }}
          >
            {distroOptions.length} gói
          </Tag>
        </div>

        {/* Nội dung chính */}
        <div style={{ padding: '28px 24px 24px', background: '#FFFFFF' }}>
          <Paragraph
            style={{
              marginBottom: 24,
              color: '#8B4513',
              fontSize: 14,
              fontWeight: 500,
              borderLeft: `3px solid #D4AF37`,
              paddingLeft: 14,
              background: '#FEFAF0',
              borderRadius: '0 12px 12px 0',
              lineHeight: 1.5,
            }}
          >
            <LinuxOutlined style={{ marginRight: 8, color: '#8B0000' }} />
            Chọn dòng phân phối của bạn để nhận các lệnh quản lý gói và cấu hình kho lưu trữ phù hợp.
          </Paragraph>

          {/* Nhóm radio tùy chọn distro */}
          <Radio.Group
            value={selectedDistro}
            onChange={handleRadioChange}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              {distroOptions.map((option) => (
                <Radio
                  key={option.value}
                  value={option.value}
                  style={{
                    margin: 0,
                    width: '100%',
                    padding: '6px 0',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '8px 12px 8px 0',
                      borderRadius: 16,
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          background: option.badgeColor,
                          borderRadius: 14,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: option.color,
                        }}
                      >
                        {option.icon}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16, color: '#2C2C2C', fontFamily: "'Cinzel', serif" }}>
                          {option.label}
                        </div>
                        <div style={{ fontSize: 12, color: '#6B4C2C', marginTop: 4 }}>
                          {option.packageManager}
                        </div>
                        {/* Hiển thị package key nhỏ gọn bên dưới */}
                        <div style={{
                          fontSize: 10,
                          color: '#CD7F32',
                          marginTop: 4,
                          fontFamily: 'monospace',
                          background: '#FEFAF0',
                          display: 'inline-block',
                          padding: '2px 6px',
                          borderRadius: 4,
                        }}>
                          {option.packageKey}
                        </div>
                      </div>
                    </div>
                    <Tag
                      style={{
                        background: selectedDistro === option.value ? '#8B0000' : '#F1E8D6',
                        color: selectedDistro === option.value ? '#FFFFFF' : '#8B4513',
                        border: 'none',
                        borderRadius: 40,
                        fontWeight: 600,
                        fontSize: 11,
                        padding: '2px 10px',
                        transition: 'all 0.2s',
                      }}
                    >
                      {option.value.toUpperCase()}
                    </Tag>
                  </div>
                </Radio>
              ))}
            </Space>
          </Radio.Group>

          {/* Thông tin gói đã chọn */}
          {selectedOption && (
            <Card
              size="small"
              style={{
                marginTop: 24,
                background: '#F1E8D6',
                borderRadius: 16,
                border: `1px solid #D4AF37`,
                boxShadow: '0 2px 8px rgba(139, 69, 19, 0.08)',
              }}
              styles={{
                body: {
                  padding: '12px 16px',
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircleOutlined style={{ color: '#2E8B57', fontSize: 18 }} />
                <Text strong style={{ color: '#2C2C2C' }}>
                  Đã chọn {selectedOption.label}
                </Text>
                <Text style={{ fontSize: 12, color: '#8B4513', marginLeft: 'auto' }}>
                  <code style={{ background: '#FFF6E5', padding: '2px 8px', borderRadius: 20 }}>
                    {selectedOption.packageManager}
                  </code>
                </Text>
              </div>
              <Paragraph style={{ fontSize: 12, color: '#5A3A1A', marginTop: 8, marginBottom: 0 }}>
                <strong>Package Key:</strong>{' '}
                <code style={{ background: '#FFF6E5', padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>
                  {selectedOption.packageKey}
                </code>
              </Paragraph>
              <Paragraph style={{ fontSize: 12, color: '#5A3A1A', marginTop: 4, marginBottom: 0 }}>
                Các lệnh quản lý gói sẽ được tối ưu cho hệ sinh thái {selectedOption.label}.
              </Paragraph>
            </Card>
          )}

          {/* Nút hành động */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 12,
              marginTop: 28,
              borderTop: `1px solid #F1E8D6`,
              paddingTop: 20,
            }}
          >
            <Button
              onClick={onClose}
              style={{
                background: '#F5F5DC',
                border: `1px solid #D4AF37`,
                color: '#8B4513',
                borderRadius: 8,
                fontWeight: 600,
                height: 40,
                padding: '0 20px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FFF6E5';
                e.currentTarget.style.borderColor = '#CD7F32';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#F5F5DC';
                e.currentTarget.style.borderColor = '#D4AF37';
              }}
            >
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              onClick={handleConfirm}
              style={{
                background: '#8B0000',
                borderColor: '#8B0000',
                borderRadius: 8,
                fontWeight: 600,
                height: 40,
                padding: '0 24px',
                boxShadow: '0 2px 0 rgba(139, 0, 0, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#A52A2A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#8B0000';
              }}
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default DistroSelectorPopup;
