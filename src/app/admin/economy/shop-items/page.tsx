// app/admin/economy/shop-items/page.tsx
'use client'

import { useState } from 'react'
import { Button, Space, Typography, Card } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { useShopItems } from './hooks/useShopItems'
import { ShopItemsTable } from './components/ShopItemsTable'
import { ShopItemFiltersComponent } from './components/ShopItemFilters'
import { ShopItemFilters } from './types'

const { Title } = Typography

export default function ShopItemsPage() {
  const router = useRouter()
  const [filters, setFilters] = useState<ShopItemFilters>({
    page: 1,
    limit: 10,
  })

  const { data, isLoading, refetch } = useShopItems(filters)

  const handleFilterChange = (newFilters: ShopItemFilters) => {
    setFilters(newFilters)
  }

  const handleResetFilters = () => {
    setFilters({ page: 1, limit: 10 })
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Shop Items</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push('/admin/economy/shop-items/new')}
        >
          Create Shop Item
        </Button>
      </div>

      <ShopItemFiltersComponent
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <Card>
        <ShopItemsTable 
          data={data?.data || []} 
          loading={isLoading}
        />
      </Card>
    </div>
  )
}
