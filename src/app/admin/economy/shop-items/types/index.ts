import { BaseItem } from "@/app/admin/base_items/types"
import { BeautyCharacter, GiftBeauty } from "@/app/admin/beauty/types"
import General from "@/app/admin/generals/types"
import { Unit } from "@/app/admin/units/types"
import { LootBox } from "@/lib/types/loot-box"

/* =======================
   Runtime constants
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
   Types (derived)
======================= */

export type ShopItemStatus = typeof SHOP_ITEM_STATUSES[number]
export type ShopItemRarity = typeof SHOP_ITEM_RARITIES[number]
export type ShopItemType = typeof SHOP_ITEM_TYPES[number]

/* =======================
   Core entities
======================= */

export interface EconomyShopItem {
  id: string
  name: string
  description: string | null
  category: string | null
  type: ShopItemType | null
  rarity: ShopItemRarity | null
  duration_days: number | null
  stock: number | null
  sales: number | null
  revenue: number | null
  status: ShopItemStatus | null
  created_at: string
  updated_at: string
  vip_level_required: number
  item_icon: string | null
}

export interface EconomyShopItemComponent {
  id: string
  shop_item_id: string
  base_item_id: string | null
  quantity: number
  beauty_id: string | null
  general_id: string | null
  gift_id: string | null
  loot_box_id: string | null
  unit_id: string | null

  // Relations (populated)
  base_item?: BaseItem
  beauty?: BeautyCharacter
  general?: General
  gift?: GiftBeauty
  loot_box?: LootBox
  unit?: Unit
}

export interface ShopItemWithComponents extends EconomyShopItem {
  components: EconomyShopItemComponent[]
}

/* =======================
   Components
======================= */

export type ComponentType =
  | 'base_item'
  | 'beauty'
  | 'general'
  | 'gift'
  | 'loot_box'
  | 'unit'

export interface ComponentOption {
  id: string
  name: string
  type: ComponentType
  icon?: string | null
}

/* =======================
   Form / Filters / API
======================= */

export interface ShopItemFormData {
  name: string
  description: string | null
  category: string | null
  type: ShopItemType | null
  rarity: ShopItemRarity | null
  duration_days: number | null
  stock: number | null
  vip_level_required: number
  item_icon: string | null
  status: ShopItemStatus | null
  components: Omit<EconomyShopItemComponent, 'id' | 'shop_item_id'>[]
}

export interface ShopItemFilters {
  status?: ShopItemStatus
  type?: ShopItemType
  rarity?: ShopItemRarity
  search?: string
  page?: number
  limit?: number
}

export interface ShopItemsResponse {
  data: ShopItemWithComponents[]
  total: number
  page: number
  limit: number
}
