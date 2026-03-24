// types/general.ts

// Enums
export type HeroRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
export type HeroElement = 'fire' | 'water' | 'earth' | 'wind' | 'light' | 'dark';
export type HeroStatus = 'active' | 'inactive' | 'training' | 'deployed';
export type HeroType = 'infantry' | 'cavalry' | 'archer' | 'siege' | 'defense';
export type SkillType = 'active' | 'passive' | 'ultimate';

// Main General interface
export interface General {
  id: string;
  name: string;
  title: string | null;
  rarity: HeroRarity;
  element: HeroElement;
  type: HeroType;
  level: number;
  max_level: number;
  base_attack: number;
  base_defense: number;
  base_health: number;
  base_speed: number;
  base_intelligence: number;
  base_leadership: number;
  current_attack: number;
  current_defense: number;
  current_health: number;
  current_speed: number;
  current_intelligence: number;
  current_leadership: number;
  status: HeroStatus;
  owner: string | null;
  location: string | null;
  experience: number;
  required_exp: number;
  star_level: number;
  max_star_level: number;
  awakening_level: number;
  bond_level: number;
  favorite: boolean;
  obtained_date: string | null;
  last_used: string | null;
  battle_count: number | null;
  win_rate: number | null;
  voice_actor: string | null;
  biography: string | null;
  image: string | null;
  thumbnail: string | null;
  is_vip: boolean;
  description: string | null;

  // Relations
  skills?: GeneralSkill[];
  shard_rewards?: BattleRewardHeroShard[];
}

// General Skills interface
export interface GeneralSkill {
  id: string;
  general_id: string | null;
  name: string;
  description: string | null;
  type: SkillType;
  level: number;
  max_level: number;
  cooldown: number | null;
  mana_cost: number | null;
  icon: string | null;

  // Relations
  general?: General;
}

// Battle Reward Hero Shards interface
export interface BattleRewardHeroShard {
  id: string;
  battle_reward_id: string;
  hero_id: string;
  shard_quantity: number;
  total_shards_needed: number;
  created_at: string;

  // Indices for performance
  // Indexed fields: battle_reward_id, hero_id

  // Relations
  general?: General;
  battle_reward?: any;
}

// Extended General with computed fields
export interface GeneralWithDetails extends General {
  skills: GeneralSkill[];
  current_power: number;
  power_rating: 'yếu' | 'trung bình' | 'mạnh' | 'tinh anh' | 'huyền thoại';
  skill_unlock_levels?: Record<number, string[]>;
  upgrade_cost?: {
    experience: number;
    star_shards: number;
    gold: number;
    resources?: Record<string, number>;
  };
  stats: GeneralStats;
  growth_rates: GeneralGrowthRates;
}

// General Stats
export interface GeneralStats {
  total_attack: number;
  total_defense: number;
  total_health: number;
  total_speed: number;
  total_intelligence: number;
  total_leadership: number;
  power_score: number;
  crit_rate: number;
  crit_damage: number;
  dodge_rate: number;
  accuracy: number;
}

// Growth Rates
export interface GeneralGrowthRates {
  attack_per_level: number;
  defense_per_level: number;
  health_per_level: number;
  speed_per_level: number;
  intelligence_per_level: number;
  leadership_per_level: number;
  power_per_level: number;
}

// Upgrade Requirements
export interface GeneralUpgradeRequirement {
  level: number;
  required_exp: number;
  required_star_level?: number;
  required_awakening?: number;
  required_bond?: number;
  required_items?: Record<string, number>;
  required_gold?: number;
  required_shards?: number;
}

// Unlock Conditions
export interface GeneralUnlockCondition {
  player_level?: number;
  campaign_stage?: string;
  items?: Record<string, number>;
  currency?: {
    type: string;
    amount: number;
  };
  quest_id?: string;
  achievement_id?: string;
}

// Team Formation
export interface GeneralTeam {
  id: string;
  name: string;
  general_ids: string[];
  formation: 'tiên phong' | 'hậu vệ' | 'cánh' | 'công thành';
  bonuses: Record<string, number>;
  total_power: number;
  active_synergies: GeneralSynergy[];
}

