// app/admin/economy/shop-items/hooks/useShopItem.ts
import { useQuery } from '@tanstack/react-query'
import { ShopItemWithComponents } from '../types'
import { supabase } from '@/utils/supabase/client'

export const fetchShopItem = async (id: string): Promise<ShopItemWithComponents> => {
  const { data, error } = await supabase
    .from('economy_shop_item')
    .select(`
      *,
      components:economy_shop_item_components(
        *,
        base_item:base_items(*),
        beauty:beauty_characters(*),
        general:generals(*),
        gift:gift_beauty(*),
        loot_box:loot_boxes(*),
        unit:units(*)
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as ShopItemWithComponents
}

export const useShopItem = (id: string) => {
  return useQuery({
    queryKey: ['shop-item', id],
    queryFn: () => fetchShopItem(id),
    enabled: !!id,
  })
}
