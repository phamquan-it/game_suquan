// types/database.ts

// ======================================================
// Base Table Types (NO relations here)
// ======================================================

// ---------- Reward Item ----------
export interface LootBoxRewardItem {
  id: string;
  reward_pool_id: string;
  reward_type: string;
  item_id: string | null;
  currency_type: string | null;
  amount_min: number;
  amount_max: number;
  weight: number;
  rarity: string;
  bound_type: string;
}

// ---------- Guaranteed Drop ----------
export interface LootBoxGuaranteedDrop {
  id: string;
  loot_box_id: string;
  open_count: number;
  reset_after_claim: boolean;
}

// ---------- Guaranteed Reward (junction table) ----------
export interface LootBoxGuaranteedReward {
  id: string;
  guaranteed_drop_id: string;
  reward_item_id: string;
}

// ======================================================
// Relation Types (USED WHEN YOU JOIN DATA)
// ======================================================

// ---------- Reward WITH item details ----------
export interface LootBoxGuaranteedRewardWithItem
  extends LootBoxGuaranteedReward {
  loot_box_reward_items: LootBoxRewardItem;
}

// ---------- Drop WITH rewards (no item details) ----------
export interface LootBoxGuaranteedDropWithRewards
  extends LootBoxGuaranteedDrop {
  loot_box_guaranteed_rewards: LootBoxGuaranteedReward[];
}

// ---------- Drop WITH rewards + item details (FULL JOIN) ----------
export interface LootBoxGuaranteedDropFull
  extends LootBoxGuaranteedDrop {
  loot_box_guaranteed_rewards: LootBoxGuaranteedRewardWithItem[];
}
