// types/player-item.ts

export type BaseItem = {
  id: string;
  name: string;
  description?: string;
  type: string;
  rarity: string;
  quality: string;
  level_requirement: number;
  stackable: boolean;
  max_stack: number;
  base_value: number;
  icon?: string;
  svg_icon?: string;
};

export type PlayerItem = {
  id: string;
  player_id: string;
  item_id: string;
  quantity: number;
  equipped: boolean;
  condition: number;
  acquired_at: string;
  metadata: Record<string, any>;
};

export type PlayerItemWithDetail = PlayerItem & {
  item: BaseItem;
};
