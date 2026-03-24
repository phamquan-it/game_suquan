// Enums matching database check constraints
export type QuestType =
  | 'login'
  | 'pvp_battle'
  | 'pve_battle'
  | 'exploration'
  | 'boss_hunt'
  | 'alliance'
  | 'alliance_battle'
  | 'crafting'
  | 'beauty';

export type QuestCategory = 'daily' | 'weekly' | 'alliance' | 'event';

export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type QuestStatus = 'active' | 'inactive';

export type RequirementType = string; // References game_actions.id

export type RewardType = 'item' | 'currency' | 'experience';

// Item types from your public schema
export type ItemType =
  | 'weapon'
  | 'armor'
  | 'consumable'
  | 'material'
  | 'quest'
  | 'currency'
  | 'treasure'
  | 'artifact'
  | 'mount'
  | 'pet'
  | 'blueprint'
  | 'resource';

export type RarityType =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'mythic';

export type QualityType =
  | 'normal'
  | 'magic'
  | 'rare'
  | 'epic'
  | 'legendary';

export type ItemStatusType = 'active' | 'inactive' | 'deprecated' | 'limited';

// Main Quest table
export interface Quest {
  id: string;
  name: string;
  description: string | null;
  type: QuestType;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  status: QuestStatus;
  completion_limit: number | null;
  created_at: Date;
  updated_at: Date;
  min_level: number;
  max_level: number;
}

// Quest Requirements
export interface QuestRequirement {
  id: string;
  quest_id: string;
  requirement_type: RequirementType;
  target: number;
  meta: Record<string, any> | null;
}

// Player progress for individual requirements
export interface QuestRequirementProgress {
  player_id: string;
  quest_requirement_id: string;
  progress: number;
  completed: boolean;
  completed_at: Date | null;
  updated_at: Date;
  last_progress_at: Date | null;
}

// Overall player quest progress
export interface PlayerQuestProgress {
  player_id: string;
  quest_id: string;
  category: QuestCategory | null;
  completed: boolean | null;
  completed_at: Date | null;
  claimed: boolean | null;
  updated_at: Date;
}

// Quest completion log
export interface QuestCompletionLog {
  id: string;
  player_id: string;
  player_name: string | null;
  quest_id: string;
  quest_name: string | null;
  completed_at: Date;
  rewards: Record<string, any>; // JSONB field
  ip: string | null;
  server: string | null;
}

// Quest Rewards
export interface QuestReward {
  id: string;
  quest_id: string;
  item_id: string | null;
  amount: number;
  reward_type: RewardType;
  currency_type: string | null;
  experience_amount: number | null;
  description: string | null;
  created_at: Date;
}

// Base Items (referenced by quest rewards)
export interface BaseItem {
  id: string;
  name: string;
  description: string | null;
  type: ItemType;
  rarity: RarityType;
  quality: QualityType;
  level_requirement: number;
  stackable: boolean;
  max_stack: number;
  base_value: number;
  icon: string | null;
  is_tradable: boolean;
  is_sellable: boolean;
  is_destroyable: boolean;
  is_quest_item: boolean;
  status: ItemStatusType;
  created_at: Date;
  updated_at: Date;
  svg_icon: string | null;
}

// Composite types for API responses
export interface QuestWithRelations extends Quest {
  requirements?: QuestRequirement[];
  rewards?: QuestReward[];
}

export interface PlayerQuestWithProgress extends PlayerQuestProgress {
  quest?: Quest;
  requirement_progress?: QuestRequirementProgress[];
}

export interface QuestRequirementWithProgress extends QuestRequirement {
  progress?: QuestRequirementProgress[];
}

// Utility types for creating/updating
export type CreateQuestInput = Omit<Quest, 'id' | 'created_at' | 'updated_at'>;
export type UpdateQuestInput = Partial<Omit<Quest, 'id' | 'created_at' | 'updated_at'>>;

export type CreateQuestRequirementInput = Omit<QuestRequirement, 'id'>;
export type UpdateQuestRequirementInput = Partial<Omit<QuestRequirement, 'id' | 'quest_id'>>;

export type UpdateQuestRequirementProgressInput = Partial<Pick<QuestRequirementProgress, 'progress' | 'completed' | 'completed_at' | 'last_progress_at'>>;

export type CreateQuestRewardInput = Omit<QuestReward, 'id' | 'created_at'>;
export type UpdateQuestRewardInput = Partial<Omit<QuestReward, 'id' | 'quest_id' | 'created_at'>>;

// Constants for validation
export const QUEST_TYPES: QuestType[] = [
  'login', 'pvp_battle', 'pve_battle', 'exploration',
  'boss_hunt', 'alliance', 'alliance_battle', 'crafting', 'beauty'
];

export const QUEST_CATEGORIES: QuestCategory[] = [
  'daily', 'weekly', 'alliance', 'event'
];

export const QUEST_DIFFICULTIES: QuestDifficulty[] = [
  'easy', 'medium', 'hard', 'expert'
];

export const QUEST_STATUSES: QuestStatus[] = [
  'active', 'inactive'
];

export const REWARD_TYPES: RewardType[] = [
  'item', 'currency', 'experience'
];
