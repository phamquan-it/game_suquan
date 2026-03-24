// app/admin/economy/shop-items/hooks/useShopItems.ts
import { useQuery } from '@tanstack/react-query'
import { ShopItemWithComponents, ShopItemFilters } from '../types'
import { supabase } from '@/utils/supabase/client'

export const fetchShopItems = async (filters?: ShopItemFilters): Promise<{
  data: ShopItemWithComponents[]
  total: number
}> => {
  let query = supabase
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
    `, { count: 'exact' })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.type) {
    query = query.eq('type', filters.type)
  }

  if (filters?.rarity) {
    query = query.eq('rarity', filters.rarity)
  }

  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }

  const page = filters?.page || 1
  const limit = filters?.limit || 10
  const from = (page - 1) * limit
  const to = from + limit - 1

  query = query.range(from, to).order('created_at', { ascending: false })

  const { data, error, count } = await query

  if (error) {
    throw new Error(error.message)
  }

  return { 
    data: data as ShopItemWithComponents[], 
    total: count || 0 
  }
}

export const useShopItems = (filters?: ShopItemFilters) => {
  return useQuery({
    queryKey: ['shop-items', filters],
    queryFn: () => fetchShopItems(filters),
  })
}
