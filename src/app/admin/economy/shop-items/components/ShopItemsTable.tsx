'use client'

import { Table, Button, Space, Tag, Tooltip, Popconfirm } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DollarOutlined,
  ShoppingOutlined
} from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { ShopItemWithComponents } from '../types'
import { useDeleteShopItem } from '../hooks/useDeleteShopItem'
import { ColumnsType } from 'antd/es/table/interface'

type ShopItemStatus = 'active' | 'inactive' | 'archived'
type ShopItemType = 'hero' | 'item' | 'resource' | 'boost' | 'vip' | 'chest' | 'unit'
type ShopItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

interface ShopItemsTableProps {
  data: ShopItemWithComponents[]
  loading?: boolean
  onEdit?: (item: ShopItemWithComponents) => void
  onDelete?: (item: ShopItemWithComponents) => void
}

const statusColors: Record<ShopItemStatus, string> = {
  active: 'success',
  inactive: 'default',
  archived: 'error',
}

const rarityColors: Record<ShopItemRarity, string> = {
  common: 'default',
  uncommon: 'cyan',
  rare: 'blue',
  epic: 'purple',
  legendary: 'gold',
}

const typeColors: Record<ShopItemType, string> = {
  hero: 'magenta',
  item: 'geekblue',
  resource: 'green',
  boost: 'orange',
  vip: 'gold',
  chest: 'purple',
  unit: 'cyan',
}

export const ShopItemsTable = ({ data, loading }: ShopItemsTableProps) => {
  const router = useRouter()
  const deleteMutation = useDeleteShopItem()

  // ✅ FIX: đúng generic
  const columns: ColumnsType<ShopItemWithComponents> = [
    {
      title: 'Icon',
      dataIndex: 'item_icon',
      key: 'icon',
      width: 60,
      render: (icon: string | null) => (
        icon ? (
          <img src={icon} alt="item" className="w-8 h-8 object-contain" />
        ) : (
          <ShoppingOutlined className="text-2xl text-gray-400" />
        )
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: ShopItemType) =>
        type && <Tag color={typeColors[type]}>{type.toUpperCase()}</Tag>,
    },
    {
      title: 'Rarity',
      dataIndex: 'rarity',
      key: 'rarity',
      render: (rarity: ShopItemRarity) =>
        rarity && <Tag color={rarityColors[rarity]}>{rarity.toUpperCase()}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: ShopItemStatus) =>
        status && <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>,
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
        { text: 'Archived', value: 'archived' },
      ],
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => stock?.toLocaleString() || '0',
    },
    {
      title: 'Sales',
      dataIndex: 'sales',
      key: 'sales',
      render: (sales: number) => sales?.toLocaleString() || '0',
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue: number) => (
        <Space>
          <DollarOutlined className="text-green-600" />
          {revenue?.toLocaleString() || '0'}
        </Space>
      ),
    },
    {
      title: 'VIP Required',
      dataIndex: 'vip_level_required',
      key: 'vip_level_required',
    },
    {
      title: 'Components',
      key: 'components',
      render: (_: any, record) => (
        <Tag>{record.components?.length || 0} items</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record) => (
        <Space>
          <Tooltip title="View">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => router.push(`/admin/economy/shop-items/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => router.push(`/admin/economy/shop-items/${record.id}/edit`)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete shop item"
              description="Are you sure you want to delete this item?"
              onConfirm={() => deleteMutation.mutate(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                icon={<DeleteOutlined />}
                size="small"
                danger
                loading={deleteMutation.isPending}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={{
        total: data.length,
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} items`,
      }}
    />
  )
}
