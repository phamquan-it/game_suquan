import { Region } from "../../regions/types/region.types";

// Base types for referenced entities
interface Unit {
  id: string;  // PK
  name: string;
  // ... other unit fields
}

interface ResourceType {
  resource_code: string;  // PK
  name: string;
  // ... other resource type fields
}

interface PlayerRegion {
  id: string;
  player_id: string;
  region_id: string;
  // ... other player region fields
}

// Main Base Building type - matches database schema
export interface BaseBuilding {
  type: string;  // Primary Key
  name: string;
  description: string | null;
  max_level: number | null;
  created_at: Date | string | null;
  updated_at: Date | string | null;

  // Relations (optional)
  unit_training?: BuildingUnitTraining[];
  attribute_details?: BuildingAttributeDetail[];
  production?: BuildingProduction[];
  region_buildings?: RegionBuilding[];
  player_buildings?: PlayerRegionBuilding[];
  unlock_rules?: BuildingUnitUnlockRules[];
  upgrade_costs?: BuildingUpgradeCost[];
}

// Building Unit Unlock Rules - defines which units become available at which building levels
export interface BuildingUnitUnlockRules {
  building_type: string;
  unit_type: string;
  required_building_level: number;

  // Relations
  building?: BaseBuilding;
  unit?: Unit;
}

// Building Unit Training - defines what units a building can train at each level
export interface BuildingUnitTraining {
  id: number;
  building_type: string;
  level: number;
  unit_type: string;
  training_rate_per_hour: number; // numeric(12,2)
  training_capacity: number;
  efficiency_percent: number | null; // numeric(5,2)
  created_at: Date | string | null;
  updated_at: Date | string | null;

  // Relations
  building?: BaseBuilding;
  unit?: Unit;
}

// Building Attribute Detail - stats per building level
export interface BuildingAttributeDetail {
  id: number;
  building_type: string;
  level: number;
  hit_points: number | null;
  build_time_seconds: number | null;
  power_score: number | null;
  troop_capacity: number | null;
  training_speed_percent: number | null; // numeric(5,2)
  defense_bonus_percent: number | null; // numeric(5,2)
  attack_bonus_percent: number | null; // numeric(5,2)
  healing_speed_percent: number | null; // numeric(5,2)
  special_abilities: Record<string, any> | null; // jsonb
  unlock_requirements: Record<string, any> | null; // jsonb
  population_capacity: number | null;
  population_growth_per_hour: number | null;
  is_destructible: boolean | null;
  is_relocatable: boolean | null;
  created_at: Date | string | null;
  updated_at: Date | string | null;

  // Relations
  building?: BaseBuilding;
  upgrade_costs?: BuildingUpgradeCost[]; // Costs to upgrade from this level
  unlock_rules?: BuildingUnitUnlockRules[]; // Units unlocked at this level
}

// Building Production - resource production per level
export interface BuildingProduction {
  id: number;
  building_type: string;
  level: number;
  resource_code: string;
  production_rate_per_hour: number; // numeric(12,2)
  production_capacity: number;
  efficiency_percent: number | null; // numeric(5,2)
  created_at: Date | string | null;
  updated_at: Date | string | null;

  // Relations
  building?: BaseBuilding;
  resource?: ResourceType;
}

// Building Upgrade Cost - resources needed to upgrade buildings
export interface BuildingUpgradeCost {
  id: number;
  building_type: string;
  current_level: number;
  target_level: number;
  resource_code: string;
  resource_amount: number;
  created_at: Date | string | null;

  // Relations
  building?: BaseBuilding;
  resource?: ResourceType;
}

// Region Building - defines what buildings can exist in a region
export interface RegionBuilding {
  region_id: string;
  building_type: string;
  max_count: number;
  min_region_level: number;

  // Relations
  region?: Region;
  building?: BaseBuilding;
}

// Player Region Building - actual buildings owned by players
export interface PlayerRegionBuilding {
  id: string;
  player_region_id: string;
  building_type: string;
  level: number;
  upgrading: boolean;
  upgrade_finish_at: Date | string | null;
  created_at: Date | string | null;

