// app/admin/economy/shop-items/hooks/useUpdateShopItem.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ShopItemFormData } from '../types'
import { supabase } from '@/utils/supabase/client'

export const updateShopItem = async ({ 
  id, 
  data 
}: { 
  id: string, 
  data: ShopItemFormData 
}) => {
  // Update shop item
  const { error: shopItemError } = await supabase
    .from('economy_shop_item')
    .update({
      name: data.name,
      description: data.description,
      category: data.category,
      type: data.type,
      rarity: data.rarity,
      duration_days: data.duration_days,
      stock: data.stock,
      vip_level_required: data.vip_level_required,
      item_icon: data.item_icon,
      status: data.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (shopItemError) {
    throw new Error(shopItemError.message)
  }

  // Delete existing components
  const { error: deleteError } = await supabase
    .from('economy_shop_item_components')
    .delete()
    .eq('shop_item_id', id)

  if (deleteError) {
    throw new Error(deleteError.message)
  }

  // Insert new components
  if (data.components && data.components.length > 0) {
    const componentsWithShopItemId = data.components.map(comp => ({
      ...comp,
      shop_item_id: id,
    }))

    const { error: componentsError } = await supabase
      .from('economy_shop_item_components')
      .insert(componentsWithShopItemId)

    if (componentsError) {
      throw new Error(componentsError.message)
    }
  }

  return { id, ...data }
}

export const useUpdateShopItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateShopItem,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shop-items'] })
      queryClient.invalidateQueries({ queryKey: ['shop-item', variables.id] })
    },
  })
}
