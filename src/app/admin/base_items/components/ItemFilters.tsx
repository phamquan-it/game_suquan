// app/admin/base_items/components/ItemFilters.tsx
'use client';

import React from 'react';
import {
  Card,
  Space,
  Select,
  Input,
  Slider,
  Button,
  Typography,
  Divider,
  Tag,
  theme,
} from 'antd';
import {
  FilterOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import { ItemFilterParams, ItemStatusType, ItemType, QualityType, RarityType } from '../types';

const { Title, Text } = Typography;
const { Option } = Select;

interface ItemFiltersProps {
  filters: ItemFilterParams;
  onFiltersChange: (filters: ItemFilterParams) => void;
}

export default function ItemFilters({ filters, onFiltersChange }: ItemFiltersProps) {
  const { token } = theme.useToken();

  const itemTypes: ItemType[] = [
    'weapon', 'armor', 'consumable', 'material', 'relic', 'general',
    'helmet', 'cloak', 'boots', 'shield', 'accessory'
  ];

  const rarities: RarityType[] = [
    'common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'
  ];

  const qualities: QualityType[] = [
    'broken', 'damaged', 'normal', 'good', 'excellent', 'perfect'
  ];

  const statuses: ItemStatusType[] = ['active', 'inactive', 'testing'];

  const handleClear = () => {
    onFiltersChange({});
  };

  const activeFilterCount = Object.keys(filters).filter(
    key => filters[key as keyof ItemFilterParams] !== undefined
  ).length;

  // Vietnamese translations for item types
  const getItemTypeLabel = (type: string): string => {
    const typeMap: Record<string, string> = {
      'weapon': 'Vũ Khí',
      'armor': 'Giáp',
      'consumable': 'Vật Phẩm Tiêu Hao',
      'material': 'Nguyên Liệu',
      'relic': 'Thánh Vật',
      'general': 'Chung',
      'helmet': 'Mũ Giáp',
      'cloak': 'Áo Choàng',
      'boots': 'Giày',
      'shield': 'Khiên',
      'accessory': 'Phụ Kiện'
    };
    return typeMap[type] || type;
  };

  // Vietnamese translations for rarities
  const getRarityLabel = (rarity: string): string => {
    const rarityMap: Record<string, string> = {
      'common': 'Thường',
      'uncommon': 'Không Phổ Biến',
      'rare': 'Hiếm',
      'epic': 'Sử Thi',
      'legendary': 'Huyền Thoại',
      'mythic': 'Thần Thoại'
    };
    return rarityMap[rarity] || rarity;
  };

  // Vietnamese translations for qualities
  const getQualityLabel = (quality: string): string => {
    const qualityMap: Record<string, string> = {
      'broken': 'Hỏng',
      'damaged': 'Hư Hại',
      'normal': 'Bình Thường',
      'good': 'Tốt',
      'excellent': 'Xuất Sắc',
      'perfect': 'Hoàn Hảo'
    };
    return qualityMap[quality] || quality;
  };

  // Vietnamese translations for statuses
  const getStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
      'active': 'Hoạt Động',
      'inactive': 'Không Hoạt Động',
      'testing': 'Đang Kiểm Tra'
    };
    return statusMap[status] || status;
  };

  return (
    <Card
      variant='borderless'
      style={{
        background: token.colorBgElevated,
        boxShadow: token.boxShadowTertiary,
        borderRadius: token.borderRadiusLG,
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={5} style={{ margin: 0 }}>
            <FilterOutlined /> Bộ Lọc
          </Title>
          {activeFilterCount > 0 && (
            <Tag color={token.colorPrimary}>{activeFilterCount} đang áp dụng</Tag>
          )}
        </div>

        <Input.Search
          placeholder="Tìm kiếm vật phẩm..."
          allowClear
          onSearch={(value) => onFiltersChange({ ...filters, search: value })}
        />

        <Divider style={{ margin: '12px 0' }} />

        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text strong>Loại Vật Phẩm</Text>
            <Select
              mode="multiple"
              placeholder="Chọn loại vật phẩm"
              style={{ width: '100%', marginTop: 8 }}
              onChange={(value) => onFiltersChange({ ...filters, type: value[0] })}
              allowClear
            >
              {itemTypes.map(type => (
                <Option key={type} value={type}>
                  {getItemTypeLabel(type)}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <Text strong>Độ Hiếm</Text>
            <Select
              placeholder="Chọn độ hiếm"
              style={{ width: '100%', marginTop: 8 }}
              onChange={(value) => onFiltersChange({ ...filters, rarity: value })}
              allowClear
            >
              {rarities.map(rarity => (
                <Option key={rarity} value={rarity}>
                  {getRarityLabel(rarity)}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <Text strong>Chất Lượng</Text>
            <Select
              placeholder="Chọn chất lượng"
              style={{ width: '100%', marginTop: 8 }}
              onChange={(value) => onFiltersChange({ ...filters, quality: value })}
              allowClear
            >
              {qualities.map(quality => (
                <Option key={quality} value={quality}>
                  {getQualityLabel(quality)}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <Text strong>Trạng Thái</Text>
            <Select
              placeholder="Chọn trạng thái"
              style={{ width: '100%', marginTop: 8 }}
              onChange={(value) => onFiltersChange({ ...filters, status: value })}
              allowClear
            >
              {statuses.map(status => (
                <Option key={status} value={status}>
                  {getStatusLabel(status)}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <Text strong>Khoảng Cấp Độ</Text>
            <Slider
              range
              min={1}
              max={100}
              defaultValue={[filters.levelMin || 1, filters.levelMax || 100]}
              onChange={([min, max]) =>
                onFiltersChange({ ...filters, levelMin: min, levelMax: max })
              }
              style={{ marginTop: 12 }}
            />
          </div>
        </Space>

        <Button
          icon={<ClearOutlined />}
          onClick={handleClear}
          style={{ width: '100%' }}
        >
          Xóa Bộ Lọc
        </Button>
      </Space>
    </Card>
  );
}
