import General, { BattleRewardHeroShard, GeneralSkill, HeroElement, HeroRarity, HeroStatus, HeroType } from ".";

// Extended types for admin UI
export interface GeneralWithRelations extends General {
  skills: GeneralSkill[];
  shard_rewards: BattleRewardHeroShard[];
}

export interface GeneralFormData {
  id: string;
  name: string;
  title: string;
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
  experience: number;
  required_exp: number;
  star_level: number;
  max_star_level: number;
  awakening_level: number;
  bond_level: number;
  favorite: boolean;
  is_vip: boolean;
  description: string;
  voice_actor: string;
  biography: string;
  image: string;
  thumbnail: string;
}

export interface GeneralSkillFormData {
  id?: string;
  name: string;
  description: string;
  type: "active" | "passive" | "ultimate";
  level: number;
  max_level: number;
  cooldown: number;
  mana_cost: number;
  icon: string;
}

export interface GeneralShardFormData {
  battle_reward_id: string;
  hero_id: string;
  shard_quantity: number;
  total_shards_needed: number;
}

// Filter options
export interface GeneralFilterOptions {
  rarity?: HeroRarity[];
  element?: HeroElement[];
  type?: HeroType[];
  status?: HeroStatus[];
  minLevel?: number;
  maxLevel?: number;
  minStar?: number;
  searchTerm?: string;
  isVip?: boolean;
  favorite?: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface GeneralsResponse {
  generals: GeneralWithRelations[];
  total: number;
}

// Stats types
export interface GeneralStats {
  totalGenerals: number;
  totalLegendary: number;
  totalMythic: number;
  avgLevel: number;
  avgPower: number;
  mostCommonElement: HeroElement;
  mostCommonType: HeroType;
}

// Rarity colors for UI
export const RARITY_COLORS: Record<HeroRarity, string> = {
  common: "#A9A9A9",
  rare: "#1E90FF",
  epic: "#800080",
  legendary: "#FFA500",
  mythic: "#DC143C",
};

export const ELEMENT_COLORS: Record<HeroElement, string> = {
  fire: "#FF4500",
  water: "#1E90FF",
  earth: "#8B4513",
  wind: "#32CD32",
  light: "#FFD700",
  dark: "#483D8B",
};

export const STATUS_COLORS: Record<HeroStatus, string> = {
  active: "#52c41a",
  inactive: "#d9d9d9",
  training: "#faad14",
  deployed: "#1890ff",
};


// Admin specific types
export interface GeneralAdminStats {
  totalGenerals: number;
  totalSkills: number;
  avgLevel: number;
  avgPower: number;
  legendaryCount: number;
  mythicCount: number;
  mostCommonElement: HeroElement;
  mostCommonType: HeroType;
}

// Utility functions for admin
export function calculateGeneralAdminStats(generals: General[]): GeneralAdminStats {
  const totalGenerals = generals.length;
  const totalSkills = generals.reduce((acc, g) => acc + (g.skills?.length || 0), 0);
  const avgLevel = generals.reduce((acc, g) => acc + g.level, 0) / totalGenerals;

  // Calculate average power
  const avgPower = generals.reduce((acc, g) => {
    const power = g.current_attack * 2.5 + g.current_defense * 2 + g.current_health * 1.5;
    return acc + power;
  }, 0) / totalGenerals;

  const legendaryCount = generals.filter(g => g.rarity === 'legendary').length;
  const mythicCount = generals.filter(g => g.rarity === 'mythic').length;

  // Find most common element
  const elementCount: Record<string, number> = {};
  generals.forEach(g => {
    elementCount[g.element] = (elementCount[g.element] || 0) + 1;
  });
  const mostCommonElement = Object.entries(elementCount).sort((a, b) => b[1] - a[1])[0]?.[0] as HeroElement;

  // Find most common type
  const typeCount: Record<string, number> = {};
  generals.forEach(g => {
    typeCount[g.type] = (typeCount[g.type] || 0) + 1;
  });
  const mostCommonType = Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0]?.[0] as HeroType;

  return {
    totalGenerals,
    totalSkills,
    avgLevel: Math.round(avgLevel * 10) / 10,
    avgPower: Math.round(avgPower),
    legendaryCount,
    mythicCount,
    mostCommonElement,
    mostCommonType,
  };
}

// Export admin components props types
export interface GeneralTableProps {
  onSelect?: (general: General) => void;
  selectedIds?: string[];
  multiSelect?: boolean;
}

export interface GeneralFormProps {
  initialValues?: Partial<General>;
  onSubmit: (values: Partial<General>) => Promise<void>;
  onCancel: () => void;
  visible: boolean;
}
