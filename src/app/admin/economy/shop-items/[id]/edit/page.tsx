// app/admin/economy/shop-items/[id]/edit/page.tsx
'use client'

import { Typography, Card, message, Spin } from 'antd'
import { useParams, useRouter } from 'next/navigation'
import { ShopItemForm } from '../../components/ShopItemForm'
import { useShopItem } from '../../hooks/useShopItem'
import { useUpdateShopItem } from '../../hooks/useUpdateShopItem'
import { ShopItemFormData } from '../../types'

const { Title } = Typography

export default function EditShopItemPage() {
  const params = useParams()
  const router = useRouter()
  const { data: item, isLoading } = useShopItem(params.id as string)
  const updateMutation = useUpdateShopItem()

  const handleSubmit = async (data: ShopItemFormData) => {
    try {
      await updateMutation.mutateAsync({ 
        id: params.id as string, 
        data 
      })
      message.success('Shop item updated successfully')
      router.push(`/admin/economy/shop-items/${params.id}`)
    } catch (error) {
      message.error('Failed to update shop item')
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <Spin size="large" />
      </div>
    )
  }

  if (!item) {
    return <div>Item not found</div>
  }

  // Transform item data to form data
  const initialValues: ShopItemFormData = {
    name: item.name,
    description: item.description,
    category: item.category,
    type: item.type,
    rarity: item.rarity,
    duration_days: item.duration_days,
    stock: item.stock,
    vip_level_required: item.vip_level_required,
    item_icon: item.item_icon,
    status: item.status,
    components: item.components?.map(comp => ({
      base_item_id: comp.base_item_id,
      beauty_id: comp.beauty_id,
      general_id: comp.general_id,
      gift_id: comp.gift_id,
      loot_box_id: comp.loot_box_id,
      unit_id: comp.unit_id,
      quantity: comp.quantity,
    })) || [],
  }

  return (
    <div className="p-6">
      <Title level={2} className="mb-6">Edit Shop Item: {item.name}</Title>
      <Card>
        <ShopItemForm 
          initialValues={initialValues}
          onSubmit={handleSubmit}
          loading={updateMutation.isPending}
        />
      </Card>
    </div>
  )
}
