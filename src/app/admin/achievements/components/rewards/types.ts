// types.ts
export type Currency = {
  currency_type: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  exchange_rate: number;
  max_stack: number;
  tradable: boolean;
  destroyable: boolean;
  category: string;
};

export type BaseItem = {
  id: string;
  name: string;
  description: string | null;
  type: string; // item_type enum
  rarity: string; // rarity_type enum
  quality: string; // quality_type enum
  level_requirement: number;
  stackable: boolean;
  max_stack: number;
  base_value: number;
  icon: string | null;
  is_tradable: boolean;
  is_sellable: boolean;
  is_destroyable: boolean;
  is_quest_item: boolean;
  status: string; // item_status_type enum
  created_at: string;
  updated_at: string;
  svg_icon: string | null;
};

export type AchievementReward = {
  id: number;
  item_id: string | null;
  quantity: number;
  probability: number;
  currency_type: string | null;
  requirement_id: number | null;
  // Joined data
  currency?: Currency | null;
  item?: BaseItem | null;
};
