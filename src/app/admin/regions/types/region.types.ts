export interface Region {
  id: string;
  lord_name: string;
  created_at: string;
  updated_at: string;
}

export interface RegionBuilding {
  region_id: string;
  building_type: string;
  max_count: number;
  min_region_level: number;
}

export interface RegionExpansionCost {
  region_id: string;
  slot_index: number;
  cost_type: string;
  cost_amount: number;
}

export interface RegionWithDetails extends Region {
  buildings?: RegionBuilding[];
  expansion_costs?: RegionExpansionCost[];
}

export interface CreateRegionDTO {
  id: string;
  lord_name: string;
}

export interface UpdateRegionDTO {
  lord_name?: string;
}

export interface BuildingOption {
  type: string;
  name: string;
  description: string;
  base_cost: number;
}

export interface ResourceType {
  resource_code: string;
  resource_name: string;
  resource_icon?: string;
}