  // Relations
  player_region?: PlayerRegion;
  building_type_details?: BaseBuilding;
  current_stats?: BuildingAttributeDetail; // For the current level
  next_level_stats?: BuildingAttributeDetail; // For upgrade preview
  production?: BuildingProduction[]; // Current production rates
  unit_training?: BuildingUnitTraining[]; // Current training capabilities
  upgrade_cost?: BuildingUpgradeCost[]; // Cost to upgrade from current level
  unlocked_units?: BuildingUnitUnlockRules[]; // Units unlocked at current level
}

// Utility types for building operations
export type CreateBaseBuildingInput = Pick<BaseBuilding, 'type' | 'name'> &
  Partial<Pick<BaseBuilding, 'description' | 'max_level'>>;

export type UpdateBaseBuildingInput = Partial<Pick<BaseBuilding, 'name' | 'description' | 'max_level'>>;

export type CreatePlayerBuildingInput = Pick<PlayerRegionBuilding, 'player_region_id' | 'building_type'>;

export type UpgradePlayerBuildingInput = {
  building_id: string;
  upgrade_finish_at: Date | string;
};

// Enums and constants
export const BUILDING_STATUS = {
  IDLE: 'idle',
  UPGRADING: 'upgrading',
  CONSTRUCTING: 'constructing',
} as const;

export type BuildingStatus = typeof BUILDING_STATUS[keyof typeof BUILDING_STATUS];

// Types for building requirements and abilities
export interface BuildingRequirement {
  building_type?: string;
  building_level?: number;
  region_level?: number;
  resources?: Record<string, number>;
  technologies?: string[];
  quests?: string[];
}

export interface BuildingSpecialAbility {
  name: string;
  description: string;
  effect_value: number;
  effect_type: 'percentage' | 'flat' | 'multiplier';
  target: 'self' | 'region' | 'allied' | 'enemy';
  condition?: string;
}

// Category-based building types (if you want to add category field to database)
export interface ResourceBuilding extends BaseBuilding {
  category: 'resource';
  production_types: string[]; // Resource codes it can produce
}

export interface MilitaryBuilding extends BaseBuilding {
  category: 'military';
  trainable_units: string[]; // Unit types it can train
  garrison_capacity: number;
}

export interface DefenseBuilding extends BaseBuilding {
  category: 'defense';
  attack_power: number;
  range: number;
  targeting_priority: string[];
}

export interface InfrastructureBuilding extends BaseBuilding {
  category: 'infrastructure';
  population_boost: number;
  resource_bonuses: Record<string, number>;
}

// Union type for all building categories
export type AnyBuilding = ResourceBuilding | MilitaryBuilding | DefenseBuilding | InfrastructureBuilding;

// Types for building queues and processes
export interface BuildingConstruction {
  player_region_id: string;
  building_type: string;
  start_time: Date | string;
  end_time: Date | string;
  resources_spent: Record<string, number>;
}

export interface BuildingUpgrade {
  player_building_id: string;
  from_level: number;
  to_level: number;
  start_time: Date | string;
  end_time: Date | string;
  resources_spent: Record<string, number>;
}

// Type for building with all details (for detailed views)
export interface BuildingWithDetails extends BaseBuilding {
  attribute_details: BuildingAttributeDetail[];
  production: BuildingProduction[];
  unit_training: BuildingUnitTraining[];
  unlock_rules: BuildingUnitUnlockRules[];
  upgrade_costs: BuildingUpgradeCost[];
  max_level_details: BuildingAttributeDetail | null;
  allowed_regions?: RegionBuilding[];
}

// Player Region Building - actual buildings owned by players
export interface PlayerRegionBuilding {
  id: string;
  player_region_id: string;
  building_type: string;
  level: number;
  upgrading: boolean;
  upgrade_finish_at: Date | string | null;
  created_at: Date | string | null;

  // Relations
  player_region?: PlayerRegion;
  building_type_details?: BaseBuilding;
  current_stats?: BuildingAttributeDetail; // For the current level
  next_level_stats?: BuildingAttributeDetail; // For upgrade preview
  production?: BuildingProduction[]; // Current production rates
  unit_training?: BuildingUnitTraining[]; // Current training capabilities
  upgrade_cost?: BuildingUpgradeCost[]; // Cost to upgrade from current level
  unlocked_rules?: BuildingUnitUnlockRules[]; // Units unlocked at current level (renamed from unlocked_units to avoid conflict)
}

