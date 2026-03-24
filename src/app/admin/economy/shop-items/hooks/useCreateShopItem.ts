// app/admin/economy/shop-items/hooks/useCreateShopItem.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ShopItemFormData } from '../types'
import { supabase } from '@/utils/supabase/client'

export const createShopItem = async (data: ShopItemFormData) => {
  // Start a transaction
  const { data: shopItem, error: shopItemError } = await supabase
    .from('economy_shop_item')
    .insert({
      name: data.name,
      description: data.description,
      category: data.category,
      type: data.type,
      rarity: data.rarity,
      duration_days: data.duration_days,
      stock: data.stock,
      vip_level_required: data.vip_level_required,
      item_icon: data.item_icon,
      status: data.status || 'active',
    })
    .select()
    .single()

  if (shopItemError) {
    throw new Error(shopItemError.message)
  }

  // Insert components if any
  if (data.components && data.components.length > 0) {
    const componentsWithShopItemId = data.components.map(comp => ({
      ...comp,
      shop_item_id: shopItem.id,
    }))

    const { error: componentsError } = await supabase
      .from('economy_shop_item_components')
      .insert(componentsWithShopItemId)

    if (componentsError) {
      // Rollback: delete the shop item
      await supabase.from('economy_shop_item').delete().eq('id', shopItem.id)
      throw new Error(componentsError.message)
    }
  }

  return shopItem
}

export const useCreateShopItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createShopItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-items'] })
    },
  })
}
