import { BaseItem } from "../../quests/types";

// Enums based on database constraints
export type LootBoxType =
  | "common"
  | "vip"
  | "premium"
  | "event"
  | "seasonal"
  | "boss"
  | "alliance"
  | "achievement"
  | "special";
export type LootBoxCategory =
  | "equipment"
  | "consumable"
  | "material"
  | "currency"
  | "cosmetic"
  | "mixed"
  | "starter"
  | "daily"
  | "weekly";
export type LootBoxTier =
  | "basic"
  | "advanced"
  | "elite"
  | "master"
  | "legendary";
export type OpeningAnimationType = "simple" | "epic" | "custom";
export type Rarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic"
  | "ancient"
  | "divine";
export type RewardType =
  | "item"
  | "currency"
  | "experience"
  | "vip_points"
  | "alliance_points"
  | "cosmetic"
  | "title"
  | "mount"
  | "pet"
  | "skill_point"
  | "stat_point";
export type BoundType = "none" | "account" | "character";
export type DistributionType = "weighted" | "random" | "sequential" | "pity";
export type StreakType = "consecutive" | "total";

// Core Loot Box
export interface LootBox {
  id: string;
  name: string;
  description: string | null;
  type: LootBoxType;
  box_type: LootBoxType;
  tier: LootBoxTier;
  category: LootBoxCategory;
  open_cost_currency: string;
  open_cost_amount: number;
  opening_animation_type: OpeningAnimationType;
  opening_animation_duration: number;
  sound_effect: string | null;
  particle_effect: string | null;
  custom_animation: string | null;
  glow_color: string | null;
  particle_color: string | null;
  shine_effect: boolean | null;
  rarity_pulse: boolean | null;
  tags: Record<string, any> | null;
  season: string | null;
  event: string | null;
  exclusive: boolean | null;
  time_limited: boolean | null;
  available_from: Date | string | null;
  available_until: Date | string | null;
  created_at: Date | string | null;
  updated_at: Date | string | null;
}

// Reward System
export interface LootBoxRewardTable {
  first_time_bonus: any;
  pools: LootBoxRewardPool[];
  id: string;
  loot_box_id: string;
  name: string;
  distribution_type: DistributionType;
  anti_duplicate: boolean | null;
  duplicate_protection: number | null;
}

export interface LootBoxRewardPool {
  items: BaseItem[];
  id: string;
  reward_table_id: string;
  name: string;
  weight: number;
  min_drops: number;
  max_drops: number;
  guaranteed: boolean | null;
}

export interface LootBoxRewardItem {
  id: string;
  reward_pool_id: string;
  reward_type: RewardType;
  item_id: string | null;
  currency_type: string | null;
  amount_min: number;
  amount_max: number;
  weight: number;
  rarity: Rarity;
  bound_type: BoundType;
}

// Pity System
export interface LootBoxPitySystem {
  id: string;
  loot_box_id: string;
  enabled: boolean | null;
  reset_on_rare_drop: boolean | null;
}

export interface LootBoxPityCounter {
  id: string;
  pity_system_id: string;
  rarity: Rarity;
  threshold: number;
}

export interface LootBoxPityItem {
  id: string;
  pity_counter_id: string;
  reward_item_id: string;
  weight: number | null;
}

// Guaranteed Drops
export interface LootBoxGuaranteedDrop {
  rewards: any;
  id: string;
  loot_box_id: string;
  open_count: number;
  reset_after_claim: boolean | null;
}

export interface LootBoxGuaranteedReward {
  id: string;
  guaranteed_drop_id: string;
  reward_item_id: string;
}

// Streak Bonuses
export interface LootBoxStreakBonus {
  id: string;
  reward_table_id: string;
  enabled: boolean | null;
  streak_type: StreakType | null;
}

export interface LootBoxStreakBonusTier {
  id: string;
  streak_bonus_id: string;
  streak_count: number;
  multiplier: number;
  guaranteed_rarity: Rarity | null;
}

export interface LootBoxStreakItem {
  id: string;
  streak_tier_id: string;
  reward_item_id: string;
  weight: number | null;
}

// First Time Bonuses
export interface LootBoxFirstTimeBonus {
  id: string;
  reward_table_id: string;
  enabled: boolean | null;
  multiplier: number;
}

export interface LootBoxFirstTimeReward {
  id: string;
  first_time_bonus_id: string;
  reward_item_id: string;
}

// Player Data
export interface PlayerLootBoxReward {
  id: string;
  player_loot_box_id: string;
  reward_item_id: string;
  is_guaranteed: boolean | null;
  is_boosted: boolean | null;
  amount: number;
  dropped_at: Date | string | null;
}

// Composite types for API responses
export interface LootBoxWithDetails extends LootBox {
  reward_tables: any;
  reward_table?: LootBoxRewardTableWithDetails;
  pity_system?: LootBoxPitySystemWithCounters;
  guaranteed_drops?: LootBoxGuaranteedDropWithRewards[];
}

export interface LootBoxRewardTableWithDetails extends LootBoxRewardTable {
  pools?: LootBoxRewardPoolWithItems[];
  streak_bonus?: LootBoxStreakBonusWithTiers;
  first_time_bonus?: LootBoxFirstTimeBonusWithRewards;
}

export interface LootBoxRewardPoolWithItems extends LootBoxRewardPool {
  items?: LootBoxRewardItem[];
}

export interface LootBoxPitySystemWithCounters extends LootBoxPitySystem {
  counters?: LootBoxPityCounterWithItems[];
}

export interface LootBoxPityCounterWithItems extends LootBoxPityCounter {
  items?: LootBoxPityItem[];
}

export interface LootBoxGuaranteedDropWithRewards
  extends LootBoxGuaranteedDrop {
  rewards?: LootBoxGuaranteedReward[];
}

export interface LootBoxStreakBonusWithTiers extends LootBoxStreakBonus {
  tiers?: LootBoxStreakBonusTierWithItems[];
}

export interface LootBoxStreakBonusTierWithItems
  extends LootBoxStreakBonusTier {
  items?: LootBoxStreakItem[];
}

export interface LootBoxFirstTimeBonusWithRewards
  extends LootBoxFirstTimeBonus {
  rewards?: LootBoxFirstTimeReward[];
}

// Utility types for creating/updating
export type CreateLootBox = Omit<LootBox, "id" | "created_at" | "updated_at">;
export type UpdateLootBox = Partial<
  Omit<LootBox, "id" | "created_at" | "updated_at">
>;

export type CreateRewardTable = Omit<LootBoxRewardTable, "id">;
export type CreateRewardPool = Omit<LootBoxRewardPool, "id">;
export type CreateRewardItem = Omit<LootBoxRewardItem, "id">;

// Request/Response types
export interface OpenLootBoxRequest {
  loot_box_id: string;
  player_id: string;
  quantity?: number;
}

export interface OpenLootBoxResponse {
  rewards: PlayerLootBoxReward[];
  pity_progress?: Record<Rarity, number>;
  streak_count?: number;
  first_time_bonus_applied?: boolean;
}

export interface LootBoxDropRate {
  rarity: Rarity;
  chance: number;
  items: Array<{
    id: string;
    name: string;
    chance: number;
    min_amount: number;
    max_amount: number;
  }>;
}
