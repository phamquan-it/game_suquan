// Enum types based on PostgreSQL enums
export type ItemType =
  | 'weapon'
  | 'armor'
  | 'consumable'
  | 'material'
  | 'quest'
  | 'special'
  | 'currency'
  | 'ammunition'
  | 'trap'
  | 'royal_seal'
  | 'decree'
  | 'territory'
  | 'court_item'
  | 'cultural'
  | 'economic'
  | 'diplomatic'
  | 'succession'
  | 'blueprint'
  | 'book'
  | 'upgrade'
  | 'relic'
  | 'totem'
  | 'key'
  | 'general'
  | 'advisor'
  | 'special_unit'
  | 'artifact'
  | 'event'
  | 'general_weapon'
  | 'general_armor'
  | 'general_mount'
  | 'general_special_item'
  | 'soldier_weapon'
  | 'soldier_armor'
  | 'siege_equipment'
  | 'soldier_special_item'
  | 'consort'
  | 'hero'
  | 'energy_food'
  | 'potion'
  | 'gift'
  | 'buff_scroll'
  | 'quest_item'
  | 'event_trigger'
  | 'skill_book'
  | 'strategy_scroll'
  | 'manual'
  | 'helmet'
  | 'cloak'
  | 'ring0'
  | 'ring1'
  | 'boots'
  | 'mount'
  | 'shield'
  | 'accessory'
  | 'general_helmet'
  | 'general_cloak'
  | 'general_boots'
  | 'general_ring0'
  | 'general_ring1'
  | 'general_shield'
  | 'general_accessory';
export type RarityType = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
export type QualityType =
  | 'broken'
  | 'damaged'
  | 'normal'
  | 'good'
  | 'excellent'
  | 'perfect';
export type ItemStatusType =
  | 'active'
  | 'inactive'
  | 'testing';
export type EquipmentSlotType =
  | 'weapon'
  | 'head'
  | 'chest'
  | 'hands'
  | 'legs'
  | 'feet'
  | 'accessory';
export type SourceType =
  | 'gathering'
  | 'crafting'
  | 'monster'
  | 'quest'
  | 'purchase';
export type EffectType =
  | 'heal'
  | 'buff'
  | 'debuff'
  | 'teleport'
  | 'transform';
export type TargetType =
  | 'self'
  | 'enemy'
  | 'ally'
  | 'area';

// Base Item type
export interface BaseItem {
  id: string;
  name: string;
  description: string | null;
  type: ItemType;
  rarity: RarityType;
  quality: QualityType;
  levelRequirement: number;
  stackable: boolean;
  maxStack: number;
  baseValue: number;
  icon: string | null;
  isTradable: boolean;
  isSellable: boolean;
  isDestroyable: boolean;
  isQuestItem: boolean;
  status: ItemStatusType;
  svgIcon: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  stats?: ItemStats | null;
  materialInfo?: MaterialItem | null;
  consumableInfo?: ConsumableItem | null;
  setMemberships?: SetItem[];
}

// Item Stats
export interface ItemStats {
  id: string;
  baseItemId: string;
  attack: number | null;
  defense: number | null;
  health: number | null;
  mana: number | null;
  strength: number | null;
  agility: number | null;
  intelligence: number | null;
  speed: number | null;
  leadership: number | null;
  criticalChance: number | null;
  criticalDamage: number | null;
  dodge: number | null;
  block: number | null;
  resistance: number | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  baseItem?: BaseItem;
}

// Equipment Set
export interface EquipmentSet {
  id: string;
  setCode: string;
  setName: string;
  setDescription: string | null;
  setRarity: string;
  requiredLevel: number | null;
  setBonusType: string | null;
  iconUrl: string | null;
  createdAt: Date | null;

  // Relations
  items?: SetItem[];
}

// Set Items (Junction table)
export interface SetItem {
  id: string;
  setId: string;
  baseItemId: string;
  requiredSlot: EquipmentSlotType;
  isRequiredForSet: boolean | null;
  pieceNumber: number | null;

  // Relations
  set?: EquipmentSet;
  baseItem?: BaseItem;
}

// Material Item
export interface MaterialItem {
  id: string;
  sourceType: SourceType;
  sourceLocation: string | null;
  dropRate: number | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  baseItem?: BaseItem;
  recipes?: MaterialRecipe[];
}

// Material Recipe (Junction table)
export interface MaterialRecipe {
  id: number;
  materialId: string;
  recipeId: string;
  createdAt: Date;

  // Relations
  material?: MaterialItem;
  // recipe?: Recipe; // Reference to a Recipe type if you have one
}

// Consumable Item
export interface ConsumableItem {
  id: string;
  cooldown: number;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  baseItem?: BaseItem;
  effects?: ConsumableEffect[];
}

// Consumable Effect
export interface ConsumableEffect {
  id: number;
  consumableId: string;
  effectType: EffectType;
  duration: number | null;
  value: number;
  target: TargetType;
  attributeAffected: string;
  effectOrder: number;
  createdAt: Date;

  // Relations
  consumable?: ConsumableItem;
}

// Utility types for creating/updating
export type CreateBaseItem = Omit<BaseItem, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateBaseItem = Partial<Omit<BaseItem, 'id' | 'createdAt' | 'updatedAt'>>;

// Type guards
export const isEquipment = (item: BaseItem): boolean => {
  return ['weapon', 'armor', 'accessory'].includes(item.type);
};

export const isConsumable = (item: BaseItem): boolean => {
  return item.type === 'consumable' && item.consumableInfo !== undefined;
};

export const isMaterial = (item: BaseItem): boolean => {
  return item.type === 'material' && item.materialInfo !== undefined;
};

// Composite types for API responses
export interface EquipmentItem extends BaseItem {
  type: 'weapon' | 'armor' | 'accessory';
  stats: ItemStats;
  setMemberships?: SetItem[];
}

export interface FullConsumableItem extends BaseItem {
  type: 'consumable';
  consumableInfo: ConsumableItem & {
    effects: ConsumableEffect[];
  };
}

export interface FullMaterialItem extends BaseItem {
  type: 'material';
  materialInfo: MaterialItem & {
    recipes: MaterialRecipe[];
  };
}

export interface ItemWithSetInfo extends BaseItem {
  setMemberships: (SetItem & {
    set: EquipmentSet;
  })[];
}


export interface ItemWithRelations extends BaseItem {
  stats?: ItemStats | null;
  setMemberships?: (SetItem & {
    set: EquipmentSet;
  })[];
}

export interface ItemFormData {
  id?: string;
  name: string;
  description: string;
  type: BaseItem['type'];
  rarity: BaseItem['rarity'];
  quality: BaseItem['quality'];
  levelRequirement: number;
  stackable: boolean;
  maxStack: number;
  baseValue: number;
  icon: string | null;
  svgIcon: string | null;
  isTradable: boolean;
  isSellable: boolean;
  isDestroyable: boolean;
  isQuestItem: boolean;
  status: BaseItem['status'];

  // Stats
  stats?: {
    attack: number | null;
    defense: number | null;
    health: number | null;
    mana: number | null;
    strength: number | null;
    agility: number | null;
    intelligence: number | null;
    speed: number | null;
    leadership: number | null;
    criticalChance: number | null;
    criticalDamage: number | null;
    dodge: number | null;
    block: number | null;
    resistance: number | null;
  };
}

export type ItemFilterParams = {
  type?: string;
  rarity?: string;
  quality?: string;
  status?: string;
  levelMin?: number;
  levelMax?: number;
  search?: string;
  page?: number;
  limit?: number;
};
