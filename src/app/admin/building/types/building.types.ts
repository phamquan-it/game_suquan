import { BaseBuilding, BuildingAttributeDetail, BuildingProduction, BuildingUnitTraining, BuildingUnitUnlockRules, BuildingUpgradeCost } from ".";

// Extended types for admin UI
export interface BuildingWithRelations extends BaseBuilding {
  attribute_details: BuildingAttributeDetail[];
  production: BuildingProduction[];
  unit_training: BuildingUnitTraining[];
  unlock_rules: BuildingUnitUnlockRules[];
  upgrade_costs: BuildingUpgradeCost[];
}

export interface BuildingFormData {
  type: string;
  name: string;
  description: string;
  max_level: number;
}

export interface BuildingAttributeFormData {
  level: number;
  hit_points: number;
  build_time_seconds: number;
  power_score: number;
  troop_capacity: number;
  training_speed_percent: number;
  defense_bonus_percent: number;
  attack_bonus_percent: number;
  healing_speed_percent: number;
  population_capacity: number;
  population_growth_per_hour: number;
  is_destructible: boolean;
  is_relocatable: boolean;
  special_abilities: any;
  unlock_requirements: any;
}

export interface BuildingProductionFormData {
  level: number;
  resource_code: string;
  production_rate_per_hour: number;
  production_capacity: number;
  efficiency_percent: number;
}

export interface BuildingTrainingFormData {
  level: number;
  unit_type: string;
  training_rate_per_hour: number;
  training_capacity: number;
  efficiency_percent: number;
}

export interface BuildingUnlockRuleFormData {
  unit_type: string;
  required_building_level: number;
}

export interface BuildingUpgradeCostFormData {
  current_level: number;
  target_level: number;
  resource_code: string;
  resource_amount: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface BuildingsResponse {
  buildings: BuildingWithRelations[];
  total: number;
}
