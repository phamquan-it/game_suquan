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

  return (
    <Card 
      bordered={false}
      style={{ 
        background: token.colorBgElevated,
        boxShadow: token.boxShadowTertiary,
        borderRadius: token.borderRadiusLG,
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={5} style={{ margin: 0 }}>
            <FilterOutlined /> Filters
          </Title>
          {activeFilterCount > 0 && (
            <Tag color={token.colorPrimary}>{activeFilterCount} active</Tag>
          )}
        </div>

        <Input.Search
          placeholder="Search items..."
          allowClear
          onSearch={(value) => onFiltersChange({ ...filters, search: value })}
        />

        <Divider style={{ margin: '12px 0' }} />

        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text strong>Item Type</Text>
            <Select
              mode="multiple"
              placeholder="Select types"
              style={{ width: '100%', marginTop: 8 }}
              onChange={(value) => onFiltersChange({ ...filters, type: value[0] })}
              allowClear
            >
              {itemTypes.map(type => (
                <Option key={type} value={type}>
                  {type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <Text strong>Rarity</Text>
            <Select
              placeholder="Select rarity"
              style={{ width: '100%', marginTop: 8 }}
              onChange={(value) => onFiltersChange({ ...filters, rarity: value })}
              allowClear
            >
              {rarities.map(rarity => (
                <Option key={rarity} value={rarity}>
                  {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <Text strong>Quality</Text>
            <Select
              placeholder="Select quality"
              style={{ width: '100%', marginTop: 8 }}
              onChange={(value) => onFiltersChange({ ...filters, quality: value })}
              allowClear
            >
              {qualities.map(quality => (
                <Option key={quality} value={quality}>
                  {quality.charAt(0).toUpperCase() + quality.slice(1)}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <Text strong>Status</Text>
            <Select
              placeholder="Select status"
              style={{ width: '100%', marginTop: 8 }}
              onChange={(value) => onFiltersChange({ ...filters, status: value })}
              allowClear
            >
              {statuses.map(status => (
                <Option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <Text strong>Level Range</Text>
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
          Clear Filters
        </Button>
      </Space>
    </Card>
  );
}
