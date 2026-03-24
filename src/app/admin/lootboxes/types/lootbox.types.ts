// app/admin/lootboxes/types/lootbox.types.ts
import { 
  LootBox, 
  LootBoxRewardTable, 
  LootBoxRewardPool,
  LootBoxRewardItem,
  LootBoxPitySystem,
  LootBoxPityCounter,
  LootBoxPityItem,
  LootBoxGuaranteedDrop,
  LootBoxGuaranteedReward,
  LootBoxStreakBonus,
  LootBoxStreakBonusTier,
  LootBoxStreakItem,
  LootBoxFirstTimeBonus,
  LootBoxFirstTimeReward,
  Rarity,
  RewardType,
  LootBoxType,
  LootBoxCategory,
  LootBoxTier,
  DistributionType
} from '@/types/lootbox';

export interface LootBoxFilters {
  search?: string;
  type?: LootBoxType;
  category?: LootBoxCategory;
  tier?: LootBoxTier;
  season?: string;
  event?: string;
  isActive?: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data: T;
  total: number;
  page: number;
  limit: number;
}

// Form Types
export interface LootBoxFormData extends Omit<LootBox, 'id' | 'created_at' | 'updated_at' | 'tags'> {
  tags: string[];
}

export interface RewardTableFormData {
  name: string;
  distribution_type: DistributionType;
  anti_duplicate: boolean;
  duplicate_protection: number;
  pools: RewardPoolFormData[];
  streak_bonus?: StreakBonusFormData;
  first_time_bonus?: FirstTimeBonusFormData;
}

export interface RewardPoolFormData {
  name: string;
  weight: number;
  min_drops: number;
  max_drops: number;
  guaranteed: boolean;
  items: RewardItemFormData[];
}

export interface RewardItemFormData {
  reward_type: RewardType;
  item_id?: string;
  currency_type?: string;
  amount_min: number;
  amount_max: number;
  weight: number;
  rarity: Rarity;
  bound_type: 'none' | 'account' | 'character';
}

export interface PitySystemFormData {
  enabled: boolean;
  reset_on_rare_drop: boolean;
  counters: PityCounterFormData[];
}

export interface PityCounterFormData {
  rarity: Rarity;
  threshold: number;
  items: PityItemFormData[];
}

export interface PityItemFormData {
  reward_item_id: string;
  weight: number;
}

export interface GuaranteedDropFormData {
  open_count: number;
  reset_after_claim: boolean;
  rewards: string[]; // reward_item_ids
}

export interface StreakBonusFormData {
  enabled: boolean;
  streak_type: 'consecutive' | 'total';
  tiers: StreakTierFormData[];
}

export interface StreakTierFormData {
  streak_count: number;
  multiplier: number;
  guaranteed_rarity?: Rarity;
  items: StreakItemFormData[];
}

export interface StreakItemFormData {
  reward_item_id: string;
  weight: number;
}

export interface FirstTimeBonusFormData {
  enabled: boolean;
  multiplier: number;
  rewards: string[]; // reward_item_ids
}
