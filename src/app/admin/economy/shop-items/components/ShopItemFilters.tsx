// app/admin/economy/shop-items/components/ShopItemFilters.tsx
'use client'

import { Card, Row, Col, Select, Input, Button, Space } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import type { ShopItemFilters } from '../types'

/* =======================
   Const data (runtime)
======================= */

export const SHOP_ITEM_STATUSES = [
  'active',
  'inactive',
  'archived',
] as const

export const SHOP_ITEM_RARITIES = [
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary',
] as const

export const SHOP_ITEM_TYPES = [
  'hero',
  'item',
  'resource',
  'boost',
  'vip',
  'chest',
  'unit',
] as const

/* =======================
   Types (compile-time)
======================= */

export type ShopItemStatus = typeof SHOP_ITEM_STATUSES[number]
export type ShopItemRarity = typeof SHOP_ITEM_RARITIES[number]
export type ShopItemType = typeof SHOP_ITEM_TYPES[number]

/* =======================
   Props
======================= */

interface ShopItemFiltersProps {
  filters: ShopItemFilters
  onFilterChange: (filters: ShopItemFilters) => void
  onReset: () => void
}

/* =======================
   Component
======================= */

export const ShopItemFiltersComponent = ({
  filters,
  onFilterChange,
  onReset,
}: ShopItemFiltersProps) => {
  const handleChange = <K extends keyof ShopItemFilters>(
    key: K,
    value: ShopItemFilters[K]
  ) => {
    onFilterChange({
      ...filters,
      [key]: value,
      page: 1,
    })
  }

  return (
    <Card size="small" className="mb-4">
      <Row gutter={[16, 16]}>
        {/* Search */}
        <Col span={6}>
          <Input
            placeholder="Search by name"
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            allowClear
          />
        </Col>

        {/* Status */}
        <Col span={4}>
          <Select<ShopItemStatus>
            className="w-full"
            placeholder="Status"
            value={filters.status}
            onChange={(value) => handleChange('status', value)}
            allowClear
            options={SHOP_ITEM_STATUSES.map(status => ({
              value: status,
              label: status.toUpperCase(),
            }))}
          />
        </Col>

        {/* Type */}
        <Col span={4}>
          <Select<ShopItemType>
            className="w-full"
            placeholder="Type"
            value={filters.type}
            onChange={(value) => handleChange('type', value)}
            allowClear
            options={SHOP_ITEM_TYPES.map(type => ({
              value: type,
              label: type.toUpperCase(),
            }))}
          />
        </Col>

        {/* Rarity */}
        <Col span={4}>
          <Select<ShopItemRarity>
            className="w-full"
            placeholder="Rarity"
            value={filters.rarity}
            onChange={(value) => handleChange('rarity', value)}
            allowClear
            options={SHOP_ITEM_RARITIES.map(rarity => ({
              value: rarity,
              label: rarity.toUpperCase(),
            }))}
          />
        </Col>

        {/* Actions */}
        <Col span={6}>
          <Space>
            <Button icon={<SearchOutlined />} type="primary">
              Search
            </Button>
            <Button icon={<ReloadOutlined />} onClick={onReset}>
              Reset
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  )
}
