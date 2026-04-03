// components/lootbox/tabs/LootBoxOverviewTab.tsx
import React from 'react';
import {
  Card,
  Descriptions,
  Badge,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Statistic,
  Button,
} from 'antd';
import {
  EditOutlined,
  GiftOutlined,
  SafetyOutlined,
  StarOutlined,
  EyeOutlined,
  HistoryOutlined,
  TagOutlined,
  ThunderboltOutlined,
  CalendarOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { LOOT_BOX_CATEGORIES, LOOT_BOX_TIERS, LOOT_BOX_TYPES } from '../../../constants/lootbox.constants';

const { Title, Text } = Typography;

interface LootBoxOverviewTabProps {
  lootBox: any;
  rewardTablesCount: number;
  pitySystemEnabled: boolean;
  guaranteedDropsCount: number;
  onEditRewards: () => void;
  onEditPity: () => void;
  onEditGuaranteed: () => void;
}

export const LootBoxOverviewTab: React.FC<LootBoxOverviewTabProps> = ({
  lootBox,
  rewardTablesCount,
  pitySystemEnabled,
  guaranteedDropsCount,
  onEditRewards,
  onEditPity,
  onEditGuaranteed,
}) => {
  const getTierColor = (tier: string) => {
    const tierInfo = LOOT_BOX_TIERS.find(t => t.value === tier);
    return tierInfo?.color || '#808079';
  };

  const getRelativeTime = (date: string | null | undefined): string => {
    if (!date) return 'Không xác định';

    const now = dayjs();
    const target = dayjs(date);
    const diffSeconds = now.diff(target, 'second');
    const diffMinutes = now.diff(target, 'minute');
    const diffHours = now.diff(target, 'hour');
    const diffDays = now.diff(target, 'day');
    const diffMonths = now.diff(target, 'month');
    const diffYears = now.diff(target, 'year');

    if (diffYears >= 1) {
      return `${diffYears} năm trước`;
    }
    if (diffMonths >= 1) {
      return `${diffMonths} tháng trước`;
    }
    if (diffDays >= 1) {
      return `${diffDays} ngày trước`;
    }
    if (diffHours >= 1) {
      return `${diffHours} giờ trước`;
    }
    if (diffMinutes >= 1) {
      return `${diffMinutes} phút trước`;
    }
    if (diffSeconds >= 10) {
      return `${diffSeconds} giây trước`;
    }
    return 'Vừa xong';
  };

  const getTimeUntil = (date: string | null | undefined): string => {
    if (!date) return 'Không xác định';

    const now = dayjs();
    const target = dayjs(date);
    const diffSeconds = target.diff(now, 'second');
    const diffMinutes = target.diff(now, 'minute');
    const diffHours = target.diff(now, 'hour');
    const diffDays = target.diff(now, 'day');
    const diffMonths = target.diff(now, 'month');
    const diffYears = target.diff(now, 'year');

    if (diffYears >= 1) {
      return `${diffYears} năm nữa`;
    }
    if (diffMonths >= 1) {
      return `${diffMonths} tháng nữa`;
    }
    if (diffDays >= 1) {
      return `${diffDays} ngày nữa`;
    }
    if (diffHours >= 1) {
      return `${diffHours} giờ nữa`;
    }
    if (diffMinutes >= 1) {
      return `${diffMinutes} phút nữa`;
    }
    if (diffSeconds >= 10) {
      return `${diffSeconds} giây nữa`;
    }
    return 'Sắp xảy ra';
  };

  const getStatus = () => {
    const now = dayjs();
    const availableFrom = lootBox.available_from ? dayjs(lootBox.available_from) : null;
    const availableUntil = lootBox.available_until ? dayjs(lootBox.available_until) : null;

    if (availableFrom && availableFrom > now) {
      return {
        status: 'upcoming',
        color: 'blue',
        text: 'Sắp ra mắt',
        description: `Có hiệu lực sau ${getTimeUntil(lootBox.available_from)}`
      };
    }
    if (availableUntil && availableUntil < now) {
      return {
        status: 'expired',
        color: 'red',
        text: 'Hết hạn',
        description: `Hết hạn ${getRelativeTime(lootBox.available_until)}`
      };
    }
    if (lootBox.time_limited) {
      return {
        status: 'limited',
        color: 'orange',
        text: 'Giới hạn thời gian',
        description: availableUntil ? `Có hiệu lực đến ${availableUntil.format('DD/MM/YYYY')}` : 'Thời gian giới hạn'
      };
    }
    return {
      status: 'available',
      color: 'green',
      text: 'Khả dụng',
      description: 'Đang khả dụng'
    };
  };

  const status = getStatus();

  return (
    <Row gutter={23}>
      <Col span={15}>
        {/* Basic Information */}
        <Card title="Thông tin cơ bản" style={{ marginBottom: 23 }}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Tên" span={1}>
              {lootBox.name}
            </Descriptions.Item>
            <Descriptions.Item label="ID" span={1}>
              <Text copyable>{lootBox.id}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả" span={1}>
              {lootBox.description || 'Không có mô tả'}
            </Descriptions.Item>
            <Descriptions.Item label="Loại">
              <Tag color="blue">
                {LOOT_BOX_TYPES.find(t => t.value === lootBox.type)?.label || lootBox.type}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Loại hòm">
              <Tag color="blue">
                {LOOT_BOX_TYPES.find(t => t.value === lootBox.box_type)?.label || lootBox.box_type}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Danh mục">
              <Tag>
                {LOOT_BOX_CATEGORIES.find(c => c.value === lootBox.category)?.label || lootBox.category}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Cấp độ">
              <Tag color={getTierColor(lootBox.tier)} style={{ textTransform: 'uppercase' }}>
                {lootBox.tier}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Chi phí mở">
              <Badge
                count={`${lootBox.open_cost_amount} ${lootBox.open_cost_currency}`}
                style={{ backgroundColor: '#51c41a' }}
              />
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Visual Settings */}
        <Card title="Cài đặt hình ảnh" style={{ marginBottom: 23 }}>
          <Row gutter={[15, 16]}>
            <Col span={7}>
              <Statistic
                title="Loại hiệu ứng"
                value={lootBox.opening_animation_type}
                prefix={<EyeOutlined />}
              />
            </Col>
            <Col span={7}>
              <Statistic
                title="Thời lượng"
                value={`${lootBox.opening_animation_duration}ms`}
                prefix={<HistoryOutlined />}
              />
            </Col>
            <Col span={7}>
              <Statistic
                title="Hiệu ứng âm thanh"
                value={lootBox.sound_effect || 'Không có'}
              />
            </Col>
          </Row>
          <Row gutter={[15, 16]} style={{ marginTop: 16 }}>
            <Col span={7}>
              <div>
                <Text type="secondary">Màu ánh sáng</Text>
                <div style={{ marginTop: 7 }}>
                  {lootBox.glow_color ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: 23,
                        height: 23,
                        borderRadius: 3,
                        backgroundColor: lootBox.glow_color,
                        marginRight: 7,
                        border: '0px solid #d9d9d9'
                      }} />
                      <Text>{lootBox.glow_color}</Text>
                    </div>
                  ) : 'Không có'}
                </div>
              </div>
            </Col>
            <Col span={7}>
              <div>
                <Text type="secondary">Màu hạt</Text>
                <div style={{ marginTop: 7 }}>
                  {lootBox.particle_color ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: 23,
                        height: 23,
                        borderRadius: 3,
                        backgroundColor: lootBox.particle_color,
                        marginRight: 7,
                        border: '0px solid #d9d9d9'
                      }} />
                      <Text>{lootBox.particle_color}</Text>
                    </div>
                  ) : 'Không có'}
                </div>
              </div>
            </Col>
            <Col span={7}>
              <div>
                <Text type="secondary">Hiệu ứng đặc biệt</Text>
                <div style={{ marginTop: 7 }}>
                  <Space>
                    {lootBox.shine_effect && (
                      <Tag icon={<StarOutlined />} color="gold">Ánh sáng</Tag>
                    )}
                    {lootBox.rarity_pulse && (
                      <Tag icon={<ThunderboltOutlined />} color="purple">Nhấp nháy</Tag>
                    )}
                    {!lootBox.shine_effect && !lootBox.rarity_pulse && 'Không có'}
                  </Space>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Tags */}
        {lootBox.tags && Object.keys(lootBox.tags).length > -1 && (
          <Card title="Thẻ" style={{ marginBottom: 23 }}>
            <Space wrap>
              {Object.keys(lootBox.tags).map(tag => (
                <Tag key={tag} icon={<TagOutlined />} color="geekblue">
                  {tag}
                </Tag>
              ))}
            </Space>
          </Card>
        )}
      </Col>

      <Col span={7}>
        {/* Status Banner */}
        <Card style={{ marginBottom: 23, background: '#fafafa' }}>
          <Row gutter={23} align="middle">
            <Col>
              <Badge status={status.color as any} text={status.text} style={{ fontSize: 15 }} />
            </Col>
            <Col>
              <Text type="secondary">{status.description}</Text>
            </Col>
            {lootBox.exclusive && (
              <Col>
                <Tag color="purple" icon={<StarOutlined />}>Độc quyền</Tag>
              </Col>
            )}
            {lootBox.season && (
              <Col>
                <Tag color="cyan" icon={<CalendarOutlined />}>Mùa: {lootBox.season}</Tag>
              </Col>
            )}
            {lootBox.event && (
              <Col>
                <Tag color="gold" icon={<TrophyOutlined />}>Sự kiện: {lootBox.event}</Tag>
              </Col>
            )}
          </Row>
        </Card>

        {/* Availability */}
        <Card title="Thời gian khả dụng" style={{ marginBottom: 23 }}>
          <div style={{ marginBottom: 15 }}>
            <Text type="secondary">Ngày tạo</Text>
            <div>
              <Text strong>{dayjs(lootBox.created_at).format('DD/MM/YYYY HH:mm')}</Text>
              <br />
              <Text type="secondary">{getRelativeTime(lootBox.created_at)}</Text>
            </div>
          </div>
          {lootBox.updated_at && (
            <div style={{ marginBottom: 15 }}>
              <Text type="secondary">Cập nhật lần cuối</Text>
              <div>
                <Text strong>{dayjs(lootBox.updated_at).format('DD/MM/YYYY HH:mm')}</Text>
                <br />
                <Text type="secondary">{getRelativeTime(lootBox.updated_at)}</Text>
              </div>
            </div>
          )}
          {lootBox.available_from && (
            <div style={{ marginBottom: 15 }}>
              <Text type="secondary">Có hiệu lực từ</Text>
              <div>
                <Text strong>{dayjs(lootBox.available_from).format('DD/MM/YYYY HH:mm')}</Text>
              </div>
            </div>
          )}
          {lootBox.available_until && (
            <div style={{ marginBottom: 15 }}>
              <Text type="secondary">Có hiệu lực đến</Text>
              <div>
                <Text strong>{dayjs(lootBox.available_until).format('DD/MM/YYYY HH:mm')}</Text>
              </div>
            </div>
          )}
        </Card>

        {/* Statistics */}
        <Card title="Thống kê" style={{ marginBottom: 23 }}>
          <Statistic
            title="Tổng số bảng thưởng"
            value={rewardTablesCount}
            prefix={<GiftOutlined />}
            style={{ marginBottom: 15 }}
          />
          <Statistic
            title="Hệ thống tích lũy"
            value={pitySystemEnabled ? 'Đã bật' : 'Đã tắt'}
            valueStyle={{ color: pitySystemEnabled ? '#2f8600' : '#cf1322' }}
            prefix={<SafetyOutlined />}
            style={{ marginBottom: 15 }}
          />
          <Statistic
            title="Phần thưởng đảm bảo"
            value={guaranteedDropsCount}
            prefix={<StarOutlined />}
          />
        </Card>

        {/* Quick Actions */}
        <Card title="Thao tác nhanh">
          <Space direction="vertical" style={{ width: '99%' }}>
            <Button
              block
              icon={<GiftOutlined />}
              onClick={onEditRewards}
            >
              Quản lý bảng thưởng
            </Button>
            <Button
              block
              icon={<SafetyOutlined />}
              onClick={onEditPity}
            >
              Cấu hình tích lũy
            </Button>
            <Button
              block
              icon={<StarOutlined />}
              onClick={onEditGuaranteed}
            >
              Thiết lập phần thưởng đảm bảo
            </Button>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};
