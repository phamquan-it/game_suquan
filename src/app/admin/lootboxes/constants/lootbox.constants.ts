import { BoundType, DistributionType, LootBoxCategory, LootBoxTier, LootBoxType, OpeningAnimationType, Rarity, RewardType, StreakType } from "../types";





export const LOOT_BOX_TYPES: { value: LootBoxType; label: string }[] = [
  { value: 'common', label: 'Common' },
  { value: 'vip', label: 'VIP' },
  { value: 'premium', label: 'Premium' },
  { value: 'event', label: 'Event' },
  { value: 'seasonal', label: 'Seasonal' },
  { value: 'boss', label: 'Boss' },
  { value: 'alliance', label: 'Alliance' },
  { value: 'achievement', label: 'Achievement' },
  { value: 'special', label: 'Special' },
];

export const LOOT_BOX_CATEGORIES: { value: LootBoxCategory; label: string }[] = [
  { value: 'equipment', label: 'Equipment' },
  { value: 'consumable', label: 'Consumable' },
  { value: 'material', label: 'Material' },
  { value: 'currency', label: 'Currency' },
  { value: 'cosmetic', label: 'Cosmetic' },
  { value: 'mixed', label: 'Mixed' },
  { value: 'starter', label: 'Starter' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
];

export const LOOT_BOX_TIERS: { value: LootBoxTier; label: string; color: string }[] = [
  { value: 'basic', label: 'Basic', color: '#808080' },
  { value: 'advanced', label: 'Advanced', color: '#1E90FF' },
  { value: 'elite', label: 'Elite', color: '#800080' },
  { value: 'master', label: 'Master', color: '#FF8C00' },
  { value: 'legendary', label: 'Legendary', color: '#D4AF37' },
];

export const OPENING_ANIMATION_TYPES: { value: OpeningAnimationType; label: string }[] = [
  { value: 'simple', label: 'Simple' },
  { value: 'epic', label: 'Epic' },
  { value: 'custom', label: 'Custom' },
];

export const RARITIES: { value: Rarity; label: string; color: string }[] = [
  { value: 'common', label: 'Common', color: '#808080' },
  { value: 'uncommon', label: 'Uncommon', color: '#1E90FF' },
  { value: 'rare', label: 'Rare', color: '#800080' },
  { value: 'epic', label: 'Epic', color: '#FF8C00' },
  { value: 'legendary', label: 'Legendary', color: '#D4AF37' },
  { value: 'mythic', label: 'Mythic', color: '#FF1493' },
  { value: 'ancient', label: 'Ancient', color: '#8B4513' },
  { value: 'divine', label: 'Divine', color: '#FFD700' },
];

export const REWARD_TYPES: { value: RewardType; label: string }[] = [
  { value: 'item', label: 'Item' },
  { value: 'currency', label: 'Currency' },
  { value: 'experience', label: 'Experience' },
  { value: 'vip_points', label: 'VIP Points' },
  { value: 'alliance_points', label: 'Alliance Points' },
  { value: 'cosmetic', label: 'Cosmetic' },
  { value: 'title', label: 'Title' },
  { value: 'mount', label: 'Mount' },
  { value: 'pet', label: 'Pet' },
  { value: 'skill_point', label: 'Skill Point' },
  { value: 'stat_point', label: 'Stat Point' },
];

export const DISTRIBUTION_TYPES: { value: DistributionType; label: string }[] = [
  { value: 'weighted', label: 'Weighted Random' },
  { value: 'random', label: 'Pure Random' },
  { value: 'sequential', label: 'Sequential' },
  { value: 'pity', label: 'Pity System' },
];

export const BOUND_TYPES: { value: BoundType; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'account', label: 'Account Bound' },
  { value: 'character', label: 'Character Bound' },
];

export const STREAK_TYPES: { value: StreakType; label: string }[] = [
  { value: 'consecutive', label: 'Consecutive' },
  { value: 'total', label: 'Total' },
];

export const CURRENCY_OPTIONS = [
  { value: 'gold', label: 'Gold' },
  { value: 'gems', label: 'Gems' },
  { value: 'silver', label: 'Silver' },
  { value: 'alliance_tokens', label: 'Alliance Tokens' },
  { value: 'event_tokens', label: 'Event Tokens' },
  { value: 'premium_currency', label: 'Premium Currency' },
];