// General Synergy
export interface GeneralSynergy {
  general_id_1: string;
  general_id_2: string;
  general_1_name?: string;
  general_2_name?: string;
  synergy_type: 'nguyên tố' | 'chủng tộc' | 'kỹ năng' | 'liên kết';
  bonus_description: string;
  bonus_value: number;
  is_active: boolean;
}

// Battle Performance
export interface GeneralBattlePerformance {
  general_id: string;
  general_name?: string;
  battles_won: number;
  battles_lost: number;
  win_rate: number;
  total_damage_dealt: number;
  avg_damage_per_battle: number;
  total_damage_taken: number;
  total_healing_done: number;
  skills_used: Record<string, {
    skill_name: string;
    times_used: number;
    total_damage: number;
  }>;
  mvp_count: number;
  last_battle_result: 'thắng' | 'thua' | 'hòa';
  last_battle_time: string | null;
}

// Input Types
export type CreateGeneralInput = Pick<
  General,
  | 'id'
  | 'name'
  | 'rarity'
  | 'element'
  | 'type'
  | 'level'
  | 'max_level'
  | 'base_attack'
  | 'base_defense'
  | 'base_health'
  | 'base_speed'
  | 'base_intelligence'
  | 'base_leadership'
  | 'current_attack'
  | 'current_defense'
  | 'current_health'
  | 'current_speed'
  | 'current_intelligence'
  | 'current_leadership'
  | 'status'
  | 'experience'
  | 'required_exp'
> &
  Partial<
    Pick<
      General,
      | 'title'
      | 'description'
      | 'owner'
      | 'location'
      | 'star_level'
      | 'max_star_level'
      | 'awakening_level'
      | 'bond_level'
      | 'favorite'
      | 'is_vip'
      | 'obtained_date'
      | 'last_used'
      | 'battle_count'
      | 'win_rate'
      | 'voice_actor'
      | 'biography'
      | 'image'
      | 'thumbnail'
    >
  >;

export type UpdateGeneralInput = Partial<
  Omit<
    General,
    | 'id'
    | 'base_attack'
    | 'base_defense'
    | 'base_health'
    | 'base_speed'
    | 'base_intelligence'
    | 'base_leadership'
  >
>;

export type CreateGeneralSkillInput = Pick<
  GeneralSkill,
  'name' | 'type' | 'level' | 'max_level'
> &
  Partial<
    Pick<
      GeneralSkill,
      'general_id' | 'description' | 'cooldown' | 'mana_cost' | 'icon'
    >
  >;

export type UpdateGeneralSkillInput = Partial<
  Omit<GeneralSkill, 'id' | 'general_id'>
>;

export type CreateBattleRewardShardInput = Pick<
  BattleRewardHeroShard,
  'battle_reward_id' | 'hero_id' | 'shard_quantity'
> &
  Partial<Pick<BattleRewardHeroShard, 'total_shards_needed'>>;

// Filter Types
export interface GeneralFilterOptions {
  rarity?: HeroRarity[];
  element?: HeroElement[];
  type?: HeroType[];
  status?: HeroStatus[];
  minLevel?: number;
  maxLevel?: number;
  minStar?: number;
  owner?: string;
  favorite?: boolean;
  isVip?: boolean;
  searchTerm?: string;
}

// Response Types
export interface GeneralListResponse {
  generals: General[];
  total: number;
  page: number;
  limit: number;
  filters?: GeneralFilterOptions;
}

export interface GeneralDetailResponse {
  general: GeneralWithDetails;
  available_skills?: GeneralSkill[];
  upgrade_options?: GeneralUpgradeRequirement[];
  synergies?: GeneralSynergy[];
}