// Type for player building with current state
export interface PlayerBuildingWithState extends PlayerRegionBuilding {
  // Override with more specific/derived types where needed
  current_stats: BuildingAttributeDetail; // Made non-nullable
  next_level_stats?: BuildingAttributeDetail;

  // Computed/derived fields
  production_rates: Record<string, number>; // resource_code -> rate per hour
  training_rates: Record<string, {
    rate: number;
    capacity: number;
    efficiency: number;
    unlocked: boolean;
    unit_details?: Unit; // Optional joined unit data
  }>;

  // FIXED: Renamed to avoid conflict with base interface
  unlocked_unit_types: string[]; // Array of unit type IDs that are unlocked at current level
  unlocked_unit_details?: (Unit & { unlock_level: number })[]; // Optional detailed unit info

  upgrade_progress?: number; // 0-100 percentage if upgrading
  time_until_upgrade_complete?: number; // seconds
  can_upgrade: boolean;

  // Aggregated cost by resource type (easy to display)
  upgrade_cost_summary?: Record<string, number>; // e.g., { "wood": 500, "stone": 200 }

  is_max_level: boolean;
  upgrade_requirements?: BuildingRequirementCheck;

  // Additional computed stats
  power_contribution?: number; // Building's contribution to player's total power
  defense_contribution?: number; // Defense bonus provided to region
  population_used?: number; // Current population used by this building
  population_capacity?: number; // Population capacity of this building
}


// Types for building effects and bonuses
export interface BuildingEffects {
  resource_production: Record<string, number>; // resource_code -> bonus percentage
  unit_stats: Record<string, { attack?: number; defense?: number; health?: number }>; // unit_type -> stat bonuses
  region_bonuses: {
    defense?: number;
    attack?: number;
    population?: number;
  };
  global_bonuses?: {
    training_speed?: number;
    healing_speed?: number;
    build_speed?: number;
  };
}

// Type for building requirements check
export interface BuildingRequirementCheck {
  met: boolean;
  missing_requirements: string[];
  required_levels: Record<string, number>;
  required_resources: Record<string, number>;
  required_buildings?: Record<string, { type: string; level: number }>;
  required_technologies?: string[];
}

// Constants for validation - updated to realistic values
export const BUILDING_CONSTRAINTS = {
  MIN_LEVEL: 0,
  MAX_LEVEL_DEFAULT: 100,
  MIN_HIT_POINTS: 0,
  MIN_BUILD_TIME: 0,
  MIN_PRODUCTION_RATE: 0,
  MAX_EFFICIENCY_PERCENT: 100,
  MIN_EFFICIENCY_PERCENT: 0,
  MIN_TRAINING_CAPACITY: 0,
  MAX_TRAINING_RATE: 999999.99,
} as const;

// Type guards for category-based types (requires category field in database)
export function isResourceBuilding(building: BaseBuilding): building is ResourceBuilding {
  return (building as ResourceBuilding).category === 'resource';
}

export function isMilitaryBuilding(building: BaseBuilding): building is MilitaryBuilding {
  return (building as MilitaryBuilding).category === 'military';
}

export function isDefenseBuilding(building: BaseBuilding): building is DefenseBuilding {
  return (building as DefenseBuilding).category === 'defense';
}

export function isInfrastructureBuilding(building: BaseBuilding): building is InfrastructureBuilding {
  return (building as InfrastructureBuilding).category === 'infrastructure';
}

// Utility types for building operations with unlock rules
export interface BuildingUnlockRuleInput {
  unit_type: string;
  required_building_level: number;
}

export interface BuildingUpgradeCostInput {
  current_level: number;
  target_level: number;
  resource_code: string;
  resource_amount: number;
}

// Response types for API endpoints
export interface BuildingListResponse {
  buildings: BaseBuilding[];
  total: number;
  page: number;
  limit: number;
}

export interface BuildingDetailResponse {
  building: BuildingWithDetails;
  region_restrictions?: RegionBuilding[];
}

export interface PlayerBuildingListResponse {
  buildings: PlayerBuildingWithState[];
  region_id: string;
  total_power: number;
}

export interface BuildingUpgradeResponse {
  building: PlayerRegionBuilding;
  upgrade_started: boolean;
  finish_time: Date | string;
  cost: Record<string, number>;
  requirements_met: boolean;
}
