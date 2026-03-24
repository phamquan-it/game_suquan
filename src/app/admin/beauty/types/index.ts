// Enums
export type CharacterRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type CharacterStatus = 'available' | 'mission' | 'training' | 'resting';
export type SkillType = 'passive' | 'active';
export type SkillEffectType = 'attribute_boost' | 'mission_success' | 'resource_bonus' | 'special_event';
export type JewelryType = 'hairpin' | 'necklace' | 'bracelet' | 'ring' | 'earring';
export type GiftRarity = 'common' | 'rare' | 'epic' | 'legendary';

// Base types
export interface BeautyCharacter {
  id: string;
  name: string;
  title: string;
  rarity: CharacterRarity;
  level: number;
  experience: number;
  max_level: number;
  description: string | null;
  charm: number;
  intelligence: number;
  diplomacy: number;
  intrigue: number;
  loyalty: number;
  status: CharacterStatus;
  current_mission: string | null;
  training_end_time: string | null; // ISO timestamp
  avatar: string;
  full_image: string;
  acquisition_date: string; // ISO timestamp
  last_used: string | null; // ISO timestamp
  mission_success_rate: number | null;
  image_url: string | null;
}

export interface BeautySkill {
  id: string; // UUID
  character_id: string | null;
  name: string;
  description: string | null;
  type: SkillType;
  effect_type: SkillEffectType;
  effect_value: number;
  effect_target: string;
  cooldown: number | null;
  level: number;
  max_level: number;
}

export interface Jewelry {
  id: string; // UUID
  character_id: string | null;
  name: string;
  type: JewelryType;
  rarity: CharacterRarity;
  charm: number | null;
  intrigue: number | null;
  loyalty: number | null;
  equipped: boolean | null;
  image: string;
}

export interface Costume {
  id: string; // UUID
  character_id: string | null;
  name: string;
  rarity: CharacterRarity;
  charm: number | null;
  intelligence: number | null;
  diplomacy: number | null;
  equipped: boolean | null;
  image: string;
}

export interface GiftBeauty {
  id: string;
  name: string;
  description: string | null;
  rarity: GiftRarity;
  intimacy_points: number;
  bonus_success_rate: number | null;
  bonus_training_speed: number | null;
  icon: string | null;
  is_active: boolean | null;
  created_at: string | null; // ISO timestamp
  price: number | null;
}

// Extended types with relationships
export interface BeautyCharacterWithRelations extends BeautyCharacter {
  skills?: BeautySkill[];
  jewelry?: Jewelry[];
  costumes?: Costume[];
}

export interface JewelryWithCharacter extends Jewelry {
  character?: BeautyCharacter;
}

export interface CostumeWithCharacter extends Costume {
  character?: BeautyCharacter;
}

export interface BeautySkillWithCharacter extends BeautySkill {
  character?: BeautyCharacter;
}

// API request/response types
export interface CreateCharacterRequest {
  name: string;
  title: string;
  rarity: CharacterRarity;
  charm: number;
  intelligence: number;
  diplomacy: number;
  intrigue: number;
  loyalty: number;
  avatar: string;
  full_image: string;
  description?: string;
  image_url?: string;
}

export interface UpdateCharacterRequest extends Partial<CreateCharacterRequest> {
  id: string;
  level?: number;
  experience?: number;
  status?: CharacterStatus;
  current_mission?: string | null;
  training_end_time?: string | null;
  last_used?: string | null;
  mission_success_rate?: number | null;
}

export interface CreateSkillRequest {
  character_id: string;
  name: string;
  description?: string;
  type: SkillType;
  effect_type: SkillEffectType;
  effect_value: number;
  effect_target: string;
  cooldown?: number;
  level?: number;
  max_level?: number;
}

export interface CreateJewelryRequest {
  character_id?: string;
  name: string;
  type: JewelryType;
  rarity: CharacterRarity;
  charm?: number;
  intrigue?: number;
  loyalty?: number;
  equipped?: boolean;
  image: string;
}

export interface CreateCostumeRequest {
  character_id?: string;
  name: string;
  rarity: CharacterRarity;
  charm?: number;
  intelligence?: number;
  diplomacy?: number;
  equipped?: boolean;
  image: string;
}

export interface CreateGiftRequest {
  name: string;
  description?: string;
  rarity: GiftRarity;
  intimacy_points: number;
  bonus_success_rate?: number;
  bonus_training_speed?: number;
  icon?: string;
  price?: number;
}

// Filter and query types
export interface CharacterFilters {
  rarity?: CharacterRarity;
  status?: CharacterStatus;
  minLevel?: number;
  maxLevel?: number;
  searchTerm?: string;
  minCharm?: number;
  minIntelligence?: number;
  minDiplomacy?: number;
  minIntrigue?: number;
  minLoyalty?: number;
}

export interface GiftFilters {
  rarity?: GiftRarity;
  is_active?: boolean;
  searchTerm?: string;
  minIntimacyPoints?: number;
}

export interface JewelryFilters {
  type?: JewelryType;
  rarity?: CharacterRarity;
  equipped?: boolean;
  character_id?: string;
}

export interface CostumeFilters {
  rarity?: CharacterRarity;
  equipped?: boolean;
  character_id?: string;
}


export interface BeautyCharacterWithRelations extends BeautyCharacter {
  skills?: BeautySkill[];
  jewelry?: Jewelry[];
  costumes?: Costume[];
}

export interface BeautyFilters {
  rarity?: CharacterRarity;
  status?: CharacterStatus;
  search?: string;
  minLevel?: number;
  maxLevel?: number;
}

export interface SortConfig {
  field: keyof BeautyCharacter;
  order: 'ascend' | 'descend' | null;
}