// Constants
export const GENERAL_CONSTRAINTS = {
  MIN_LEVEL: 1,
  MAX_LEVEL: 100,
  MIN_STAR_LEVEL: 1,
  MAX_STAR_LEVEL: 5,
  MIN_AWAKENING_LEVEL: 0,
  MAX_AWAKENING_LEVEL: 10,
  MIN_BOND_LEVEL: 0,
  MAX_BOND_LEVEL: 10,
  MIN_STAT_VALUE: 0,
  MAX_STAT_VALUE: 999999,
  MIN_WIN_RATE: 0,
  MAX_WIN_RATE: 100,
  MIN_EXPERIENCE: 0,
  MAX_EXPERIENCE: 9999999,
} as const;

export const RARITY_COLORS: Record<HeroRarity, string> = {
  common: '#A9A9A9',
  rare: '#1E90FF',
  epic: '#800080',
  legendary: '#FFA500',
  mythic: '#DC143C',
} as const;

export const ELEMENT_COLORS: Record<HeroElement, string> = {
  fire: '#FF4500',
  water: '#1E90FF',
  earth: '#8B4513',
  wind: '#32CD32',
  light: '#FFD700',
  dark: '#483D8B',
} as const;

// Utility Functions
export function calculateGeneralPower(general: General): number {
  return (
    general.current_attack * 2.5 +
    general.current_defense * 2 +
    general.current_health * 1.5 +
    general.current_speed * 3 +
    general.current_intelligence * 2 +
    general.current_leadership * 2
  );
}

export function getGeneralPowerRating(powerScore: number): GeneralWithDetails['power_rating'] {
  if (powerScore < 1000) return 'yếu';
  if (powerScore < 5000) return 'trung bình';
  if (powerScore < 10000) return 'mạnh';
  if (powerScore < 20000) return 'tinh anh';
  return 'huyền thoại';
}

export function calculateGrowthRates(
  baseStats: Pick<General, 'base_attack' | 'base_defense' | 'base_health' | 'base_speed' | 'base_intelligence' | 'base_leadership'>,
  maxLevel: number
): GeneralGrowthRates {
  const growthFactor = 0.1; // 10% growth per level

  return {
    attack_per_level: baseStats.base_attack * growthFactor,
    defense_per_level: baseStats.base_defense * growthFactor,
    health_per_level: baseStats.base_health * growthFactor,
    speed_per_level: baseStats.base_speed * growthFactor,
    intelligence_per_level: baseStats.base_intelligence * growthFactor,
    leadership_per_level: baseStats.base_leadership * growthFactor,
    power_per_level: (
      baseStats.base_attack * 2.5 +
      baseStats.base_defense * 2 +
      baseStats.base_health * 1.5 +
      baseStats.base_speed * 3 +
      baseStats.base_intelligence * 2 +
      baseStats.base_leadership * 2
    ) * growthFactor,
  };
}

export function calculateRequiredExp(currentLevel: number, targetLevel: number): number {
  // Exponential growth formula for experience
  let totalExp = 0;
  for (let level = currentLevel; level < targetLevel; level++) {
    totalExp += Math.floor(100 * Math.pow(1.2, level - 1));
  }
  return totalExp;
}

export function canUpgradeGeneral(
  general: General,
  playerResources: Record<string, number>
): {
  canUpgrade: boolean;
  missingRequirements: string[];
} {
  const missing: string[] = [];

  if (general.level >= general.max_level) {
    missing.push('Đã đạt cấp độ tối đa');
  }

  if (general.star_level >= general.max_star_level) {
    missing.push('Đã đạt sa tối đa');
  }

  // Check resources if needed
  // Add more checks as needed

  return {
    canUpgrade: missing.length === 0,
    missingRequirements: missing,
  };
}

// Type Guards
export function isLegendaryGeneral(general: General): boolean {
  return general.rarity === 'legendary' || general.rarity === 'mythic';
}

export function isMaxLevelGeneral(general: General): boolean {
  return general.level >= general.max_level;
}

export function isMaxStarGeneral(general: General): boolean {
  return general.star_level >= general.max_star_level;
}

export function isActiveGeneral(general: General): boolean {
  return general.status === 'active';
}

export function isDeployedGeneral(general: General): boolean {
  return general.status === 'deployed';
}

export function hasSkill(general: General, skillId: string): boolean {
  return general.skills?.some(skill => skill.id === skillId) ?? false;
}

export default General;
